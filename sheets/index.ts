import * as StalkMarket from "stalk-market";

const STALK_MARKET_API = "#STALK_MARKET_API#";

/**
 * @param priceM A 1 row, 13 column, matrix of numbers. Each element is a turnip price. The
 * 0th price is the Sunday buy price, 1st and 2nd are Monday AM and PM, 3rd and 4th are
 * Tuesday AM and PM, etc.
 * @param fB Whether or not this is the first time turnips are being bought on the island.
 * @param probabilityM A 1 row, 4 column matrix of numbers. Each element is a 0..1 probability
 * that pattern i (i being the column) was the pattern last week.
 */
function STALKMARKET_MATCH(priceM: number[][], fB: boolean, probabilityM?: number[][]) {
    let priceV: number[] = priceM[0];
    let probabilityV: number[] = (probabilityM || [[]])[0];

    let knownPrices = Array(14).fill(priceV[0] || 0);
    let firstBuy = fB === true;
    let unknownBuyPrice = !priceV[0];

    for (let i = 1; i < 14; i++) {
        if (typeof priceV[i] !== "number") {
            priceV[i] = 0;
        }
        knownPrices[i] = priceV[i - 1] || 0;
    }

    if (firstBuy) {
        knownPrices[0] = 0;
        knownPrices[1] = 0;
    }

    let previousPattern = (probabilityV || []).indexOf(1);

    let response = UrlFetchApp.fetch(STALK_MARKET_API, {
        'method': 'post',
        'contentType': 'application/json',
        'payload': JSON.stringify({
            knownPrices: knownPrices,
            previousPattern: previousPattern === -1 ? undefined : previousPattern
        })
    });
    let responseObj: { result: StalkMarket.PriceAnalysis, requestId: string } = JSON.parse(response.getContentText());
    let returnMatrix: (number | string)[][] = [Array(19).fill(" ")];

    let analysis = responseObj.result;
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

    returnMatrix[0][18] = JSON.stringify(responseObj.requestId);
    return returnMatrix;
}

export default STALKMARKET_MATCH;
