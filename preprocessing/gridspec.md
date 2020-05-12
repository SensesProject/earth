# Grid Spec

- Based on utfgrid
- compressed
- txt instead of json
- first 8 values are reserved
  - 0: null
  - 1: error
  - 2: warning
  - 3...7: for future use
- everything above 8 can be used for actual data
  - typically 8 = 0
  - everything above depends on binning