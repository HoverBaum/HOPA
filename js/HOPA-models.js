/**
    A Model within HOPA.

    Models can be registered with this module.
    A model can contain data and behavior that is associated with it.
*/

const HOPAModels = function(){

    let registeredModels = [];

    function createModel(name, properties) {
        let newModel = {
            name,
            values: {}
        };
        registeredModels.push(newModel);
        newModel.addProperty = function(property, value) {
            addPropertyToModel(property, newModel.values, value);
        }
        for (var property in properties) {
            if (properties.hasOwnProperty(property)) {
                newModel.addProperty(property, properties[property]);
            }
        }
        return newModel;
    }

    function addPropertyToModel(property, model, value) {
        let listener = [];
        Object.defineProperty(model, property, {
            set: function (newVal) {
                value = newVal;
            },
            get: function () {
                return value;
            }
        });
    }

    return {
        add: createModel
    }
}();
