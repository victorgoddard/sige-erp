import { db } from "$lib/server/db";
import { supplierTable, type NewSupplierType } from "$lib/server/db/tables/supplier";
import { validateSupplierForm } from "$lib/server/validators/supplier";
import { fail } from "@sveltejs/kit";

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const { values, errors } = validateSupplierForm(formData);

    if (Object.keys(errors).length > 0) {
      return fail(422, { success: false, errors });
    }

    try {
      const newSupplier: NewSupplierType = {
        idUser: 1,
        createdAt: new Date(),
        name: values.name,
        telefone: values.telefone,
        condicaoPagamento: values.condicaoPagamento,
      };
      await db.insert(supplierTable).values(newSupplier);
      return { success: true };
    } catch (error) {
      console.log(error);
      return fail(400, {
        success: false,
        exception: "Ocorreu uma excecao nao tratada, favor contatar o suporte.",
      });
    }
  },
};
