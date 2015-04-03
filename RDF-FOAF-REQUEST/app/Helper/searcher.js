
//Import for SparqlClient
var SparqlClient = require('sparql-client');
var endpoint = 'http://dbpedia.org/sparql';

//Construire requete :
module.exports = function construireRequete(recherche, options, termine) {

    console.log("LES OPTIONS");
    console.log(options);
    console.log("FIN OPTIONS");
    
    var client = new SparqlClient(endpoint);
    var query = "SELECT DISTINCT * FROM <http://dbpedia.org> WHERE { {} ";
    var optQuery = "";

    //Construct with Option
    if (typeof options !== 'undefined') {

        for (var attributename in options) {
            if (attributename !== 'limitQuery') {
                optQuery += "UNION" + block(options[attributename], recherche);
            }
        }
    }
    if (optQuery == "") {
        optQuery += "UNION" + block("?r", recherche);
    }
    query = query + optQuery + "} LIMIT " + options.limitQuery;
  
    console.log(query);

    client.query(query).execute(function (error, results) {
        console.log("fait " + error);
        var jsonProduit = [];
        if (error) {
            jsonProduit = [
                {slabel: "error", stype: "error", rlabel: "invalid", olabel: "request", otype: "error"}
            ];
            return jsonProduit;
        }
        var listOfNodes = [];
        results.results.bindings.forEach(function (entry) {
            listOfNodes.push(entry.s.value);
            listOfNodes.push(entry.o.value);
            listOfNodes.push(entry.o1.value);
            listOfNodes.push(entry.o2.value);
        });

        listOfNodes = listOfNodes.unique();

        var requeteTypes = "SELECT * WHERE { {} ";
        listOfNodes.forEach(function (entry) {
            requeteTypes += oneLineType(entry);
        });
        requeteTypes += "}";
        console.log(requeteTypes);

        client.query(requeteTypes).execute(function (error, resTypes) {
            console.log("fait " + error);
            var listOfTypes = {};

            resTypes.results.bindings.forEach(function (entry) {
                if (!listOfTypes[entry.slabel.value]) {
                    listOfTypes[entry.slabel.value] = entry.typelabel.value;
                }
            });

            var requeteDescriptions = "SELECT * WHERE { {} ";
            listOfNodes.forEach(function (entry) {
                requeteDescriptions += oneLineDescription(entry);
            });
            requeteDescriptions += "}";
            console.log(requeteDescriptions);

            client.query(requeteDescriptions).execute(function (error, resDescriptions) {
                console.log("fait " + error);
                var listOfDescriptions = {};

                resDescriptions.results.bindings.forEach(function (entry) {
                    if (!listOfDescriptions[entry.slabel.value]) {
                        listOfDescriptions[entry.slabel.value] = entry.abstract.value;
                    }
                });

                results.results.bindings.forEach(function (entry) {
                    var ligne1 = {
                        slabel: entry.slabel.value,
                        stype: listOfTypes[entry.slabel.value],
                        sdescription: listOfDescriptions[entry.slabel.value],
                        rlabel: entry.rlabel.value,
                        olabel: entry.olabel.value,
                        otype: listOfTypes[entry.olabel.value],
                        odescription: listOfDescriptions[entry.olabel.value]
                    };
                    var ligne2 = {
                        slabel: entry.olabel.value,
                        stype: listOfTypes[entry.olabel.value],
                        sdescription: listOfDescriptions[entry.olabel.value],
                        rlabel: entry.r1label.value,
                        olabel: entry.o1label.value,
                        otype: listOfTypes[entry.o1label.value],
                        odescription: listOfDescriptions[entry.o1label.value]
                    };
                    var ligne3 = {
                        slabel: entry.o1label.value,
                        stype: listOfTypes[entry.o1label.value],
                        sdescription: listOfDescriptions[entry.o1label.value],
                        rlabel: entry.r2label.value,
                        olabel: entry.o2label.value,
                        otype: listOfTypes[entry.o2label.value],
                        odescription: listOfDescriptions[entry.o2label.value]
                    };
                    jsonProduit.push(ligne1);
                    jsonProduit.push(ligne2);
                    jsonProduit.push(ligne3);

                });
                //console.log(jsonProduit);
                termine.emit('finit', JSON.stringify(jsonProduit));
            });

        });

    });

};

