import * as process from "process";

let nativeNodePath = "../../build/Release/PriceMatcher.node";
if (process.env["NODE_TEST"] === "true") {
    nativeNodePath = "../../../build/Release/PriceMatcher.node";
}

export type PatternAndMatches = { patternName: string, matches: number[][][] };
const PriceMatcher: { findMatches: (knownPrices: number[]) => PatternAndMatches[] } = require(nativeNodePath);

export function analyzePrices(knownPrices: number[]): PatternAndMatches[] {
    let matchesByPattern: PatternAndMatches[] = PriceMatcher.findMatches(knownPrices);
    let totalMatches = matchesByPattern.reduce<number>((acc, pattern) => acc + pattern.matches.length, 0);
    let analysisResult = totalMatches > 0 ? realAnalysis(matchesByPattern) : emptyAnalysis();
    matchesByPattern.push(analysisResult);

    return matchesByPattern;
}

function realAnalysis(matchesByPattern: PatternAndMatches[]): PatternAndMatches {
    let analyzedMinsAndMaxes: number[][] = [];
    for (let i = 0; i < 14; i++) {
        analyzedMinsAndMaxes.push([Number.MAX_SAFE_INTEGER, 0]);
    }
    matchesByPattern.forEach((obj) => {
        obj.matches.forEach((match) => {
            match.forEach((day, idx) => {
                analyzedMinsAndMaxes[idx][0] = Math.min(day[0], analyzedMinsAndMaxes[idx][0]);
                analyzedMinsAndMaxes[idx][1] = Math.max(day[1], analyzedMinsAndMaxes[idx][1]);
            });
        });
    });

    return {
        patternName: "Across All",
        matches: [analyzedMinsAndMaxes]
    };
}

function emptyAnalysis(): PatternAndMatches {
    return {
        patternName: "Across All",
        matches: []
    };
}
