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
  return result;
}

function showEditCard(editResult) {
  var card = CardService.newCardBuilder();
  
  card.setHeader(CardService.newCardHeader().setTitle("Edit Suggestions"));
  
  var section = CardService.newCardSection()
    .addWidget(CardService.newTextParagraph().setText(editResult))
    .addWidget(CardService.newButtonSet()
      .addButton(CardService.newTextButton()
        .setText("Apply Edit")
        .setOnClickAction(CardService.newAction().setFunctionName("applyEdit"))));
  
  card.addSection(section);
  
  var nav = CardService.newNavigation().pushCard(card.build());
  return CardService.newActionResponseBuilder()
    .setNavigation(nav)
    .build();
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
  var html = HtmlService.createHtmlOutput('<script>window.parent.updateSelectedText(' + JSON.stringify(selectedText) + ');</script>');
  DocumentApp.getUi().showSidebar(html);
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
      .setText("Edit applied successfully!"))
    .build();
}
