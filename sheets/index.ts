import * as StalkMarket from "stalk-market";

export type StalkMarketApiResponse = { result?: StalkMarket.PriceAnalysis; requestId: string; };
export type StalkMarketApi = (knownPrices: number[], previousPattern: number | undefined) => StalkMarketApiResponse;

const STALK_MARKET_API = "$STALK_MARKET_API";

function urlFetchStalkMarket(knownPrices: number[], previousPattern: number | undefined): StalkMarketApiResponse {
    let response = UrlFetchApp.fetch(STALK_MARKET_API, {
        'method': 'post',
        'contentType': 'application/json',
        'payload': JSON.stringify({
            knownPrices: knownPrices,
            previousPattern: previousPattern
        })
    });
    let responseObj: { result?: StalkMarket.PriceAnalysis, requestId: string } = JSON.parse(response.getContentText());
    return responseObj;
}

/**
 * @param priceM A 1 row, 13 column, matrix of numbers. Each element is a turnip price. The
 * 0th price is the Sunday buy price, 1st and 2nd are Monday AM and PM, 3rd and 4th are
 * Tuesday AM and PM, etc.
 * @param fB Whether or not this is the first time turnips are being bought on the island.
 * @param probabilityM A 1 row, 4 column matrix of numbers. Each element is a 0..1 probability
 * that pattern i (i being the column) was the pattern last week.
 */
function STALK_MARKET_MATCH(priceM: (number | string)[][], firstBuy: boolean, probabilityM: number[][] = [[]], api: StalkMarketApi = urlFetchStalkMarket) {
    let knownPrices = Array(14).fill(0);
    for (let i = 1; i < 14; i++) {
        if (typeof priceM[0][i - 1] === "number") {
            knownPrices[i] = priceM[0][i - 1] || 0;
        }
        else {
            knownPrices[i] = 0;
        }
    }
    knownPrices[0] = knownPrices[1];
    let unknownBuyPrice = knownPrices[0] === 0;

    if (firstBuy) {
        knownPrices[0] = 0;
        knownPrices[1] = 0;
    }

    let previousPattern = probabilityM[0].indexOf(1);

    let apiResponse = api(knownPrices, previousPattern === -1 ? undefined : previousPattern);
    let analysis = apiResponse.result;
    let requestId = apiResponse.requestId;
    let returnMatrix: (number | string)[][] = [Array(19).fill(" ")];

    if (!!analysis) {
        let patternToUse = analysis[0];
        let matchToUse = patternToUse.matches[0];

        if (!!matchToUse) {
            matchToUse.shift();

            if (firstBuy) {
                returnMatrix[0][0] = "first buy";
            } else if (unknownBuyPrice) {
                returnMatrix[0][0] = matchToUse[0][0] + "," + matchToUse[0][1]
            } else {
                returnMatrix[0][0] = matchToUse[0][0]
            }

            for (let i = 1; i < 13; i++) {
                returnMatrix[0][i] = matchToUse[i][0] !== matchToUse[i][1] ? matchToUse[i][0] + "," + matchToUse[i][1] : matchToUse[i][0];
            }
        } else {
            returnMatrix[0][0] = "No match?";
        }

        let patternWithBestChance = analysis.reduce((pV, cV) => {
            if (pV.patternIdx === -1) {
                return cV;
            } else if (pV.probability < cV.probability) {
                return cV;
            } else {
                return pV;
            }
        }, analysis[0]);
        if (!matchToUse) {
            returnMatrix[0][13] = "Unknown";
        } else {
            returnMatrix[0][13] = patternWithBestChance.patternName;
        }

        let pattern0Analysis = analysis.filter((m) => m.patternIdx == 0)[0];
        let pattern1Analysis = analysis.filter((m) => m.patternIdx == 1)[0];
        let pattern2Analysis = analysis.filter((m) => m.patternIdx == 2)[0];
        let pattern3Analysis = analysis.filter((m) => m.patternIdx == 3)[0];

        returnMatrix[0][14] = pattern0Analysis.probability / 100;
        returnMatrix[0][15] = pattern1Analysis.probability / 100;
        returnMatrix[0][16] = pattern2Analysis.probability / 100;
        returnMatrix[0][17] = pattern3Analysis.probability / 100;
    } else {
        returnMatrix[0][0] = "Error";
    }


    returnMatrix[0][18] = JSON.stringify(requestId);
    return returnMatrix;
}

export let stalkMarketMatch = STALK_MARKET_MATCH;
