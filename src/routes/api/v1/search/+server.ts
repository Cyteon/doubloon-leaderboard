import fs from "fs";

export async function GET({ url }) {
    const username = url.searchParams.get("username");
    const slackId = url.searchParams.get("id") || "";

    if (!username && !slackId) {
        return Response.json({ error: "Username or ID is required." }, { status: 400 });
    }

    const total = url.searchParams.get("total") == "true" || false;
    const page = parseInt(url.searchParams.get("page") || "1");

    const cache = await fs.promises.readFile("cache.json", "utf-8");

    const { data, cachedAt } = JSON.parse(cache);
    
    if (total) {
        data.sort((a, b) => b.total_doubloons - a.total_doubloons);
    } else {
        data.sort((a, b) => b.current_doubloons - a.current_doubloons);
    }

    if (slackId) {
        let user = data.find((user) => user.id === slackId);

        if (!user) {
            return Response.json({ error: "User not found." }, { status: 404 });
        }

        user.rank = data.findIndex((u) => u.id === user.id) + 1;

        return Response.json({
            user,
            time_since_last_update: Date.now() - cachedAt
        });
    }

    let users = data.filter((user) => user.username?.toLowerCase().includes(username.toLowerCase()));

    users.forEach((user) => {
        user.rank = data.findIndex((u) => u.username === user.username) + 1;
    });

    if (total) {
        users.sort((a, b) => b.total_doubloons - a.total_doubloons);
    } else {
        users.sort((a, b) => b.current_doubloons - a.current_doubloons);
    }

    users = users.slice(page * 25 - 25, page * 25);

    return Response.json({
        users,
        pages: Math.ceil(users.length / 25),
        opted_in: data.length,
        time_since_last_update: Date.now() - cachedAt
    });
}