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
  create: async ({ request }) => {
    const formData = await request.formData();

    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString().trim();
    const name = formData.get("name")?.toString().trim();

    if (!name) {
      return fail(400, {
        success: false,
        error: "O nome é obrigatório."
      });
    }

    if (!email) {
      return fail(400, {
        success: false,
        error: "O email é obrigatório."
      });
    }

    if (!emailRegex.test(email)) {
      return fail(400, {
        success: false,
        error: "Email inválido."
      });
    }

    if (!password) {
      return fail(400, {
        success: false,
        error: "A senha é obrigatória."
      });
    }

    try {
      const existingUser = await db
        .select()
        .from(LoginTable)
        .where(eq(LoginTable.email, email));

      if (existingUser.length > 0) {
        return fail(400, {
          success: false,
          error: "Email já cadastrado."
        });
      }

      const now = new Date();

      await db.insert(LoginTable).values({
        email,
        name,
        password: hashPassword(password),
        createdAt: now,
        updatedAt: now
      });

      // return { success: true };
    } catch (error) {
      console.error(error);

      return fail(500, {
        success: false,
        error: "Erro interno ao salvar no banco."
      });
    }

    throw redirect(303, "/login");
  },

  update: async ({ request }) => {
    const formData = await request.formData();

    const userId = formData.get("id")?.toString();
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString().trim();
    const name = formData.get("name")?.toString().trim();

    if (!name) {
      return fail(400, {
        success: false,
        error: "O nome é obrigatório."
      });
    }

    if (!userId) {
      return fail(400, {
        success: false,
        error: "ID não fornecido."
      });
    }

    const id = parseInt(userId, 10);

    if (Number.isNaN(id)) {
      return fail(400, {
        success: false,
        error: "ID inválido."
      });
    }

    if (!email) {
      return fail(400, {
        success: false,
        error: "O email é obrigatório."
      });
    }

    if (!emailRegex.test(email)) {
      return fail(400, {
        success: false,
        error: "Email inválido."
      });
    }

    if (!password) {
      return fail(400, {
        success: false,
        error: "A senha é obrigatória."
      });
    }

    try {
      const user = await db
        .select()
        .from(LoginTable)
        .where(eq(LoginTable.id, id));

      if (user.length === 0) {
        return fail(404, {
          success: false,
          error: "Usuário não encontrado."
        });
      }

      await db
        .update(LoginTable)
        .set({
          email,
          name,
          password: hashPassword(password),
          updatedAt: new Date()
        })
        .where(eq(LoginTable.id, id));

      return { success: true };
    } catch (error) {
      console.error(error);

      return fail(500, {
        success: false,
        error: "Erro interno ao atualizar no banco."
      });
    }
  },

  delete: async ({ request }) => {
    const formData = await request.formData();

    const id = parseInt(
      formData.get("id")?.toString() || "",
      10
    );

    if (Number.isNaN(id)) {
      return fail(400, {
        success: false,
        error: "ID inválido para exclusão."
      });
    }

    try {
      const user = await db
        .select()
        .from(LoginTable)
        .where(eq(LoginTable.id, id));

      if (user.length === 0) {
        return fail(404, {
          success: false,
          error: "Usuário não encontrado."
        });
      }

      await db
        .delete(LoginTable)
        .where(eq(LoginTable.id, id));

      return { success: true };
    } catch (error) {
      console.error(error);

      return fail(500, {
        success: false,
        error: "Erro ao deletar do banco."
      });
    }
  },

  login: async ({ request }) => {
    const formData = await request.formData();

    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      return fail(400, {
        success: false,
        error: "Email e senha são obrigatórios."
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
          error: "Email ou senha inválidos."
        });
      }

      const isValidPassword = verifyPassword(
        password,
        user[0].password
      );

      if (!isValidPassword) {
        return fail(401, {
          success: false,
          error: "Email ou senha inválidos."
        });
      }

      return {
        success: true,
        user: {
          id: user[0].id,
          email: user[0].email
        }
      };

    } catch (error) {
      console.error(error);

      return fail(500, {
        success: false,
        error: "Erro interno ao realizar login."
      });
    }
  }

};