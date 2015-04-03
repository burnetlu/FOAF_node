var EventEmitter = require('events').EventEmitter;

//Import modéle Find
var models = require('../models/find_model.js');
var searcher = require('../Helper/searcher.js');
//var typefinder = require('../Helper/typefinder.js');
var requete = models.Requete;

//Outil de visualisation JSON
var util = require('util');

var SparqlClient = require('sparql-client');
var utilSparql = require('../Helper/sparql_request_formatteur.js');
var formatReq = require('../Helper/helperSimply.js');
var endpoint = 'http://dbpedia.org/sparql';

module.exports = function (app) {

    //C'est cette fonction qui est appelée dans public/js/deck.js
    app.post('/decks/searchInitial', function (req, res) {

/*<<<<<<< HEAD*/
        //On appelle le modèle searcher.js pour qu'il produise le json répondant à la requête
        var termine = new EventEmitter();
        var jsonRes = searcher(req.body.recherche, req.body.options, termine);
        
        //On renvoie ce json en résultat, il sera pris en charge
        //côté client par public/js/deck.js
        
        termine.on('finit',function(message) {
            res.json(JSON.parse(message));
/*=======*/
/*        console.log(req.body);

        var client = new SparqlClient(endpoint);

        var myQuery = searcher(req.body.options,req.body.recherche);


        console.log('Query : ' + myQuery);


        //Execute Request on Sparql end-point
        client.query(myQuery).execute(function (error, results) {
            var jsonProduit = [];
            results.results.bindings.forEach(function (entry) {

                //console.log("value de la recherche : ");
                //console.log(req.body.recherche);
                //console.log("Value slabel : ");
                //console.log(entry.slabel.value);
                //console.log("Value o2label : ");
                //console.log(entry.o2label.value);
                //console.log(entry);

                if(req.body.recherche == entry.slabel.value) {
                    //console.log("OK premier IF !" );
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
                }else if(req.body.recherche == entry.o2label.value){
                    //console.log("Deuxieme IF !");
                    var ligne1 = {
                        slabel: entry.o2label.value,
                        rlabel: entry.r2label.value,
                        slabel: entry.o1label.value
                    };
                    var ligne2 = {
                        slabel: entry.o1label.value,
                        rlabel: entry.r1label.value,
                        olabel: entry.olabel.value
                    };
                    var ligne3 = {
                        slabel: entry.olabel.value,
                        rlabel: entry.rlabel.value,
                        olabel: entry.slabel.value
                    };

                }
                jsonProduit.push(ligne1);
                jsonProduit.push(ligne2);
                jsonProduit.push(ligne3);
                //console.log(jsonProduit);
            });

            //Prepare Return Results
			var displayResult;

			if (results == null) {
			    //On error
			    displayResult = "fail";
            }
			else {


                //console.log(JSON.stringify(results));
                res.send(JSON.stringify(jsonProduit));

			}

//>>>>>>> 9640dc62874ef7832e0cdebec46c0b1ca8b6204b*/
        });
    });
};


