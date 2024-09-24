/**
 * @OnlyCurrentDoc
 */

function onOpen(e) {
  DocumentApp.getUi().createAddonMenu()
      .addItem('Start Writing Copilot', 'showHomepage')
      .addToUi();
}

function onInstall(e) {
  onOpen(e);
}

function showHomepage() {
  var card = createHomepageCard();
  var ui = CardService.newUi().setCard(card);
  DocumentApp.getUi().showSidebar(ui);
  createSelectionChangeTrigger();
}

function createHomepageCard() {
  var card = CardService.newCardBuilder();
  
  card.setHeader(CardService.newCardHeader().setTitle("Writing Copilot"));
  
  var selectedTextSection = CardService.newCardSection()
    .addWidget(CardService.newTextParagraph().setText("Selected Text:"))
    .addWidget(CardService.newTextParagraph().setText("No text selected"));
  
  card.addSection(selectedTextSection);
  
  var writerSection = CardService.newCardSection()
    .addWidget(CardService.newSelectionInput()
      .setTitle("Select Writers")
      .setFieldName("writers")
      .setType(CardService.SelectionInputType.DROPDOWN)
      .setMultiselect(true));

  var styleSection = CardService.newCardSection()
    .addWidget(CardService.newSelectionInput()
      .setTitle("Select Styles")
      .setFieldName("styles")
      .setType(CardService.SelectionInputType.DROPDOWN)
      .setMultiselect(true));

  // Populate writers and styles
  var aiService = new AIService();
  var writers = aiService.getWriterStyles();
  var styles = aiService.getWritingStyles();

  writers.forEach(function(writer) {
    writerSection.addWidget(CardService.newSelectionInput()
      .addItem(writer, writer, false));
  });

  styles.forEach(function(style) {
    styleSection.addWidget(CardService.newSelectionInput()
      .addItem(style, style, false));
  });

  var actionSection = CardService.newCardSection()
    .addWidget(CardService.newButtonSet()
      .addButton(CardService.newTextButton()
        .setText("Edit")
        .setOnClickAction(CardService.newAction().setFunctionName("onEditButtonClicked")))
      .addButton(CardService.newTextButton()
        .setText("Rewrite")
        .setOnClickAction(CardService.newAction().setFunctionName("onRewriteButtonClicked")))
      .addButton(CardService.newTextButton()
        .setText("Continue")
        .setOnClickAction(CardService.newAction().setFunctionName("onContinueButtonClicked"))));

  card.addSection(writerSection)
     .addSection(styleSection)
     .addSection(actionSection);

  // Add a fixed footer
  var fixedFooter = CardService.newFixedFooter()
    .setPrimaryButton(CardService.newTextButton()
      .setText("Refresh")
      .setOnClickAction(CardService.newAction().setFunctionName("refreshHomepage")));
  
  card.setFixedFooter(fixedFooter);

  return card.build();
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
    Logger.log('Selected text: ' + text);
    return text || 'No text selected';
  }
  Logger.log('No text selected');
  return 'No text selected';
}

function onEditButtonClicked(e) {
  var selectedText = getSelectedText();
  var writers = e.commonEventObject.formInputs.writers || [];
  var styles = e.commonEventObject.formInputs.styles || [];
  var card = generateEdit(selectedText, writers, styles);
  
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().pushCard(card))
    .build();
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

function onRewriteButtonClicked(e) {
  var selectedText = getSelectedText();
  var writers = e.commonEventObject.formInputs.writers || [];
  var styles = e.commonEventObject.formInputs.styles || [];
  var card = generateRewrite(selectedText, writers, styles);
  
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().pushCard(card))
    .build();
}

function onContinueButtonClicked(e) {
  var selectedText = getSelectedText();
  var writers = e.commonEventObject.formInputs.writers || [];
  var styles = e.commonEventObject.formInputs.styles || [];
  var card = generateContinuation(selectedText, writers, styles);
  
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().pushCard(card))
    .build();
}

