/**

    HOPA - Hover One Page Application

    A simple framework for single page aplications.

*/
const HOPA = function() {

    /**
     *   This will do the initialization of HOPA.
     *   Should therefor be called on page load.
     */
    function initHOPA() {

        HOPARoutes.init();

    }

    /**
     *   Add a new model.
     */
    function addModel(name, properties) {
        return HOPAModels.add(name, properties);
    }

    /**
     *   Register a view.
     */
    function registerView(name, templateURL, controlls) {
        HOPAViews.add(name, templateURL, controlls)
    }

    /**
     *   Register a controller and identify it by a name.
     */
    function registerController(name, controller) {
        HOPAControllers.register(name, controller);
    }

    return {
        route: HOPARoutes.register,
        init: initHOPA,
        model: addModel,
        view: registerView
    }

}();
