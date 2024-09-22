function RewriteResults(results) {
  this.results = results;
}

RewriteResults.prototype.build = function() {
  var content = '<div class="block">' +
                '<h3>Rewrite Suggestions</h3>' +
                '<div>' + this.results + '</div>' +
                '</div>';
  return content;
};

// Make RewriteResults globally available
this.RewriteResults = RewriteResults;