/**
 * @OnlyCurrentDoc
 */

function onOpen() {
  DocumentApp.getUi()
    .createAddonMenu()
    .addItem('Open Writing Copilot', 'showSidebar')
    .addToUi();
}

function onInstall(e) {
  onOpen(e);
}

function showSidebar() {
  var ui = HtmlService.createHtmlOutputFromFile('ui/Sidebar')
    .setTitle('Writing Copilot');
  DocumentApp.getUi().showSidebar(ui);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getWriterStyles() {
  return StyleService.getWriterStyles();
}

function getWritingStyles() {
  return StyleService.getWritingStyles();
}

function getAISuggestions(selectedWriters, selectedStyles, operation) {
  return AIService.getAISuggestions(selectedWriters, selectedStyles, operation);
}

function findQuotes() {
  return CitationService.findQuotes();
}

function findCitations() {
  return CitationService.findCitations();
}

function getSelectedText() {
  var selection = DocumentApp.getActiveDocument().getSelection();
  if (selection) {
    var elements = selection.getSelectedElements();
    return elements.map(function(element) {
      if (element.isPartial()) {
        return element
          .getElement()
          .asText()
          .getSubstring(element.getStartOffset(), element.getEndOffsetInclusive());
      } else {
        return element.getElement().asText().getText();
      }
    }).join('\n');
  }
  return '';
}