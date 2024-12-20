import fs from "fs";

export async function GET({ url }) {
    const username = url.searchParams.get("username");

    if (!username) {
        return Response.json({ error: "Username is required." }, { status: 400 });
    }

    const total = url.searchParams.get("total") == "true" || false;

    const cache = await fs.promises.readFile("cache.json", "utf-8");

    const { data } = JSON.parse(cache);

    let user = data.find(user => (user.username || "").toLowerCase() == username.toLowerCase());

    if (!user) {
        return Response.json({ error: "User not found." }, { status: 404 });
    }

    if (total) {
        data.sort((a, b) => b.total_doubloons - a.total_doubloons); 
    } else {
        data.sort((a, b) => b.current_doubloons - a.current_doubloons);
    }

    user.rank = data.indexOf(user) + 1;

    return Response.json(user);
}