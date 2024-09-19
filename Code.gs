function onOpen(e) {
  DocumentApp.getUi()
    .createAddonMenu()
    .addItem('Open Writing Copilot', 'showSidebar')
    .addToUi();
}

function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('ui/Sidebar')
    .setTitle('Writing Copilot');
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
