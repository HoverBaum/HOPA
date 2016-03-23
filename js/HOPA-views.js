const HOPAViews = function() {

    let registeredViews = [];

    function createView(name, templateURL) {
            registeredViews.push({
                name,
                templateURL
            });
    }

    function displayView(viewName, parent) {
        var view = getViewByName(viewName);
        HOPAHelper.get(view.templateURL)
            .then(function (template) {
                parent.innerHTML = template;
                resolve();
            })
            .catch(function (error) {
                console.error(error);
            });
    }

    function getViewByName(viewName) {
        console.log(registeredViews);
        console.log(viewName)
        registeredViews.forEach( view => {
            if(view.name === viewName) {
                return view;
            }
        });
    }

    return {
        add: createView,
        display: displayView
    }

}();
