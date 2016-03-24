const HOPAViews = function() {

    //All views that are currently registered.
    let registeredViews = [];

    //All currently running views.
    let runningViews = [];

    /**
    *   Creates and registeres a new view.
    */
    function createView(name, templateURL, controlls) {
        registeredViews.push({
            name,
            templateURL,
            controlls
        });
    }

    function switchViewTo(viewName, parent) {
        
    }

    /**
    *   Displays a view, starts it's lifecycle.
    */
    function displayView(viewName, parent) {
        let registeredView = getViewByName(viewName);
        let view = copyViewForRunning(registeredView);
        if(parent.getAttribute('hopa-viewID')) {
            destroyView(parent.getAttribute('hopa-viewID'));
        }
        HOPAHelper.get(view.templateURL)
            .then(function (template) {
                parent.innerHTML = template;
                startControlls(view);
                runningViews.push(view);
                parent.setAttribute('hopa-viewID', view.id);
                parseTemplateParent(parent, view);
            })
            .catch(function (error) {
                console.error(error);
            });
    }

    /**
    *   Copies a registered view to run a different object with unique id per running view.
    */
    function copyViewForRunning(view) {
        return {
            name: view.name,
            templateURL: view.templateURL,
            controlls: view.controlls,
            id: view.name + Date.now()
        }
    }

    function startControlls(view) {
        if(view.controlls) {
            view.destroy = view.controlls();
        }
    }

    /**
    *   After a template is inserted parse it's parent for databinding and child views.
    */
    function parseTemplateParent(parent, view) {
        HOPAHelper.forEach(parent.querySelectorAll('[hopa-model]'), modelElm => {
            HOPAModels.bindModelToHost(modelElm.getAttribute('hopa-model'), modelElm, view.id);
        });
        HOPAHelper.forEach(parent.querySelectorAll('[hopa-view]'), viewElm => {
            displayView(viewElm.getAttribute('hopa-view'), viewElm);
        });
        HOPAHelper.forEach(parent.querySelectorAll('[hopa-click]'), clickElm => {
            clickElm.addEventListener('click', function() {
                eval('view.' + clickElm.getAttribute('hopa-click'));
            });
        });
    }

    /**
    *   Destroys views, deregisters all listeners and databindings.
    */
    function destroyView(viewID) {
        let parent = document.querySelector(`[hopa-viewID="${viewID}"]`);
        HOPAHelper.forEach(parent.querySelectorAll('hopa-view'), viewParent => {
            destroyView(viewParent.getAttribute('hopa-viewID'));
        });
        HOPAHelper.forEach(parent.querySelectorAll('[hopa-model]'), modelElm => {
            HOPAModels.debindModelFromHost(modelElm.getAttribute('hopa-model'), modelElm);
        });
        let view = getRunningViewById(parent.getAttribute('hopa-viewID'));
        let index = runningViews.indexOf(view);
        if(view.destroy) {
            view.destroy();
        }
        parent.innerHTML = '';
        runningViews.splice(index, 1);
    }

    /**
    *   Returns a view by name if registered.
    */
    function getViewByName(viewName) {
        let foundView;
        registeredViews.forEach( view => {
            if(view.name === viewName) {
                foundView = view;
            }
        });
        return foundView;
    }

    function getRunningViewById(viewID) {
        let foundView;
        runningViews.forEach(view => {
            if(view.id === viewID) {
                foundView = view;
            }
        });
        return foundView;
    }

    return {
        add: createView,
        display: displayView
    }

}();
