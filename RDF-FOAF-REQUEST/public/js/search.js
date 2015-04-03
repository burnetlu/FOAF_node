var searchModule = angular.module('searchModule', ['modalModule']);

// service accessing the USER API of Pop
decksModule.factory('Searchs', ['$http',function($http) {
	return {
		post : function(valSearch, valOptions) {
			return $http.post('/search/initSearch', {recherche: valSearch, options: valOptions});
		}
	};
}]);

	// inject the User service factory into our controller
decksModule.controller('searchController', ['$scope','$http','Searchs','$location','$rootScope',
			 function($scope, $http, Searchs, $location, $rootScope) {



	$scope.goRestSearch = function(search){

		//On click on person label ,past slabel argument to decks
		$rootScope.searchLabel = search.slabel.value;
		$location.path( "/decks");
	};


	$scope.goSearch = function(){


		$scope.valueLoading = true;

		//Test si on à des options
		// Si oui on ajout l'option de limit de query
		// Si non on creer l'objet valSearchOption et on ajoute l'option limitQuery dedans
		if(typeof $scope.formData.valSearchOption !== 'undefined'){
			$scope.formData.valSearchOption.limitQuery = $rootScope.limitQuery;
		}else{
			$scope.formData.valSearchOption = {};
			$scope.formData.valSearchOption.limitQuery = $rootScope.limitQuery;
		}

		//console.log($scope.formData.valSearchOption);
		//First search for one person
		//console.log(JSON.stringify($scope.formData));
		Searchs.post($scope.formData.valSearch,$scope.formData.valSearchOption)
			.success(function(data) {
				//Format Data
				data.forEach(function(entry) {
					//If birthplace is an URI --> Kepp only last word
					if(typeof entry.birthplace !== 'undefined'){


						var n = entry.birthplace.value.lastIndexOf("/");

						if(n !== -1)
						{
							var rsultDecoupe = entry.birthplace.value.substring(n+1);
							entry.birthplace.value = rsultDecoupe;
						}
						//console.log(entry.birthplace);
					}
					//Format birthDate ----> 1989-04-21+02:00 TO --> 21 April 1989
					if(typeof entry.birth !== 'undefined') {

						//console.log(entry.birth.value);

						var monthName = ["January", "February", "March",
						"April", "May", "June", "July", "August", "September",
						"October", "November", "December"];

						var myChain = entry.birth.value;

						var n = myChain.lastIndexOf("+");
						myChain = myChain.substring(0,n);

					    n = myChain.lastIndexOf("-");
					    var dateJour = myChain.substring(n+1);
					    myChain = myChain.substring(0,n);

					    n = myChain.lastIndexOf("-");
					    var dateMoi = myChain.substring(n+1);
					    myChain = myChain.substring(0,n);
					    var intMoi = parseInt(dateMoi);
						dateMoi = monthName[intMoi-1];

					    //console.log(dateJour + " " +dateMoi + " "+ myChain);
					    entry.birth.value = dateJour + " " + dateMoi + " " + myChain;
						//console.log(entry.birth);
					}


				});
				$scope.valueLoading = false;
				$scope.lsSearch = data;
			});
	};

}]);