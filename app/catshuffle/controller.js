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
            $scope.currentVideoPlayer = 1;

            $scope.$watch('catsReady',
                function(newValue, oldValue) {
                    if (newValue.state) {
                        $scope.shuffleCatVideo(1);
                    }
                }, true);

            backgroundVideo.addEventListener('loadeddata', function() {
                $scope.$apply(function() {
                    $scope.isLoading = false;
                    if ($scope.currentVideoPlayer == 1) {
                        $scope.currentVideoPlayer == 2;
                    } else {
                        $scope.currentVideoPlayer == 1;
                    }
                });
            }, false);

            /**
             * [shuffleCatVideo description]
             * @return {[type]} [description]
             */
            $scope.shuffleCatVideo = function(videoSourceNumber) {
                $scope.isLoading = true;
                var mp4SourceId = 'mp4Source' + videoSourceNumber.toString();
                var videoSource = document.getElementById(mp4SourceId);
                videoSource.setAttribute("src", catSources.nextCat());
                backgroundVideo.load();
            };
        }
    ]);
})();
