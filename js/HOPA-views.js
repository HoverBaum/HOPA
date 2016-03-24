const HOPAViews = function() {

    //All views that are currently registered.
    let registeredViews = [];

    /**
    *   Creates and registeres a new view.
    */
    function createView(name, templateURL) {
            registeredViews.push({
                name,
                templateURL
            });
    }

    /**
    *   Displays a view, starts it's lifecycle.
    */
    function displayView(viewName, parent) {
        let view = getViewByName(viewName);
        HOPAHelper.get(view.templateURL)
            .then(function (template) {
                parent.innerHTML = template;
                parseTemplateParent(parent);
            })
            .catch(function (error) {
                console.error(error);
            });
    }

    /**
    *   After a template is inserted parse it's parent for databinding and child views.
    */
    function parseTemplateParent(parent) {
        HOPAHelper.forEach(parent.querySelectorAll('[hopa-model]'), modelElm => {
            HOPAModels.bindModelToHost(modelElm.getAttribute('hopa-model'), modelElm);
        });
        HOPAHelper.forEach(parent.querySelectorAll('[hopa-view]'), viewElm => {
            displayView(viewElm.getAttribute('hopa-view'), viewElm);
        });
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

    return {
        add: createView,
        display: displayView
    }

}();
