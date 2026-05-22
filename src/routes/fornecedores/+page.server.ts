import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { count, like, or } from "drizzle-orm";
import { supplierTable, type NewSupplierType } from "$lib/server/db/tables/supplier";
import { fail } from "assert";

export const load = (async ({ depends, locals, url }) => {
  depends("getSupplier");

  let page = parseInt(url.searchParams.get("page") ?? "1");
  let pageSize = parseInt(url.searchParams.get("pageSize") ?? "30");
  const supplierFilter = url.searchParams.get("texto")?.trim() ?? "";
  if (pageSize > 100) pageSize = 100;
  if (page < 1) page = 1;
  const offset = (page - 1) * pageSize;

  const whereFilter = supplierFilter
    ? or(like(supplierTable.name, `%${supplierFilter}%`))
    : undefined;

  const [suppliers, [countSupplier]] = await db.batch([
    db
      .select()
      .from(supplierTable)
      .where(whereFilter)
      .limit(pageSize)
      .offset(offset),

    db
      .select({ count: count(supplierTable.id) })
      .from(supplierTable)
      .where(whereFilter),
  ]);

  const total = countSupplier.count;
  return {
    suppliers,
    total,
    variavelYagoTeste: "Testes",
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const name = formData.get("name")?.toString() ?? "";

    const errors: Record<string, string> = {};

    if (!name || name.length < 4) errors.name = "Nome inválido";

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    try {
      let insertedNewSupplier: NewSupplierType = {
        name,
        idUser : 1,
        createdAt: new Date(),
      };
      console.log(insertedNewSupplier);
      await db.insert(supplierTable).values(insertedNewSupplier);
      return { success: true };
    } catch (e) {
      console.log(e);
      return fail(400, {
        success: false,
        exception: "Ocorreu uma exceção não tratada, favor contatar o suporte.",
      });
    }
  },
};