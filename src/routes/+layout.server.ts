export async function load({ cookies }) {
    return {
        userName: cookies.get("user_name") ?? ""
    };
}