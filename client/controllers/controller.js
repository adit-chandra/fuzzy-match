var frontApp = angular.module("frontApp", []);
frontApp.controller('replyCtrl', ['$scope', '$http', 'front', function($scope, $http, front) {
    console.log("From controller.");

    $scope.toSend = ["test1","test2","test3"];

    front.Front.on('conversation', function(data){
        $scope.test = data;
        $scope.toSend.push(data);
        console.log("Hi.");
    });
}]);