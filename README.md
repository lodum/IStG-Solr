# Tools for converting IStG data for Solr

## Literatur (bibtex)
Run the following command with bibtex export
```
node bibtex.js -f filename
```

## Karten, Ansichtskarten, Stadtinformationen (MySQL)

Extract data by using rdf-dump with corresponding mapping file and then run
```
node trig.js -f filename
```

## Upload data to Solr
```
curl 'http://solrendpoint/solr/update/json?commit=true' --data-binary @filename.json -H 'Content-type:application/json'
```