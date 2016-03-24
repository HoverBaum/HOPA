/**
    A Model within HOPA.

    Models can be registered with this module.
    A model can contain data and behavior that is associated with it.
*/

const HOPAModels = function(){

    let registeredModels = [];

    /**
    *   Creates and registers a new model.
    */
    function createModel(name, properties) {
        let newModel = {
            name,
            values: {},
            properties: [],
            propertyListerners: {}
        };

        newModel.addProperty = function(property, value) {
            addPropertyToModel(property, newModel, value);
        };
        newModel.bindToElement = function(host) {
            bindModelToHost(newModel, host);
        };
        newModel.addPropertyListener = function(property, listener) {
            newModel.propertyListerners[property].push(listener);
        }
        registeredModels.push(newModel);
        for (var property in properties) {
            if (properties.hasOwnProperty(property)) {
                newModel.addProperty(property, properties[property]);
            }
        }
        return newModel.values;
    }

    function addPropertyToModel(property, model, value) {
        let values = model.values;
        model.properties.push(property);
        let listeners = [];
        model.propertyListerners[property] = listeners;
        Object.defineProperty(values, property, {
            set: function (newVal) {
                let oldVal = value;
                value = newVal;
                listeners.forEach(listener => {
                    listener(newVal, oldVal);
                });
            },
            get: function () {
                return value;
            }
        });
    }

    function findAndBindModelToHost(modelName, host) {
        var model = getModelByName(modelName);
        model.bindToElement(host);
    }

    function bindModelToHost(model, host) {
        model.properties.forEach(property => {
            bindProperty(property, model, host);
        });
    }

    /**
     *   Databinds a single property.
     */
    function bindProperty(property, model, parent) {
        let values = model.values;
        let initialValue = model.values[property];
        let propertyName = `${model.name}.${property}`;
        let DOMRepresentations = findDomRepresentations(propertyName, parent);
        let DOMValues = findDomValues(propertyName, parent);

        //DOM Values to Data.
        DOMValues.forEach(value => {
            value.addEventListener('input', function (e) {
                values[property] = value.value;
            });
        });

        //Data change to DOMRepresentation.
        model.addPropertyListener(property, newVal => {
            dataToDOM(DOMRepresentations, 'innerHTML', newVal);
        });

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
     *   Returns an array of all of them.
     */
    function findDomValues(property, root) {
        var valueElements = [];
        var list = root.querySelectorAll(`[hopa-value="${property}"]`);
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

    /**
    *   Returns the model with the given name if it is registered.
    */
    function getModelByName(modelName) {
        let foundModel;
        registeredModels.forEach( model => {
            if(model.name === modelName) {
                foundModel = model;
            }
        });
        return foundModel;
    }

    return {
        add: createModel,
        bindModelToHost: findAndBindModelToHost
    }
}();
