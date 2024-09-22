export default class ContinuationResults {
  constructor(results) {
    this.results = results;
  }

  render() {
    const container = document.createElement('div');
    container.className = 'continuation-results';

    const title = document.createElement('h2');
    title.textContent = 'Suggested Continuations';
    container.appendChild(title);

    this.results.forEach((result, index) => {
      const resultElement = document.createElement('div');
      resultElement.className = 'result-item';
      resultElement.textContent = result.text;
      container.appendChild(resultElement);
    });

    const applyButton = document.createElement('button');
    applyButton.textContent = 'APPLY CONTINUATION';
    applyButton.onclick = this.applyContinuation.bind(this);
    container.appendChild(applyButton);

    return container;
  }

  applyContinuation() {
    // Implement the logic to apply the continuation
    console.log('Applying continuation');
  }
}