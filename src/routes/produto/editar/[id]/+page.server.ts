import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { productTable } from "$lib/server/db/tables/product";
import { supplierTable } from "$lib/server/db/tables/supplier";
import { eq } from "drizzle-orm";
import { error, fail } from "@sveltejs/kit";

export const load = (async ({ depends, params }) => {
  depends("getProduct");

  const productId = Number(params.id);
  if (!Number.isInteger(productId)) {
    throw error(400, "Id inválido");
  }

  const [product] = await db
    .select()
    .from(productTable)
    .where(
      eq(productTable.id, productId),
    )
    .limit(1);

  if (!product) {
    throw error(404, "Produto não encontrado");
  }

  const suppliers = await db
    .select()
    .from(supplierTable)
    .where(eq(supplierTable.active, true));

  return {
    product,
    suppliers,
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request, params }) => {
    const productId = Number(params.id);
    if (!Number.isInteger(productId)) {
      return fail(400, { success: false, exception: "Id inválido" });
    }

    const formData = await request.formData();
    const name = formData.get("name")?.toString().trim() ?? "";
    const price = formData.get("price")?.toString() ?? "0";
    const quantity = formData.get("quantity")?.toString() ?? "0";
    const minimumStockQuantity = formData.get("minimumStockQuantity")?.toString() ?? "0";
    const fornecedorId = formData.get("fornecedorId")?.toString().trim() ?? "";

    const errors: Record<string, string> = {};

    if (!name || name.length < 2) errors.name = "Nome inválido";
    if (isNaN(Number(price)) || Number(price) < 0) errors.price = "Preço inválido";
    if (isNaN(Number(quantity)) || Number(quantity) < 0) errors.quantity = "Quantidade inválida";
    if (isNaN(Number(minimumStockQuantity)) || Number(minimumStockQuantity) < 0) {
      errors.minimumStockQuantity = "Quantidade mínima de estoque inválida";
    }

    if (Object.keys(errors).length > 0) {
      return fail(422, { success: false, errors });
    }

    try {
      await db
        .update(productTable)
        .set({
          name,
          price: Number(price),
          quantity: Number(quantity),
          minimumStockQuantity: Number(minimumStockQuantity),
          fornecedorId: fornecedorId ? Number(fornecedorId) : null,
        })
        .where(eq(productTable.id, productId));

      return { success: true };
    } catch (err) {
      console.log(err);
      return fail(400, {
        success: false,
        exception: "Ocorreu uma exceção não tratada, favor contatar o suporte.",
      });
    }
  },
} satisfies Actions;
