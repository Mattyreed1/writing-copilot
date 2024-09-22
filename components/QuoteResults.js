function QuoteResults(results) {
  this.results = results;
}

QuoteResults.prototype.build = function() {
  var content = '<div class="block">' +
                '<h3>Quote Suggestions</h3>' +
                '<div>' + this.results + '</div>' +
                '</div>';
  return content;
};

// Make QuoteResults globally available
this.QuoteResults = QuoteResults;