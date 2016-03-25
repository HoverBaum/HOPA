/**

    HOPA - Hover One Page Application

    A simple framework for single page aplications.

*/
const HOPA = function() {

    const Models = HOPAModels();
    const Views = HOPAViews();

    let moduleCache = Object.create(null);
    let waitingOnDependency = [];

    function addModule(name, dependencies) {
        let module = createNewModule(name, dependencies);
        module.loadDependencies(dependencies).then(function() {
            module.dependenciesLoaded();
        });
        storeModule(name, module);
    }

    function createNewModule(name) {
        let newModule = {
            name: name,
            exports: null,
            configFunctions: [],
            exportFunction: null
        }
        newModule.dependcies = createDependencyManager()
        newModule.loadDependencies = function(dependencies) {
            return loadDependenciesForModule(dependencies, module);
        }
        newModule.config = function(dependencies, configFunction) {
            newModule.configFunctions.push({dependencies, configFunction});
        }
        newModule.dependenciesLoaded = function() {
            startModule(newModule);
        }
        newModule.export = function(dependcies, exportFunction) {
            newModule.exportFunction = {dependcies, exportFunction};
        }
        newModule.view = Views.add;
        newModule.model = Models.add;
        return newModule;
    }

    function startModule(module) {

        //Run config functions.
        module.configFunctions.forEach(config => {
            let dependencies = [];
            config.dependencies.forEach(dependency => {
                dependcies.push(moduleCache[dependency].exports);
            });
            config.configFunction(...dependcies);
        });

        //Run export function.
        let dependencies = [];
        module.exportFunction.dependencies.forEach(dependency => {
            dependcies.push(moduleCache[dependency].exports);
        });
        module.exports = module.exportFunction(...dependcies);
    }


    function loadDependenciesForModule(dependencies, module) {
        return new Promise((resolve, reject) => {
            dependencies.forEach(dependency => {
                module.dependencies.add(dependency, checkDependencies);
            });

            function checkDependencies() {
                let allLoaded = dependencies.every(function(elm) {
                    module.dependcies.hasLoaded(elm);
                });
                if(allLoaded) {
                    resolve();
                }
            }
            checkDependencies();
        });
    }

    function executeCallbacks(callbacks, argument) {
        callbacks.forEach(callback => {
            callback(argument);
        });
    }

    function createDependencyManager() {
        let manager = {
            dependencies: []
        };

        manager.add = function(name, callback) {
            if(manager.get(name) === null) {
                let dependency = {
                    name: name,
                    hasLoaded: false,
                    onLoad: [callback]
                };
                manager.dependcies.push(dependency);
                if(name in moduleCache) {
                    dependency.hasLoaded = true;
                    executeCallbacks(dependency.onLoad, moduleCache[name]);
                    storeModule(name);
                } else {
                    waitingOnDependency.push(dependency);
                }
            }
        }

        //Check if this manager has a dependency.
        manager.contains = function(name) {
            let contains = (manager.get(name) !== null) ? true : false
            return contains;
        }

        //Get a dependency by it's name.
        manager.get = function(name) {
            let found = null;
            manager.dependcies.forEach(dependency => {
                if(dependency.name === name) {
                    found = dependency;
                }
            });
            return found;
        }

        //Check if a given dependency has finished loading.
        manager.hasLoaded = function(name) {
            let dependency = manager.get(name);
            if(dependency === null) {
                return false;
            } else {
                return dependency.hasLoaded;
            }
        }

        return manager;
    }

    function addRunFunctionToModule(dependencies, runFunction, newModule) {
        //check if dependencies loaded
        //store the run function to be run when all dependencies are loaded
    }

    function storeModule(name, module) {
        moduleCache[name] = module;
        waitingOnDependency.forEach(waiting => {
            if(waiting.name === name) {
                waiting.hasLoaded = true;
                executeCallbacks(waiting.onLoad, module);
            }
        });
    }

    function createAndRegisterModule(name, dependencies) {
        var newModule = getOrCreateModule(name);
        moduleCache[name] = {
            name,
            newModule
        };
        return newModule;
    }

    function getOrCreateModule(name) {
        if (name in moduleCache) {
            return moduleCache[name];
        } else {
            let module = createNewModule(name);
            moduleCache[name] = module;
            return module;
        }
    }

    return {
        module: createAndRegisterModule
    }

}();
