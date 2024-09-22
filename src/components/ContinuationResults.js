function ContinuationResults(results) {
  this.results = results;
}

ContinuationResults.prototype.build = function() {
  var content = '<div class="block">' +
                '<h3>Continuation Suggestions</h3>' +
                '<div>' + this.results + '</div>' +
                '</div>';
  return content;
};

// Make ContinuationResults globally available
this.ContinuationResults = ContinuationResults;