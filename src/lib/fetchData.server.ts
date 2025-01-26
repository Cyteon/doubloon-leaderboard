import client from "$lib/cache.server";
import fs from "fs";

export default async function fetchData() {
    console.log("Fetching data from Airtable");

    const res = await fetch("https://airtable.com/v0.3/application/appTeNFYcUiYfGcR6/readForSharedPages?stringifiedObjectParams=%7B%22includeDataForPageId%22%3A%22pagblWwXt2nF2bRKu%22%2C%22shouldIncludeSchemaChecksum%22%3Atrue%2C%22expectedPageLayoutSchemaVersion%22%3A26%2C%22shouldPreloadQueries%22%3Atrue%2C%22shouldPreloadAllPossibleContainerElementQueries%22%3Atrue%2C%22urlSearch%22%3A%22iyC4S%253Asort%3DeyJwZWxyRDBBVmZJU282c0RGbCI6eyJjb2x1bW5JZCI6ImZsZHh0Y3h2T0FyQ1JTYzZKIiwiYXNjZW5kaW5nIjpmYWxzZX19%22%2C%22includeDataForExpandedRowPageFromQueryContainer%22%3Atrue%2C%22includeDataForAllReferencedExpandedRowPagesInLayout%22%3Atrue%2C%22navigationMode%22%3A%22view%22%7D&requestId=reqdw1usa3w2U5EDZ&accessPolicy=%7B%22allowedActions%22%3A%5B%7B%22modelClassName%22%3A%22page%22%2C%22modelIdSelector%22%3A%22pagblWwXt2nF2bRKu%22%2C%22action%22%3A%22read%22%7D%2C%7B%22modelClassName%22%3A%22application%22%2C%22modelIdSelector%22%3A%22appTeNFYcUiYfGcR6%22%2C%22action%22%3A%22readForSharedPages%22%7D%2C%7B%22modelClassName%22%3A%22application%22%2C%22modelIdSelector%22%3A%22appTeNFYcUiYfGcR6%22%2C%22action%22%3A%22readSignedAttachmentUrls%22%7D%5D%2C%22shareId%22%3A%22shro4hnLq63fT8psX%22%2C%22applicationId%22%3A%22appTeNFYcUiYfGcR6%22%2C%22generationNumber%22%3A0%2C%22expires%22%3A%222025-02-13T00%3A00%3A00.000Z%22%2C%22signature%22%3A%222e914abcd764855797b77d20b9ec093a0475e76b32b1549aa65ad558df8529e8%22%7D", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0",
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Accept-Language": "en-US,en;q=0.5",
            "x-time-zone": "Europe/Oslo",
            "x-user-locale": "en",
            "x-airtable-client-queue-time": "0",
            "x-airtable-application-id": "appTeNFYcUiYfGcR6",
            "x-airtable-page-load-id": "pglQ3rzVIHeHT9ETo",
            "x-airtable-inter-service-client": "webClient",
            "x-airtable-inter-service-client-code-version": "16c9ba318d59b9179baf308a61decbf1a9096e51",
            "traceparent": "00-399bed3e39b8fee3e547251a9822c09f-f2141eb318663e71-01",
            "tracestate": "",
            "X-Requested-With": "XMLHttpRequest",
            "Sec-GPC": "1",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
        },
        "method": "GET",
        "mode": "cors"
    });

    if (res.ok) {
        const json = await res.json();

        const data = [];

        const docs = json.data.preloadPageQueryResults.tableDataById.tblfTzYVqvDJlIYUB.partialRowById;
        
        for (const docId in docs) {
            const doc = docs[docId];
            
            data.push({
                username: doc.cellValuesByColumnId.fldOVlRkhZklVMoqF,
                total_doubloons: doc.cellValuesByColumnId.fld8Qfj9OUvo4LeG2,
                current_doubloons: doc.cellValuesByColumnId.fld4Qofv5LMGtlFlp,
                slack: doc.cellValuesByColumnId.fldDyEwLCk2QQnMAn,
                id: doc.cellValuesByColumnId.fldQiUhwbhQ2Lvrm5
            }); 
        }

        Promise.all([
            client.set("doubloon_lb", JSON.stringify({
                cachedAt: Date.now(),
                data
            }), { EX: 300 }).catch(console.error),
            client.set("doubloon_lb_persistent", JSON.stringify({
                data,
                cachedAt: Date.now()
            })).catch(console.error)
        ]);

        console.log("Fetched data from Airtable, all went good");

        return data;
    } else {
        console.error(`Failed to fetch data from Airtable, using cache instead: ${res.status} ${res.statusText}`);

        const cache = await client.get("doubloon_lb_persistent");

        if (cache) {
            console.error("Using cache: 'doubloon_lb_persistent'");
            const { data } = JSON.parse(cache);

            return data;
        } else {
            console.error("We are so fucking cooked.");
            console.error("imma try to use silly cache.json, if thats gone we cooked for real");

            try {
                const cache = await fs.promises.readFile("cache.json", "utf-8");

                const { data } = JSON.parse(cache);

                return data;
            } catch (e) {
                console.error("NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
                console.error(e);

                return [];
            }
        }
    }
}