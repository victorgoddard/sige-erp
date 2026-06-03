import { fail } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { productTable } from "$lib/server/db/tables/product";
import { eq, desc } from "drizzle-orm";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async () => {
  try {
    const products = await db
      .select()
      .from(productTable)
      .orderBy(desc(productTable.id));

    return { products };
  } catch (error) {
    console.error(error);
    return { products: [] };
  }
};

export const actions: Actions = {
  create: async ({ request }) => {
    const formData = await request.formData();
    
    const name = formData.get("name")?.toString().trim();
    const rawPrice = formData.get("price")?.toString() || "0";
    const rawQuantity = formData.get("quantity")?.toString() || "0";

    const price = parseFloat(rawPrice.replace(',', '.'));
    const quantity = parseInt(rawQuantity, 10);

    if (!name) {
      return fail(400, { success: false, error: "O nome do produto é obrigatório." });
    }

    if (isNaN(price)) {
      return fail(400, { success: false, error: "Preço inválido." });
    }

    try {
      await db.insert(productTable).values({ name, price, quantity });
      return { success: true };
    } catch (error) {
      console.error(error);
      return fail(500, { success: false, error: "Erro interno ao salvar no banco." });
    }
  },

  update: async ({ request }) => {
    const formData = await request.formData();
    
    const idStr = formData.get("id")?.toString();
    const name = formData.get("name")?.toString().trim();
    const rawPrice = formData.get("price")?.toString() || "0";
    const rawQuantity = formData.get("quantity")?.toString() || "0";

    if (!idStr) return fail(400, { success: false, error: "ID não fornecido." });
    
    const id = parseInt(idStr, 10);
    const price = parseFloat(rawPrice.replace(',', '.'));
    const quantity = parseInt(rawQuantity, 10);

    if (!name) return fail(400, { success: false, error: "O nome é obrigatório." });
    if (isNaN(price)) return fail(400, { success: false, error: "Preço inválido." });

    try {
      await db.update(productTable)
        .set({ name, price, quantity })
        .where(eq(productTable.id, id));
      
      return { success: true };
    } catch (error) {
      console.error(error);
      return fail(500, { success: false, error: "Erro interno ao atualizar no banco." });
    }
  },

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