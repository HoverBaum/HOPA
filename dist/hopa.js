
const HOPAHelper=function(){function forEach(array,callback,scope){for(let i=0;i<array.length;i++){callback.call(scope,array[i],i);}}
function httpGet(url){return new Promise(function(resolve,reject){var request=new XMLHttpRequest();request.onreadystatechange=function(){if(request.readyState===4&&request.status===200){resolve(request.responseText);}}
request.onerror=function(){reject(new Error(this.statusText));}
request.open('GET',url);request.send();});}
return{forEach:forEach,get:httpGet}}();const HOPAModels=function(){let registeredModels=[];function createModel(name,properties){let newModel={name,values:{},properties:[],propertyListeners:{}};addMethodsToNewModel(newModel);registeredModels.push(newModel);for(var property in properties){if(properties.hasOwnProperty(property)){newModel.addProperty(property,properties[property]);}}
return newModel.values;}
function addMethodsToNewModel(newModel){newModel.addProperty=function(property,value){addPropertyToModel(property,newModel,value);};newModel.bindToElement=function(host){bindModelToHost(newModel,host);};newModel.addPropertyListener=function(property,listener){newModel.propertyListeners[property].push(listener);};newModel.removePropertyListener=function(property,listener){var index=newModel.propertyListeners.indexOf(listener);newModel.propertyListeners[property].splice(index,1);};}
function addPropertyToModel(property,model,value){model.properties.push(property);let listeners=[];model.propertyListeners[property]=listeners;let values=model.values;Object.defineProperty(values,property,{set:function(newVal){let oldVal=value;value=newVal;listeners.forEach(listener=>{listener(newVal,oldVal);});},get:function(){return value;}});}
function findAndBindModelToHost(modelName,host){var model=getModelByName(modelName);model.bindToElement(host);}
function bindModelToHost(model,host){model.properties.forEach(property=>{bindProperty(property,model,host);});}
function bindProperty(property,model,parent){let propertyName=`${model.name}.${property}`;bindPropertyTowardsDOM(property,model,propertyName,parent);bindDOMTowardsProperty(property,model,propertyName,parent);}
function bindDOMTowardsProperty(property,model,propertyName,parent){let values=model.values;let DOMValues=findDomValues(propertyName,parent);DOMValues.forEach(value=>{value.addEventListener('input',function(e){values[property]=value.value;});});}
function bindPropertyTowardsDOM(property,model,propertyName,parent){let initialValue=model.values[property];let updateDOM=generateDOMUpdater(propertyName,parent);let listener=function(newValue){updateDOM(newValue);}
model.addPropertyListener(property,listener);updateDOM(initialValue);}
function generateDOMUpdater(propertyName,parent){let DOMRepresentations=findDomRepresentations(propertyName,parent);let DOMValues=findDomValues(propertyName,parent);let updateDOM=dataToDOMFactory([{elements:DOMRepresentations,property:'innerHTML'},{elements:DOMValues,property:'value'}]);return updateDOM;}
function dataToDOMFactory(lists){return function(newValue){lists.forEach(list=>{dataToDOM(list.elements,list.property,newValue);})}}
function dataToDOM(elements,property,newValue){elements.forEach(element=>{if(element[property]!==newValue){element[property]=newValue;}});}
function findDomValues(property,root){var valueElements=[];var list=root.querySelectorAll(`[hopa-value="${property}"]`);HOPAHelper.forEach(list,element=>{valueElements.push(element);});return valueElements;}
function findDomRepresentations(property,root=document.body){var elements=[];var regex=new RegExp('^\\s*{{\\s*'+property+'\\s*}}\\s*$');if(regex.test(root.innerHTML)){elements.push(root);}
HOPAHelper.forEach(root.children,child=>{elements=elements.concat(findDomRepresentations(property,child));});return elements;}
function getModelByName(modelName){let foundModel;registeredModels.forEach(model=>{if(model.name===modelName){foundModel=model;}});return foundModel;}
return{add:createModel,bindModelToHost:findAndBindModelToHost}}();const HOPARoutes=function(){var registeredRoutes=[];function initRoutes(){var currentPath=window.location.hash.substring(1);handleRouteChange(currentPath);registerHashlistener();}
function registerHashlistener(){window.addEventListener('hashchange',function(e){var oldURL=e.oldURL;var newURL=e.newURL;var newPath=newURL.split(/#(.+)?/)[1];handleRouteChange(newPath,oldURL,newURL);e.preventDefault();});}
function handleRouteChange(newPath,oldURL,newURL){registeredRoutes.forEach(route=>{if(route.path===newPath){switchToRoute(route);}});}
function switchToRoute(route){var parent=document.querySelector('[hopa-view]');HOPAViews.switchTo(route.view,parent);}
function registerRoute(path,viewName){var newRoute={path:path,view:viewName}
registeredRoutes.push(newRoute);}
return{register:registerRoute,init:initRoutes}}();const HOPAViews=function(){let registeredViews=[];let runningViews=[];function createView(name,templateURL,controlls){registeredViews.push({name,templateURL,controlls});}
function switchViewTo(viewName,parent){if(parent.getAttribute('hopa-viewID')){destroyView(parent.getAttribute('hopa-viewID'));}
displayAndParseView(viewName,parent);}
function displayAndParseView(viewName,parent){let view=getViewForRunning(viewName);parent.setAttribute('hopa-viewID',view.id);displazTemplateIn(view.templateURL,parent,function(){startControlls(view);runningViews.push(view);parseTemplateParent(parent,view);});}
function displazTemplateIn(templateURL,parent,callback){HOPAHelper.get(templateURL).then(function(template){parent.innerHTML=template;callback();}).catch(function(error){console.error(error);});}
function getViewForRunning(viewName){let view=getViewByName(viewName);return{name:view.name,templateURL:view.templateURL,controlls:view.controlls,id:view.name+Date.now()}}
function startControlls(view){if(view.controlls){view.controlls();}}
function parseTemplateParent(parent,view){HOPAHelper.forEach(parent.querySelectorAll('[hopa-model]'),modelElm=>{HOPAModels.bindModelToHost(modelElm.getAttribute('hopa-model'),modelElm,view.id);});HOPAHelper.forEach(parent.querySelectorAll('[hopa-view]'),viewElm=>{displayAndParseView(viewElm.getAttribute('hopa-view'),viewElm);});HOPAHelper.forEach(parent.querySelectorAll('[hopa-click]'),clickElm=>{clickElm.addEventListener('click',function(){eval('view.'+clickElm.getAttribute('hopa-click'));});});}
function destroyView(viewID){let parent=document.querySelector(`[hopa-viewID="${viewID}"]`);HOPAHelper.forEach(parent.querySelectorAll('[hopa-view]'),viewParent=>{destroyView(viewParent.getAttribute('hopa-viewID'));});let view=getRunningViewById(parent.getAttribute('hopa-viewID'));let index=runningViews.indexOf(view);if(view.destroy){view.destroy();}
parent.innerHTML='';runningViews.splice(index,1);}
function getViewByName(viewName){let foundView;registeredViews.forEach(view=>{if(view.name===viewName){foundView=view;}});return foundView;}
function getRunningViewById(viewID){let foundView;runningViews.forEach(view=>{if(view.id===viewID){foundView=view;}});return foundView;}
return{add:createView,switchTo:switchViewTo}}();const HOPA=function(){function initHOPA(){HOPARoutes.init();}
function addModel(name,properties){return HOPAModels.add(name,properties);}
function registerView(name,templateURL,controlls){HOPAViews.add(name,templateURL,controlls)}
function registerController(name,controller){HOPAControllers.register(name,controller);}
return{route:HOPARoutes.register,init:initHOPA,model:addModel,view:registerView}}();