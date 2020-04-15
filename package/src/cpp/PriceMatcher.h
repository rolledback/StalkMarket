#ifndef PRICE_MATCHER_H_
#define PRICE_MATCHER_H_

#include <vector>

using namespace std;

namespace PriceMatcher
{
    struct Matches
    {
        vector<vector<vector<int>>> pattern0Matches;
        vector<vector<vector<int>>> pattern1Matches;
        vector<vector<vector<int>>> pattern2Matches;
        vector<vector<vector<int>>> pattern3Matches;
    };

    Matches findMatches(int knownPrices[14]);
}

#endif  // PRICE_MATCHER_H_