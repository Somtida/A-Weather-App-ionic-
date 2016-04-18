/*angular.module('app.controllers',[])
.controller('AppCtrl', function($scope, $log){
    $log.info('AppCtrl Created');
    //$scope.settings = Settings;
})
.controller('WeatherCtrl', function($scope,$log){
    $log.info('WeatherCtrl Created');
 */
    
angular.module('app.controllers',['app.services'])
.controller('AppCtrl', function($scope, $log, Settings){
    $log.info('AppCtrl Created');
    $scope.settings = Settings;
})
.controller('WeatherCtrl', function($scope,$log, $ionicPlatform, $ionicLoading, $cordovaGeolocation,Location, Weather, Settings){
    $log.info('WeatherCtrl Created');
    
    $ionicPlatform.ready(function(){
        if (Location.lat == 0){
            var posOptions = { frequency: 1000, timeout: 30000, enableHighAccuracy: false};
            $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position){
                Location.lat = position.coords.latitude;
                Location.long = position.coords.longitude;
                console.log(Location.lat);
                console.log(Location.long);
                getWeather();
            }, function (err){
                //error
            });
        }
    });
    
    
    $scope.haveData = false;
    $ionicLoading.show({
        template : 'Loading...'
    });
    
    function getWeather() {
        $scope.haveData = false;
        $ionicLoading.show({
        template : 'Loading...'
        });
        
        //Weather.getWeatherAtLocation(37.66, -122.45).then(function (resp) {
        Weather.getWeatherAtLocation(Location.lat, Location.long).then(function (resp) {
            $log.info(resp);
            $scope.current = resp.data.currently;
            $scope.highTemp = Math.ceil(resp.data.daily.data[0].temperatureMax);
            $scope.lowTemp = Math.floor(resp.data.daily.data[0].temperatureMin);
            $scope.currentTemp = Math.ceil($scope.current.temperature);
            $scope.dailySum = resp.data.daily;
            $scope.latit = resp.data.latitude.toFixed(2);
            $scope.longit = resp.data.longitude.toFixed(2);
            $scope.haveData = true;
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');

        }, function (error) {
            alert('Unable to get current conditions');
            $log.error(error);
        });

    }
    getWeather();
    
    $scope.doRefresh = function(){
        getWeather();
    }
    
    $scope.$watch(function(){
        return Settings.units
    }, function(newVal, oldVal){
        if (newVal !== oldVal){
            getWeather();
        }
    });
    
});