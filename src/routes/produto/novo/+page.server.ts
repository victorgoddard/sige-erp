import { db } from "$lib/server/db";
import { productTable, type NewProductType } from "$lib/server/db/tables/product";
import { supplierTable } from "$lib/server/db/tables/supplier";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { eq } from "drizzle-orm";

export const load = (async () => {
  try {
    const suppliers = await db
        .select()
        .from(supplierTable)
        .where(eq(supplierTable.active, true));
    return { suppliers };
  } catch (error) {
    console.error(error);
    return { suppliers: [] };
  }
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request }) => {
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
      const newProduct: NewProductType = {
        name,
        price: Number(price),
        quantity: Number(quantity),
        minimumStockQuantity: Number(minimumStockQuantity),
        fornecedorId: fornecedorId ? Number(fornecedorId) : null,
      };
      await db.insert(productTable).values(newProduct);
      return { success: true };
    } catch (error) {
      console.log(error);
      return fail(400, {
        success: false,
        exception: "Ocorreu uma exceção não tratada, favor contatar o suporte.",
      });
    }
  },
} satisfies Actions;
