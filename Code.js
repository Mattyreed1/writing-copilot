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
  var html = HtmlService.createTemplateFromFile('ui/Sidebar')
      .evaluate()
      .setTitle('Writing Copilot')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  DocumentApp.getUi().showSidebar(html);
}

function getSelectedText() {
  var selection = DocumentApp.getActiveDocument().getSelection();
  if (selection) {
    var text = selection.getRangeElements().map(function(element) {
      if (element.getElement().editAsText) {
        return element.getElement().editAsText().getText();
      }
      return '';
    }).join('\n').trim();
    return text || 'No text selected';
  }
  return 'No text selected';
}

function generateEdit(text, selectedWriters, selectedStyles) {
  var aiService = new AIService();
  var result = aiService.getAISuggestions(text, selectedWriters, selectedStyles, 'edit');
  return createEditCard(result, text);
}

function createEditCard(editResult, originalText) {
  var card = CardService.newCardBuilder();
  
  card.setHeader(CardService.newCardHeader().setTitle("Suggested Edits"));
  
  var section = CardService.newCardSection()
    .addWidget(CardService.newTextParagraph().setText("Original text:"))
    .addWidget(CardService.newTextParagraph().setText(originalText))
    .addWidget(CardService.newDivider())
    .addWidget(CardService.newTextParagraph().setText("Suggested edits:"))
    .addWidget(CardService.newTextParagraph().setText(editResult));

  // Add multiple edit suggestions
  var suggestions = editResult.split('\n\n');
  suggestions.forEach((suggestion, index) => {
    section.addWidget(CardService.newTextButton()
      .setText(`Apply Edit ${index + 1}`)
      .setOnClickAction(CardService.newAction()
        .setFunctionName("applyEdit")
        .setParameters({text: suggestion, index: index.toString()})));
  });
  
  card.addSection(section);
  
  return card.build();
}

function generateRewrite(text) {
  var result = callOpenAI("Rewrite the following text: " + text);
  return "<div class='block'><h3>Rewrite Suggestion</h3><div>" + result + "</div></div>";
}

function generateContinuation(text) {
  var result = callOpenAI("Continue the following text: " + text);
  return "<div class='block'><h3>Continuation Suggestion</h3><div>" + result + "</div></div>";
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function listenForSelectionChanges() {
  var selection = DocumentApp.getActiveDocument().getSelection();
  if (selection) {
    return getSelectedText();
  }
  return 'Please select some text.';
}

function onSelectionChange(e) {
  var selectedText = getSelectedText();
  updateSidebarText(selectedText);
}

function updateSidebarText(text) {
  var html = HtmlService.createHtmlOutput('<script>window.parent.updateSelectedText("' + text.replace(/"/g, '\\"') + '");</script>');
  DocumentApp.getUi().showSidebar(html);
}

function removeTrigger() {
  var triggers = ScriptApp.getUserTriggers(DocumentApp.getActiveDocument());
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'onSelectionChange') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}

function applyEdit(e) {
  var text = e.parameters.text;
  var index = parseInt(e.parameters.index);
  var doc = DocumentApp.getActiveDocument();
  var selection = doc.getSelection();
  
  if (selection) {
    var elements = selection.getRangeElements();
    if (elements.length > 0) {
      var element = elements[0].getElement();
      element.asText().setText(text);
    }
  }
  
  return CardService.newActionResponseBuilder()
    .setNotification(CardService.newNotification()
      .setText(`Edit ${index + 1} applied successfully!`))
    .build();
}

function onEditButtonClicked(e) {
  var text = e.commonEventObject.formInputs.selectedText;
  var selectedWriters = e.commonEventObject.formInputs.selectedWriters;
  var selectedStyles = e.commonEventObject.formInputs.selectedStyles;

  var card = generateEdit(text, selectedWriters, selectedStyles);
  
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().pushCard(card))
    .build();
}

function createSelectionChangeTrigger() {
  var doc = DocumentApp.getActiveDocument();
  ScriptApp.newTrigger('onSelectionChange')
    .forDocument(doc.getId())
    .onSelectionChange()
    .create();
}

function onClose() {
  var triggers = ScriptApp.getUserTriggers(DocumentApp.getActiveDocument());
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'onSelectionChange') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}
