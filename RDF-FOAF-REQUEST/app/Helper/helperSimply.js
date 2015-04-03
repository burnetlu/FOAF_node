module.exports = function adaptQueryWithOption(valCherche,options) {

	// DEBUG Enrtry Argument
	console.log('Recehrche pour : ');
	console.log( valCherche);
	console.log('Avec les options : ');
	console.log(options);
    //on ajoute les prefix utilisé pour la requete
    var queryPrefix = "PREFIX : <http://dbpedia.org/resource/>" +
                         "PREFIX foaf: <http://xmlns.com/foaf/0.1/>" +
                         "PREFIX dbpedia: <http://dbpedia.org/> " +
                         "PREFIX dbpedia2: <http://dbpedia.org/property/> " +
                         "PREFIX dbpedia3: <http://dbpedia.org/ontology/> ";

	//Select query --> Just option Distinct
	var selectQuery = "SELECT DISTINCT ";

	//Defautlt --> All is conserve
	var valueQuery = "?person ?name ?birth ?birthplace ?descro ?slabel ?picture ?function";

	//Query heart
	var heartQuery = " WHERE {" +
					 "?person dc:description ?descro." +
					 "?person rdfs:label ?slabel." +
					 "?person foaf:name ?name.";

	/*Query Option -----------
	Add optional and filter here
	Test for name search :
						--> name or * (n'importe qui)
	Test for 4 options :
	                    --> birthdate
	                    --> birthYear
	                    --> birthplace
	                    --> function*/

	//Main search --> Name of person
	if(valCherche !== "" && typeof valCherche !== 'undefined'){
		var mainSearchQuery = "FILTER regex(?name, \"" + valCherche + "\",\"i\").";
	}
	else{
		var mainSearchQuery = "";
	}


	if (typeof options !== 'undefined'){

		//Options : BIRTHPLACE
	    if (typeof options.placeBirth !== 'undefined') {
			// Verifier xsd:date dans DBpedia + REGEX
			var birthPlaceQuery = "?person dbpedia2:placeOfBirth ?birthplace." +
								 "FILTER regex(?birthplace, \"" + options.placeBirth + "\",\"i\").";
		}
		else{
			var birthPlaceQuery = "OPTIONAL{?person dbpedia2:placeOfBirth ?birthplace}.";
		}

		//Options : BIRTHDATE et BIRTHYEAR
	    if (typeof options.birthDate !== 'undefined' || typeof options.birthYear !== 'undefined') {
		    // Verifier xsd:date dans DBpedia + REGEX
		    if (typeof options.birthDate !== 'undefined' ) {
			    // Verifier xsd:date dans DBpedia + REGEX
			    var birthDateQuery = "?person dbpedia3:birthDate ?birth." +
				    "FILTER regex(?birth, \"" + options.birthDate + "\").";
		    }
		    else {
			    // Verifier REGEX --> option.birthYear
			    var birthDateQuery = "?person dbpedia3:birthDate ?birth." +
				    "FILTER regex(?birth, \"" + options.birthYear + "\").";
		    }
	    }
	    else{
	        var birthDateQuery = "OPTIONAL{?person dbpedia3:birthDate ?birth}.";
	    }

		//Options : FUNCTION
	    if (typeof options.titleFunction !== 'undefined') {
			// Verifier xsd:date dans DBpedia + REGEX
			var functionQuery = "FILTER regex(?descro, \"" + options.titleFunction + "\",\"i\").";
		}
		else{

			var functionQuery = "";
		}
	}
	else{

		var birthDateQuery = "OPTIONAL{?person dbpedia3:birthDate ?birth}.";
		var birthPlaceQuery = "OPTIONAL{?person dbpedia2:placeOfBirth ?birthplace}.";
		var functionQuery = "OPTIONAL{?person dbpedia2:title ?function.}";
	}

	//recupere la photo si elle existe

	var pictureQuery = "OPTIONAL{?person dbpedia3:thumbnail ?picture.}";

	//Add filter to english '@en'
	var filterEnQuery = "FILTER(lang(?slabel) = 'en')}";

	//Recupere la limit Query
	var limitQuery = "LIMIT " + options.limitQuery;

	//Add All Variables

	var finalQuery = queryPrefix + selectQuery +valueQuery + heartQuery + mainSearchQuery + birthDateQuery + birthPlaceQuery + functionQuery + pictureQuery + filterEnQuery  + limitQuery;

	// -- DEBUG QUERY
	console.log('DEBUG DE LA QUERY -----')
	console.log(queryPrefix);
	console.log(selectQuery);
	console.log(valueQuery);
	console.log(heartQuery);
	console.log(mainSearchQuery);
	console.log(birthDateQuery);
	console.log(birthPlaceQuery);
	console.log(functionQuery);
	console.log(pictureQuery);
	console.log(filterEnQuery);
	console.log(limitQuery);
	console.log('FIN DEBUG -----')

    return finalQuery;

};
