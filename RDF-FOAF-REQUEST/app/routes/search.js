/**
 * Created by zorg on 09/12/14.
 */
var models = require('../models/find_model.js');
var requete = models.Requete;

//Outil de visualisation JSON
var util = require('util');

//Import for SparqlClient
var SparqlClient = require('sparql-client');
var utilSparql = require('../Helper/sparql_request_formatteur.js');
var formatReq = require('../Helper/helperSimply.js');
var endpoint = 'http://dbpedia.org/sparql';


module.exports = function(app) {

    app.post('/search/initSearch',function(req, res) {

        //Use client for sparql search
        var client = new SparqlClient(endpoint);



        console.log(req.body);

        var myQuery = formatReq(req.body.recherche,req.body.options);

        //-------------------------------------------------------------------------------------------
        //-------------------------- Futur Integration MONGODB --------------------------------------
        ////Before save new params search on mongoDB (Find if exist --> Update / also --> create new)
        //var condition = { search: nameRech };
        //var update = {
        //    search          : nameRech,     // mandatory
        //    searchOptions   : option
        //};
        //requete.findOneAndUpdate(condition, update, {upsert:true}, function(err, contact) {
        //    if (err || contact === undefined) {
        //        console.log(err);
        //    }
        //    console.log( 'Requetes ' + requete.search + ' created.');
        //});


        //--DEBUG--
        //console.log('Searching for : ' + nameRech + ' -- With option : ' + option);
        console.log('Query : ' + myQuery);


        //Execute Request on Saprql end-point
        client.query(myQuery)
        .execute(function(error, results) {

            // -- DEBUG --
			//console.log(req.body);

            //Prepare Return Results
			var displayResult;

			if (results == null) {
			    //On error
			    displayResult = "fail";
            }
			else {
                //console.log(JSON.stringify(results));
                res.json(results.results.bindings);

			}
        });
     });

    app.get('/search', function(req, res){
        console.log('Call /search ');
    });
};