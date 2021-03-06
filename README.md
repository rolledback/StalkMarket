# StalkMarket

This repo contains the code for 3 related projects.

The projects are an NPM package, an Azure Function, and a Google Sheets script. All 3 are used together to create a Google Sheet which is used to track and analyze the Animal Crossing New Horizons turnip prices of multiple people.

[![Build Status](https://mrayermann.visualstudio.com/StalkMarket/_apis/build/status/rolledback.StalkMarket?branchName=master)](https://mrayermann.visualstudio.com/StalkMarket/_build/latest?definitionId=2&branchName=master)

This code would not be possible without the fantastic work of [Ninji](https://twitter.com/_Ninji). He has decompiled much of Animal Crossing New Horizons, including the algorithm for determining turnip prices. Many thanks to him for finding that, and for everything he continues to find and share with the Animal Crossing community!

## NPM Package

The `package` folder contains the source for the [stalk-market](https://www.npmjs.com/package/stalk-market) NPM package.

## Azure Function

The `api` folder contains the source for an [Azure Function](https://azure.microsoft.com/en-us/services/functions/) which uses the `stalk-market` package.

## Google Sheets Script

The `sheets` folder contains the source to a [Google Sheets](https://www.google.com/sheets/about/) script that uses the Azure Function.
