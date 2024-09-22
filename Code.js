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
  var html = HtmlService.createTemplateFromFile('Sidebar')
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
    return text || 'Please select some text.';
  }
  return 'Please select some text.';
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
