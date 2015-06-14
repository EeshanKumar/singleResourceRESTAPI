'use strict';

require('../../app/js/client');
require('angular-mocks');

describe('dogs_controller', function() {
	var $ControllerConstructor;
	var $httpBackend;
	var $scope;
	var app = '/api/dogs';

	beforeEach(angular.mock.module('dogsApp'));

	beforeEach(angular.mock.inject(function($rootScope, $controller) {
		$scope = $rootScope.$new();
		$ControllerConstructor = $controller;
	}));

	it('should be able to create a new controller', function() {
		var dogsController = $ControllerConstructor('dogsController', {$scope: $scope});
		expect(typeof dogsController).toBe('object');
		expect(Array.isArray($scope.dogs)).toBe(true);
		expect(Array.isArray($scope.errors)).toBe(true);
		expect(typeof $scope.getAllDogs).toBe('function');
	});

	describe('rest functionality', function() {
		beforeEach(angular.mock.inject(function(_$httpBackend_) {
			$httpBackend = _$httpBackend_;
			this.dogsController = $ControllerConstructor('dogsController', {$scope: $scope});
		}));

		afterEach(function() {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});

		it('should clean old errors', function() {
			$scope.errors.push({msg: 'Test error'});
			expect($scope.errors.length).toBe(1);
			$scope.cleanErrors();
			expect($scope.errors.length).toBe(0);
		});

		it('should get all dogs', function() {
			$httpBackend.expectGET(app).respond(200, [{_id: '1', name: 'Lassie', breed: 'Big One'}]);
			$scope.getAllDogs();
			$httpBackend.flush();
			expect($scope.dogs[0].name).toBe('Lassie');
			expect($scope.dogs[0]._id).toBe('1');
		});

		it('should handle errors on get request', function() {
			$httpBackend.expectGET(app).respond(500, {msg: 'internal server error'});
			$scope.getAllDogs();
			$httpBackend.flush();
			expect($scope.errors.length).toBe(1);
			expect($scope.errors[0].msg).toBe('Error retrieving dogs');
		})

		it('should save a new dog' ,function() {
			$scope.newDog = {name: 'Bill', breed: 'Retriever'};
			$httpBackend.expectPOST(app).respond(200, {_id: '1', name: 'Billium', breed: 'Retriver'});
			$scope.saveNewDog();
			expect($scope.dogs[0].name).toBe('Bill');
			$httpBackend.flush();
			expect($scope.dogs[0].name).toBe('Billium');
			expect($scope.dogs[0]._id).toBe('1');
			expect($scope.newDog).toBe(null);
		});

		it('should handle errors on saving a new dog', function() {
			$httpBackend.expectPOST(app).respond(500, {msg: 'internal server error'});
			$scope.newDog = {name: 'test', breed: 'that one'};
			$scope.saveNewDog();
			expect($scope.dogs.length).toBe(1);
			$httpBackend.flush();
			expect($scope.dogs.length).toBe(0);
			expect($scope.errors[0].msg).toBe('Error saving dog: test');
			expect($scope.errors.length).toBe(1);
		});

		describe('cases that require previous dogs loaded in from scope', function() {
			beforeEach(function() {
				$scope.dogs.push({_id: 4, name: 'Tina', breed: 'Turning'});
			});

			it('should delete a dog', function() {
				var dog = $scope.dogs[0];
				$httpBackend.expectDELETE(app+'/'+dog._id).respond(200, {msg: 'dog deleted'});
				expect($scope.dogs.length).toBe(1);
				$scope.deleteDog(dog);
				expect($scope.dogs.length).toBe(0);
				$httpBackend.flush();
				expect($scope.errors.length).toBe(0);
			});

			it('should handle errors on trying to delete a dog', function() {
				var dog = $scope.dogs[0];
				$httpBackend.expectDELETE(app+'/'+dog._id).respond(500, {msg: 'internal server error'});
				expect($scope.dogs.length).toBe(1);
				$scope.deleteDog(dog);
				expect($scope.dogs.length).toBe(0);
				$httpBackend.flush();
				expect($scope.errors.length).toBe(1);
				expect($scope.errors[0].msg).toBe('Error deleting dog: Tina');
				expect($scope.dogs.length).toBe(1);
				expect($scope.dogs[0].breed).toBe('Turning');
			});

			describe('editing dogs', function() {
				it('should allow you to cancel your edit', function() {
					var dog = $scope.dogs[0];
					$scope.editDog(dog);
					expect($scope.dogs[0].name).toBe('Tina');
					$scope.dogs[0].name = 'Bob';
					expect($scope.dogs[0].name).toBe('Bob');
					$scope.cancelEdit(dog);
					expect($scope.dogs[0].name).toBe('Tina');
				});

				it('should save your edit', function() {
					var dog = $scope.dogs[0];
					$scope.editDog(dog);
					$httpBackend.expectPUT(app+'/'+dog._id).respond(200, {msg: 'dog updated'});
					$scope.dogs[0].name = 'Bob';
					expect(dog.old.name).toBe('Tina');
					$scope.saveDogEdit(dog);
					$httpBackend.flush();
					expect(dog.old.name).toBe(undefined);
					expect($scope.errors.length).toBe(0);
				});

				it('should handle errors when trying to save your edit', function() {
					var dog = $scope.dogs[0];
					$scope.editDog(dog);
					$httpBackend.expectPUT(app+'/'+dog._id).respond(500, {msg: 'internal server error'});
					$scope.dogs[0].name = 'Bob';
					$scope.saveDogEdit(dog);
					$httpBackend.flush();
					expect($scope.dogs[0].name).toBe('Tina');
					expect($scope.errors.length).toBe(1);
					expect($scope.errors[0].msg).toBe('Could not save dog: Bob');
				});
			});
		});
	})
});