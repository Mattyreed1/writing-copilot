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

// ... other functions for interacting with the document
