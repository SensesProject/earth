# Preprocessing

Preprocessing is necessary to reduce file size. Input data are csv files of gridded data. This process converts them into a custom file format [inspired by UTFGrid (1.3)](https://github.com/mapbox/utfgrid-spec/blob/master/1.3/utfgrid.md). Instead of numbers, which can use a large number of charcters (read bits), each value is converted into a single utf character, thus there's also no need for comma separating the values anymore, saving more valuable bits. However, this means numbers can't be super precise. Here all values get rounded to integers (which is quite enough for displaying them on the globe). The files are then also compressed saving more data. Additionally a file (grids.json) is created for metadata, which helps interpreting the created files.

## Setup

install required packages
```
npm i
```

## Preprocess

convert files
```
node convert.js
```