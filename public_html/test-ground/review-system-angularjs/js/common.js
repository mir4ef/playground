// Miroslav Georgiev
"use strict";

(function (ng, appName)
{
/*********************************************/
/*                Application                */
/*********************************************/
var app = ng.module(appName, []);
/*********************************************/
/*                Controllers                */
/*********************************************/
app.controller("PageCtrl", ["$scope", "$http", "$filter", function ($scope, $http, $filter)
    {
        // make a request to get the reviews
        $http.get("data/data.json").success(function (data)
        {
            $scope.reviews = data.reviews;

            $scope.starsObj = {}; // an object to keep track of votes per star
            $scope.starArr = []; // an array to keep the rating system i.e. 5, 10, etc. stars
            // populate the array with the rating system and set the right number of stars to keep track of in the object
            for (var s = data.maxstars; s--; )
            {
                $scope.starArr.push(s + 1);
                $scope.starsObj[s + 1] = 0;
            }

            var len = $scope.reviews.length;
            // var starRating;
            var totalScore = 0;
            $scope.maxVotes = 0; // a number to store the max number of votes for a star to use as a base to manage the star distribution
            $scope.sourceObj = {}; // an object to keep track of the sources and their number of occurence
            // var sourcename;
            
            // loop through the ratings and get the scores and sources
            for (var i = len; i--; )
            {
                var starRating = parseInt($scope.reviews[i].rating);
                totalScore += starRating; // sum all ratings
                $scope.starsObj[starRating]++; // keep count of how many votes each star received
                if ($scope.maxVotes < $scope.starsObj[starRating])
                    $scope.maxVotes = $scope.starsObj[starRating];
                
                // get, set and keep count of the sources
                var sourcename = $scope.reviews[i].sourcename;
                if (!$scope.sourceObj[sourcename])
                    $scope.sourceObj[sourcename] = 1;
                else
                    $scope.sourceObj[sourcename]++;
            }
            $scope.averageRating = totalScore / len;
            if ($scope.averageRating % 1 !== 0)
                $scope.averageRating = $scope.averageRating.toFixed(1); // round the avg score if it is not an integer
            
            $scope.filters = {}; // an object to store the filter requests i.e. # of stars, source, etc.
            var setFilter = function ()
            {
                $scope.reviews = $filter("filter")($scope.reviews, $scope.filters);
            };
            
            $scope.defaultLimit = 3; // a number to define the default items to display
            $scope.limit = $scope.defaultLimit; // set a limit how many reviews to show at a time. Default it to defaultLimit
            $scope.setVisibleItems = function ()
            {
                setFilter();
                $scope.limit = $scope.reviews.length;
            };
            $scope.removeFilter = function (key)
            {
                if (key)
                    delete $scope.filters[key];
                $scope.reviews = data.reviews;
                setFilter();
                if (Object.getOwnPropertyNames($scope.filters).length !== 0)
                    $scope.limit = $scope.reviews.length;
                else
                    $scope.limit = $scope.defaultLimit;
            };
        });
    }]);
/*********************************************/
/*                Directives                 */
/*********************************************/
// directive to fill up the stars based on the rating score
app.directive("filling", ["$timeout", function (timer)
    {
        return {
            restrict: "A",
            link: function (scope, element, attrs)
            {
                var setFiller = function ()
                {
                    attrs.$observe('starClass', function ()
                    {
                        if (scope.starArr)
                        {
                            var currentRate = element[0].getAttribute("data-rating");
                            var maxRate = scope.starArr.length;
                            scope.setWidth = (currentRate / maxRate) * 100;
                            return scope.setWidth;
                        }
                    });
                };
                timer(setFiller, 250); // delay the directive execution to give the controller enough time to render the DOM
            }
        };
    }]);
})(angular, "rating");