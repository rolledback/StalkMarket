# stalk-market

Provides tools to analyze past and present turnip prices from Animal Crossing New Horizons.

[![Build Status](https://mrayermann.visualstudio.com/StalkMarket/_apis/build/status/rolledback.StalkMarket?branchName=master)](https://mrayermann.visualstudio.com/StalkMarket/_build/latest?definitionId=2&branchName=master)

## Developing

```
npm i
npm run build
npm test
```

## Using

```ts

import * as StalkMarket from "stalk-market";

// 2 prices/day, including Sunday (repeat sell price or specify a range)
let knownPrices = [95, 95, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let result = StalkMarket.analyzePrices(knownPrices);

```
