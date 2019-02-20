
'use strict';
var app = angular.module('laboratorio', ['ngRoute','ngCookies'])

// servizio per gestire la variabile item utilizzata per la ricerca di richieste in base a parole chiave

app.service('itemToSearchfunc', function () {
    var item = {}

    this.addItem = function (value) {

        item = value
    }
    this.getItemToSearch = function () {
        return item
    }
})
// rotte definite all'interno di angularjs
app.config(function ($routeProvider, $locationProvider) {


    $routeProvider.when('/addtest/',
        {
            templateUrl: '/app/addtest',
            controller: 'listaAnalisi',
            
        })

    $routeProvider.when('/richiesteAperte/',
        {
            templateUrl: '/app/richiesteAperte',
            controller: 'listaRichiesteTabella'
        })

    $routeProvider.when('/richiesteChiuse/',
        {
            templateUrl: '/app/richiesteChiuse',
            controller: 'listaRichiesteTabella'
        })
    $routeProvider.when('/richiesteAll/',
        {
            templateUrl: '/app/richiesteAll',



            controller: 'listaRichiesteTabella'

        })

    $routeProvider.when('/viewRichiesta/',
        {

            templateUrl: function (params) {

                return '/app/viewRichiesta?idrichiesta=' + params.idrichiesta

            },
            controller: 'listaAnalisi'
        })

    $routeProvider.when('/editRichiesta/',
        {

            templateUrl: function (params) {

                return '/app/editRichiesta?idrichiesta=' + params.idrichiesta

            },
            controller: 'listaAnalisi'
        })

    $locationProvider.hashPrefix('');

})

//controller per effettuare la ricerca di analisi popolamento della variabile item mediante l'utilizzo del servizio itemToSearch

app.controller('ricerca', function ($scope, $location, itemToSearchfunc) {

    $scope.ricerca = function (valore) {

        itemToSearchfunc.addItem(valore)
        location.href = '#/richiesteAll'

    }
})

//controller utilizzato per effettuare il logout dall'applicazione mediante la cancellazione del cookie contenente il jsonwebtoken

app.controller('gestioneAccount',function($scope,$http,$location,$cookies)
{
    $scope.logOut=function()
    {
        $cookies.remove("token",{path: '/'})

        
    }
    
})

