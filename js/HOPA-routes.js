/**
 *   HOPA Routes implements nested handling of routes.
 */
const HOPARoutes = function() {

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
        window.addEventListener('hashchange', function(e) {
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
        var parent = document.querySelector('[hopa-view]');
        HOPAViews.switchTo(route.view, parent);
    }

    /**
     * Register a route and what should be displayed in it.
     */
    function registerRoute(path, viewName) {
        var newRoute = {
            path: path,
            view: viewName
        }
        registeredRoutes.push(newRoute);
    }

    return {
        register: registerRoute,
        init: initRoutes
    }

}();
