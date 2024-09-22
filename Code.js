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

function generateEdit(text) {
  var result = callOpenAI("Edit the following text: " + text);
  return "<div class='block'><h3>Edit Suggestion</h3><div>" + result + "</div></div>";
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
