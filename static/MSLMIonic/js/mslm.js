/**
 * Created by bjwsl-001 on 2016/11/14.
 */

var app = angular.module('mslm',['ionic']);

app.config(function ($stateProvider,$urlRouterProvider) {

  $urlRouterProvider.otherwise('/start');

  $stateProvider
    .state('start',{
      url:'/start',
      templateUrl:'tpl/start.html'
    })
    .state('main',{
      url:'/main',
      templateUrl:'tpl/main.html',
      controller:'mainCtrl'
    })
    .state('detail',{
      url:'/detail/:id',
      templateUrl:'tpl/detail.html',
      controller:'detailCtrl'
    })
    .state('order',{
      url:'/order/:id',
      templateUrl:'tpl/order.html',
      controller:'orderCtrl'
    })
    .state('myOrder',{
      url:'/myOrder',
      templateUrl:'tpl/myOrder.html',
      controller:'myOrderCtrl'
    })

});

app.controller('parentCtrl',
  ['$scope','$state',
    function ($scope,$state) {
      $scope.jump = function (stateName,arg) {
        $state.go(stateName,arg);
      }
    }]);

app.controller('mainCtrl',
  ['$scope','$http',
    function($scope,$http){
      $scope.hasMore = true;
      $scope.inputTxt = {kw:''};

      $scope.$watch('inputTxt.kw', function () {
        console.log($scope.inputTxt.kw);
        if($scope.inputTxt.kw)
        {
          $http
            .get('data/dish_getbykw.php?kw='+$scope.inputTxt.kw)
            .success(function (data) {
              $scope.dishList = data;
            })
        }

      })

      $http
        .get('data/dish_getbypage.php?start=0')
        .success(function (data) {
          $scope.dishList = data;
          console.log(data);
        })
      $scope.loadMore = function () {
        $http
          .get('data/dish_getbypage.php?start='+$scope.dishList.length)
          .success(function (data) {
            if(data.length <5)
            {
              $scope.hasMore = false;
            }
            $scope.dishList = $scope.dishList.concat(data);

            $scope.$broadcast('scroll.infiniteScrollComplete');
          })
      }

    }]);

app.controller('detailCtrl',[
  '$scope','$http','$stateParams',
  function ($scope,$http,$stateParams) {
    console.log($stateParams.id);

    $http
      .get('data/dish_getbyid.php?id='
        +$stateParams.id)
      .success(function (data) {
        console.log(data);
        $scope.dish = data[0];
      })

  }
]);

app.controller('orderCtrl',
  ['$scope','$http','$stateParams','$rootScope','$httpParamSerializerJQLike',
    function ($scope,$http, $stateParams,
              $rootScope,
              $httpParamSerializerJQLike) {
      console.log($stateParams.id);

      $scope.order = {did:$stateParams.id};

      $scope.submitOrder = function () {
        //console.log($scope.order);
        var str = $httpParamSerializerJQLike($scope.order);
        $http
          .get('data/order_add.php?'+str)
          .success(function (data) {
            console.log(data);
            if(data[0].msg == 'succ')
            {
              $rootScope.phone = $scope.order.phone;
              $scope.succMsg =
                '下单成功，订单编号为：'+data[0].oid;
            }
            else
            {
              $scope.errMsg = '下单失败!';
            }
          })
      }
      
    }])

app.controller('myOrderCtrl',
  ['$scope','$rootScope','$http',
    function ($scope,$rootScope,$http) {

      $http
        .get('data/order_getbyphone.php?phone='+$rootScope.phone)
        .success(function(data){
          console.log(data);
          $scope.orderList = data;
        })

  }])








