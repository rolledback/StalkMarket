# Google Sheets Script

Once built, this module produces a script which can be used in Google Sheets to analyze prices for Animal Crossing New Horizon's Stalk Market.

[![Build Status](https://mrayermann.visualstudio.com/StalkMarket/_apis/build/status/rolledback.StalkMarket?branchName=master)](https://mrayermann.visualstudio.com/StalkMarket/_build/latest?definitionId=2&branchName=master)

## Developing

```
npm i
npm run build
npm test
```

## Using

### Getting a Google Sheets friendly script

Before actually using this script in a Google Sheet, you'll need to add a `.gs-config` to the root of the package. The `.gs-config` is used by `gs.ts` during `npm run build` to:
1. remove any code added during TypeScript transpilation that the Google Sheets script runner will get conufsed by
2. insert the endpoint for your API (see the root README for more info)

For the 1st task, for each line you want to delete, add this to `.gs-config`:
```
!<content of line>
```

The recommended lines to delete can be deleted by adding:
```
!Object.defineProperty(exports, "__esModule", { value: true });
!exports.stalkMarketMatch = STALK_MARKET_MATCH;
!"use strict";
```

For the 2nd task, you'll need to replace the value of the `STALK_MARKET_API` const located at the top of index.ts. The value of that const starts with a `$` and is therefore considered a "secret". So to replace that secret value you add:
```
$STALK_MARKET_API=<your API endpoint here>
```

Now when you execute `npm run build`, look for the file `index.gs.js` in `out/`. You can quickly copy the entire contents of this file to Google Sheets.

### Using in Google Sheets

1. Create a spreadsheet.
2. Go to "File" -> "Import" and upload `StalkMarket.csv`.
3. Go to "Tools" -> "Script editor" and paste the contents of `index.gs.js` into the editor. Save.
4. Under the first set of AM/PM headers, you can gradually enter turnip prices throughout the week. It's ok to have them blank initially.
5. Under the next set of headers, set the value of `Sun Buy` to be: `=STALK_MARKET_MATCH(A2:M2,FALSE)`. If this is the first time you are buying turnips, change `FALSE` to be true.
6. You should now see see prices/ranges of prices under the second set of AM/PM headers, pattern probabilities towards the end, and a request ID (for debugging purposes).
7. Once you have prices for the next week, you can add an additional parameter to that week's `STALK_MARKET_MATCH` function: `=STALK_MARKET_MATCH(A2:M2,FALSE,AB3:AE3)`. That paremeter will send your known pattern for the previous week (if there was one) to the API.

