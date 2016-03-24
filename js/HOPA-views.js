const HOPAViews = function() {

    let registeredViews = [];

    function createView(name, templateURL) {
            registeredViews.push({
                name,
                templateURL
            });
    }

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
