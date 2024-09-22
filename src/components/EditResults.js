export default class EditResults {
  constructor(results) {
    this.results = results;
  }

  build() {
    const card = CardService.newCardBuilder();
    card.setHeader(CardService.newCardHeader().setTitle('Suggested Edits'));

    this.results.forEach((result, index) => {
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
}