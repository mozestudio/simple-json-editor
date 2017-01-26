// query string
var JSONInputQuery = '#JSONInput';
var EditorHolderQuery = '#editor-holder'
var ExportJSONButton = '#export-JSON'

// utils
function querySelectorTask(querySelector, task) {
  new Promise(function(res, rej) {
    var element  = document.querySelector(querySelector);
    element ? res(element) : rej();
  })
  .then(function(element) { task(element) })
  .catch(function(e) { /* -_- */ })
}

function deleteElement(querySelector) {
  querySelectorTask(
    querySelector
    , function(element) {
      var element = element;
      element.outerHTML = "";
      delete element;
    })
}

function onEditorChange(editor) {
    var json = JSON.stringify(editor.getValue());
    var blob = new Blob([json], {type: "application/json"});
    var url  = URL.createObjectURL(blob);
    querySelectorTask(
      ExportJSONButton
      , function(element) {
        element.style = "display: block";
        element.href = url;
        element.download = "localized.json";
        element.textContent = "Download JSON";
      });
}

function findAnchestor(className, element) {
  return element.classList.contains(className) ? element : findAnchestor(className, element.parentElement)
}

function insertDuplicatedStatic(element) {
  var parent = element.parentElement;
  var duplicatedElement = document.createElement('input');
  duplicatedElement.className = 'default-value';
  duplicatedElement.value = element.value;
  duplicatedElement.disabled = true;
  parent.insertBefore(duplicatedElement, parent.childNodes[0]);
}

function addClassToAncestorParent(element, anchestorClassName,  className) {
  new Promise(function(res, rej) {
      var anchestor = findAnchestor(anchestorClassName, element);
      anchestor ? res(anchestor) : rej()
  })
  .then(function(anchestor){
    anchestor.parentElement.className = anchestor.parentElement.className.replace(className, "") + " " + className
  })
  .catch(function(e){ /* 0.0 */ });
}

function startEditor(editorDomNode, data) {
  var editor = new JSONEditor(editorDomNode, {schema: {}})
  editor.setValue(data)
  Array.prototype.filter
  .call(document.querySelectorAll('.form-control input'), function(element) { return element.value })
  .map(function(el){ insertDuplicatedStatic(el);  addClassToAncestorParent(el, 'row', 'input-wrapper')});
  editor.on('change', function() { onEditorChange(editor) })
}

function onReaderLoad(event){
    deleteElement(EditorHolderQuery + ' > div')
    var data = JSON.parse(event.target.result);
    querySelectorTask(EditorHolderQuery, function(element) {startEditor(element, data)} )
}

function initJSONEditor(evt) {
  var reader = new FileReader();
  reader.onload = onReaderLoad;
  reader.readAsText(evt.target.files[0]);
}

// main
(function(){
  querySelectorTask(
    JSONInputQuery
    , function(button) { button.addEventListener('change', initJSONEditor) })
})();
