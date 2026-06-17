import { fail } from "@sveltejs/kit";
import { asc, desc, eq } from "drizzle-orm";
import type { Actions, PageServerLoad } from "./$types";
import { Status, type StatusType } from "$lib/enums/orderStatus";
import { db } from "$lib/server/db";
import { productTable } from "$lib/server/db/tables/product";
import { purchaseOrderTable } from "$lib/server/db/tables/purchase-order";
import { supplierTable } from "$lib/server/db/tables/supplier";
import type { PurchaseOrder } from "$lib/types/purchase-order";

const statuses = Object.values(Status);

type CookieReader = {
  get: (name: string) => string | undefined;
};

function formatDate(value: Date | number | string | null) {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("pt-BR").format(date);
}

function readUserId(cookies: CookieReader) {
  const session = cookies.get("session");

  if (!session) return 1;

  try {
    const parsed = JSON.parse(session);
    const userId = Number(parsed?.userId);
    return Number.isInteger(userId) && userId > 0 ? userId : 1;
  } catch {
    return 1;
  }
}

function parseRequiredId(value: FormDataEntryValue | null) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function parseQuantity(value: FormDataEntryValue | null) {
  const quantity = Number(value);
  return Number.isInteger(quantity) && quantity > 0 ? quantity : null;
}

function isValidStatus(value: string): value is StatusType {
  return statuses.includes(value as StatusType);
}

async function findProduct(productId: number) {
  const [product] = await db
    .select({
      id: productTable.id,
      price: productTable.price
    })
    .from(productTable)
    .where(eq(productTable.id, productId))
    .limit(1);

  return product;
}

async function findSupplier(supplierId: number) {
  const [supplier] = await db
    .select({ id: supplierTable.id })
    .from(supplierTable)
    .where(eq(supplierTable.id, supplierId))
    .limit(1);

  return supplier;
}

export const load = (async () => {
  try {
    const [suppliers, products, orderRows] = await db.batch([
      db
        .select({
          id: supplierTable.id,
          name: supplierTable.name
        })
        .from(supplierTable)
        .where(eq(supplierTable.active, true))
        .orderBy(asc(supplierTable.name)),

      db
        .select({
          id: productTable.id,
          name: productTable.name,
          price: productTable.price,
          quantity: productTable.quantity
        })
        .from(productTable)
        .orderBy(asc(productTable.name)),

      db
        .select({
          id: purchaseOrderTable.orderId,
          orderNumber: purchaseOrderTable.code,
          date: purchaseOrderTable.date,
          supplierId: purchaseOrderTable.supplierId,
          supplierName: supplierTable.name,
          productId: purchaseOrderTable.productId,
          productName: productTable.name,
          productPrice: productTable.price,
          productQuantity: productTable.quantity,
          quantity: purchaseOrderTable.quantity,
          unitPrice: purchaseOrderTable.unitPrice,
          totalPrice: purchaseOrderTable.totalPrice,
          status: purchaseOrderTable.status
        })
        .from(purchaseOrderTable)
        .leftJoin(supplierTable, eq(purchaseOrderTable.supplierId, supplierTable.id))
        .leftJoin(productTable, eq(purchaseOrderTable.productId, productTable.id))
        .orderBy(desc(purchaseOrderTable.orderId))
    ]);

    const orders: PurchaseOrder[] = orderRows.map((order) => {
      const quantity = order.quantity ?? 0;
      const unitPrice = order.unitPrice ?? order.productPrice ?? 0;
      const totalPrice = order.totalPrice ?? unitPrice * quantity;

      return {
        id: order.id,
        orderNumber: order.orderNumber ?? `OC${String(order.id).padStart(4, "0")}`,
        date: formatDate(order.date),
        supplier: {
          id: order.supplierId,
          name: order.supplierName ?? "Fornecedor nao encontrado"
        },
        product: {
          id: order.productId,
          name: order.productName ?? "Produto nao encontrado",
          price: order.productPrice ?? unitPrice,
          quantity: order.productQuantity ?? 0
        },
        quantity,
        unitPrice,
        totalPrice,
        status: order.status
      };
    });

    return {
      suppliers,
      products,
      orders,
      statuses
    };
  } catch (error) {
    console.error(error);

    return {
      suppliers: [],
      products: [],
      orders: [],
      statuses
    };
  }
}) satisfies PageServerLoad;

export const actions: Actions = {
  update: async ({ request }) => {
    const formData = await request.formData();

    const orderId = parseRequiredId(formData.get("orderId"));
    const supplierId = parseRequiredId(formData.get("supplierId"));
    const productId = parseRequiredId(formData.get("productId"));
    const quantity = parseQuantity(formData.get("quantity"));
    const status = formData.get("status")?.toString() ?? "";

    if (!orderId) {
      return fail(400, { success: false, error: "Ordem de compra invalida." });
    }

    if (!supplierId) {
      return fail(400, { success: false, error: "Selecione um fornecedor." });
    }

    if (!productId) {
      return fail(400, { success: false, error: "Selecione um produto." });
    }

    if (!quantity) {
      return fail(400, { success: false, error: "Informe uma quantidade valida." });
    }

    if (!isValidStatus(status)) {
      return fail(400, { success: false, error: "Status invalido." });
    }

    try {
      const [supplier, product] = await Promise.all([
        findSupplier(supplierId),
        findProduct(productId)
      ]);

      if (!supplier) {
        return fail(404, { success: false, error: "Fornecedor nao encontrado." });
      }

      if (!product) {
        return fail(404, { success: false, error: "Produto nao encontrado." });
      }

      const unitPrice = product.price;
      const totalPrice = unitPrice * quantity;

      await db
        .update(purchaseOrderTable)
        .set({
          supplierId,
          productId,
          quantity,
          unitPrice,
          totalPrice,
          status,
          updatedAt: new Date()
        })
        .where(eq(purchaseOrderTable.orderId, orderId));

      return { success: true };
    } catch (error) {
      console.error(error);
      return fail(500, { success: false, error: "Erro interno ao atualizar ordem de compra." });
    }
  },

  delete: async ({ request }) => {
    const formData = await request.formData();
    const orderId = parseRequiredId(formData.get("orderId"));

    if (!orderId) {
      return fail(400, { success: false, error: "Ordem de compra invalida." });
    }

    try {
      await db.delete(purchaseOrderTable).where(eq(purchaseOrderTable.orderId, orderId));
      return { success: true };
    } catch (error) {
      console.error(error);
      return fail(500, { success: false, error: "Erro interno ao excluir ordem de compra." });
    }
  }
};
