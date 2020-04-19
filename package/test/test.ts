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
    it("should always add to ~100", function () {
        let result: number[];

        for (let pattern = 0; pattern < 5; pattern++) {
            for (let i = 0; i < (1 << 3); i++) {
                let impossiblePatterns: boolean[] = [];
                for (let j = 4 - 1; j >= 0; j--) {
                    impossiblePatterns.push(Boolean(i & (1 << j)));
                }

                result = StalkMarket.getPatternProbabilities(pattern < 4 ? pattern : undefined, impossiblePatterns);
                assert(!!result);

                let sum = result.reduce((pV, cV) => pV + cV, 0);
                assert(100 - sum < 1);
            }
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
});
