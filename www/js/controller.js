var jasmineApp = angular.module('jasmineApp', ['ngSanitize']);
    jasmineApp.controller('PageCtrl', function ($scope) {
        $scope.usersArrData = [
            {'name': 'Anthony', lastname:'Balao' },
            {'name': 'John', lastname:'Bowen' }
        ];
    });