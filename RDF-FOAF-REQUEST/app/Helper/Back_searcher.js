/**
 * Created by zorg on 14/12/14.
 */

//Import for SparqlClient
var SparqlClient = require('sparql-client');
var endpoint = 'http://dbpedia.org/sparql';

module.exports = function effectuerRecherche(recherche,termine) {

    var client = new SparqlClient(endpoint);

    var requete = "SELECT DISTINCT ?slabel ?rlabel ?olabel ?r1label ?o1label ?r2label ?o2label " +
            " WHERE { {} UNION" +
            "{ " +
            "?s ?r ?o. " +
            "?o ?r1 ?o1. " +
            "?o1 ?r2 ?o2. " +
            "?s rdfs:label \"Barack Obama\"@en. " +
            "?s rdfs:label ?slabel. " +
            "?r rdfs:label ?rlabel. " +
            "?o rdfs:label ?olabel. " +
            "?r1 rdfs:label ?r1label. " +
            "?o1 rdfs:label ?o1label. " +
            "?r2 rdfs:label ?r2label. " +
            "?o2 rdfs:label ?o2label. " +
            "FILTER(lang(?slabel) = 'en'). " +
            "FILTER(lang(?rlabel) = 'en'). " +
            "FILTER(lang(?olabel) = 'en'). " +
            "FILTER(lang(?r1label) = 'en'). " +
            "FILTER(lang(?o1label) = 'en'). " +
            "FILTER(lang(?r2label) = 'en'). " +
            "FILTER(lang(?o2label) = 'en'). " +
            "} " +
            "} LIMIT 50";

    client.query(requete).execute(function (error, results) {
        //console.log(results.results.bindings);
        var jsonProduit = [];
        results.results.bindings.forEach(function (entry) {
            var ligne1 = {
                slabel: entry.slabel.value,
                rlabel: entry.rlabel.value,
                olabel: entry.olabel.value
            };
            var ligne2 = {
                slabel: entry.olabel.value,
                rlabel: entry.r1label.value,
                olabel: entry.o1label.value
            };
            var ligne3 = {
                slabel: entry.o1label.value,
                rlabel: entry.r2label.value,
                olabel: entry.o2label.value
            };
            jsonProduit.push(ligne1);
            jsonProduit.push(ligne2);
            jsonProduit.push(ligne3);

        });

        //console.log(jsonProduit);

        termine.emit('finit',JSON.stringify(jsonProduit));
    });


    
};
