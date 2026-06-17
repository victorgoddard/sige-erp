import { fail } from "@sveltejs/kit";
import { asc, eq } from "drizzle-orm";
import type { Actions, PageServerLoad } from "./$types";
import { Status } from "$lib/enums/orderStatus";
import { db } from "$lib/server/db";
import { productTable } from "$lib/server/db/tables/product";
import { purchaseOrderTable } from "$lib/server/db/tables/purchase-order";
import { supplierTable } from "$lib/server/db/tables/supplier";

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

function parseRequiredId(value: FormDataEntryValue | null) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function parseQuantity(value: FormDataEntryValue | null) {
  const quantity = Number(value);
  return Number.isInteger(quantity) && quantity > 0 ? quantity : null;
}

async function findProduct(productId: number) {
  const [product] = await db
    .select({
      id: productTable.id,
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
    .select({ id: supplierTable.id })
    .from(supplierTable)
    .where(eq(supplierTable.id, supplierId))
    .limit(1);
  return supplier;
}

export const load = (async ({ depends, cookies }) => {
  depends("getOrderData");

  try {
    const suppliers = await db
      .select({
        id: supplierTable.id,
        name: supplierTable.name
      })
      .from(supplierTable)
      .where(eq(supplierTable.active, true))
      .orderBy(asc(supplierTable.name));

    return {
      suppliers,
    };
  } catch (error) {
    console.error(error);
    return {
      suppliers: [],
    };
  }
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();

    const supplierId = parseRequiredId(formData.get("supplierId"));
    const productId = parseRequiredId(formData.get("productId"));
    const quantity = parseQuantity(formData.get("quantity"));

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
      const [supplier, product] = await Promise.all([
        findSupplier(supplierId),
        findProduct(productId)
      ]);

      if (!supplier) {
        return fail(404, { success: false, error: "Fornecedor não encontrado." });
      }

      if (!product) {
        return fail(404, { success: false, error: "Produto não encontrado." });
      }

      if (product.fornecedorId !== supplierId) {
        return fail(400, { success: false, error: "O produto não pertence a este fornecedor." });
      }

      const unitPrice = product.price;
      const totalPrice = unitPrice * quantity;
      const userId = readUserId(cookies);

      await db.insert(purchaseOrderTable).values({
        supplierId,
        productId,
        quantity,
        unitPrice,
        totalPrice,
        status: Status.Pending,
        idUser: userId,
        date: new Date(),
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
