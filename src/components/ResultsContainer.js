import EditResults from './EditResults.js';
import RewriteResults from './RewriteResults.js';
import ContinuationResults from './ContinuationResults.js';
import QuoteResults from './QuoteResults.js';
import ResourceResults from './ResourceResults.js';

export default class ResultsContainer {
  constructor() {
    this.currentCard = null;
  }

  showComponent(componentName, results) {
    let component;
    switch (componentName) {
      case 'EditResults':
        component = new EditResults(results);
        break;
      case 'RewriteResults':
        component = new RewriteResults(results);
        break;
      case 'ContinuationResults':
        component = new ContinuationResults(results);
        break;
      case 'QuoteResults':
        component = new QuoteResults(results);
        break;
      case 'ResourceResults':
        component = new ResourceResults(results);
        break;
      default:
        console.error('Unknown component:', componentName);
        return;
    }

    this.currentCard = component.build();
    return this.currentCard;
  }

  getCurrentCard() {
    return this.currentCard;
  }
}