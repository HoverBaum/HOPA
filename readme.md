# Notes and documentation for HOPA

## How To

### Register Controllers
Controllers need to be registered with HOPA before they can be used for routes.
```javascript
HOPA.controller('ControllerName', function() {
    //Code goes here

    this.property = 'This can use databinding';
});
```

### Setup routes
To create a route at `/#/pathName` that uses a controller named `controllerName`.
```javascript
HOPA.route('/pathName', {
    controller: 'controllerName',
    templateUrl: 'path/to/template.html'
});
```

## Definition

Model
A representation of Data

View
A representation of data
When a view gets loaded references to data in it's template gets parsed

templates
HTML representation of a view

Events
Are how communication works.
Multiple things can throw events.
 - User interaction
 - Change of data
 - view changes


## Databinding

The DOM can containe two types of references to a property. 'representations', places in the DOM where a value gets represented and 'inputs', places in the DOM where data for a property might get inputed.
