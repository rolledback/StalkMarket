#include <iostream>
#include <algorithm>
#include <vector>
#include <cmath>
#include "PriceMatcher.h"

using namespace std;

namespace PriceMatcher
{
    void rndFltMult(vector<int>& maxAndMin, float rangeA, float rangeB) {
        float minRange = min(rangeA, rangeB);
        float maxRange = max(rangeA, rangeB);
        maxAndMin[0] = floor(minRange * maxAndMin[0]);
        maxAndMin[1] = ceil(maxRange * maxAndMin[1]);
    }

    bool isPriceOutOfRng(int price, vector<int>& maxAndMin)
    {
        return price != 0 && (price < maxAndMin[0] || maxAndMin[1] < price);
    }

    bool rndFltMultAndCheckPrice(vector<int>& maxAndMin, float rangeA, float rangeB, int price) {
        rndFltMult(maxAndMin, rangeA, rangeB);
        bool isOutOfRange = isPriceOutOfRng(price, maxAndMin);
        if (price != 0)
        {
            maxAndMin[0] = price;
            maxAndMin[1] = price;
        }

        return isOutOfRange;
    }

    // PATTERN 3: decreasing, spike, decreasing
    void matchPattern3(int pricesToMatch[14], vector<vector<vector<int>>>& out)
    {
        int peakStartMin = 2;
        int peakStartMax = 9;

        for (int peakStart = peakStartMin; peakStart <= peakStartMax; peakStart++)
        {
            int work = 2;
            int basePrice = pricesToMatch[0];
            bool isInvalid = false;

            vector<vector<int>> maxAndMins(14, vector<int>(2));
            for (int r = 0; r < 14; r++)
                for (int c = 0; c < 2; c++)
                    maxAndMins[r][c] = basePrice;

            float rateMin1 = 0.4;
            float rateMax1 = 0.9;
            for (work = 2; work < peakStart; work++)
            {
                isInvalid = isInvalid || rndFltMultAndCheckPrice(maxAndMins[work], rateMin1, rateMax1, pricesToMatch[work]);

                rateMin1 -= 0.03;
                rateMax1 -= 0.03;

                rateMin1 -= 0.02;
            }

            isInvalid = isInvalid || rndFltMultAndCheckPrice(maxAndMins[work], 0.9, 1.4, pricesToMatch[work]);
            work++;

            isInvalid = isInvalid || rndFltMultAndCheckPrice(maxAndMins[work], 0.9, 1.4, pricesToMatch[work]);
            work++;

            isInvalid = isInvalid || rndFltMultAndCheckPrice(maxAndMins[work], 1.4, 2.0, pricesToMatch[work]);
            work++;

            isInvalid = isInvalid || rndFltMultAndCheckPrice(maxAndMins[work], 1.4, 2.0, pricesToMatch[work]);
            work++;

            isInvalid = isInvalid || rndFltMultAndCheckPrice(maxAndMins[work], 1.4, 2.0, pricesToMatch[work]);
            work++;

            if (work < 14)
            {
                float rateMin2 = 0.4;
                float rateMax2 = 0.9;
                for (; work < 14; work++)
                {
                    isInvalid = isInvalid || rndFltMultAndCheckPrice(maxAndMins[work], rateMin2, rateMax2, pricesToMatch[work]);

                    if (pricesToMatch[work] != 0)
                    {
                        rateMin2 = (float)pricesToMatch[work] / (float)basePrice;
                        rateMax2 = (float)pricesToMatch[work] / (float)basePrice;
                    }
                    rateMin2 -= 0.03;
                    rateMax2 -= 0.03;

                    rateMin2 -= 0.02;
                }
            }

            if (!isInvalid)
            {
                out.push_back(maxAndMins);
            }
        }
    }

    // PATTERN 2: consistently decreasing
    void matchPattern2(int pricesToMatch[14], vector<vector<vector<int>>>& out)
    {
        int work = 2;
        int basePrice = pricesToMatch[0];
        bool isInvalid = false;

        vector<vector<int>> maxAndMins(14, vector<int>(2));
        for (int r = 0; r < 14; r++)
            for (int c = 0; c < 2; c++)
                maxAndMins[r][c] = basePrice;

        float rateMin = 0.85;
        float rateMax = 0.9;
        for (work; work < 14; work++)
        {
            isInvalid = isInvalid || rndFltMultAndCheckPrice(maxAndMins[work], rateMin, rateMax, pricesToMatch[work]);

            if (pricesToMatch[work] != 0)
            {
                rateMin = (float)pricesToMatch[work] / (float)basePrice;
                rateMax = (float)pricesToMatch[work] / (float)basePrice;
            }
            rateMin -= 0.03;
            rateMax -= 0.03;

            rateMin -= 0.02;
        }

        if (!isInvalid)
        {
            out.push_back(maxAndMins);
        }
    }

