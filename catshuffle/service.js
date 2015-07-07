(function() {
    'use strict';

    angular.module('catshuffle.services', [])

    /**
     * Encapsulates fetching of cats. Speaks to a data layer and
     * lets all other services/controllers know when cat data endpoints
     * are available, and can serve the next one like a crude generator.
     */
    .factory('catSources', ['$rootScope', 'giphyDataAccess',
        function($rootScope, giphyDataAccess) {

        	// On app start, fetch a group of cat media endpoints
            giphyDataAccess.fetchCatUrls();
            $rootScope.catSources = giphyDataAccess.catSources;
            var catsReady = {
                state: false
            };

            // Watch the data access service for cat media endpoints,
            // once some exist, declare the application as 'catready'
            $rootScope.$watch('catSources',
                function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        catsReady.state = true;
                    }
                }, true);

            // Fetches the next cat for the consuming entity by
            // looking through all the cat sources and assigning one
            // at random.
            function getNextCat() {
                var numberOfCats = $rootScope.catSources.urls.length;
                var currentCat = getRandomInt(0, numberOfCats - 1);
                var url = $rootScope.catSources.urls[currentCat];
                return url;
            }

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

	/**
	 * Gathers and filters data from a video source, which currently is GIPHY.
     * A pre builter parameterised URL is used to find 100 cat videos. The Urls
     * for the MP4 versins are then extraction via a simple map.
	 */
    .factory('giphyDataAccess', ['$http', '$rootScope',
        function($http, $rootScope) {

        	// Pre built URL for finding 'cute cats' of quantity 100
            var giphyCatUrl = "//api.giphy.com/v1/gifs/search?q=cute+cat&api_key=dc6zaTOxFJmzC&limit=100";
            
            // Container for our MP4 urls
            var filteredUrls = {
                'urls': []
            };

            // Fetches Giphy data and filters it, before assigning to container
            function fetchCatUrls() {
                $http.get(giphyCatUrl)
                    .success(function(data) {
                        var filteredCats = filterForOriginalMp4(data.data);
                        filteredUrls.urls = filteredCats;
                    })
                    .error(function() {
                        console.log('giphyerror');
                    })
            }

            // Map function that can traveral a list and extra an MP4 file
            // Note: Note generic, built against the GIPHY data structure.
            function filterForOriginalMp4(completeCatData) {
                var filteredCats = completeCatData.map(function(catEntry) {
                    return catEntry.images.original.mp4;
                });

                return filteredCats;
            }


            return {
                fetchCatUrls: fetchCatUrls,
                catSources: filteredUrls
            };
        }
    ]);
})();
