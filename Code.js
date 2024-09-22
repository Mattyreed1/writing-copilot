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
  var ui = HtmlService.createTemplateFromFile('Sidebar')
      .evaluate()
      .setTitle('Writing Copilot')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  DocumentApp.getUi().showSidebar(ui);
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
  // Implement your edit generation logic here
  // Return HTML to be displayed in the sidebar
}

function generateRewrite(text) {
  // Implement your rewrite generation logic here
}

function generateContinuation(text) {
  // Implement your continuation generation logic here
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
