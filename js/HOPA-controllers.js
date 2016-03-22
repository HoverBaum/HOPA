const HOPAControllers = function () {

    var registeredControllers = [];

    /**
     *   Registers a new controller with the given name.
     */
    function registerController(name, controller) {
        if (name === '' || name === undefined || name === null) {
            return new Error('Controller needs to have a name.');
        }
        var newController = {
            name,
            controller
        }
        registeredControllers.push(newController);
    }

    /**
     *   Runs a controller identified by a name if it is registered.
     */
    function runController(name) {
        registeredControllers.forEach(controller => {
            if (controller.name === name) {
                var ctrl = new controller.controller();
                bindDataForController(ctrl);
            }
        });
    }

    /**
     *   Sets up databinding for a given controller that has initialized.
     */
    function bindDataForController(controller) {
        for (var property in controller) {
            if (controller.hasOwnProperty(property)) {
                bindProperty(property, controller);
            }
        }
    }

    /**
     *   Databinds a single property.
     */
    function bindProperty(property, controller) {
        var DOMRepresentations = findDomRepresentations(property);
        var DOMValues = findDomValues(property);
        controller[property];
    }

    /**
     *   Find all elements thats value represents a property.
     * Returns an array of all of them.
     */
    function findDomValues(property) {
        var valueElements = [];
        var list = document.querySelectorAll(`[hopa-value="${property}"]`);
        HOPAHelper.forEach(list, element => {
            valueElements.push(element);
        });
        return valueElements;
    }

    /**
     *   Finds all elements in the DOM that need to output a property.
     *   Recursivly traverses the entire DOM and returns an array.
     */
    function findDomRepresentations(property, root = document.body) {
        var elements = [];

        //Match all innerHTMLs that only contain {{property}} and whitspaces.
        var regex = new RegExp('^\\s*{{\\s*' + property + '\\s*}}\\s*$');
        if (regex.test(root.innerHTML)) {
            elements.push(root);
        }
        HOPAHelper.forEach(root.children, child => {
            elements = elements.concat(findDomRepresentations(property, child));
        });
        return elements;
    }

    return {
        register: registerController,
        runController: runController
    }

}();
