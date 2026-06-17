import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { supplierTable } from "$lib/server/db/tables/supplier";
import { validateSupplierForm } from "$lib/server/validators/supplier";
import { eq } from "drizzle-orm";
import { error, fail } from "@sveltejs/kit";

export const load = (async ({ depends, params }) => {
  depends("getSupplier");

  const supplierId = Number(params.id);
  if (!Number.isInteger(supplierId)) {
    throw error(400, "Id invalido");
  }

  const [supplier] = await db
    .select()
    .from(supplierTable)
    .where(eq(supplierTable.id, supplierId))
    .limit(1);

  if (!supplier) {
    throw error(404, "Fornecedor nao encontrado");
  }

  return {
    supplier,
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request, params }) => {
    const supplierId = Number(params.id);
    if (!Number.isInteger(supplierId)) {
      return fail(400, { success: false, exception: "Id invalido" });
    }

    const formData = await request.formData();
    const { values, errors } = validateSupplierForm(formData);

    if (Object.keys(errors).length > 0) {
      return fail(422, { success: false, errors });
    }

    try {
      await db
        .update(supplierTable)
        .set({
          name: values.name,
          active: values.active,
          telefone: values.telefone,
          condicaoPagamento: values.condicaoPagamento,
          updatedAt: new Date(),
        })
        .where(eq(supplierTable.id, supplierId));

      return { success: true };
    } catch (err) {
      console.log(err);
      return fail(400, {
        success: false,
        exception: "Ocorreu uma excecao nao tratada, favor contatar o suporte.",
      });
    }
  },
} satisfies Actions;
