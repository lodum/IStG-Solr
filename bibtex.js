var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var split = require('split');
var Writable = require('stream').Writable;

var counter = 0;
var openBr = 0;
var newEntry = false;
var entries = [];
var entry = {};
var authors = [];
var signature = [];
var comments = [];
var volumes = [];
var editors = [];
var editorsa = [];
var titles = [];
var numbers = [];
var numbersArray = new Array(10);
var seriesArray = new Array(10);
var baseURI = 'http://data.uni-muenster.de/context/istg/allegro/'
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
    if (chunk.charAt(0) === '@') {
      newEntry = true;
      var rdftypes = [];
      rdftypes.push("http://vocab.lodum.de/istg/WrittenResource");
      rdftypes.push("http://vocab.lodum.de/istg/Resource");
      type = chunk.split(' ')[0].split('@')[1];
      springerlink = chunk.split(' ')[1].split(':')[1].split(',')[0];
      entry.id = baseURI + springerlink;
      switch (type) {
        case 'book':
          rdftypes.push("http://purl.org/ontology/bibo/Book");
          entry["istg:icon"] = "http://purl.org/ontology/bibo/Book";
          break;
        case 'periodical':
          rdftypes.push("http://purl.org/ontology/bibo/Periodical");
          entry["istg:icon"] = "http://purl.org/ontology/bibo/Periodical";
          break;
        case 'mvbook':
          rdftypes.push("http://purl.org/ontology/bibo/MultiVolumeBook");
          entry["istg:icon"] = "http://purl.org/ontology/bibo/MultiVolumeBook";
          break;
        case 'article':
          rdftypes.push("http://purl.org/ontology/bibo/Article");
          entry["istg:icon"] = "http://purl.org/ontology/bibo/Article";
          break;
        default:
          rdftypes.push("http://vocab.lodum.de/istg/Resource");
          entry["istg:icon"] = "http://vocab.lodum.de/istg/Resource";
          break;
      }
      entry["rdf:type"] = rdftypes;
    }

    if (newEntry) {
      if (chunk.indexOf("=") !== -1) {
        //Extract key and value
        key = chunk.split("=")[0].trim();
        value = chunk.split("=").slice(1).join("=").split("{")[1].split("}")[0];

        if (key.indexOf("author") > -1) {
          authors.push(value);
        } else if (key.indexOf("title") > -1 && key !== "maintitlei" && key !== "subtitle") {
          entry["istg:maintitle"] = value;
        } else if (key.indexOf("organization") > -1) {
          if (!("dct:contributor" in entry)) {
            entry["dct:contributor"] = [];
          }
          entry["dct:contributor"].push(value);
        } else if (key.indexOf("keywords") > -1) {
          if (!("dc:subject" in entry)) {
            entry["dc:subject"] = []
          }
          entry["dc:subject"].push(value);
        } else if (key.indexOf("location") > -1) {
          entry["istg:publishingLocation"] = value;
        } else if (key.indexOf("pages") > -1) {
          entry["bibo:pages"] = value;
        } else if (key.indexOf("library") > -1) {
          if (value.indexOf("*") > -1) {
            signatures = value.split("*");
            for (var i = signatures.length - 1; i >= 0; i--) {
              signature.push(signatures[i]);
            }
          } else{
            signature.push(value);
          }
        } else if (key.indexOf("year") > -1) {
          // entry["dct:issued"] = value.match(/\d+/g);
        } else if (key === "subtitle") {
          entry["istg:subtitle"] = value;
        } else if(key.indexOf("publisher") > -1) {
          if (!("dct:publisher" in entry)) {
            entry["dct:publisher"] = [];
          }
          entry["dct:publisher"].push(value);
        } else if(key.indexOf("number") > -1) {
          if (value === "...") {
            numbers.push(value);
            if (value === "number") {
              number = ["number",value];
              numbersArray[0] = number;
            } else if (value = "numberi") {
              number = ["numberi",value];
              numbersArray[1] = number;
            } else if (value = "numberii") {
              number = ["numberii",value];
              numbersArray[2] = number;
            } else if (value = "numberiii") {
              number = ["numberiii",value];
              numbersArray[3] = number;
            } else if (value = "numberiv") {
              number = ["numberiv",value];
              numbersArray[4] = number;
            } else if (value = "numberv") {
              number = ["numberv",value];
              numbersArray[5] = number;
            } else if (value = "numbervi") {
              number = ["numbervi",value];
              numbersArray[6] = number;
            } else if (value = "numbervii") {
              number = ["numbervii",value];
              numbersArray[7] = number;
            }
          }
        } else if(key.indexOf("series") > -1) {
          if (!("dct:isPartOf" in entry)) {
            entry["dct:isPartOf"] = [];
          }
          if (value.indexOf(" * ") > -1) {
            ref = baseURI + value.split(" * ")[0].replace("=", "").trim();
            titles.push(value.split("*")[1].trim());
            entry["dct:isPartOf"].push(ref);
          } else {
            entry["dct:isPartOf"].push(value);
          }
          if (value === "series") {
            serie = ["series",value];
            seriesArray[0] = serie;
          } else if (value = "seriesi") {
            serie = ["seriesi",value];
            seriesArray[1] = serie;
          } else if (value = "seriesii") {
            serie = ["seriesii",value];
            seriesArray[2] = serie;
          } else if (value = "seriesiii") {
            serie = ["seriesiii",value];
            seriesArray[3] = serie;
          } else if (value = "seriesiv") {
            serie = ["seriesiv",value];
            seriesArray[4] = serie;
          } else if (value = "seriesv") {
            serie = ["seriesv",value];
            seriesArray[5] = serie;
          } else if (value = "seriesvi") {
            serie = ["seriesvi",value];
            seriesArray[6] = serie;
          } else if (value = "seriesvii") {
            serie = ["seriesvii",value];
            seriesArray[7] = serie;
          }
        } else if (key.indexOf("note") > -1) {
          comments.push(value.trim());
        } else if (key.indexOf("volume") > -1) {
          volumes.push(value);
        } else if (key.indexOf("part") > -1) {
          if (!("bibo:volume") > -1) {
            entry["bibo:volume"] = [];
          }
          entry["bibo:volume"].push(value);
        } else if (key.indexOf("url") > -1) {
          if (!("istg:rezension" in entry)) {
            entry["istg:rezension"] = [];
          }
          entry["istg:rezension"].push(value);
        } else if (key.indexOf("annotation") > -1) {
          if (!("istg:inhaltsverzeichnis_text" in entry)) {
            entry["istg:inhaltsverzeichnis_text"] = [];
          }
          entry["istg:inhaltsverzeichnis_text"].push(value);
        } else if (key.indexOf("type") > -1) {
          entry["istg:type"] = value;
        } else if (key.indexOf("howpublished") > -1) {
          comments.push(value);
        } else if (key.indexOf("editora") > -1) {
          editorsa.push(value.trim());
        } else if (key.indexOf("editor") > -1 && key !== "editora") {
          editors.push(value.trim());
        } else if (key.indexOf("maintitlei") > -1) {
          if (!("dct:isPartOf" in entry)) {
            entry["dct:isPartOf"] = [];
          }

          if (value.indexOf("*") > -1) {
            ref = baseURI + value.split(" * ")[0].replace("=", "").trim();
            titles.push(value.split("*")[1].trim());
            entry["dct:isPartOf"].push(ref);
          } else {
            entry["dct:isPartOf"].push(value);
          }
        } else if (key === "category") {
          entry["istg:type"] = value;
        } else if (key.indexOf("edition") > -1) {
          if (!("bibo:edition" in entry)) {
            entry["bibo:edition"] = [];
          }
          entry["bibo:edition"].push(value);
        } else if (key.indexOf("changedate") > -1) {
          //TODO
        }
    }

    if (chunk.indexOf('{') !== -1) {
      openBr++;
    }
    if (chunk.indexOf('}') !== -1) {
      openBr--;
    }

    }
    // console.log('Brackets: '+ openBr + ' || ' + chunk);
    if (openBr === 0 && chunk.length !== 0) {
      if (authors.length > 0) {
        if (!(entry["dc:creator"] in entry)) {
          entry["dc:creator"] = [];
        }
        for (var i = 0; i < authors.length; i++) {
          ref = entry["id"] + "/author/" + i;
          author = {};
          author.id = ref;
          author["rdf:type"] = "http://xmlns.com/foaf/spec/#Person";
          author["foaf:name"] = authors[i];
          entries.push(author);
          entry["dc:creator"].push(ref);
        };
      }

      if (editors.length > 0) {
        if (!(entry["bibo:editor"] in entry)) {
          entry["bibo:editor"] = [];
        }
        for (var i = 0; i < editors.length; i++) {
          ref = entry["id"] + "/editor/" + i;
          editor = {};
          editor.id = ref;
          editor["rdf:type"] = "http://xmlns.com/foaf/spec/#Person";
          editor["foaf:name"] = editors[i];
          entries.push(editor);
          entry["bibo:editor"].push(ref);
        };
      }

      if (editorsa.length > 0) {
        if (!(entry["dct:contributor"] in entry)) {
          entry["dct:contributor"] = [];
        }
        for (var i = 0; i < editors.length; i++) {
          ref = entry["id"] + "/editora/" + i;
          editora = {};
          editora.id = ref;
          editora["rdf:type"] = "http://xmlns.com/foaf/spec/#Person";
          editora["foaf:name"] = editorsa[i];
          entries.push(editora);
          entry["dct:contributor"].push(ref);
        };
      }

      if (signature.length > 0) {
        var signatureAggregate = "";
        for (var i = 0; i < signature.length; i++) {
          if (signatureAggregate !== "") {
            signatureAggregate += ", ";
          }
          signatureAggregate = signatureAggregate + signature[i];
        }
        entry["istg:signatur"] = signatureAggregate;
      }

      if (comments.length > 0) {
        var commentAggregate = "";
        if (entry["istg:type"]) {
          commentAggregate += entry["istg:type"];
        }
        for (var i = 0; i < comments.length; i++) {
          if (commentAggregate !== "") {
            commentAggregate += "\n";
          }
          splitComment = comments[i].split("¶");
          if (splitComment.length > 1) {
            commentSubString = "";
            for (var j = 0; j < splitComment.length; j++) {
              if (commentSubString !== "") {
                commentSubString += "\n";
              }
              commentSubString = commentSubString + splitComment[j];
            }
            commentAggregate = commentAggregate + commentSubString;
          } else {
            commentAggregate = commentAggregate + comments[i];
          }
        }

        entry["rdfs:comment"] = commentAggregate;
      }

      var seriesNumbers = "";
      for (var i = 0; i < seriesArray.length; i++) {
        if (seriesArray[i] !== undefined && numbersArray[i] !== undefined) {
          seriesNumbers = seriesNumbers + seriesArray[i][1] + "<>" + numbersArray[i][1] + "|";
        }
      }
      if (seriesNumbers !== "") {
        entry["istg:relief"] = seriesNumbers;
      }

      if (entry["istg:maintitle"] !== undefined && entry["istg:subtitle"] !== undefined) {
        entry["dct:title"] = entry["istg:maintitle"].trim() + " : " + entry["istg:subtitle"].trim();
      } else if (entry["istg:maintitle"] !== undefined && !entry["istg:subtitle"] !== undefined) {
        entry["dct:title"] = entry["istg:maintitle"].trim();
      } else if (!entry["istg:maintitle"] !== undefined && !entry["istg:subtitle"] !== undefined && entry["istg:isPartOf"] !== undefined) {
        entry["dct:title"] = titles[0];
      }

      entries.push(entry);
      newEntry = false;
      entry = {};
      authors = [];
      signature = [];
      comments = [];
      volumes = [];
      editors = [];
      editorsa = [];
      titles = [];
      numbers = [];
      numbersArray = new Array(10);
      seriesArray = new Array(10);
    }
  }