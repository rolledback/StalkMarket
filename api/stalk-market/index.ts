import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { PriceAnalysis, analyzePrices } from "stalk-market";
import * as crypto from "crypto";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    let log: string[] = [];
    let start = Date.now();
    let response: { result?: PriceAnalysis; requestId: string; } = { requestId: newRequestId() };

    try {
        log.push(`Request: ${JSON.stringify(req)}`);
        let knownPrices: number[] = req.body.knownPrices;
        let previousPattern: number | undefined = req.body.previousPattern;

        log.push(`Known prices: ${JSON.stringify(knownPrices)}`);
        log.push(`Previous pattern: ${JSON.stringify(previousPattern)}`);

        for (let i = 0; i < 14; i++) {
            if (knownPrices[i] === undefined) {
                knownPrices[i] = 0;
            }
        }

        response.result = analyzePrices(knownPrices, previousPattern);
    } catch (err) {
        log.push(`Error: ${err.toString()}`);
    }

    context.res = {
        body: response,
        headers: {
            "Content-Type": "application/json"
        }
    };

    let end = Date.now();

    log.push(`Execution time: ${end - start}ms`);
    log.push(`Response: ${JSON.stringify(response)}`);

    context.log(log);
    context.done();
};

function newRequestId(): string {
    return crypto.randomBytes(16).toString('hex');
}

export default httpTrigger;
