angular.module('laboratorio')

    // controller per il template listaricheste.ejs

    .controller('listaRichiesteTabella', ['$scope', '$http', '$window','itemToSearchfunc', function ($scope, $http, $window,itemToSearchfunc,$route) {
        $scope.richiesteAperte = []
        $scope.richiesteChiuse = []
        $scope.controllo = []

        // rotta per ottenre la lista delle richieste aperte

        $http.get('/app/getRichichiesteAperte').then(function (listarichiesteaperte) {
            $scope.richiesteAperte = listarichiesteaperte.data
            
        })

         // rotta per ottenre la lista delle richieste chiuse

        $http.get('/app/getRichiesteChiuse').then(function (listarichiestechiuse) {
            $scope.richiesteChiuse = listarichiestechiuse.data
        })

         // rotta per ottenre la lista delle richieste i base a paramtri di ricerca

        $http.get('/app/getAllRichieste',{params:{itemToSearch:itemToSearchfunc.getItemToSearch()}}).then(function (listarichieste) {
            
           
            $scope.richieste = listarichieste.data
        })

        // funzione per visualizzare una richiesta

        $scope.apriRichiesta = function (idrichiesta) {
            window.location.href = "#/viewRichiesta?idrichiesta=" + idrichiesta
        }

        // funzione per modificare una richiesta 

        $scope.editRichiesta = function (idrichiesta, admin) {

            if (admin == 0) {

                window.location.href = "#/editRichiesta?idrichiesta=" + idrichiesta
            }

        }

        // funzione per cancellare una richiesta

        $scope.deleteRichiesta = function (idrichiesta1,admin,stato) {
            if (admin==1 || stato==1)
                {
                    return
                }
            $http({ url: '/app/deleteRichiesta', method: 'delete', params: { idrichiesta: idrichiesta1 } }).then(function () {
                window.location.href = "/app/mainpage"
            })
        }

        // funzione per visualizzare il report associato ad una richiesta chiusa

        $scope.getReport = function (idrichiesta2) {

            
            window.open('/app/getReport?idrichiesta=' + idrichiesta2)
        }
        
        // funzione per chiudere un'analisi e fare l'upload del report

        $scope.caricaReport = function (indice,idrichiesta,numReq,pn,materiale) {

            var file1 = document.getElementById('file' + indice).files[0]
            fd = new FormData()
            fd.append('file', file1)
            $http({
                url: "/app/addImage",
                method: "PUT",
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity,
                data: fd,
                params: { richiesta: idrichiesta,numReq:numReq,pn: pn,materiale:materiale }
            }).then(function()
        {
            window.location.href = "/app/mainpage/#richiesteAperte"
        })

        }
       
    }])