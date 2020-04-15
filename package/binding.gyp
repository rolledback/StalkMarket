{
  "targets": [
    {
      "target_name": "PriceMatcher",
      "sources": [ "src/cpp/index.cpp", "src/cpp/PriceMatcher.cpp" ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}
