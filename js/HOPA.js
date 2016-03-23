/**

    HOPA - Hover One Page Application
    
    A simple framework for single page aplications.

*/
const HOPA = function () {

    /**
     *   This will do the initialization of HOPA.
     *   Should therefor be called on page load.
     */
    function initHOPA() {

        HOPARoutes.init();

    }

    /**
     *   Register a controller and identify it by a name.
     */
    function registerController(name, controller) {
        HOPAControllers.register(name, controller);
    }

    return {
        controller: registerController,
        route: HOPARoutes.register,
        init: initHOPA
    }

}();

//TODO calculations with databound variables.
//TODO unload controllers
//TODO scopeing