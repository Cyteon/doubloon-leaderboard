import fetchData from "$lib/fetchData.server.js";
import client from "$lib/cache.server";

client.del("doubloon_lb");

export async function GET({ url }) {
    const page = (url.searchParams.get("page") || 1) as number;
    const total = url.searchParams.get("total") == "true" || false;

    try {
        const cache = await client.get("doubloon_lb");

        if (cache) {
            let { cachedAt, data } = JSON.parse(cache);

            if (total) {
                data.sort((a, b) => b.total_doubloons - a.total_doubloons);
            } else {
                data.sort((a, b) => b.current_doubloons - a.current_doubloons);
            }

            return Response.json({
                users: data.slice(page * 25 - 25, page * 25),
                pages: Math.ceil(data.length / 25),
                opted_in: data.length,
                time_since_last_update: Date.now() - cachedAt
            });
        } else {
            let data = await fetchData();

            if (total) {
                data.sort((a, b) => b.total_doubloons - a.total_doubloons);
            } else {
                data.sort((a, b) => b.current_doubloons - a.current_doubloons);
            }

            return Response.json({
                users: data.slice(page * 25 - 25, page * 25),
                pages: Math.ceil(data.length / 25),
                opted_in: data.length,
                time_since_last_update: 0
            });
        }
    } catch (e) {
        console.error("We cooked: ", e);

        let data = await fetchData();

        if (total) {
            data.sort((a, b) => b.total_doubloons - a.total_doubloons);
        } else {
            data.sort((a, b) => b.current_doubloons - a.current_doubloons);
        }

        return Response.json({
            users: data.slice(page * 25 - 25, page * 25),
            pages: Math.ceil(data.length / 25),
            opted_in: data.length,
            time_since_last_update: 0
        });
    }
}
