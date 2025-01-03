import fs from "fs";

import { fetchData } from "$lib/data.server";

export async function GET({ url }) {
    const page = (url.searchParams.get("page") || 1) as number;
    const total = url.searchParams.get("total") == "true" || false;

    try {
        const cache = await fs.promises.readFile("cache.json", "utf-8");

        const { cachedAt, data } = JSON.parse(cache);

        if (Date.now() - cachedAt > 1000 * 60 * 5) {
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
        } else {
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
        }
    } catch (e) {
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