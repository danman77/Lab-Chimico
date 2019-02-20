angular.module('laboratorio')

// Controller per pagina inserimento richiesta di analisi

.controller('listaAnalisi', ['$scope', '$http', function ($scope, $http) {
    $scope.read = false
    $scope.analisi = []
    $scope.analisiSelezionate = {}
    $scope.analisiDaMemorizzare = []
    $http.get("/app/getanalisi").then(function (lista) {
        $scope.analisi = lista.data
    })
    $scope.vettore = window.vettore

    if (window.read == 1) {

    }

    // Fuzione di inserimento dati nel Database

    $scope.inserisciRichiesta = function () {
        
        angular.forEach($scope.analisiSelezionate, function (value, key) {
            if (value) {
                $scope.analisiDaMemorizzare.push(key)
            }
        })
        $scope.datiRichiesta = ({ pn: $scope.pn, materiale: $scope.materiale, specapp: $scope.specapp, bem: $scope.bem, databem: new Date($scope.databem), odv: $scope.odv, lotto: $scope.lotto, disegno: $scope.disegno, note: $scope.note, analisi: $scope.analisiDaMemorizzare, stato: 0 })
        $http.post("/app/addRichiesta", $scope.datiRichiesta).then(function()
    {
        window.location.href="/app/mainpage"
    })
    }
    // Funzione di verifica per analisi selezionate

    $scope.checkCheckbox = function (arr, valorecheck) {
        $scope.vettore = arr.split(",")
        ritorno = false
        angular.forEach($scope.vettore, function (value, key) {
            if (angular.equals(value, valorecheck)) {
                ritorno = true
            }
        })
        return ritorno
    }
    $scope.returnToHome=function()
    {
        
        window.history.back();
    }

    // funzione per modificare richiesta di analisi

    $scope.editRecord=function(idrichiesta)
    
    {
        $scope.analisiDaMemorizzare=[]
        $scope.idrec=idrichiesta
        angular.forEach($scope.analisiSelezionate, function (value,key) {
            
            if (value) {
                $scope.analisiDaMemorizzare.push(key)
            }
        })
        $scope.datiRichiesta = ({ pn: $scope.pn, materiale: $scope.materiale, specapp: $scope.specapp, bem: $scope.bem, databem: $scope.databem, odv: $scope.odv, lotto: $scope.lotto, disegno: $scope.disegno, note: $scope.note, analisi: $scope.analisiDaMemorizzare, stato: 0 })
    $http.put('/app/editRichiesta',{valori:$scope.datiRichiesta,id:$scope.idrec}).then(function()
{
    window.location.href="/app/mainpage"
    
})
    }
}])