'use strict';

module.exports = function(app) {
	app.controller('dogsController', ['$scope', '$http', function($scope, $http) {
		$scope.errors = [];
		$scope.dogs = [];

		$scope.getAllDogs = function() {
			$http.get('/api/dogs')
				.success(function(data) {
					$scope.dogs = data;
				})
				.error(function(data) {
					$scope.errors.push({msg: 'Error retrieving dogs'});
				});
		};

		$scope.saveNewDog = function() {
			//Save new dog to client side
			$scope.dogs.push($scope.newDog);
			//Make request to server
			$http.post('/api/dogs', $scope.newDog)
				.error(function(data) {
					//On error print errors, add to error array
					console.log(data);
					$scope.errors.push({msg: 'Error saving dog: ' + newDog.name });
					//Remove dog from client side array
					$scope.dogs.splice($scope.dogs.indexOf(newDog), 1);
				});
			//Clear entry in client side
			$scope.newDog = null;
		};

		$scope.deleteDog = function(dog) {
			//Remove dog from client side
			$scope.dogs.splice($scope.dogs.indexOf(dog), 1);
			//Make request to server
			$http.delete('./api/dogs/' + dog._id)
				.error(function(data) {
					//On error, print errors, add to error array
					console.log(data);
					$scope.errors.push({msg: 'Error deleting dog: ' + dog.name});
					//Add dog back to client side array
					$scope.dogs.push(dog);
				});
		};

		$scope.cleanErrors = function() {
			//Clear errors
			$scope.errors = [];
		};

	}]);
}