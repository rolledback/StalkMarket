#include <vector>
#include <nan.h>
#include "PriceMatcher.h"

using namespace v8;
using namespace std;

void addMatchesToRetObj(Local<Array>& retArr, int retArrIdx, char* patternName, vector<vector<vector<int>>> matches)
{
    v8::Local<v8::Object> jsonObject = Nan::New<v8::Object>();

    Local<String> patternNameProp = Nan::New("patternName").ToLocalChecked();
    Local<String> patternNameValue = Nan::New(patternName).ToLocalChecked();

    Local<String> matchesProp = Nan::New("matches").ToLocalChecked();
    Local<Array> matchesValue = Nan::New<Array>(matches.size());

    for (size_t matchIdx = 0; matchIdx < matches.size(); matchIdx++)
    {
        Local<Array> match = Nan::New<Array>(14);
        for (int dayIdx = 0; dayIdx < 14; dayIdx++)
        {
            Local<Array> day = Nan::New<Array>(2);
            day->Set(0, Nan::New(matches[matchIdx][dayIdx][0]));
            day->Set(1, Nan::New(matches[matchIdx][dayIdx][1]));
            match->Set(dayIdx, day);
        }
        matchesValue->Set(matchIdx, match);
    }

    Nan::Set(jsonObject, patternNameProp, patternNameValue);
    Nan::Set(jsonObject, matchesProp, matchesValue);

    retArr->Set(retArrIdx, jsonObject);
}

void invoke(const Nan::FunctionCallbackInfo<Value>& info)
{
    Local<Array> knownPricesJs = Local<Array>::Cast(info[0]);

    int knownPrices[14] = { };
    for (uint32_t i = 0; i < knownPricesJs->Length(); i++) {
        knownPrices[i] = Nan::To<int>(knownPricesJs->Get(i)).FromJust();
    }

    PriceMatcher::Matches matches = PriceMatcher::findMatches(knownPrices);

    Local<Array> retValue = Nan::New<Array>(4);
    addMatchesToRetObj(retValue, 0, "Fluctuating (Pattern 0)", matches.pattern0Matches);
    addMatchesToRetObj(retValue, 1, "Big Spike (Pattern 1)", matches.pattern1Matches);
    addMatchesToRetObj(retValue, 2, "Decreasing (Pattern 2)", matches.pattern2Matches);
    addMatchesToRetObj(retValue, 3, "Spike (Pattern 3)", matches.pattern3Matches);

    info.GetReturnValue().Set(retValue);
}

void Init(Local<Object> exports) {
  Local<Context> context = exports->CreationContext();
  exports->Set(context,
               Nan::New("findMatches").ToLocalChecked(),
               Nan::New<FunctionTemplate>(invoke)
                   ->GetFunction(context)
                   .ToLocalChecked());
}

NODE_MODULE(PriceMatcher, Init)