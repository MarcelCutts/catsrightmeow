(function() {
    'use strict';

    angular.module('catshuffle.controllers', [])

    .controller('CatsCtrl', ['$scope', '$sce', '$timeout', 'catSources',
        function($scope, $sce, $timeout, catSources) {
            var backgroundVideo1 = document.getElementById('bgvid1');
            var backgroundVideo2 = document.getElementById('bgvid2');

            $scope.isLoading = true;
            $scope.catsReady = catSources.catsReady;
            $scope.currentVideoPlayer = 1;
            $scope.$watch('catsReady',
                function(newValue, oldValue) {
                    if (newValue.state) {
                        $scope.shuffleCatVideo();
                    }
                }, true);

            backgroundVideo1.addEventListener('loadeddata', function() {
                $scope.$apply(function() {
                    $scope.isLoading = false;
                    $scope.currentPlayer = 1;
                });
            }, false);

            backgroundVideo2.addEventListener('loadeddata', function() {
                $scope.$apply(function() {
                    $scope.isLoading = false;
                    $scope.currentPlayer = 2;
                });
            }, false);

            /**
             * [shuffleCatVideo description]
             * @return {[type]} [description]
             */
            $scope.shuffleCatVideo = function() {
                $scope.isLoading = true;
                var targetPlayerNumber = ($scope.currentPlayer == 1) ? 2 : 1;
                var mp4SourceId = 'mp4Source' + targetPlayerNumber.toString();
                var videoSourceId = 'bgvid' + targetPlayerNumber.toString();
                
                var mp4Source = document.getElementById(mp4SourceId);
                var videoSource = document.getElementById(videoSourceId);

                mp4Source.setAttribute("src", catSources.nextCat());
                videoSource.load();
            };
        }
    ]);
})();
