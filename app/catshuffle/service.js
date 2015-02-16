(function() {
    'use strict';

    angular.module('catshuffle.services', [])

    .factory('catSources', ['$rootScope', 'giphyDataAccess',
        function($rootScope, giphyDataAccess) {
            /**
             * Load all the cat URLs we'll need and
             * bind them to the root scope for use.
             */
            giphyDataAccess.fetchCatUrls();
            $rootScope.catSources = giphyDataAccess.catSources;
            var catsReady = {
                state: false
            };

            $rootScope.$watch('catSources',
                function(newValue, oldValue) {
                    console.log('puuurrrr');
                    if (newValue !== oldValue) {
                        console.log('meow');
                        catsReady.state = true;
                    }
                }, true);



            function getNextCat() {
                var numberOfCats = $rootScope.catSources.urls.length;
                var currentCat = getRandomInt(0, numberOfCats - 1)
                var url = $rootScope.catSources.urls[currentCat];
                return url;
            };

            /**
             * Returns a random integer between min (inclusive) and max (inclusive)
             * Using Math.round() will give you a non-uniform distribution!
             */
            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            return {
                nextCat: getNextCat,
                catsReady: catsReady
            };
        }
    ])


    .factory('giphyDataAccess', ['$http', '$rootScope',
        function($http, $rootScope) {

            var giphyCatUrl = "http://api.giphy.com/v1/gifs/search?q=cute+cat&api_key=dc6zaTOxFJmzC&limit=100";
            var filteredUrls = {
                'urls': []
            };

            function suchCat() {
                return filteredUrls;
            }

            function fetchCatUrls() {
                $http.get(giphyCatUrl)
                    .success(function(data) {
                        var filteredCats = filterForOriginalMp4(data.data);
                        filteredUrls.urls = filteredCats;
                    })
                    .error(function() {
                        console.log('giphyerror');
                    })
            };

            function filterForOriginalMp4(completeCatData) {
                var filteredCats = completeCatData.map(function(catEntry) {
                    return catEntry.images.original.mp4;
                });

                return filteredCats;
            };


            return {
                fetchCatUrls: fetchCatUrls,
                catSources: filteredUrls,
                getThings: suchCat
            };
        }
    ]);
})();
