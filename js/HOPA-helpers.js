/**
 *   Some helpfull functions used throughout HOPA.
 */
const HOPAHelper = function () {

    /**
     *   Iterration for array-like objects.
     */
    function forEach(array, callback, scope) {
        for (let i = 0; i < array.length; i++) {
            callback.call(scope, array[i], i);
        }
    }

    /**
     *   A promise wrap of a http get request.
     */
    function httpGet(url) {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            //NOTE this might not be the best way, check that. 
            request.onreadystatechange = function () {
                if (request.readyState === 4 && request.status === 200) {
                    resolve(request.responseText);
                }
            }
            request.onerror = function () {
                reject(new Error(this.statusText));
            }
            request.open('GET', url);
            request.send();
        });
    }

    return {
        forEach: forEach,
        get: httpGet
    }

}();
