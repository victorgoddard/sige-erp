export async function load({ cookies, url }) {
    const noShellRoutes = new Set(["/login", "/cadastro"]);

    return {
        userName: cookies.get("user_name") ?? "",
        hideShell: noShellRoutes.has(url.pathname),
    };
}