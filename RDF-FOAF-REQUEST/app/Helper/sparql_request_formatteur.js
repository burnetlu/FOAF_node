/**
 * Created by zorg on 09/12/14.
 */

module.exports = function block(relation,recherche) {
	var askedLabel = "";
	if (recherche != "") {
		askedLabel = "?s rdfs:label \"" + recherche + "\"@en. ";
	}
	return "{" +
		"?s " + relation + " ?o. " +
		askedLabel +
 		"?s rdfs:label ?slabel. " +
 		relation + " rdfs:label ?rlabel. " +
 		"?o rdfs:label ?olabel. " +
		"?o rdf:type foaf:Person. " +
		"FILTER(lang(?slabel) = 'en')." +
		"FILTER(lang(?rlabel) = 'en')." +
		"FILTER(lang(?olabel) = 'en')." +
		"}" +
		"UNION" +
		"{" +
		"?s " + relation + " ?o. " +
		askedLabel +
 		"?s rdfs:label ?slabel. " +
 		relation + " rdfs:label ?rlabel. " +
 		"?o rdfs:label ?olabel. " +
		"?s rdf:type foaf:Person. " +
		"FILTER(lang(?slabel) = 'en')." +
		"FILTER(lang(?rlabel) = 'en')." +
		"FILTER(lang(?olabel) = 'en')." +
		"}";
};

