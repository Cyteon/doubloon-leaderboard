// i think this is ssr :heavysob:

import fs from "fs";
import { fetchData } from "$lib/data.server";

export const load = async ({ }) => {
    try {
            const cache = await fs.promises.readFile("cache.json", "utf-8");
    
            const { cachedAt, data } = JSON.parse(cache);
    
            if (Date.now() - cachedAt > 1000 * 60 * 5) {
                let data = await fetchData();
    
            
                data.sort((a, b) => b.current_doubloons - a.current_doubloons);
    
                return {
                    users: data.slice(0, 25),
                    pages: Math.ceil(data.length / 25),
                    opted_in: data.length,
                    time_since_last_update: 0
                };
            } else {
                data.sort((a, b) => b.current_doubloons - a.current_doubloons);
    
                return {
                    users: data.slice(0, 25),
                    pages: Math.ceil(data.length / 25),
                    opted_in: data.length,
                    time_since_last_update: Date.now() - cachedAt
                };
            }
        } catch (e) {
            let data = await fetchData();
    
            data.sort((a, b) => b.current_doubloons - a.current_doubloons);
    
            return {
                users: data.slice(0, 25),
                pages: Math.ceil(data.length / 25),
                opted_in: data.length,
                time_since_last_update: 0
            };
        }
};