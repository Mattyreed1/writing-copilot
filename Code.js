/**
 * @OnlyCurrentDoc
 */

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
  var card = createCard();
  var ui = CardService.newUniversalActionResponseBuilder()
    .displayAddOnCards([card])
    .build();
  return ui;
}

function createCard(selectedText = '') {
  var card = CardService.newCardBuilder()
    .setName("Writing Copilot")
    .addSection(CardService.newCardSection()
      .addWidget(CardService.newTextParagraph().setText(selectedText ? "Selected text: " + selectedText : "No text selected"))
      .addWidget(CardService.newTextInput()
        .setFieldName("writerStyle")
        .setTitle("Writer Style"))
      .addWidget(CardService.newTextInput()
        .setFieldName("writingStyle")
        .setTitle("Writing Style"))
      .addWidget(CardService.newButtonSet()
        .addButton(CardService.newTextButton()
          .setText("Edit")
          .setOnClickAction(CardService.newAction().setFunctionName("handleEdit")))
        .addButton(CardService.newTextButton()
          .setText("Rewrite")
          .setOnClickAction(CardService.newAction().setFunctionName("handleRewrite")))
        .addButton(CardService.newTextButton()
          .setText("Continue")
          .setOnClickAction(CardService.newAction().setFunctionName("handleContinue")))))
    .build();
  return card;
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

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile('ui/Sidebar')
      .setTitle('My Add-on Sidebar');
}

function getWriterStyles() {
  return StyleService.getWriterStyles();
}

function getWritingStyles() {
  return StyleService.getWritingStyles();
}

// ... other functions for interacting with the document

function onSelectionChange(e) {
  var selection = DocumentApp.getActiveDocument().getSelection();
  if (selection) {
    var selectedText = getSelectedText();
    CardService.newActionResponseBuilder()
      .setStateChanged(true)
      .setNavigation(CardService.newNavigation()
        .updateCard(createCard(selectedText)))
      .build();
  }
}