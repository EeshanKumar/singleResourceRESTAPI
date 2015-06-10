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
			//Clear entry in client side
			var newDog = $scope.newDog;
			$scope.newDog = null;
			//Save new dog to client side
			$scope.dogs.push(newDog);
			//Make request to server
			$http.post('/api/dogs', newDog)
				.success(function(data) {
					//Add returned dog to client side
					$scope.dogs.splice($scope.dogs.indexOf(newDog), 1, data);
				})
				.error(function(data) {
					//On error print errors, add to error array
					console.log(data);
					$scope.errors.push({msg: 'Error saving dog: ' + newDog.name });
					//Remove dog from client side array
					$scope.dogs.splice($scope.dogs.indexOf(newDog), 1);
				});
		};

		$scope.deleteDog = function(dog) {
			//Remove dog from client side
			$scope.dogs.splice($scope.dogs.indexOf(dog), 1);
			//Make request to server
			$http.delete('/api/dogs/' + dog._id)
				.error(function(data) {
					//On error, print errors, add to error array
					console.log(data);
					$scope.errors.push({msg: 'Error deleting dog: ' + dog.name});
					//Add dog back to client side array
					$scope.dogs.push(dog);
				});
		};

		$scope.editDog = function(dog) {
			dog.editing = true
			//Save copy of old dog values
			dog.old = {};
			dog.old._id = dog._id;
			dog.old.name = dog.name;
			dog.old.breed = dog.breed;
		}

		$scope.saveDogEdit = function(dog) {
			dog.editing = false;
			//Make request to server
			$http.put('/api/dogs/' + dog._id, dog)
				.success(function(data) {
					//Clear old values
					dog.old = {};
				}).error(function(data) {
					console.log(data);
					$scope.errors.push({msg: 'Could not save dog: ' + dog.name});
					$scope.dogs.splice($scope.dogs.indexOf(dog), 1, dog.old)
				});
		}

		$scope.cancelEdit = function(dog) {
			dog.name = dog.old.name;
			dog.breed = dog.old.breed;
			dog.old = {};
			dog.editing=false
		}

		$scope.cleanErrors = function() {
			//Clear errors
			$scope.errors = [];
		};

	}]);
}