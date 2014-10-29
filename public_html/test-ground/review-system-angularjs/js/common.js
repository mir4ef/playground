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
            // populate the array with the rating system
            for (var l = data.maxstars; l--;)
                $scope.starArr.push(l+1);
            // loop through the array to set the right number of stars to keep track of
            angular.forEach($scope.starArr, function (star)
            {
                if (!$scope.starsObj[star])
                    $scope.starsObj[star] = 0;
            });
            
            var len = $scope.reviews.length;
            var starRating;
            var totalScore = 0;
            $scope.maxVotes = 0; // number to store the max number of votes for a star to use as a base to manage the star distribution
            // loop through the ratings and get the scores
            angular.forEach($scope.reviews, function (review)
            {
                starRating = parseInt(review.rating);
                totalScore += starRating; // sum all ratings
                $scope.starsObj[starRating]++; // keep count of how many votes each star received
                if ($scope.maxVotes < $scope.starsObj[starRating])
                    $scope.maxVotes = $scope.starsObj[starRating];
            });
            $scope.averageRating = totalScore / len;
            if ($scope.averageRating % 1 !== 0)
                $scope.averageRating = $scope.averageRating.toFixed(1); // round the avg score if it is not an integer
        });
    }]);
/*********************************************/
/*                Directives                 */
/*********************************************/
// directive to fill up the stars based on the rating score
app.directive("filling", ["$timeout", function (timer) {
    return {
        restrict: "A",
        link: function (scope, element, attrs)
        {
            var setFiller = function()
            {
                attrs.$observe('starClass', function ()
                {
                    var currentRate = element[0].getAttribute("data-rating");
                    var maxRate = scope.starArr.length;
                    scope.setWidth = (currentRate / maxRate) * 100;
                    return scope.setWidth;
                });
            };
            timer(setFiller, 200); // delay the directive execution to give the controller enough time to render the DOM
        }
    };
}]);