    // PATTERN 1: decreasing middle, high spike, random low
    void matchPattern1(int pricesToMatch[14], vector<vector<vector<int>>>& out)
    {
        int peakStartMin = 3;
        int peakStartMax = 9;

        for (int peakStart = peakStartMin; peakStart <= peakStartMax; peakStart++)
        {
            int work = 2;
            int basePrice = pricesToMatch[0];
            bool isInvalid = false;

            vector<vector<int>> maxAndMins(14, vector<int>(2));
            for (int r = 0; r < 14; r++)
                for (int c = 0; c < 2; c++)
                    maxAndMins[r][c] = basePrice;

            float rateMin = 0.85;
            float rateMax = 0.9;
            for (work; work < peakStart; work++)
            {
                isInvalid = isInvalid || rndFltMultAndCheckPrice(maxAndMins[work], rateMin, rateMax, pricesToMatch[work]);

                if (pricesToMatch[work] != 0)
                {
                    rateMin = (float)pricesToMatch[work] / (float)basePrice;
                    rateMax = (float)pricesToMatch[work] / (float)basePrice;
                }
                rateMin -= 0.03;
                rateMax -= 0.03;

                rateMin -= 0.02;
            }

            isInvalid = isInvalid || rndFltMultAndCheckPrice(maxAndMins[work], 0.9, 1.4, pricesToMatch[work]);
            work++;

            isInvalid = isInvalid || rndFltMultAndCheckPrice(maxAndMins[work], 1.4, 2.0, pricesToMatch[work]);
            work++;

            isInvalid = isInvalid || rndFltMultAndCheckPrice(maxAndMins[work], 2.0, 6.0, pricesToMatch[work]);
            work++;

            isInvalid = isInvalid || rndFltMultAndCheckPrice(maxAndMins[work], 1.4, 2.0, pricesToMatch[work]);
            work++;

            isInvalid = isInvalid || rndFltMultAndCheckPrice(maxAndMins[work], 0.9, 1.4, pricesToMatch[work]);
            work++;

            for (; work < 14; work++)
            {
                isInvalid = isInvalid || rndFltMultAndCheckPrice(maxAndMins[work], 0.4, 0.9, pricesToMatch[work]);
            }

            if (!isInvalid)
            {
                out.push_back(maxAndMins);
            }
        }
    }

