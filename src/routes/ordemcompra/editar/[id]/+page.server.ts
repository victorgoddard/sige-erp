import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { cashFlowTable } from "$lib/server/db/tables/cash-flow";
import { productTable } from "$lib/server/db/tables/product";
import { purchaseOrderTable } from "$lib/server/db/tables/purchase-order";
import { supplierTable } from "$lib/server/db/tables/supplier";
import { asc, eq, sql } from "drizzle-orm";
import { error, fail } from "@sveltejs/kit";
import { Status } from "$lib/enums/orderStatus";

const statuses = Object.values(Status);

function isValidStatus(value: string): value is (typeof statuses)[number] {
  return statuses.includes(value as (typeof statuses)[number]);
}

function parseRequiredId(value: FormDataEntryValue | null) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function parseQuantity(value: FormDataEntryValue | null) {
  const quantity = Number(value);
  return Number.isInteger(quantity) && quantity > 0 ? quantity : null;
}

function readUserId(cookies: any) {
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

async function findProduct(productId: number) {
  const [product] = await db
    .select({
      id: productTable.id,
      name: productTable.name,
      price: productTable.price,
      fornecedorId: productTable.fornecedorId,
    })
    .from(productTable)
    .where(eq(productTable.id, productId))
    .limit(1);
  return product;
}

async function findSupplier(supplierId: number) {
  const [supplier] = await db
    .select({
      id: supplierTable.id,
      name: supplierTable.name,
    })
    .from(supplierTable)
    .where(eq(supplierTable.id, supplierId))
    .limit(1);
  return supplier;
}

async function findOrder(orderId: number) {
  const [order] = await db
    .select({
      orderId: purchaseOrderTable.orderId,
      code: purchaseOrderTable.code,
      productId: purchaseOrderTable.productId,
      quantity: purchaseOrderTable.quantity,
      totalPrice: purchaseOrderTable.totalPrice,
      status: purchaseOrderTable.status,
    })
    .from(purchaseOrderTable)
    .where(eq(purchaseOrderTable.orderId, orderId))
    .limit(1);

  return order;
}

export const load = (async ({ params, depends }) => {
  depends("getOrder");

  const orderId = Number(params.id);
  if (!Number.isInteger(orderId)) {
    throw error(400, "Id inválido");
  }

  try {
    const [orderRows, suppliers] = await db.batch([
      db
        .select({
          id: purchaseOrderTable.orderId,
          orderNumber: purchaseOrderTable.code,
          date: purchaseOrderTable.date,
          supplierId: purchaseOrderTable.supplierId,
          productId: purchaseOrderTable.productId,
          quantity: purchaseOrderTable.quantity,
          unitPrice: purchaseOrderTable.unitPrice,
          totalPrice: purchaseOrderTable.totalPrice,
          status: purchaseOrderTable.status
        })
        .from(purchaseOrderTable)
        .where(eq(purchaseOrderTable.orderId, orderId))
        .limit(1),

      db
        .select({
          id: supplierTable.id,
          name: supplierTable.name
        })
        .from(supplierTable)
        .where(eq(supplierTable.active, true))
        .orderBy(asc(supplierTable.name)),
    ]);

    const orderRow = orderRows[0];

    if (!orderRow) {
      throw error(404, "Ordem de compra não encontrada");
    }

    return {
      order: orderRow,
      suppliers,
      statuses,
    };
  } catch (err) {
    console.error(err);
    throw error(500, "Erro ao carregar a ordem");
  }
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request, params, cookies }) => {
    const orderId = Number(params.id);
    if (!Number.isInteger(orderId)) {
      return fail(400, { success: false, error: "Id inválido" });
    }

    const formData = await request.formData();
    const supplierId = parseRequiredId(formData.get("supplierId"));
    const productId = parseRequiredId(formData.get("productId"));
    const quantity = parseQuantity(formData.get("quantity"));
    const statusValue = formData.get("status")?.toString() ?? "";

    if (!supplierId) {
      return fail(400, { success: false, error: "Selecione um fornecedor." });
    }

    if (!productId) {
      return fail(400, { success: false, error: "Selecione um produto." });
    }

    if (!quantity) {
      return fail(400, { success: false, error: "Informe uma quantidade válida." });
    }

    try {
      const [existingOrder, supplier, product] = await Promise.all([
        findOrder(orderId),
        findSupplier(supplierId),
        findProduct(productId)
      ]);

      if (!existingOrder) {
        return fail(404, { success: false, error: "Ordem de compra não encontrada." });
      }

      if (existingOrder.status === Status.Paid) {
        return fail(400, { success: false, error: "Pedido pago não pode ser alterado." });
      }

      if (!supplier) {
        return fail(404, { success: false, error: "Fornecedor não encontrado." });
      }

      if (!product) {
        return fail(404, { success: false, error: "Produto não encontrado." });
      }

      if (product.fornecedorId !== supplierId) {
        return fail(400, { success: false, error: "O produto não pertence a este fornecedor." });
      }

      const status = statusValue
        ? isValidStatus(statusValue)
          ? statusValue
          : null
        : existingOrder.status;

      if (!status) {
        return fail(400, { success: false, error: "Status inválido." });
      }

      const unitPrice = product.price;
      const totalPrice = unitPrice * quantity;
      const shouldRegisterStockEntry = existingOrder.status !== Status.Paid && status === Status.Paid;
      const now = new Date();
      const today = now.toISOString().slice(0, 10);
      const userId = readUserId(cookies);

      await db.transaction(async (tx: any) => {
        await tx
          .update(purchaseOrderTable)
          .set({
            supplierId,
            productId,
            quantity,
            unitPrice,
            totalPrice,
            status,
            updatedAt: new Date(),
          })
          .where(eq(purchaseOrderTable.orderId, orderId));

        if (shouldRegisterStockEntry) {
          await tx
            .update(productTable)
            .set({
              quantity: sql`${productTable.quantity} + ${quantity}`,
            })
            .where(eq(productTable.id, productId));

          await tx.insert(cashFlowTable).values({
            launchDate: today,
            description: `Pagamento da ordem de compra ${existingOrder.code ?? `OC${String(orderId).padStart(4, '0')}`}`,
            origin: supplier.name,
            dueDate: today,
            valueCents: Math.round(totalPrice * 100),
            type: 'A Pagar',
            idUser: userId,
            createdAt: now,
            updatedAt: now,
          });
        }
      });

      return { success: true };
    } catch (err) {
      console.log(err);
      return fail(400, {
        success: false,
        error: "Ocorreu uma exceção não tratada, favor contatar o suporte.",
      });
    }
  },
} satisfies Actions;
