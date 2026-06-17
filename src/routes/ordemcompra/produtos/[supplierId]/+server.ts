import { json } from "@sveltejs/kit";
import { asc, eq } from "drizzle-orm";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { productTable } from "$lib/server/db/tables/product";

export const GET: RequestHandler = async ({ params }) => {
  const supplierId = Number(params.supplierId);

  if (!Number.isInteger(supplierId) || supplierId <= 0) {
    return json({ products: [] }, { status: 400 });
  }

  try {
    const products = await db
      .select({
        id: productTable.id,
        name: productTable.name,
        price: productTable.price,
        quantity: productTable.quantity,
      })
      .from(productTable)
      .where(eq(productTable.fornecedorId, supplierId))
      .orderBy(asc(productTable.name));

    return json({ products });
  } catch (error) {
    console.error(error);
    return json({ products: [] }, { status: 500 });
  }
};