Array.prototype.unique = function ()
{
    var n = {}, r = [];
    for (var i = 0; i < this.length; i++)
    {
        if (!n[this[i]])
        {
            n[this[i]] = true;
            r.push(this[i]);
        }
    }
    return r;
};

function oneLineType(subject) {
    return "UNION { <" + subject + "> rdf:type ?type ; rdfs:label ?slabel. " +
            "?type rdfs:label ?typelabel . " +
            "FILTER(lang(?typelabel) = 'en'). " +
            "FILTER(lang(?slabel) = 'en'). " +
            "} ";
}

function oneLineDescription(subject) {
    return "UNION { <" + subject + "> dbpedia-owl:abstract ?abstract " +
            "; rdfs:label ?slabel. " +
            "FILTER(lang(?abstract) = 'en'). " +
            "} ";
}

//Création d'une recherche avec une relation donnée
function block(relation, recherche) {
    var askedLabel = "";

    return "{" +
            // Branche S -> O -> O1 -> O2
            "?s " + relation + " ?o. " +
            "?s ?r ?o. " +
            "?o ?r1 ?o1. " +
            "?o1 ?r2 ?o2. " +
            // Recherche des labels pour représenter les objets par des mots
            // plutôt que par des URI 
            "?s rdfs:label \"" + recherche + "\"@en." +
            "?s rdfs:label ?slabel. " +
            relation + " rdfs:label ?rlabel. " +
            "?o rdfs:label ?olabel. " +
            "?r1 rdfs:label ?r1label. " +
            "?o1 rdfs:label ?o1label. " +
            "?r2 rdfs:label ?r2label. " +
            "?o2 rdfs:label ?o2label. " +
            // Dans la branche, les niveaux O et O2 sont des personnes
            "?o rdf:type foaf:Person. " +
            "?o2 rdf:type foaf:Person. " +
            // Les labels doivent être écrits en anglais
            "FILTER(lang(?slabel) = 'en'). " +
            "FILTER(lang(?rlabel) = 'en'). " +
            "FILTER(lang(?olabel) = 'en'). " +
            "FILTER(lang(?r1label) = 'en'). " +
            "FILTER(lang(?o1label) = 'en'). " +
            "FILTER(lang(?r2label) = 'en'). " +
            "FILTER(lang(?o2label) = 'en'). " +
            "}"
            + "UNION" +
            "{" +
            // Branche dans l'autre sens : O2 -> O1 -> 0 -> S
            "?o2 " + relation + " ?o1." +
            "?o2 ?r2 ?o1." +
            "?o1 ?r1 ?o." +
            "?o ?r ?s." +
            "?o2 rdfs:label ?o2label." +
            "?r2 rdfs:label ?r2label." +
            "?o1 rdfs:label ?o1label." +
            "?r1 rdfs:label ?r1label." +
            "?o rdfs:label ?olabel." +
            "?r rdfs:label ?rlabel." +
            "?s rdfs:label ?slabel." +
            "?o2 rdfs:label \"" + recherche + "\"@en." +
            "FILTER(lang(?o2label) = 'en')." +
            "FILTER(lang(?r2label) = 'en')." +
            "FILTER(lang(?o1label) = 'en')." +
            "FILTER(lang(?r1label) = 'en')." +
            "FILTER(lang(?olabel) = 'en')." +
            "FILTER(lang(?rlabel) = 'en')." +
            "FILTER(lang(?slabel) = 'en')." +
            "}";
}
