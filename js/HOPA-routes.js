/**
 *   HOPA Routes implements nested handling of routes.
 */
const HOPARoutes = function () {

    //All routes that are registered with this handler.
    var registeredRoutes = [];

    /**
     *   A function to be called upon initialization to display the first view and register handlers.
     */
    function initRoutes() {
        var currentPath = window.location.hash.substring(1);
        handleRouteChange(currentPath);
        registerHashlistener();
    }

    /**
     *   Registers a listener for the change of hashvalues.
     */
    function registerHashlistener() {
        window.addEventListener('hashchange', function (e) {
            var oldURL = e.oldURL;
            var newURL = e.newURL;

            //The new path will be everything behind the first # in URL.
            var newPath = newURL.split(/#(.+)?/)[1];

            handleRouteChange(newPath, oldURL, newURL);
            e.preventDefault();
        });
    }

    /**
     *   Handle route changes
     */
    function handleRouteChange(newPath, oldURL, newURL) {
        registeredRoutes.forEach(route => {
            if (route.path === newPath) {
                switchToRoute(route);
            }
        });
    }

    /**
     *   Render and initialize a route.
     */
    function switchToRoute(route) {
        renderRoute(route).then(function () {
            HOPAControllers.runController(route.controller);
        });
    }

    /**
     *   Renders a route by displaying the associated element.
     */
    function renderRoute(route) {
        return new Promise((resolve, reject) => {
            HOPAHelper.get(route.templateUrl)
                .then(function (template) {
                    var parent = document.querySelector('[hopa-view]');
                    parent.innerHTML = template;
                    resolve();
                })
                .catch(function (error) {
                    console.error(error);
                });
        });
    }

    /**
     * Register a route and what should be displayed in it.
     */
    function registerRoute(path, opts) {
        var newRoute = {
            path: path,
            templateUrl: opts.templateUrl,
            controller: opts.controller
        }
        registeredRoutes.push(newRoute);
    }

    return {
        register: registerRoute,
        init: initRoutes
    }

}();
