function ResultsContainer() {
  this.currentCard = null;
}

ResultsContainer.prototype.showComponent = function(componentName, results) {
  var component;
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
};

ResultsContainer.prototype.getCurrentCard = function() {
  return this.currentCard;
};

// Make ResultsContainer globally available
this.ResultsContainer = ResultsContainer;