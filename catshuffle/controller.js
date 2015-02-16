(function() {
    'use strict';

    angular.module('catshuffle.controllers', [])

    .controller('CatsCtrl', ['$scope', '$sce', '$timeout', 'catSources',
        function($scope, $sce, $timeout, catSources) {
            var backgroundVideo = document.getElementById('bgvid');
            var webmSource = document.getElementById('webmSource');
            var mp4Source = document.getElementById('mp4Source');

            $scope.isLoading = true;
            $scope.catsReady = catSources.catsReady;

            $scope.$watch('catsReady',
                function(newValue, oldValue) {
                    if (newValue.state) {
                        $scope.shuffleCatVideo();
                    }
                }, true);

            backgroundVideo.addEventListener('loadeddata', function() {
                $scope.$apply(function() {
                    $scope.isLoading = false;
                });
            }, false);

            /**
             * [shuffleCatVideo description]
             * @return {[type]} [description]
             */
            $scope.shuffleCatVideo = function() {
                $scope.isLoading = true;
                mp4Source.setAttribute("src", catSources.nextCat());
                backgroundVideo.load();
            };
        }
    ]);
})();
