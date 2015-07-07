(function() {
    'use strict';

    angular.module('catshuffle.controllers', [])

    /**
     * Holds responsibility for the loading and displaying of cat
     * videos. Seemless video transitions achieved by switching between
     * 2 seperate video containers, and doing all load actions on the
     * hidden on. Not pretty, but it's experimental HTML5 video on a 
     * single threaded javascript environment.
     * During all loading actions, the CSS of the loading-paw is adjusted
     * to let the user know something is happening, albeit asynchronously.
     */
    .controller('CatsCtrl', ['$scope', '$timeout', 'catSources',
        function($scope, $timeout, catSources) {
            // Grab th 2 video containers so we may attach listeners
            var backgroundVideo1 = document.getElementById('bgvid1');
            var backgroundVideo2 = document.getElementById('bgvid2');

            /**
             * Listeners.
             * Attached to video containers. When they detected a 'loadeddata'
             * event in the video element, they cancel any loading animations
             * and push themselves to the front through updating the current player.
             * N.B. 'loadeddata' technically fires when the first frame is ready 
             *      to go. While this is generally the point where no interruptions
             *      will occur, they may persist with slow connections.
             */
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


            // Video state controllers
            $scope.isLoading = true;
            $scope.currentVideoPlayer = 1;

            // Initialisation code. Once cat sources are pulled
            // from the service we are good to start displaying.
            $scope.catsReady = catSources.catsReady;
            $scope.$watch('catsReady',
                function(newValue, oldValue) {
                    if (newValue.state) {
                        $scope.shuffleCatVideo();
                    }
                }, true);


            /** 
             * Fetches the next cat from the service and figures out
             * which video container to load the new video into.
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
