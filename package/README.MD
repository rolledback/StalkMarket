# stalk-market

Provides tools to analyze past and present turnip prices from Animal Crossing New Horizons.

## Developing

```
npm i
npm run build
```

## Using

```ts

import * as StalkMarket from "stalk-market";

// 2 prices/day, including Sunday (repeat sell price or specify a range)
let knownPrices = [95, 95, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let result = StalkMarket.analyzePrices(knownPrices);

```
