var app = angular.module('findApp', ['ngRoute','decksModule','searchModule','angular.filter','modalModule']);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
        when('/home', {
            templateUrl: 'partials/home.html'
        }).

        when('/decks', {
            templateUrl: 'partials/deck.html',
            controller: 'decksController'
        }).
        when('/deck/search/:search_id', {
            templateUrl: 'partials/deck.html',
            controller: 'decksController'
        }).
        when('/search', {
            templateUrl: 'partials/search.html',
            controller: 'searchController'
        }).
        otherwise({
            redirectTo: '/home'
        });
}]);

app.run(function($rootScope,$http) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute) {
        //redirect only if both isAuthenticated is false and no token is set
        if (nextRoute !== null
            && nextRoute.templateUrl == "partials/home.html" ) {
                $rootScope.searchLabel = "Search";
                //Re-init value for request Limit to 1000
                $rootScope.limitQuery = "100";
            }

        //for every change route --> Test if DBpedia is accessible (OK)
        $http.get('http://www.dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=select+distinct+%3FConcept+where+{[]+a+%3FConcept}+LIMIT+100&format=text%2Fhtml&timeout=3000&debug=on').success(function(data, status, headers, config) {

            $rootScope.etataServDbpedia = "OK";
		    //console.log('Serveur OK !')
		  }).error(function(data, status, headers, config) {

		    //console.log('Serveur DB NOK !')
		    $rootScope.etataServDbpedia = "NOK";
		  });
    });
});

