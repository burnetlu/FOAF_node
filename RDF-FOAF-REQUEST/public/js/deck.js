var decksModule = angular.module('decksModule', ['modalModule']);

// service accessing the USER API of Pop
decksModule.factory('Decks', ['$http', function ($http) {
        return {
            post: function (valQuery, valOptions) {
                return $http.post('/decks/searchInitial', {recherche: valQuery, options: valOptions});
            }
        };
    }]);

// inject the User service factory into our controller
decksModule.controller('decksController', ['$scope', '$http', 'Decks', '$location', '$rootScope',
    function ($scope, $http, Decks, $location, $rootScope) {
        //On initialise les valeurs des boutons par defaut ( All options et arbre circulaire pour la vue)
        $scope.vue = 'tree';


        //On remplace le champs de recherche par la valeur du $rootScope.searchLabel
        if(typeof $rootScope.searchLabel !== 'undefined' ) {
            $scope.somePlaceholder = $rootScope.searchLabel;
        }else{
            $scope.somePlaceholder = '';
        }

        //Fonction qui permet de lancer la recherche n°2
        $scope.searchQuery = function () {

            //Verification que l'utilisateur ne lance pas la recherche à vide
            if(typeof $scope.formData !== 'undefined') {

                //Verification que l'utilisateur à entrée un element à rechercher
                if (typeof $scope.formData.valQuery !== 'undefined') {

                    //Si l'utilisateur à entrée une valeur on réinitialise les valeurs de la recherche n°1
                    $rootScope.searchLabel = '';
                    //On met à jour l'affichage
                    $scope.somePlaceholder = '';

                } else {

                    // Si l'utilisateur n'a pas entrée de recherche et qu'il y'a une valeur venan de la recherche n°1
                    if( $rootScope.searchLabel != '' ) {

                        //On récupére la valeur de la recherche n°1
                        $scope.formData.valQuery = $rootScope.searchLabel;

                    }
                }
                //Ajout du paramétre pour la limitation des requêtes
                if (typeof $scope.formData.valOptions !== 'undefined') {
                    $scope.formData.valOptions.limitQuery = $rootScope.limitQuery;
                } else {
                    $scope.formData.valOptions = {};
                    $scope.formData.valOptions.limitQuery = $rootScope.limitQuery;
                }
                //Appelle post avec les valeurs du formulaire
                //L'action à réaliser est définie dans app/routes/deck.js
                //app/routes/deck.js renvoie un json de type liste de triplets
                //produitToGenerique le transforme en json générique
                //d3_graphe fait appel à d3_formatteur pour le transformer en jsonGraph
                //puis d3_graphe affiche le graphe
                //On verifie encore que l'utilisateur n'a pas fait que selectionner des options sans entree de recherche
                if (typeof $scope.formData.valQuery !== 'undefined' && $scope.formData.valQuery !== '') {
                    Decks.post($scope.formData.valQuery, $scope.formData.valOptions)
                        .success(function (data) {
                            var jsongen = produitToGenerique(data);
                            if ($scope.vue == "tree") {
                                var d3_tree = new D3_NodeLinkTreeRepresentation();
                                d3_tree.show(jsongen);
                            }
                            else if ($scope.vue == "bubble") {
                                var d3_bubble = new D3_BubbleRepresentation();
                                d3_bubble.show(jsongen);
                            }
                            else if ($scope.vue == "indented") {
                                var d3_collapsible = new D3_TreeRepresentation();
                                d3_collapsible.show(jsongen);
                            }
                            else {
                                var d3_graphe = new D3_GrapheRepresentation();
                                d3_graphe.show(jsongen);
                            }
                        });
                }
            }else{

                //Si l'utilisateur lance la recherche à vide et qu'il y a une valeur en provenance de la recherche n°1
                if( $rootScope.searchLabel !== '' && typeof $rootScope.searchLabel !== 'undefined' ){
                    //On crer la variable à transmettre
                    $scope.formData = {};
                    //On récupére la valeur de la recherche n°1
                    $scope.formData.valQuery = $rootScope.searchLabel;
                    //Ajoute la limitation de requête
                    if (typeof $scope.formData.valOptions !== 'undefined') {
                        $scope.formData.valOptions.limitQuery = $rootScope.limitQuery;
                    } else {
                        $scope.formData.valOptions = {};
                        $scope.formData.valOptions.limitQuery = $rootScope.limitQuery;
                    }
                    //Appelle post avec les valeurs du formulaire
                    //L'action à réaliser est définie dans app/routes/deck.js
                    //app/routes/deck.js renvoie un json de type liste de triplets
                    //produitToGenerique le transforme en json générique
                    //d3_graphe fait appel à d3_formatteur pour le transformer en jsonGraph
                    //puis d3_graphe affiche le graphe
                    Decks.post($scope.formData.valQuery, $scope.formData.valOptions)
                        .success(function (data) {
                            var jsongen = produitToGenerique(data);
                            if ($scope.vue == "tree") {
                                var d3_tree = new D3_NodeLinkTreeRepresentation();
                                d3_tree.show(jsongen);
                            }
                            else if ($scope.vue == "bubble") {
                                var d3_bubble = new D3_BubbleRepresentation();
                                d3_bubble.show(jsongen);
                            }
                            else if ($scope.vue == "indented") {
                                var d3_collapsible = new D3_TreeRepresentation();
                                d3_collapsible.show(jsongen);
                            }
                            else {
                                var d3_graphe = new D3_GrapheRepresentation();
                                d3_graphe.show(jsongen);
                            }
                            //On remet les valeurs en provenance de la recherche n°1 à vide
                            //On remet egalement l'indicateur dans le Input à vide
                            $rootScope.searchLabel = '';
                            $scope.somePlaceholder = '';
                        });


                }

            }
        };

    }]);
