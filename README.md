# jbrowse-plugin-ribo-seq

## Dev setup

```bash

git clone git@github.com:cmdcolin/jbrowse-plugin-ribo-seq
cd jbrowse-plugin-ribo-seq
yarn
yarn start
# visit http://yourjbrowse/?config=http://localhost:9000/config.json

```

## Production setup

```json
{
  "plugins": [
    {
      "name": "RiboSeq",
      "url": "https://unpkg.com/jbrowse-plugin-ribo-seq/dist/jbrowse-plugin-ribo-seq.umd.production.min.js"
    }
  ]
}
```

## Screenshot

![](img/1.png)

## Input

sample data: a bed tabix file with a column name indicating "color"

```
#chr	start	end	strand	color	count
1	10000000	10000001	+	0	6
1	10000001	10000002	+	0	1
1	10000004	10000005	+	1	1
1	10000006	10000007	+	2	1
1	10000007	10000008	+	1	30
1	10000009	10000010	+	3	2
```

## Configuration

Use the RiboSeqAdapter and then use a BedTabixAdapter subadapter

```json
{
  "type": "FeatureTrack",
  "trackId": "ribo-seq_track",
  "name": "RiboSeq",
  "assemblyNames": ["hg19"],
  "adapter": {
    "type": "RiboSeqAdapter",
    "subadapter": {
      "type": "BedTabixAdapter",
      "scoreColumn": "count",
      "bedGzLocation": {
        "uri": "test.bed.gz"
      },
      "index": {
        "location": {
          "uri": "test.bed.gz.tbi"
        }
      }
    }
  },
  "displays": [
    {
      "displayId": "ribo-seq_display",
      "type": "LinearRiboSeqDisplay"
    }
  ]
}
```

## Footnote

Motivated by https://www.biostars.org/p/9591324/#9591469

This is very demo-quality. Inspired by plugins like
https://github.com/cmdcolin/mpileupplugin also
