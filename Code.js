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
  var template = HtmlService.createTemplateFromFile('ui/Sidebar')
    .evaluate()
    .setTitle('Writing Copilot');
  DocumentApp.getUi().showSidebar(template);
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
  return handleEdit(text, selectedWriters, selectedStyles);
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

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function handleEdit(text, selectedWriters, selectedStyles) {
  if (!text || text === 'No text selected') {
    return { error: 'No text selected' };
  }
  
  if (!selectedWriters || !selectedStyles) {
    return { error: 'Please select writing styles' };
  }

  try {
    // Get AI suggestions
    const aiResponse = getAISuggestions(text, selectedWriters, selectedStyles, 'edit');
    
    // Format the response
    return {
      originalText: text,
      suggestions: [{
        text: aiResponse,
        explanation: "This edit improves clarity and maintains the intended message while incorporating the selected writing styles."
      }]
    };
  } catch (error) {
    Logger.log('Error in handleEdit: ' + error);
    return { error: 'Failed to generate suggestions' };
  }
}

function applySelectedEdits(originalText, selectedEdits) {
  if (!selectedEdits || selectedEdits.length === 0) {
    return { error: 'No edits selected' };
  }

  try {
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();
    var foundElement = body.editAsText().findText(originalText);
    
    if (foundElement) {
      var start = foundElement.getStartOffset();
      var end = foundElement.getEndOffsetInclusive();
      foundElement.getElement().editAsText().deleteText(start, end);
      foundElement.getElement().editAsText().insertText(start, selectedEdits[0]);
      return { success: true, message: 'Edits applied successfully' };
    } else {
      return { error: 'Original text not found in document' };
    }
  } catch (error) {
    Logger.log('Error applying edits: ' + error);
    return { error: 'Failed to apply edits' };
  }
}
