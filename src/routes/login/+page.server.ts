import { fail, redirect } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { LoginTable } from "$lib/server/db/tables/login";
import { eq, desc } from "drizzle-orm";
import type { PageServerLoad, Actions } from "./$types";
import { randomBytes, scryptSync, timingSafeEqual, } from "crypto";

export const load: PageServerLoad = async () => {
  try {
    const logins = await db
      .select()
      .from(LoginTable)
      .orderBy(desc(LoginTable.id));

    return { logins };
  } catch (error) {
    console.error(error);
    return { logins: [] };
  }
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");

  return `${salt}:${hash}`;
}

function verifyPassword(
  password: string,
  storedPassword: string
): boolean {
  const [salt, storedHash] = storedPassword.split(":");

  const hashBuffer = scryptSync(password, salt, 64);
  const storedHashBuffer = Buffer.from(storedHash, "hex");

  return timingSafeEqual(hashBuffer, storedHashBuffer);
}

export const actions: Actions = {

  login: async ({ request, cookies }) => {
    const formData = await request.formData();

    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      return fail(400, {
        success: false,
        error: "Email e senha são obrigatórios.",
        email,
        password
      });
    }

    try {
      const user = await db
        .select()
        .from(LoginTable)
        .where(eq(LoginTable.email, email));

      if (user.length === 0) {
        return fail(401, {
          success: false,
          error: "Email ou senha inválidos.",
          email,
          password
        });
      }

      const isValidPassword = verifyPassword(
        password,
        user[0].password
      );

      if (!isValidPassword) {
        return fail(401, {
          success: false,
          error: "Email ou senha inválidos.",
          email,
          password
        });
      }

      cookies.set("user_name", user[0].name, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24
      });

    } catch (error) {
      console.error(error);

      return fail(500, {
        success: false,
        error: "Erro interno ao realizar login.",
        email,
        password
      });
    }

    throw redirect(303, "/");
  }

};