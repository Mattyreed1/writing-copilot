export default class RewriteResults {
  constructor(results) {
    this.results = results;
  }

  render() {
    const container = document.createElement('div');
    container.className = 'rewrite-results';

    const title = document.createElement('h2');
    title.textContent = 'Suggested Rewrites';
    container.appendChild(title);

    this.results.forEach((result, index) => {
      const resultElement = document.createElement('div');
      resultElement.className = 'result-item';
      resultElement.textContent = result.text;
      container.appendChild(resultElement);
    });

    const applyButton = document.createElement('button');
    applyButton.textContent = 'APPLY REWRITE';
    applyButton.onclick = this.applyRewrite.bind(this);
    container.appendChild(applyButton);

    return container;
  }

  applyRewrite() {
    // Implement the logic to apply the rewrite
    console.log('Applying rewrite');
  }
}