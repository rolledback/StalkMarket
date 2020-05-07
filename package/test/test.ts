import * as process from "process";
process.env["NODE_TEST"] = "true";

import * as assert from "assert";
import * as StalkMarket from "../src/ts/index";

describe("README Example", function () {
    it("should work", function () {
        // 2 prices/day, including Sunday (repeat sell price or specify a range)
        let knownPrices = [95, 95, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let result = StalkMarket.analyzePrices(knownPrices);

        assert(!!result);
    });
});

describe("getPatternProbabilities", function () {
    it("should work", function () {
        let result = StalkMarket.getPatternProbabilities(undefined, [false, false, false, false]);
        assert(!!result);
    });
    it("should always add to ~100 or 0", function () {
        let result: number[];

        let combinations = generateBooleanCombinations(4);
        for (let prevPattern = 0; prevPattern < 5; prevPattern++) {
            combinations.forEach((combination) => {
                result = StalkMarket.getPatternProbabilities(prevPattern < 4 ? prevPattern : undefined, combination)
                assert(!!result);
                let sum = result.reduce((pV, cV) => pV + cV, 0);
                assert(100 - sum < 1 || sum === 0);
            });
        }
    });
});

describe("analyzePrices", function () {
    it("should work", function () {
        let knownPrices = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let result = StalkMarket.analyzePrices(knownPrices);

        assert(!!result);
    });
    it("should gracefully handle no match", function () {
        let knownPrices = [0, 0, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000];
        let result = StalkMarket.analyzePrices(knownPrices);

        assert(!!result);
    });
    it("should return consistent results", function () {
        let knownPrices1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let knownPrices2 = [93, 93, 83, 78, 107, 146, 423, 0, 0, 0, 0, 0, 0, 0];

        let result1 = StalkMarket.analyzePrices(knownPrices1);
        StalkMarket.analyzePrices(knownPrices2);
        let result2 = StalkMarket.analyzePrices(knownPrices1);

        let resultsAreTheSame: boolean = JSON.stringify(result1) === JSON.stringify(result2);
        assert(resultsAreTheSame);
    });
});

function generateBooleanCombinations(length: number): boolean[][] {
    let returnVal: boolean[][] = [];
    const AMOUNT_OF_VARIABLES = length;

    for (let i = 0; i < (1 << AMOUNT_OF_VARIABLES); i++) {
        let boolArr: boolean[] = [];
        for (let j = AMOUNT_OF_VARIABLES - 1; j >= 0; j--) {
            boolArr.push(Boolean(i & (1 << j)));
        }
        returnVal.push(boolArr);
    }

    return returnVal;
}