const HOPAControllers = function () {

    var registeredControllers = [];
    var currentController = null;

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
                currentController = new controller.controller();
                bindDataForController(currentController);
            }
        });
    }

    /**
     *   Sets up databinding for a given controller that has initialized.
     */
    function bindDataForController(controller) {
        for (var property in controller) {
            if (controller.hasOwnProperty(property)) {
                bindProperty(property, controller, controller[property]);
            }
        }
    }

    /**
     *   Databinds a single property.
     */
    function bindProperty(property, controller, initialValue) {
        var DOMRepresentations = findDomRepresentations(property);
        var DOMValues = findDomValues(property);

        //DOM Values to Data.
        DOMValues.forEach(value => {
            value.addEventListener('input', function (e) {
                controller[property] = value.value;
            });
        });

        //Data change to DOMRepresentation.
        console.log('Setting property for ' + property)
        Object.defineProperty(controller, property, {
            set: function (newVal) {
                console.log(property + '   ' + newVal);
                dataToDOM(DOMRepresentations, 'innerHTML', newVal);
                this.value = newVal;
            },
            get: function () {
                return this.value;
            }
        });

        //Make sure the initial value of this property remains.
        controller[property] = initialValue;

        //Initially set a value to the DOM.
        dataToDOM(DOMRepresentations, 'innerHTML', initialValue);
        dataToDOM(DOMValues, 'value', initialValue);
    }

    function dataToDOM(elements, property, newValue) {
        elements.forEach(element => {
            element[property] = newValue;
        });
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
