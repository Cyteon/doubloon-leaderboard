import fs from "fs";

export async function fetchData() {
    const res = await fetch("https://airtable.com/v0.3/application/appTeNFYcUiYfGcR6/readForSharedPages?stringifiedObjectParams=%7B%22includeDataForPageId%22%3A%22pagblWwXt2nF2bRKu%22%2C%22shouldIncludeSchemaChecksum%22%3Atrue%2C%22expectedPageLayoutSchemaVersion%22%3A26%2C%22shouldPreloadQueries%22%3Atrue%2C%22shouldPreloadAllPossibleContainerElementQueries%22%3Atrue%2C%22urlSearch%22%3A%22iyC4S%253Asort%3DeyJwZWxyRDBBVmZJU282c0RGbCI6eyJjb2x1bW5JZCI6ImZsZDRRb2Z2NUxNR3RsRmxwIiwiYXNjZW5kaW5nIjpmYWxzZX19%22%2C%22includeDataForExpandedRowPageFromQueryContainer%22%3Atrue%2C%22includeDataForAllReferencedExpandedRowPagesInLayout%22%3Atrue%2C%22navigationMode%22%3A%22view%22%7D&requestId=reqF7W1PBvHXwBOfz&accessPolicy=%7B%22allowedActions%22%3A%5B%7B%22modelClassName%22%3A%22page%22%2C%22modelIdSelector%22%3A%22pagblWwXt2nF2bRKu%22%2C%22action%22%3A%22read%22%7D%2C%7B%22modelClassName%22%3A%22application%22%2C%22modelIdSelector%22%3A%22appTeNFYcUiYfGcR6%22%2C%22action%22%3A%22readForSharedPages%22%7D%2C%7B%22modelClassName%22%3A%22application%22%2C%22modelIdSelector%22%3A%22appTeNFYcUiYfGcR6%22%2C%22action%22%3A%22readSignedAttachmentUrls%22%7D%5D%2C%22shareId%22%3A%22shro4hnLq63fT8psX%22%2C%22applicationId%22%3A%22appTeNFYcUiYfGcR6%22%2C%22generationNumber%22%3A0%2C%22expires%22%3A%222025-01-16T00%3A00%3A00.000Z%22%2C%22signature%22%3A%22c00120076892e9d47e46bae23cb5fdc387b8a19d723dee6892fa01081a7fa3d7%22%7D", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Accept-Language": "en-US,en;q=0.5",
            "x-time-zone": "Europe/Berlin",
            "x-user-locale": "en",
            "x-airtable-client-queue-time": "0",
            "x-airtable-application-id": "appTeNFYcUiYfGcR6",
            "x-airtable-page-load-id": "pglJLirrTbzpgbbq0",
            "x-airtable-inter-service-client": "webClient",
            "x-airtable-inter-service-client-code-version": "0172c9229aae27099ae617d13157821608d409b8",
            "traceparent": "00-004d9307f0685cc38a205d334c00562b-b539dff33095899c-01",
            "tracestate": "",
            "X-Requested-With": "XMLHttpRequest",
            "Sec-GPC": "1",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache"
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

        await fs.promises.writeFile("cache.json", JSON.stringify({
            cachedAt: Date.now(),
            data
        }), "utf-8");

        return data;
    } else {
        console.error("Failed to fetch data from Airtable, using cache instead.");

        const cache = await fs.promises.readFile("cache.json", "utf-8");

        const { data } = JSON.parse(cache);

        return data;
    }
}