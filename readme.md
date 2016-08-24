# HOPA - Hovers One Page Application 

[![Project Status: Abandoned - Initial development has started, but there has not yet been a stable, usable release; the project has been abandoned and the author(s) do not intend on continuing development.](http://www.repostatus.org/badges/latest/abandoned.svg)](http://www.repostatus.org/#abandoned)

A simplistic framework build as a learning experience

## Models

Models are HOPAs representation of data. To create a new Model simply call:

 ```javascript
let myModel = HOPA.model('nameOfMyModel', {
    modelsProperty: 'and its value'
});
 ```

When working with data you should always represent it as a Model.

## Databinding

The DOM can containe two types of references to a property. 'representations', places in the DOM where a value gets represented and 'inputs', places in the DOM where data for a property might get inputed.

Once defined a model may be used with two way databinding. HOPA makes sure for you that whenever you update a property the DOM gets updated and whenever the DOM updates your property gets updated. We will use a simple 'user' model to illustrate this.

```javascript
let user = HOPA.model('user', {
    name: 'Hendrik',
    username: 'HoverBaum'
});
```
Here we have a simple user with a name and username. When we store the model in an object we can use it as normal and do things like `user.username = 'my new username'`.

To access data you first need to let HOPA know which model you want to use inside a scope.

```html
<div hopa-model="user">
</div>
```

Now we can bind the data from the model to inputs or tags. For inputs that have a "value" attribute we can use `hopa-value`. To display our data in a tag simply put it in "mustach syntax", remember to only put the reference in the tag (whitespaces are okay).

```html
<div hopa-model="user">
    <span>{{user.name}}</span>
    <input hopa-value="user.name">
</div>
```

## Views

A View is a reusable component that displays data from Models and handles user interactions. Defining a view takes at least two parameters, the name of the view and a URL for the template that this view renders.

```javascript
HOPA.view('myFirstView', 'some/url/to.html');
```

This is enough if you have a simple view which might use a globally available Model and displays a users name for example. For example a simple view to great your user might look like this:

```javascript
//main.js
HOPA.view('welcome', 'views/welcome.html');
```

```html
<!-- views/welcome.html -->
<div hopa-model="user">
    <p>Welcome, <span>{{user.name}}</span></p>
</div>
```

However sometime you might want to react to users input or do other computations. To do this you can pass along a function when creating a view. Any method you declare as `this.method = function() {}` inside this function will be available inside the template.

```javascript
HOPA.view('counter', 'views/counter.html', function() {
    let counter = HOPA.model('counter', { count: 0 });
    let interval;

    //Start counting up every second.
    this.start = function() {
        interval = setInterval(function() { counter.count = counter.count + 1; }, 1000);
    }

    //Stop counting.
    this.stop = function() {
        clearInterval(interval);
    }

    this.destroy = function() {
        this.stop();
    }
});
```

```html
<div hopa-model="counter">
    <h1>Counter</h1>
    <span>{{counter.count}}</span>
    <button hopa-click="startCounter()">Start</button>
    <button hopa-click="stopCounter()">Stop</button>
</div>
```

### Nesting views

Once defined Views can be nested. Would you for example want to nest the `counter` view inside a `welcome` view you can easily do that by referring to it with its name.

```html
<!-- views/welcome.html -->
<div hopa-model="user">
    <p>Welcome, <span>{{user.name}}</span></p>

    <!-- put a counter here -->
    <div hopa-view="counter"></div>
</div>
```

## Routing

HOPA also supplies a way to handle URL, HOPA calls this a route. You can specify a route by providing a URL and a view that should be used.

```javascript
HOPA.route('/user', 'user');
```

Now all that is left to do is add a single div with `hopa-view` to your page.

## initialization
HOPA needs to be initialized. So after you have added all models views and routes simply call `HOPA.init()` and HOPA will do the rest.
