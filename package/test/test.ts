import * as process from "process";
process.env["NODE_TEST"] = "true";

import * as assert from "assert";
import * as StalkMarket from "../src/ts/index";

describe("README Example", function () {
    it("should work", function () {
        // 2 prices/day, including Sunday (repeat sell price or specify a range)
        let knownPrices = [95, 95, 110, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let result = StalkMarket.analyzePrices(knownPrices);

        assert(!!result);
    });
});
