

angular.module('MyMapquest', []).controller(
		'mapquestController',
		function($scope, $http, $timeout) {
			var timeout = null;

			$scope.initialize = function() {
				$scope.mapsearch = {};
				$scope.directions = new Array;
				if (navigator.geolocation) {
				$scope.mapsearch.from = '<please wait...>';
				$scope.mapsearch.to = 'Cambridge, MA';
				$scope.getLocation();
				} else {
					$scope.mapsearch.from = 'Boston, MA';
					$scope.mapsearch.to = 'Cambridge, MA';
				}
			};

					
			$scope.onChange = function() {
				var from = $scope.mapsearch.from;
				var to = $scope.mapsearch.to;
				if ((from == "") || (to == "")) {
					return;
				}
				$scope.getDirections(from, to, function($scope) {
					
					return function(directions) {
						$scope.directions = directions;
					};
				}($scope));
			};

			$scope.getLocation = function() {
				navigator.geolocation.getCurrentPosition(function(position) {
					var latitude = position.coords.latitude;
					var longitude = position.coords.longitude;
					$scope.mapsearch.from = latitude + ',' + longitude;
					$scope.onChange();
				}, function(error) {
					$scope.mapsearch.from = 'Boston, MA';
					$scope.onChange();
					console.log('Error');
				}, {
					enableHighAccuracy : true,
					timeout : 5000,
					maximumAge : 0
				});
			};

			
			$scope.getDirections = function(from, to, callback) {
				var apikey = 'Fmjtd|luu821u7nd%2Caa%3Do5-942whf';
				var url = 'http://open.mapquestapi.com/directions/v2/route?key=Fmjtd|luu821u7nd%2Caa%3Do5-942whf' + '&from='
						+ encodeURIComponent(from) + '&to=' + encodeURIComponent(to);

			$http.get(url)
			 .success(
						function(data, status, headers, config) {
							try {
								console.log(data);
								var directions = new Array;
								var counter = 0;
								directions.Distance = data.route.distance;
								directions.Time = data.route.formattedTime;
								var maneuvers = data.route.legs[0].maneuvers;

								angular.forEach(maneuvers, function(maneuver) {
									var direction = {
										image : maneuver.iconUrl,
										step: counter++,
										link : maneuver.mapUrl,
										text : maneuver.narrative,
										distance : maneuver.distance
									};
									directions.push(direction);
								});
							
								callback(directions);
							} catch (error) {
								alert('Unable to access');
							}
						}).error(function(data, status, headers, config) {
					alert('Unable to access');
				});
			};
		});