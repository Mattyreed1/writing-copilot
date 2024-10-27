/**
 * @OnlyCurrentDoc
 */

function onOpen(e) {
  DocumentApp.getUi().createAddonMenu()
    .addItem('Start Writing Copilot', 'showSidebar')
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

function getSelectedText() {
  try {
    var selection = DocumentApp.getActiveDocument().getSelection();
    if (selection) {
      var text = '';
      var elements = selection.getRangeElements();
      elements.forEach(function(element) {
        if (element.getElement().editAsText) {
          var elementText = element.getElement().editAsText().getText();
          text += elementText + '\n';
        }
      });
      return text.trim();
    } else {
      return '';
    }
  } catch (e) {
    Logger.log('Error retrieving selected text: ' + e);
    return '';
  }
}

function getWriterStyles() {
  return [
    'Paul Graham',
    'Seth Godin',
    'James Clear',
    'Sam Harris'
  ];
}

function getWritingStyles() {
  return [
    'Concise',
    'Witty',
    'Humorous',
    'Creative',
    'Sarcastic',
    'Conversational',
    'Persuasive',
    'Narrative'
  ];
}

function generateEdit(text, selectedWriters, selectedStyles) {
  var result = getAISuggestions(text, selectedWriters, selectedStyles, 'edit');
  return result;
}

function generateRewrite(text, selectedWriters, selectedStyles) {
  var result = getAISuggestions(text, selectedWriters, selectedStyles, 'rewrite');
  return result;
}

function generateContinuation(text, selectedWriters, selectedStyles) {
  var result = getAISuggestions(text, selectedWriters, selectedStyles, 'continue');
  return result;
}

function applySuggestion(originalText, newText) {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  var foundElement = body.editAsText().findText(originalText);
  if (foundElement) {
    var start = foundElement.getStartOffset();
    var end = foundElement.getEndOffsetInclusive();
    foundElement.getElement().editAsText().deleteText(start, end);
    foundElement.getElement().editAsText().insertText(start, newText);
    return 'Suggestion applied successfully!';
  } else {
    return 'Original text not found in the document.';
  }
}