    // PATTERN 0: high, decreasing, high, decreasing, high
    void matchPattern0(int pricesToMatch[14], vector<vector<vector<int>>>& out)
    {
        int decPhaseLen1Min = 2;
        int decPhaseLen1Max = 3;

        for (int decPhaseLen1 = decPhaseLen1Min; decPhaseLen1 <= decPhaseLen1Max; decPhaseLen1++)
        {
            int decPhaseLen2 = 5 - decPhaseLen1;

            int hiPhaseLen1Min = 0;
            int hiPhaseLen1Max = 6;

            for (int hiPhaseLen1 = hiPhaseLen1Min; hiPhaseLen1 <= hiPhaseLen1Max; hiPhaseLen1++)
            {
                int hiPhaseLen2and3 = 7 - hiPhaseLen1;

                int hiPhaseLen3Min = 0;
                int hiPhaseLen3Max = hiPhaseLen2and3 - 1;

                for (int hiPhaseLen3 = hiPhaseLen3Min; hiPhaseLen3 <= hiPhaseLen3Max; hiPhaseLen3++)
                {
                    int hiPhaseLen2 = hiPhaseLen2and3 - hiPhaseLen3;

                    int work = 2;
                    int basePrice = pricesToMatch[0];
                    bool isInvalid = false;

                    vector<vector<int>> maxAndMins(14, vector<int>(2));
                    for (int r = 0; r < 14; r++)
                        for (int c = 0; c < 2; c++)
                            maxAndMins[r][c] = basePrice;

                    // high phase 1
                    for (int i = 0; i < hiPhaseLen1; i++)
                    {
                        isInvalid = isInvalid || rndFltMultAndCheckPrice(maxAndMins[work], 0.9, 1.4, pricesToMatch[work]);
                        work++;
                    }

                    // decreasing phase 1
                    float rateMin1 = 0.6;
                    float rateMax1 = 0.8;
                    for (int i = 0; i < decPhaseLen1; i++)
                    {
                        isInvalid = isInvalid || rndFltMultAndCheckPrice(maxAndMins[work], rateMin1, rateMax1, pricesToMatch[work]);
                        if (pricesToMatch[work] != 0)
                        {
                            rateMin1 = (float)pricesToMatch[work] / (float)basePrice;
                            rateMax1 = (float)pricesToMatch[work] / (float)basePrice;
                        }
                        rateMin1 -= 0.04;
                        rateMax1 -= 0.04;

                        rateMin1 -= 0.06;

                        work++;
                    }

                    // high phase 2
                    for (int i = 0; i < hiPhaseLen2; i++)
                    {
                        isInvalid = isInvalid || rndFltMultAndCheckPrice(maxAndMins[work], 0.9, 1.4, pricesToMatch[work]);
                        work++;
                    }

                    // decreasing phase 2
                    float rateMin2 = 0.6;
                    float rateMax2 = 0.8;
                    for (int i = 0; i < decPhaseLen2; i++)
                    {
                        isInvalid = isInvalid || rndFltMultAndCheckPrice(maxAndMins[work], rateMin2, rateMax2, pricesToMatch[work]);
                        if (pricesToMatch[work] != 0)
                        {
                            rateMin2 = (float)pricesToMatch[work] / (float)basePrice;
                            rateMax2 = (float)pricesToMatch[work] / (float)basePrice;
                        }
                        rateMin2 -= 0.04;
                        rateMax2 -= 0.04;

                        rateMin2 -= 0.06;

                        work++;
                    }

                    // high phase 3
                    for (int i = 0; i < hiPhaseLen3; i++)
                    {
                        isInvalid = isInvalid || rndFltMultAndCheckPrice(maxAndMins[work], 0.9, 1.4, pricesToMatch[work]);
                        work++;
                    }

                    if (!isInvalid)
                    {
                        out.push_back(maxAndMins);
                    }
                }
            }
        }
    }

    Matches findMatches(int knownPrices[14])
    {
        int buyMin = knownPrices[0] != 0 ? knownPrices[0] : 90;
        int buyMax = knownPrices[1] != 0 ? knownPrices[1] : 110;

        Matches matches;
        for (int i = buyMin; i <= buyMax; i++)
        {
            knownPrices[0] = i;
            knownPrices[1] = i;

            matchPattern0(knownPrices, matches.pattern0Matches);
            matchPattern1(knownPrices, matches.pattern1Matches);
            matchPattern2(knownPrices, matches.pattern2Matches);
            matchPattern3(knownPrices, matches.pattern3Matches);
        }

        return matches;
    }
}

void printMatches(vector<vector<vector<int>>> matches)
{
    for (size_t i = 0; i < matches.size(); i++)
    {
        vector<vector<int>> maxAndMins = matches[i];
        cout << "[";
        for (int i = 0; i < 14; i++)
        {
            if (maxAndMins[i][0] == maxAndMins[i][1])
                cout << "[" << maxAndMins[i][0] << "]";
            else
                cout << "[" << maxAndMins[i][0] << "," << maxAndMins[i][1] << "]";
            if (i < 13)
            {
                cout << ",";
            }
        }
        cout << "]";
        cout << endl;
    }
}

int main()
{
    int knownPrices[14] = { 0,0,0,0,0,0,0,0,0,0,0,0,0 };
    int buyMin = knownPrices[0] != 0 ? knownPrices[0] : 90;
    int buyMax = knownPrices[1] != 0 ? knownPrices[1] : 110;

    for (int i = buyMin; i <= buyMax; i++)
    {
        PriceMatcher::Matches matches = PriceMatcher::findMatches(knownPrices);
        printMatches(matches.pattern0Matches);
        printMatches(matches.pattern1Matches);
        printMatches(matches.pattern2Matches);
        printMatches(matches.pattern3Matches);
    }
}
