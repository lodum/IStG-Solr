var fs = require('fs');
var split = require('split');
var Writable = require('stream').Writable;

var id = "";
var entry = {};
var entries = [];
var baseURI = 'http://data.uni-muenster.de'

fs.createReadStream('stadtinformationen.nt')
  .pipe(split())
  .on('data', function (chunk) {
    stream = this;
    convert(chunk);
  })
  .on('error', function (err) {
    console.log('Error: '+err);
  })
  .on('end', function () {
    ws = fs.createWriteStream('stadtinformationen.json');
    ws.write(JSON.stringify(entries));
    console.log("Finished");
  })

  function convert (chunk) {
    if (chunk.length > 0 && chunk.charAt(chunk.length - 1) === ".") {
      //Split triple
      triple = chunk.split("> ");
      subject = triple[0].split("<")[1];
      predicate = triple[1].split("<")[1];
      object = triple[2];
      if (subject.indexOf(baseURI) > -1) {
        if (id == "") {
          id = triple[0].split("<")[1];
          entry.id = id;
        } else if (id !== triple[0].split("<")[1]) {
          entries.push(entry);
          id = "";
          entry = {};
        }

        if (predicate === "http://xmlns.com/foaf/spec/#name") {
          if (!("foaf:name" in entry)) {
            entry["foaf:name"] = [];
          }
          name = triple[2].split('"')[1].trim();
          entry["foaf:name"].push(name);
        } else if (predicate === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
          if (!("rdf:type" in entry)) {
            entry["rdf:type"] = [];
          }
          entry["rdf:type"].push(object.split("<")[1]);
        } else if (predicate === "http://purl.org/dc/terms/title") {
          if (!("dct:title" in entry)) {
            entry["dct:title"] = [];
          }
          title = triple[2].split('"')[1].trim();
          entry["dct:title"].push(title);
        } else if (predicate === "http://vocab.lodum.de/istg/themeLocation") {
          entry["istg:themeLocation"] = object.split("<")[1];
        } else if (predicate === "http://purl.org/ontology/bibo/content") {
          if (!("bibo:content" in entry)) {
            entry["bibo:content"] = [];
          }
          content = triple[2].split('"')[1].trim();
          entry["bibo:content"].push(content);
        } else if (predicate === "http://purl.org/dc/elements/1.1/creator") {
          if (!("dc:creator" in entry)) {
            entry["dc:creator"] = [];
          }
          creator = triple[2].split('<')[1];
          entry["dc:creator"].push(creator);
        } else if (predicate === "http://purl.org/ontology/bibo/pages") {
          pages = object.split('"')[1].trim();
          entry["bibo:pages"] = pages;
        } else if (predicate === "http://purl.org/dc/terms/isPartOf") {
          if (!("dct:isPartOf" in entry)) {
            entry["dct:isPartOf"] = [];
          }
          entry["dct:isPartOf"].push(object.split("<")[1]);
        } else if (predicate === "http://vocab.lodum.de/istg/icon") {
          entry["istg:icon"] = object.split("<")[1];
        } else if (predicate === "http://purl.org/ontology/bibo/volume") {
          volume = object.split('"')[1].trim();
          entry["bibo:volume"] = volume;
        } else if (predicate === "http://vocab.lodum.de/istg/maintitle") {
          maintitle = object.split('"')[1].trim();
          entry["istg:maintitle"] = maintitle;
        } else if (predicate === "http://vocab.lodum.de/istg/publishingLocation") {
          publishingLocation = object.split('"')[1].trim();
          entry["istg:publishingLocation"] = publishingLocation;
        } else if (predicate === "http://purl.org/ontology/bibo/editor") {
          if (!("bibo:editor" in entry)) {
            entry["bibo:editor"] = [];
          }
          entry["bibo:editor"].push(object.split("<")[1]);
        } else if (predicate === "http://vocab.lodum.de/istg/subtitle") {
          subtitle = object.split('"')[1].trim();
          entry["istg:subtitle"] = subtitle;
        } else if (predicate === "http://purl.org/dc/terms/description") {
          description = object.split('"')[1].trim();
          entry["dct:description"] = description;
        } else if (predicate === "http://www.w3.org/2003/01/geo/long") {
          long = object.split('"')[1].trim();
          entry["wgs84_pos:long"] = long;
        } else if (predicate === "http://vocab.lodum.de/istg/historicPlaceName") {
          if (!("istg:HistoricPlace" in entry)) {
            entry["istg:HistoricPlace"] = [];
          }
          entry["istg:HistoricPlace"].push(object.split('"')[1].trim());
        } else if (predicate === "http://www.geonames.org/ontology#name") {

        } else if (predicate === "http://www.w3.org/2003/01/geo/lat") {
          lat = object.split('"')[1].trim();
          entry["wgs84_pos:lat"] = lat;
        } else if (predicate === "http://www.w3.org/1999/02/22-rdf-syntax-ns#ID") {
          entry["rdf:ID"] = object.split('"')[1].trim();
        }
      }
    }
  }