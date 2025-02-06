import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const res = fetch("https://airtable.com/v0.3/application/appTeNFYcUiYfGcR6/readForSharedPages?stringifiedObjectParams=%7B%22includeDataForPageId%22%3A%22pagblWwXt2nF2bRKu%22%2C%22shouldIncludeSchemaChecksum%22%3Atrue%2C%22expectedPageLayoutSchemaVersion%22%3A26%2C%22shouldPreloadQueries%22%3Atrue%2C%22shouldPreloadAllPossibleContainerElementQueries%22%3Atrue%2C%22urlSearch%22%3A%22iyC4S%253Asort%3DeyJwZWxyRDBBVmZJU282c0RGbCI6eyJjb2x1bW5JZCI6ImZsZHh0Y3h2T0FyQ1JTYzZKIiwiYXNjZW5kaW5nIjpmYWxzZX19%22%2C%22includeDataForExpandedRowPageFromQueryContainer%22%3Atrue%2C%22includeDataForAllReferencedExpandedRowPagesInLayout%22%3Atrue%2C%22navigationMode%22%3A%22view%22%7D&requestId=reqdw1usa3w2U5EDZ&accessPolicy=%7B%22allowedActions%22%3A%5B%7B%22modelClassName%22%3A%22page%22%2C%22modelIdSelector%22%3A%22pagblWwXt2nF2bRKu%22%2C%22action%22%3A%22read%22%7D%2C%7B%22modelClassName%22%3A%22application%22%2C%22modelIdSelector%22%3A%22appTeNFYcUiYfGcR6%22%2C%22action%22%3A%22readForSharedPages%22%7D%2C%7B%22modelClassName%22%3A%22application%22%2C%22modelIdSelector%22%3A%22appTeNFYcUiYfGcR6%22%2C%22action%22%3A%22readSignedAttachmentUrls%22%7D%5D%2C%22shareId%22%3A%22shro4hnLq63fT8psX%22%2C%22applicationId%22%3A%22appTeNFYcUiYfGcR6%22%2C%22generationNumber%22%3A0%2C%22expires%22%3A%222025-02-13T00%3A00%3A00.000Z%22%2C%22signature%22%3A%222e914abcd764855797b77d20b9ec093a0475e76b32b1549aa65ad558df8529e8%22%7D", {
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
}).then((res) => {
    if (res.ok) {
        res.json().then(async (json) => {
            const docs = json.data.preloadPageQueryResults.tableDataById.tblfTzYVqvDJlIYUB.partialRowById;

            let cheaters = [];
            let checked = 0;

            const ratelimit = 60 / 150 * 1000;
            console.log(`Doing ${(60 / 60 / ratelimit * 1000).toFixed(1)} reqs/sec (${60 / ratelimit * 1000} reqs/min) - ETA: ${(Object.keys(docs).length / (150 / 60) / 60).toFixed(1)} minutes`);
            console.log(`Checking ${Object.keys(docs).length} users\n`);

            for (const docId in docs) {
                const doc = docs[docId];
            
                const id = doc.cellValuesByColumnId.fldQiUhwbhQ2Lvrm5;
                
                try {
                    const res2 = await fetch(`https://slack.com/api/users.info?user=${id}`, {
                        headers: {
                            Authorization: `Bearer ${process.env.SLACK_TOKEN_FOR_CHEATER_FINDER}`
                        }
                    })
    
                    if (res2.ok) {
                        res2.json().then((json) => {
                            if (json?.user && json.user.deleted) {
                                console.log(`Cheater found: ${json.user.name} | ${doc.cellValuesByColumnId.fldOVlRkhZklVMoqF} | STINKYYYYYYYYYYYYYYYYYYYY`);

                                cheaters.push(json.user.id);
                            } else {
                                console.log(`Not a cheater: ${json.user?.name} | ${doc.cellValuesByColumnId.fldOVlRkhZklVMoqF}`);
                            }
    
                            checked++;
                            console.log(`Checked ${checked}/${Object.keys(docs).length} users (${Math.round(checked / Object.keys(docs).length * 100)}%) | ${cheaters.length} cheaters found\n`);
                        }).catch((err) => { console.error("Error parsing JSON (2)", err); })
                    } else {
                        res2.text().then((text) => { console.error("Failed to fetch user info from Slack", text); })
                    }
                } catch (err) {
                    console.error("Error fetching user info from Slack", err);
                }

                await new Promise((resolve) => setTimeout(resolve, ratelimit));
            }

            await fs.promises.writeFile("./src/lib/cheaters/cheaters.json", JSON.stringify(cheaters, null, 4));
        }).catch((err) => { console.error("Error parsing JSON", err); })
    } else {
        console.error("Failed to fetch data from Airtable", res.text());
    }
}).catch((err) => { console.error("Error fetching data from Airtable", err); });