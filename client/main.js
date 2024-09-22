function onSidebarLoad() {
  google.script.run.withSuccessHandler(showCard).createHomepageCard();
}

function showCard(cardJson) {
  const card = JSON.parse(cardJson);
  const app = document.getElementById('app');
  app.innerHTML = ''; // Clear existing content
  
  // Render the card
  const cardElement = renderCard(card);
  app.appendChild(cardElement);
}

function renderCard(card) {
  const cardElement = document.createElement('div');
  cardElement.className = 'card';

  // Render header
  if (card.header) {
    const header = document.createElement('div');
    header.className = 'card-header';
    header.textContent = card.header.title;
    cardElement.appendChild(header);
  }

  // Render sections
  card.sections.forEach(section => {
    const sectionElement = document.createElement('div');
    sectionElement.className = 'card-section';

    section.widgets.forEach(widget => {
      const widgetElement = renderWidget(widget);
      sectionElement.appendChild(widgetElement);
    });

    cardElement.appendChild(sectionElement);
  });

  return cardElement;
}

function renderWidget(widget) {
  switch (widget.type) {
    case 'TextParagraph':
      const p = document.createElement('p');
      p.textContent = widget.text;
      return p;
    case 'TextButton':
      const button = document.createElement('button');
      button.textContent = widget.text;
      button.onclick = () => handleButtonClick(widget.action.functionName);
      return button;
    // Add more widget types as needed
  }
}

function handleButtonClick(functionName) {
  switch (functionName) {
    case 'showEditResults':
      google.script.run.withSuccessHandler(showCard).createEditResultsCard();
      break;
    case 'showRewriteResults':
      google.script.run.withSuccessHandler(showCard).createRewriteResultsCard();
      break;
    case 'showContinuationResults':
      google.script.run.withSuccessHandler(showCard).createContinuationResultsCard();
      break;
    case 'showQuoteResults':
      google.script.run.withSuccessHandler(showCard).createQuoteResultsCard();
      break;
    case 'showResourceResults':
      google.script.run.withSuccessHandler(showCard).createResourceResultsCard();
      break;
    // Add more cases as needed
  }
}

// Call onSidebarLoad when the page loads
window.onload = onSidebarLoad;
