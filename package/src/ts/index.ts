import * as process from "process";

let nativeNodePath = "../../build/Release/PriceMatcher.node";
if (process.env["NODE_TEST"] === "true") {
    nativeNodePath = "../../../build/Release/PriceMatcher.node";
}

export type PriceAnalysis = (
    {
        patternIdx: number,
        patternName: string,
        matches: number[][][],
        probability: number,
        probabilityPerMatch: number
    }
)[];

const PriceMatcher: { findMatches: (knownPrices: number[]) => number[][][][] } = require(nativeNodePath);

let PatternNames = [
    "Fluctuating (Pattern 0)",
    "Big Spike (Pattern 1)",
    "Decreasing (Pattern 2)",
    "Spike (Pattern 3)"
];

const probabilityTable = [
    [20, 30, 15, 35],
    [50, 5, 20, 25],
    [25, 45, 5, 25],
    [45, 25, 15, 15],
    [35, 26, 14, 25]
]

export function analyzePrices(knownPrices: number[], previousPattern?: number): PriceAnalysis {
    let matchesByPattern: number[][][][] = PriceMatcher.findMatches(knownPrices);

    let patternProbabilities = getPatternProbabilities(
        previousPattern,
        [
            matchesByPattern[0].length === 0,
            matchesByPattern[1].length === 0,
            matchesByPattern[2].length === 0,
            matchesByPattern[3].length === 0
        ]
    );

    let retValue: PriceAnalysis = [];

    matchesByPattern.forEach((matches, patternIdx) => {
        retValue.push({
            patternIdx: patternIdx,
            patternName: PatternNames[patternIdx],
            matches: matches,
            probability: patternProbabilities[patternIdx],
            probabilityPerMatch: matches.length > 0 ? patternProbabilities[patternIdx] / matches.length : 0
        });
    });

    addPatternsAnalysis(retValue);

    return retValue;
}

function addPatternsAnalysis(analysis: PriceAnalysis): void {
    let analyzedMinsAndMaxes: number[][] = [];
    for (let i = 0; i < 14; i++) {
        analyzedMinsAndMaxes.push([Number.MAX_SAFE_INTEGER, 0]);
    }

    let atLeastOneMatch = false;
    analysis.forEach((obj) => {
        obj.matches.forEach((match) => {
            atLeastOneMatch = true;
            match.forEach((day, idx) => {
                analyzedMinsAndMaxes[idx][0] = Math.min(day[0], analyzedMinsAndMaxes[idx][0]);
                analyzedMinsAndMaxes[idx][1] = Math.max(day[1], analyzedMinsAndMaxes[idx][1]);
            });
        });
    });

    if (!atLeastOneMatch) {
        analyzedMinsAndMaxes = [];
    }

    analysis.unshift({
        patternIdx: -1,
        patternName: "All Patterns",
        matches: analyzedMinsAndMaxes.length > 0 ? [analyzedMinsAndMaxes] : [],
        probability: 100,
        probabilityPerMatch: 100
    });
}

export function getPatternProbabilities(previousPattern: number | undefined, impossiblePatterns: boolean[]): number[] {
    if (impossiblePatterns.filter((i) => i).length === 4) {
        return Array(4).fill(0);
    }

    let probabilities: number[];
    if (!!previousPattern) {
        probabilities = probabilityTable[previousPattern];
    } else {
        probabilities = probabilityTable[4];
    }

    let possiblePatternCount = impossiblePatterns.filter((impossible) => !impossible).length;

    for (let i = 0; i < 4; i++) {
        if (impossiblePatterns[i]) {
            for (let j = 0; j < 4; j++) {
                if (!impossiblePatterns[j]) {
                    probabilities[j] += probabilities[i] / possiblePatternCount;
                }
            }
            probabilities[i] = 0;
        }
    }

    return probabilities;
}
