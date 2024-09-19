/**
 * @OnlyCurrentDoc
 */

function onOpen(e) {
  DocumentApp.getUi()
    .createAddonMenu()
    .addItem('Open Writing Copilot', 'showSidebarFromMenu')
    .addToUi();
}

function onInstall(e) {
  onOpen(e);
}

function showSidebarFromMenu() {
  showSidebar();
}

function showSidebar() {
  var html = HtmlService.createTemplateFromFile('ui/Sidebar')
    .evaluate()
    .setTitle('Writing Copilot')
    .setWidth(300);
  DocumentApp.getUi().showSidebar(html);
}

function getSelectedText() {
  var selection = DocumentApp.getActiveDocument().getSelection();
  if (selection) {
    var elements = selection.getSelectedElements();
    return elements[0].getElement().asText().getText();
  }
  return '';
}

function insertText(text, index) {
  var body = DocumentApp.getActiveDocument().getBody();
  body.insertParagraph(index, text);
}

function replaceSelectedText(newText) {
  var doc = DocumentApp.getActiveDocument();
  var selection = doc.getSelection();
  if (selection) {
    var elements = selection.getSelectedElements();
    if (elements.length > 0) {
      var element = elements[0].getElement();
      var startOffset = elements[0].getStartOffset();
      var endOffset = elements[0].getEndOffsetInclusive();
      element.asText().deleteText(startOffset, endOffset);
      element.asText().insertText(startOffset, newText);
    }
  }
}

function getCursorPosition() {
  var doc = DocumentApp.getActiveDocument();
  var cursor = doc.getCursor();
  return cursor ? cursor.getOffset() : 0;
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getDocumentContent() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  return body.getText();
}

function getDocumentStructure() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  var structure = [];
  
  for (var i = 0; i < body.getNumChildren(); i++) {
    var child = body.getChild(i);
    structure.push({
      type: child.getType().toString(),
      text: child.asText().getText()
    });
  }
  
  return structure;
}