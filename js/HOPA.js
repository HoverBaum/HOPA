/**

    HOPA - Hover One Page Application

    A simple framework for single page aplications.

*/
const HOPA = function() {

    let registeredModules = [];

    /**
     *   This will do the initialization of HOPA.
     *   Should therefor be called on page load.
     */
    function initHOPA() {

    }

    function createAndRegisterModule(name, dependencies) {
        var newModule = createNewModule(name);
        dependencies.forEach(dependency => {
            newModule.dependencies.push({
                name: dependency,
                loaded: false
            });
        });
    }

    function createNewModule(name) {
        let newModule = {
            name: name,
            dependencies: createDependenciesCache(),
            configFunctions: []
        };
        let models = HOPAModels();
        newModule.model = models.add;
        let views = HOPAViews();
        newModule.view = views.add;
        newModule.config = function(dependencies, configFunction) {
            addConfigFunctionToModule(newModule, dependencies, configFunction);
        }
        return newModule;
    }

    function addConfigFunctionToModule(module, dependencies, configFunction) {

    }

    function createDependenciesCache() {
        let cache = [];

        //Add dependencies but only those that are new.
        cache.add = addDependencyToChace;
    }

    function addDependencyToChace(cache, newDependency) {
        let isNew = true;
        cache.forEach(entry => {
            if(entry.name === newDependency) {
                isNew = false;
            }
        });
        if(isNew) {
            cache.push({
                name: newDependency,
                loaded: false
            });
        }
    }

    return {
        module: createAndRegisterModule
    }

}();
