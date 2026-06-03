import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { count, like, or } from "drizzle-orm";
import { supplierTable } from "$lib/server/db/tables/supplier";

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