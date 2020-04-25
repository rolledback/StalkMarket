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

    assert(firstBuy ? row[0] === "first buy" : typeof row[0] === "number" || expectedStringDays.indexOf(0) !== -1);

    for (let i = 1; i < 13; i++) {
        assert(typeof row[i] === "number" || expectedStringDays.indexOf(i) !== -1);
    }

    assert(typeof row[13] === "string");

    for (let i = 14; i < 18; i++) {
        assert(typeof row[i] === "number");
    }

    assert(typeof row[18] === "string");
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
        let expectedStringDays = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        let firstBuy = false;

        let result = stalkMarketMatch(priceM, firstBuy, undefined, api);

        checkResult(result, firstBuy, expectedStringDays);
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
