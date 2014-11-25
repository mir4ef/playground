// Miroslav Georgiev
"use strict";

(function (ng, appName)
{
    /*********************************************/
    /*                Application                */
    /*********************************************/
    var app = ng.module(appName, [
        "ngRoute",
        "appControllers",
        "appServices"
    ]);

    app.config(["$routeProvider",
        function ($routeProvider)
        {
            for (var i = menu.links.length; i--; )
            {
                $routeProvider.when(
                        "/" + menu.links[i].id,
                        {
                            templateUrl: "views/" + menu.links[i].pageTemplate + "-view.html",
                            controller: menu.links[i].pageController,
                            dataSourceExtention: menu.links[i].dataFileType
                        }
                );
            }
            $routeProvider.when(
                    "/:pageId/:subpageId",
                    {
                        templateUrl: "views/main-view.html",
                        controller: "SubPageCtrl"
                    }
            );
            $routeProvider.otherwise({redirectTo: "/home"});
        }]);
    /*********************************************/
    /*                Controllers                */
    /*********************************************/
    var appControllers = ng.module("appControllers", []);

    appControllers.controller("AppController", ["$scope", function ($scope)
        {
            $scope.goback = function ()
            {
                window.history.back();
            };
        }]);
    appControllers.controller("NavigationController", ["$scope", "$location", function ($scope, $location)
        {
            $scope.menuItems = menu.links;
            $scope.isActive = function (page)
            {
                return $location.path().indexOf(page) > -1;
            };
        }]);
    appControllers.controller("MainPageCtrl", ["$scope", "$location", "$route", "PageContent", function ($scope, $location, $route, PageContent)
        {
            $scope.page = PageContent.get({pageId: $location.path(), dataFileType: $route.current.dataSourceExtention});
            $scope.currentPage = $location.path();
        }]);
    appControllers.controller("SubPageCtrl", ["$scope", "$http", "$routeParams", "$route", "$compile", "PageContent", function ($scope, $http, $routeParams, $route, $compile, PageContent)
        {
            $route.current.templateUrl = "views/" + $routeParams.pageId + "-view.html";
            $http.get($route.current.templateUrl).then(function (templateview)
            {
                if ($routeParams.pageId === "gallery")
                    $scope.page = PageContent.get({pageId: "/galleries/" + $routeParams.subpageId, dataFileType: ".json"});
                else
                    $scope.page = PageContent.get({pageId: "/" + $routeParams.pageId + "s/" + $routeParams.subpageId, dataFileType: ".json"});
                $("main").html($compile(templateview.data)($scope));
            });
        }]);
    appControllers.controller("GalleryPageCtrl", ["$scope", "$routeParams", function ($scope, $routeParams)
        {
            console.log("gallery ctrl");
            // do more stuff here
        }]);
    appControllers.controller("PortfolioPageCtrl", ["$scope", "$routeParams", function ($scope, $routeParams)
        {
            console.log("portfolio ctrl");
            // do more stuff here
        }]);
    appControllers.controller("ProductPageCtrl", ["$scope", "$routeParams", function ($scope, $routeParams)
        {
            console.log("product ctrl");
            // do more stuff here
        }]);
    /*********************************************/
    /*                 Services                  */
    /*********************************************/
    var appServices = ng.module("appServices", ["ngResource"]);

    appServices.factory("PageContent", ["$resource", function ($resource)
        {
            return $resource("data:pageId-data:dataFileType");
        }]);
})(angular, "app");
/*********************************************/
/*                JavaScript                 */
/*********************************************/
// get and set the current year to fields requiring it like copyright, etc.
var currentYear = new Date().getFullYear(); // get the current year in a YYYY format
var yearFields = document.getElementsByClassName("current-year"); // get all fields that require the year
// loop through all fields and assing the year
for (var i = yearFields.length; i--; )
    yearFields[i].innerHTML = currentYear;