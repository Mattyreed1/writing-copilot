/**
 * @OnlyCurrentDoc
 */

function onOpen(e) {
  DocumentApp.getUi()
    .createAddonMenu()
    .addItem('Open Sidebar', 'showSidebar')
    .addToUi();
}

function onInstall(e) {
  onOpen(e);
}

function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('Writing Copilot');
  DocumentApp.getUi().showSidebar(html);
}

function createHomepageCard() {
  const card = CardService.newCardBuilder();
  card.setHeader(CardService.newCardHeader().setTitle('Writing Copilot'));

  // Set Writing Style section
  const writingStyleSection = CardService.newCardSection()
    .setHeader('Set Writing Style')
    .addWidget(CardService.newTextInput().setFieldName('writers').setTitle('Select writers...'))
    .addWidget(CardService.newTextInput().setFieldName('styles').setTitle('Select styles...'));
  card.addSection(writingStyleSection);

  // Generate Suggestions section
  const suggestionsSection = CardService.newCardSection()
    .setHeader('Generate Suggestions')
    .addWidget(CardService.newTextButton().setText('EDIT').setOnClickAction(CardService.newAction().setFunctionName('showEditResults')))
    .addWidget(CardService.newTextButton().setText('REWRITE').setOnClickAction(CardService.newAction().setFunctionName('showRewriteResults')))
    .addWidget(CardService.newTextButton().setText('CONTINUE').setOnClickAction(CardService.newAction().setFunctionName('showContinuationResults')));
  card.addSection(suggestionsSection);

  // Find Quotes & Resources section
  const findSection = CardService.newCardSection()
    .setHeader('Find Quotes & Resources')
    .addWidget(CardService.newTextButton().setText('FIND QUOTES').setOnClickAction(CardService.newAction().setFunctionName('showQuoteResults')))
    .addWidget(CardService.newTextButton().setText('FIND RESOURCES').setOnClickAction(CardService.newAction().setFunctionName('showResourceResults')));
  card.addSection(findSection);

  return card.build();
}

function showEditResults() {
  const results = getEditSuggestions();
  const card = CardService.newCardBuilder();
  card.setHeader(CardService.newCardHeader().setTitle('Suggested Edits'));

  results.forEach((result, index) => {
    const section = CardService.newCardSection()
      .addWidget(CardService.newTextParagraph().setText(result.text))
      .addWidget(CardService.newTextParagraph().setText('Explain why you should make these changes and how it improves the writing.'));
    card.addSection(section);
  });

  const applyButton = CardService.newTextButton()
    .setText('APPLY EDITS')
    .setOnClickAction(CardService.newAction().setFunctionName('applyEdits'));
  card.addSection(CardService.newCardSection().addWidget(applyButton));

  return card.build();
}

function showRewriteResults() {
  // Similar to showEditResults, but for rewrites
}

function showContinuationResults() {
  // Similar to showEditResults, but for continuations
}

function showQuoteResults() {
  // Similar to showEditResults, but for quotes
}

function showResourceResults() {
  // Similar to showEditResults, but for resources
}

function getEditSuggestions() {
  // Implement this function to get actual edit suggestions
  return [
    { text: 'Sample edit suggestion 1' },
    { text: 'Sample edit suggestion 2' },
  ];
}

function getRewriteSuggestions() {
  // Implement this function to get actual rewrite suggestions
}

function getContinuationSuggestions() {
  // Implement this function to get actual continuation suggestions
}

function getQuoteSuggestions() {
  // Implement this function to get actual quote suggestions
}

function getResourceSuggestions() {
  // Implement this function to get actual resource suggestions
}

<<<<<<< HEAD
function applyEdits() {
  // Implement the logic to apply the edits
  // This function will be called when the "APPLY EDITS" button is clicked
}

// Add similar functions for applying rewrites, continuations, etc.
=======
function getScriptContent(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
>>>>>>> parent of 358e3d2... fix ui
