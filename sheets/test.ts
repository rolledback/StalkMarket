import { stalkMarketMatch, StalkMarketApiResponse } from "./index";
import { analyzePrices } from "stalk-market";
import * as assert from "assert";

function api(knownPrices: number[], previousPattern: number | undefined): StalkMarketApiResponse {
    let analysis = analyzePrices(knownPrices, previousPattern);
    return {
        result: analysis,
        requestId: ""
    };
}

function checkResult(result: (string | number)[][], firstBuy: boolean, expectedStringDays: number[]): void {
    let row = result[0];

    assert(firstBuy ? row[0] === "first buy" : typeof row[0] === "number" || expectedStringDays.indexOf(0) !== -1, "result did not indicate a first buy");

    for (let i = 1; i < 13; i++) {
        assert(typeof row[i] === "number" || expectedStringDays.indexOf(i) !== -1, "result cell had a bad type");
    }

    assert(typeof row[13] === "string", "13th cell was not a string");

    for (let i = 14; i < 18; i++) {
        assert(typeof row[i] === "number", "a probability cell was not a number");
    }

    assert(typeof row[18] === "string", "final cell was not a string");
}

function resultIsEmpty(result: (string | number)[][]) {
    return result[0].every((p) => !p);
}

const TestData1: (number | string)[] = [99, 73, 120, 132, 153, 169, 160, 68, 63, 59, 54, 51, 48];
const TestData2: (number | string)[] = [];

describe("STALKMARKET_MATCH", function () {
    it("should work", function () {
        let priceM = [TestData1.slice(0)];
        let expectedStringDays = [];
        let firstBuy = false;
        expectedStringDays.forEach((day) => priceM[0][day] = "N/A");

        let result = stalkMarketMatch(priceM, firstBuy, undefined, api);

        checkResult(result, firstBuy, expectedStringDays);
    });
    it("should handle no known prices", function () {
        let priceM = [TestData2.slice(0)];
        let firstBuy = false;

        let result = stalkMarketMatch(priceM, firstBuy, undefined, api);

        resultIsEmpty(result);
    });
    it("should handle data with non-numbers", function () {
        let priceM = [TestData1.slice(0)];
        let expectedStringDays = [5, 8];
        let firstBuy = false;
        expectedStringDays.forEach((day) => priceM[0][day] = "N/A");

        let result = stalkMarketMatch(priceM, firstBuy, undefined, api);

        checkResult(result, firstBuy, expectedStringDays);
    });
    it("should handle first buy", function () {
        let priceM = [TestData1.slice(0)];
        let expectedStringDays = [];
        let firstBuy = true;
        expectedStringDays.forEach((day) => priceM[0][day] = "N/A");

        let result = stalkMarketMatch(priceM, firstBuy, undefined, api);

        checkResult(result, firstBuy, expectedStringDays);
    });
})
