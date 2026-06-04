import { redirect } from "@sveltejs/kit";

export async function load({ cookies, url }) {
    const noShellRoutes = new Set(["/login", "/cadastro"]);

    const cookie = cookies.get("session");

    let session = null;

    if (cookie) {
        try {
            session = JSON.parse(cookie);
        } catch {
            session = null;
        }
    }

    const isPublicRoute = noShellRoutes.has(url.pathname);

    if (!session && !isPublicRoute) {
        throw redirect(303, "/login");
    }

    return {
        userName: session?.userName ?? "Usuario",
        userId: session?.userId ?? 0,
        hideShell: noShellRoutes.has(url.pathname),
    };
}