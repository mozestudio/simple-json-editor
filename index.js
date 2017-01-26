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

function startEditor(editorDomNode, data) {
  var editor = new JSONEditor(editorDomNode, {schema: {}})
  editor.setValue(data)
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
