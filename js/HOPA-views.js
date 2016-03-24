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

    /**
    *   Switch the view displayed in a parent to the specified one.
    *   Will first destroy ant possibly running views and then start the new one.
    */
    function switchViewTo(viewName, parent) {
        if(parent.getAttribute('hopa-viewID')) {
            destroyView(parent.getAttribute('hopa-viewID'));
        }
        displayAndParseView(viewName, parent);
    }

    /**
    *   Displays a view and then parses its template for databindings and subviews.
    */
    function displayAndParseView(viewName, parent) {
        let view = getViewForRunning(viewName);
        parent.setAttribute('hopa-viewID', view.id);
        displazTemplateIn(view.templateURL, parent, function() {
            startControlls(view);
            runningViews.push(view);
            parseTemplateParent(parent, view);
        });
    }

    /**
    *   Displays a view, starts it's lifecycle.
    */
    function displazTemplateIn(templateURL, parent, callback) {
        HOPAHelper.get(templateURL)
            .then(function (template) {
                parent.innerHTML = template;
                callback();
            })
            .catch(function (error) {
                console.error(error);
            });
    }

    /**
    *   Copies a registered view to run a different object with unique id per running view.
    */
    function getViewForRunning(viewName) {
        let view = getViewByName(viewName);
        return {
            name: view.name,
            templateURL: view.templateURL,
            controlls: view.controlls,
            id: view.name + Date.now()
        }
    }

    /**
    *   Starts controlls for a view if the view has any.
    */
    function startControlls(view) {
        if(view.controlls) {
            view.controlls();
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
            displayAndParseView(viewElm.getAttribute('hopa-view'), viewElm);
        });
        HOPAHelper.forEach(parent.querySelectorAll('[hopa-click]'), clickElm => {
            clickElm.addEventListener('click', function() {
                eval('view.' + clickElm.getAttribute('hopa-click'));
            });
        });
    }

    /**
    *   Destroys views, deregisters all listeners and databindings and removes template from DOM.
    */
    function destroyView(viewID) {
        let parent = document.querySelector(`[hopa-viewID="${viewID}"]`);
        HOPAHelper.forEach(parent.querySelectorAll('hopa-view'), viewParent => {
            destroyView(viewParent.getAttribute('hopa-viewID'));
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
        switchTo: switchViewTo
    }

}();
