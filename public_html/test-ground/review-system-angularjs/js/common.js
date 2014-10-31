// Miroslav Georgiev
"use strict";

/*********************************************/
/*                Application                */
/*********************************************/
var app = angular.module("rating", []);
/*********************************************/
/*                Controllers                */
/*********************************************/
app.controller("PageCtrl", ["$scope", "$http", function ($scope, $http)
    {
        // make a request to get the reviews
        $http.get("data/data.json").success(function (data)
        {
            $scope.reviews = data.reviews;

            $scope.starsObj = {}; // object to keep track of votes per star
            $scope.starArr = []; // array to keep the rating system i.e. 5, 10, etc. stars
            // populate the array with the rating system and set the right number of stars to keep track of in the object
            for (var s = data.maxstars; s--; )
            {
                $scope.starArr.push(s + 1);
                $scope.starsObj[s + 1] = 0;
            }

            $scope.len = $scope.reviews.length;
            var starRating;
            var totalScore = 0;
            $scope.maxVotes = 0; // number to store the max number of votes for a star to use as a base to manage the star distribution
            $scope.sourceObj = {}; // object to keep track of the sources and their number of occurence
            var sourcename;
            
            // loop through the ratings and get the scores and sources
            for (var i = $scope.len; i--; )
            {
                starRating = parseInt($scope.reviews[i].rating);
                totalScore += starRating; // sum all ratings
                $scope.starsObj[starRating]++; // keep count of how many votes each star received
                if ($scope.maxVotes < $scope.starsObj[starRating])
                    $scope.maxVotes = $scope.starsObj[starRating];
                
                // get, set and keep count of the sources
                sourcename = $scope.reviews[i].sourcename;
                if (!$scope.sourceObj[sourcename])
                {
                    $scope.sourceObj[sourcename] = 1;
                }
                else
                    $scope.sourceObj[sourcename]++;
            }
            $scope.averageRating = totalScore / $scope.len;
            if ($scope.averageRating % 1 !== 0)
                $scope.averageRating = $scope.averageRating.toFixed(1); // round the avg score if it is not an integer
            
            $scope.filters = {};
            
            $scope.limit = 3;
            $scope.setVisibleItems = function (num)
            {
                $scope.limit = num;
            }
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
                        var currentRate = element[0].getAttribute("data-rating");
                        var maxRate = scope.starArr.length;
                        scope.setWidth = (currentRate / maxRate) * 100;
                        return scope.setWidth;
                    });
                };
                timer(setFiller, 250); // delay the directive execution to give the controller enough time to render the DOM
            }
        };
    }]);