function generateRewrite(text, writers, styles) {
  var aiService = new AIService();
  var results = aiService.getAISuggestions(text, writers, styles, 'rewrite');
  return createRewriteCard("Suggested Rewrites", results, text);
}

function createRewriteCard(title, results, originalText) {
  var card = CardService.newCardBuilder();
  
  card.setHeader(CardService.newCardHeader().setTitle(title));
  
  var section = CardService.newCardSection()
    .addWidget(CardService.newTextParagraph().setText("Suggested Rewrites"));

  // Assuming results is an array of rewrite suggestions
  results.forEach((result, index) => {
    section.addWidget(CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.RADIO_BUTTON)
      .setFieldName("rewrite_option")
      .addItem(result, result, index === 0)); // Set the first option as default selected

    if (index < results.length - 1) {
      section.addWidget(CardService.newDivider());
    }
  });

  section.addWidget(CardService.newButtonSet()
    .addButton(CardService.newTextButton()
      .setText("APPLY REWRITE")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("applyRewrite")
        .setParameters({originalText: originalText}))));
  
  card.addSection(section);
  
  return card.build();
}

function applyRewrite(e) {
  var selectedRewrite = e.formInputs.rewrite_option[0];
  var originalText = e.parameters.originalText;
  
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  var searchResult = body.findText(originalText);
  
  if (searchResult) {
    var foundElement = searchResult.getElement();
    foundElement.asText().setText(selectedRewrite);
  }
  
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().popCard())
    .setNotification(CardService.newNotification()
      .setText("Rewrite applied successfully!"))
    .build();
}

function generateContinuation(text, writers, styles) {
  var aiService = new AIService();
  var result = aiService.getAISuggestions(text, writers, styles, 'continue');
  return createResultCard("Continuation Suggestion", result);
}

function createResultCard(title, result) {
  var card = CardService.newCardBuilder();
  
  card.setHeader(CardService.newCardHeader().setTitle(title));
  
  var section = CardService.newCardSection()
    .addWidget(CardService.newTextParagraph().setText(result));
  
  card.addSection(section);
  
  return card.build();
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

function refreshHomepage(e) {
  var card = createHomepageCard();
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().updateCard(card))
    .build();
}

function createUniversalActionResponseCard() {
  var card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Settings"))
    .addSection(CardService.newCardSection()
      .addWidget(CardService.newTextParagraph().setText("Add your settings here.")))
    .build();
  return card;
}

function onUniversalAction(e) {
  var card = createUniversalActionResponseCard();
  return CardService.newUniversalActionResponseBuilder()
    .displayAddOnCards([card])
    .build();
}

// Add this function to update the card with selected text
function updateSelectedTextCard() {
  var selectedText = getSelectedText();
  var card = CardService.newCardBuilder();
  
  card.setHeader(CardService.newCardHeader().setTitle("Writing Copilot"));
  
  var selectedTextSection = CardService.newCardSection()
    .addWidget(CardService.newTextParagraph().setText("Selected Text:"))
    .addWidget(CardService.newTextParagraph().setText(selectedText));
  
  card.addSection(selectedTextSection);
  
  // Add other sections (writers, styles, actions) here...
  // (Copy the relevant parts from the createHomepageCard function)

  return CardService.newNavigation().updateCard(card.build());
}

// Add this function to create a trigger for selection changes
function createSelectionChangeTrigger() {
  var doc = DocumentApp.getActiveDocument();
  ScriptApp.newTrigger('onSelectionChange')
    .forDocument(doc.getId())
    .onSelectionChange()
    .create();
}

// Add this function to handle selection changes
function onSelectionChange(e) {
  var card = updateSelectedTextCard();
  CardService.newActionResponseBuilder()
    .setNavigation(card)
    .build();
}

// Add this function to remove the trigger when the add-on is closed
function onClose() {
  var triggers = ScriptApp.getUserTriggers(DocumentApp.getActiveDocument());
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'onSelectionChange') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}
