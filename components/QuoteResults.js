export default class QuoteResults {
  constructor(quotes) {
    this.quotes = quotes;
  }

  render() {
    const container = document.createElement('div');
    container.className = 'quote-results';

    const title = document.createElement('h2');
    title.textContent = 'Suggested Quotes';
    container.appendChild(title);

    this.quotes.forEach((quote, index) => {
      const quoteElement = document.createElement('div');
      quoteElement.className = 'quote-item';
      quoteElement.innerHTML = `
        <blockquote>${quote.text}</blockquote>
        <p class="author">- ${quote.author}</p>
        <p class="explanation">Why is this a good relevant quote</p>
      `;
      container.appendChild(quoteElement);
    });

    const addButton = document.createElement('button');
    addButton.textContent = 'ADD QUOTES';
    addButton.onclick = this.addQuotes.bind(this);
    container.appendChild(addButton);

    return container;
  }

  addQuotes() {
    // Implement the logic to add the quotes
    console.log('Adding quotes');
  }
}