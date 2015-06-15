'use strict';

module.exports = function(app) {
	app.controller('dogsController', ['$scope', 'RESTResource', function($scope, rest) {
		$scope.errors = [];
		$scope.dogs = [];
		var httpDog = rest('dogs');

		$scope.getAllDogs = function() {
			//Make request to server
      httpDog.get(function(err, data) {
				if (err) {
					//add to error array
					return $scope.errors.push({msg: 'Error retrieving dogs'});
				}
				//Return data to client side
				$scope.dogs = data;
      });
		};

		$scope.saveNewDog = function() {
			//Clear entry in client side
			var newDog = $scope.newDog;
			$scope.newDog = null;
			//Save new dog to client side
			$scope.dogs.push(newDog);
			//Make request to server
			httpDog.post(newDog, function(err, data) {
				if (err) {
					//Remove dog from client side array
					$scope.dogs.splice($scope.dogs.indexOf(newDog), 1);
					//add to error array
					return $scope.errors.push({msg: 'Error saving dog: ' + newDog.name });
				}
					//Add returned dog to client side
				$scope.dogs.splice($scope.dogs.indexOf(newDog), 1, data);
			});
		};

		$scope.deleteDog = function(dog) {
			//Remove dog from client side
			$scope.dogs.splice($scope.dogs.indexOf(dog), 1);
			//Make request to server
			httpDog.delete(dog, function(err, data) {
				if (err) {
					//Add dog back to client side array
					$scope.dogs.push(dog);
					//add to error array
					return $scope.errors.push({msg: 'Error deleting dog: ' + dog.name});
				}
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
			httpDog.put(dog, function(err, data) {
				if (err) {
					//Put old dog back into client side array
					$scope.dogs.splice($scope.dogs.indexOf(dog), 1, dog.old)
					//add to error array
					return $scope.errors.push({msg: 'Could not save dog: ' + dog.name});
				}
				dog.old = {};
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
