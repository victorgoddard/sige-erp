import { fail } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { productTable } from "$lib/server/db/tables/product";
import { supplierTable } from "$lib/server/db/tables/supplier";
import { desc, eq } from "drizzle-orm";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async () => {
  try {
    const products = await db
      .select({
        id: productTable.id,
        name: productTable.name,
        price: productTable.price,
        quantity: productTable.quantity,
        minimumStockQuantity: productTable.minimumStockQuantity,
        fornecedorId: productTable.fornecedorId,
        supplierName: supplierTable.name,
      })
      .from(productTable)
      .leftJoin(supplierTable, eq(productTable.fornecedorId, supplierTable.id))
      .orderBy(desc(productTable.id));
      
    return { products };
  } catch (error) {
    console.error(error);
    return { products: [] };
  }
};

export const actions: Actions = {
  delete: async ({ request }) => {
    const formData = await request.formData();
    const id = parseInt(formData.get("id")?.toString() || "0", 10);

    if (!id) {
      return fail(400, { success: false, error: "ID inválido para exclusão." });
    }

    try {
      await db.delete(productTable).where(eq(productTable.id, id));
      return { success: true };
    } catch (error) {
      console.error(error);
      return fail(500, { success: false, error: "Erro ao deletar do banco." });
    }
  }
};