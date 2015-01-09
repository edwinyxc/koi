function _angularCompile(dom, $scope) {
    console.log($scope);
    var injector = angular.element($('[ng-app]')[0]).injector();
    var $compile = injector.get('$compile');
    var $rootScope = injector.get('$rootScope');
    return $compile(dom)($scope || $rootScope);
}
var app = angular.module('app', []);
app.controller('main', function ($scope) {

    var $editor = $('#' + Designer.config.canvasId);

    var editor = $scope.editor = new ProcessFlowEditor($editor);

    $scope.Designer = Designer.init($scope);

    $scope.g_title = 'KOI EDITOR (BETA)';

    $scope.current = null;

    //activity input param
    $scope.param = {};
    //global input property
    $scope.prop = {};

    $scope.prop = function () {
        $scope.editor.prop($scope.prop.key, $scope.prop.val);
    };

    $scope.typeForDisplay = function () {
        if ($scope.currentIsActivity()) {
            return 'activity';
        } else if ($scope.currentIsSynchronizer()) {
            return 'synchronizer';
        } else {
            return 'none';
        }
    };

    $scope.currentIsActivity = function () {
        return $scope.type == 'a';
    };
    $scope.currentIsSynchronizer = function () {
        return $scope.type == 's';
    };

    $scope.param = function () {
        $scope.current.act_params[$scope.param.key] = $scope.param.val;
    };
});

