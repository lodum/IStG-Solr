var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var split = require('split');
var _ = require('underscore');
var Writable = require('stream').Writable;

var id = "";
var entry = {};
var entries = [];
var baseURI = 'http://data.uni-muenster.de'
var file = argv.f;

fs.createReadStream(file)
  .pipe(split())
  .on('data', function (chunk) {
    stream = this;
    convert(chunk);
  })
  .on('error', function (err) {
    console.log('Error: '+err);
  })
  .on('end', function () {
    ws = fs.createWriteStream(file.split(".")[0]+".json");
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
          id = triple[0].split("<")[1];
          entry = {};
          entry.id = id;
        }

        //check if object with id already exists in entries array
        obj = _.find(entries, function (obj) {
          if (obj.id === subject) {
            return obj;
          }
        });

        //if id already exists, then copy object and delete old one
        if (obj !== undefined) {
          entry = obj;
          entries.splice(entries.indexOf(obj),1);
        }

        if (predicate === "http://xmlns.com/foaf/spec/#name") {
          if (!("foaf:name" in entry)) {
            entry["foaf:name"] = [];
          }
          name = triple[2].split('"')[1].trim();
          if (!_.contains(entry["foaf:name"],name)) {
            entry["foaf:name"].push(name);
          }
        } else if (predicate === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
          if (!("rdf:type" in entry)) {
            entry["rdf:type"] = [];
          }
          if (!_.contains(entry["rdf:type"],object.split("<")[1])) {
            entry["rdf:type"].push(object.split("<")[1]);
          }
        } else if (predicate === "http://purl.org/dc/terms/title") {
          if (!("dct:title" in entry)) {
            entry["dct:title"] = [];
          }
          title = triple[2].split('"')[1].trim();
          if (!_.contains(entry["dct:title"],title)) {
            entry["dct:title"].push(title);
          }
        } else if (predicate === "http://vocab.lodum.de/istg/themeLocation") {
          entry["istg:themeLocation"] = object.split("<")[1];
        } else if (predicate === "http://purl.org/ontology/bibo/content") {
          if (!("bibo:content" in entry)) {
            entry["bibo:content"] = [];
          }
          content = triple[2].split('"')[1].trim();
          if (!_.contains(entry["bibo:content"],content)) {
            entry["bibo:content"].push(content);
          }
        } else if (predicate === "http://purl.org/dc/elements/1.1/creator") {
          if (!("dc:creator" in entry)) {
            entry["dc:creator"] = [];
          }
          creator = triple[2].split('<')[1];
          if (!_.contains(entry["dc:creator"],creator)) {
            entry["dc:creator"].push(creator);
          }
        } else if (predicate === "http://purl.org/ontology/bibo/pages") {
          pages = object.split('"')[1].trim();
          entry["bibo:pages"] = pages;
        } else if (predicate === "http://purl.org/dc/terms/isPartOf") {
          if (!("dct:isPartOf" in entry)) {
            entry["dct:isPartOf"] = [];
          }
          if (!_.contains(entry["dct:isPartOf"],object.split("<")[1])) {
            entry["dct:isPartOf"].push(object.split("<")[1]);
          }
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
          if (!_.contains(entry["bibo:editor"],object.split("<")[1])) {
            entry["bibo:editor"].push(object.split("<")[1]);
          }
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
          if (!_.contains(entry["istg:HistorcPlace"],object.split('"')[1].trim())) {
            entry["istg:HistoricPlace"].push(object.split('"')[1].trim());
          }
        } else if (predicate === "http://www.geonames.org/ontology#name") {

        } else if (predicate === "http://www.w3.org/2003/01/geo/lat") {
          lat = object.split('"')[1].trim();
          entry["wgs84_pos:lat"] = lat;
        } else if (predicate === "http://www.w3.org/1999/02/22-rdf-syntax-ns#ID") {
          entry["rdf:ID"] = object.split('"')[1].trim();
        } else if (predicate === "http://xmlns.com/foaf/spec/#firstName") {
          if (!("foaf:firstName" in entry)) {
            entry["foaf:firstName"] = [];
          }
          if (!_.contains(entry["foaf:firstName"],object.split('"')[1].trim())) {
            entry["foaf:firstName"].push(object.split('"')[1].trim());
          }
        } else if (predicate === "http://xmlns.com/foaf/spec/#lastName") {
          if (!(entry["foaf:lastName"] in entry)) {
            entry["foaf:lastName"] = [];
          }
          if (!_.contains(entry["foaf:lastName"],object.split('"')[1].trim())) {
            entry["foaf:lastName"].push(object.split('"')[1].trim());
          }
        } else if (predicate === "http://purl.org/ontology/bibo/pageStart") {
          entry["bibo:pageStart"] = object.split('"')[1].trim();
        } else if (predicate === "http://purl.org/ontology/bibo/pageEnd") {
          entry["bibo:pageEnd"] = object.split('"')[1].trim();
        } else if (predicate === "http://vocab.lodum.de/istg/signature") {
          if (!("istg:signature" in entry)) {
            entry["istg:signature"] = [];
          }
          if (!_.contains(entry["istg:signature"],object.split('"')[1].trim())) {
            entry["istg:signature"].push(object.split('"')[1].trim());
          }
        } else if (predicate === "http://vocab.lodum.de/istg/historicPlacenameType") {
          // entry["istg:historicPlacenameType"] = object.split('<')[1].trim();
        } else if (predicate === "http://data.uni-muenster.de/context/istg/karten/vocab/HistorischeLageTyp_Bezeichnung") {
          if (!("vocab:HistorischeLageTyp_Bezeichnung" in entry)) {
            entry["vocab:HistorischeLageTyp_Bezeichnung"] = [];
          }
          if (!_.contains(entry["vocab:HistorischeLageTyp_Bezeichnung"],object.split('"')[1].trim())) {
            entry["vocab:HistorischeLageTyp_Bezeichnung"].push(object.split('"')[1].trim());
          }
        } else if (predicate === "http://vocab.lodum.de/istg/inventory") {
          entry["istg:inventory"] = object.split('"')[1].trim();
        } else if (predicate === "http://vocab.lodum.de/istg/paralleltitle") {
          if (!("istg:paralleltitel" in entry)) {
            entry["istg:paralleltitel"] = [];
          }
          if (!_.contains(entry["istg:paralleltitel"],object.split('"')[1].trim())) {
            entry["istg:paralleltitel"].push(object.split('"')[1].trim());
          }
        } else if (predicate === "http://vocab.lodum.de/istg/mapScale") {
          if (!(entry["istg:mapScale"] in entry)) {
            entry["istg:mapScale"] = [];
          }
          if (!_.contains(entry["istg:mapScale"],object.split('"')[1].trim())) {
            entry["istg:mapScale"].push(object.split('"')[1].trim());
          }
        } else if (predicate === "http://purl.org/dc/terms/format") {
          entry["dct:format"] = object.split('"')[1].trim();
        } else if (predicate === "http://vocab.lodum.de/istg/displayedTime") {
          if (!("istg:displayedTime" in entry)) {
            entry["istg:displayedTime"] = [];
          }
          if (!_.contains(entry["istg:displayedTime"],object.split('"')[1].trim())) {
            entry["istg:displayedTime"].push(object.split('"')[1].trim());
          }
        } else if (predicate === "http://vocab.lodum.de/istg/colored") {
          entry["istg:colored"] = object.split('"')[1].trim();
        } else if (predicate === "http://vocab.lodum.de/istg/badCondition") {
          entry["istg:badCondition"] = object.split('"')[1].trim();
        } else if (predicate === "http://vocab.lodum.de/istg/yearEstimated") {
          entry["istg:yearEstimated"] = object.split('"')[1].trim();
        } else if (predicate === "http://vocab.lodum.de/istg/webDisplay") {
          entry["istg:webDisplay"] = object.split('"')[1].trim();
        } else if (predicate === "http://vocab.lodum.de/istg/politicalBoundaries") {
          entry["istg:politicalBoundaries"] = object.split('"')[1].trim();
        } else if (predicate === "http://vocab.lodum.de/istg/churchBoundaries") {
          entry["istg:churchBoundaries"] = object.split('"')[1].trim();
        } else if (predicate === "http://vocab.lodum.de/istg/relief") {
          entry["istg:relief"] = object.split('"')[1].trim();
        } else if (predicate === "http://vocab.lodum.de/istg/streetDirectory") {
          entry["istg:streetDirectory"] = object.split('"')[1].trim();
        } else if (predicate === "http://vocab.lodum.de/istg/cityBlockRepresentation") {
          entry["istg:cityBlockRepresentation"] = object.split('"')[1].trim();
        } else if (predicate === "http://vocab.lodum.de/istg/parcelRepresentation") {
          entry["istg:parcelRepresentation"] = object.split('"')[1].trim();
        } else if (predicate === "http://vocab.lodum.de/istg/houseNumbers") {
          entry["istg:houseNumbers"] = object.split('"')[1].trim();
        } else if (predicate === "http://vocab.lodum.de/istg/streetNames") {
          entry["istg:streetNames"] = object.split('"')[1].trim();
        } else if (predicate === "http://purl.org/dc/terms/subject") {
          if (!("dct:subject" in entry)) {
            entry["dct:subject"] = [];
          }
          if (!_.contains(entry["dct:subject"],object.split('"')[1].trim())) {
            entry["dct:subject"].push(object.split('"')[1].trim());
          }
        } else if (predicate === "http://vocab.lodum.de/istg/publishingOrganization") {
          if (!("istg:publishingOrganization" in entry)) {
            entry["istg:publishingOrganization"] = [];
          }
          if (!_.contains(entry["istg:publishingOrganization"],object.split('<')[1].trim())) {
            entry["istg:publishingOrganization"].push(object.split('<')[1].trim());
          }
        } else if (predicate === "http://vocab.lodum.de/istg/technique") {
          if (!("istg:technique" in entry)) {
            entry["istg:technique"] = [];
          }
          if (!_.contains(entry["istg:technique"],object.split('<')[1].trim())) {
            entry["istg:technique"].push(object.split('<')[1].trim());
          }
        } else if (predicate === "http://www.w3.org/2000/01/rdf-schema#comment") {
          entry["rdfs:comment"] = object.split('"')[1].trim();
        } else if (predicate === "http://vocab.lodum.de/istg/page") {
          if (!("istg:page" in entry)) {
            entry["istg:page"] = [];
          }
          if (!_.contains(entry["istg:page"],object.split('"')[1].trim())) {
            entry["istg:page"].push(object.split('"')[1].trim());
          }
        } else if (predicate === "http://xmlns.com/foaf/spec/#thumbnail") {
          if (!("foaf:thumbnail" in entry)) {
            entry["foaf:thumbnail"] = [];
          }
          if (!_.contains(entry["foaf:thumbnail"],object.split("<")[1].trim())) {
            entry["foaf:thumbnail"].push(object.split("<")[1].trim());
          }
        } else if (predicate === "http://vocab.lodum.de/istg/cartographer") {
          if (!("istg:cartographer" in entry)) {
            entry["istg:cartographer"] = [];
          }
          if (!_.contains(entry["istg:cartographer"],object.split("<")[1].trim())) {
            entry["istg:cartographer"].push(object.split("<")[1].trim());
          }
        } else if (predicate === "http://vocab.lodum.de/istg/mapType") {
          if (!("istg:mapType" in entry)) {
            entry["istg:mapType"] = [];
          }
          if (!_.contains(entry["istg:mapType"],object.split("<")[1].trim())) {
            entry["istg:mapType"].push(object.split("<")[1].trim());
          }
        } else if (predicate === "http://vocab.lodum.de/istg/continent") {
          if (!("istg:continent" in entry)) {
            entry["istg:continent"] = [];
          }
          if (!_.contains(entry["istg:continent"],object.split("<")[1].trim())) {
            entry["istg:continent"].push(object.split("<")[1].trim());
          }
        } else if (predicate === "http://vocab.lodum.de/istg/region") {

        } else if (predicate === "http://vocab.lodum.de/istg/country") {
          if (!("istg:country" in entry)) {
            entry["istg:country"] = [];
          }
          if (!_.contains(entry["istg:country"],object.split("<")[1].trim())) {
            entry["istg:country"].push(object.split("<")[1].trim());
          }
        } else if (predicate === "http://vocab.lodum.de/istg/city") {
          if (!("istg:city" in entry)) {
            entry["istg:city"] = [];
          }
          if (!_.contains(entry["istg:city"],object.split('<')[1].trim())) {
            entry["istg:city"].push(object.split('<')[1].trim());
          }
        } else if (predicate === "http://www.w3.org/2004/02/skos/core#prefLabel") {
          if (!("skos:prefLabel" in entry)) {
            entry["skos:prefLabel"] = [];
          }
          if (!_.contains(entry["skos:prefLabel"],object.split('"')[1].trim())) {
            entry["skos:prefLabel"].push(object.split('"')[1].trim());
          }
        } else if (predicate === "http://dbpedia.org/property/commonName") {
          if (!("dbpedia-prop:commonName" in entry)) {
            entry["dbpedia-prop:commonName"] = [];
          }
          if (!_.contains(entry["dbpedia-prop:commonName"],object.split('"')[1].trim())) {
            entry["dbpedia-prop:commonName"].push(object.split('"')[1].trim());
          }
        } else if (predicate === "http://www.w3.org/1999/02/22-rdf-syntax-ns#description") {
          if (!("rdf:description" in entry)) {
            entry["rdf:description"] = [];
          }
          if (!_.contains(entry["rdf:description"],object.split('"')[1].trim())) {
            entry["rdf:description"].push(object.split('"')[1].trim());
          }
        } else if (predicate === "http://lido.org/spec/#originaltitel") {
          if (!("lido:originaltitel" in entry)) {
            entry["lido:originaltitel"] = [];
          }
          if (!_.contains(entry["lido:originaltitel"],object.split('"')[1].trim())) {
            entry["lido:originaltitel"].push(object.split('"')[1].trim());
          }
        } else if (predicate === "http://vocab.lodum.de/istg/recordingTime") {
          if (!("istg:recordingTime" in entry)) {
            entry["istg:recordingTime"] = [];
          }
          if (!_.contains(entry["istg:recordingTime"],object.split('"')[1].trim())) {
            entry["istg:recordingTime"].push(object.split('"')[1].trim());
          }
        } else if (predicate === "http://purl.org/dc/terms/publisher") {
          if (!("dct:publisher" in entry)) {
            entry["dct:publisher"] = [];
          }
          if (!_.contains(entry["dct:publisher"],object.split('<')[1].trim())) {
            entry["dct:publisher"].push(object.split('<')[1].trim());
          }
        } else if (predicate === "http://purl.org/dc/elements/1.1/contributor") {
          if (!("dct:contributor" in entry)) {
            entry["dct:contributor"] = [];
          }
          if (!_.contains(entry["dct:contributor"],object.split('"')[1].trim())) {
            entry["dct:contributor"].push(object.split('"')[1].trim());
          }
        } else if (predicate === "http://vocab.lodum.de/istg/printedFront") {
          if (!("istg:printedFront" in entry)) {
            entry["istg:printedFront"] = [];
          }
          if (!_.contains(entry["istg:printedFront"],object.split('"')[1].trim())) {
            entry["istg:printedFront"].push(object.split('"')[1].trim());
          }
        } else if (predicate === "http://vocab.lodum.de/istg/handwritingFront") {
          if (!("istg:handwritingFront" in entry)) {
            entry["istg:handwritingFront"] = [];
          }
          if (!_.contains(entry["istg:handwritingFront"],object.split('"')[1].trim())) {
            entry["istg:handwritingFront"].push(object.split('"')[1].trim());
          }
        } else if (predicate === "http://vocab.lodum.de/istg/printedBack") {
          if (!("istg:printedBack" in entry)) {
            entry["istg:printedBack"] = [];
          }
          if (!_.contains(entry["istg:printedBack"],object.split('"')[1].trim())) {
            entry["istg:printedBack"].push(object.split('"')[1].trim());
          }
        } else if (predicate === "http://vocab.lodum.de/istg/handwritingBack") {
          if (!("istg:handwritingBack" in entry)) {
            entry["istg:handwritingBack"] = [];
          }
          if (!_.contains(entry["istg:handwritingBack"],object.split('"')[1].trim())) {
            entry["istg:handwritingBack"].push(object.split('"')[1].trim());
          }
        } else if (predicate === "http://purl.org/dc/elements/1.1/subject") {
          if (!("dct:subject" in entry)) {
            entry["dct:subject"] = [];
          }
          if (!_.contains(entry["dct:subject"],object.split('"')[1].trim())) {
            entry["dct:subject"].push(object.split('"')[1].trim());
          }
        } else if (predicate === "http://vocab.lodum.de/istg/federalstate") {
          entry["istg:federalstate"] = object.split('"')[1].trim();
        } else if (predicate === "http://vocab.lodum.de/istg/landkreis") {
          if (!("istg:landkreis" in entry)) {
            entry["istg:landkreis"] = [];
          }
          if (!_.contains(entry["istg:landkreis"],object.split('"')[1].trim())) {
            entry["istg:landkreis"].push(object.split('"')[1].trim());
          }
        } else if (predicate === "http://vocab.lodum.de/istg/cityDistrict") {
          entry["istg:cityDistrict"] = object.split('"')[1].trim();
        } else if (predicate === "http://vocab.lodum.de/istg/historicRegion") {
          entry["istg:historicRegion"] = object.split('"')[1].trim();
        } else if (predicate === "http://purl.org/dc/terms/medium") {
          entry["dct:medium"] = object.split('"')[1].trim();
        } else if (predicate === "http://vocab.lodum.de/istg/color") {
          entry["istg:color"] = object.split('"')[1].trim();
        } else if (predicate === "http://vocab.lodum.de/istg/condition") {
          entry["istg:condition"] = object.split('"')[1].trim();
        }
      }
    }
  }