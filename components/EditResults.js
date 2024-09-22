function EditResults(results) {
  this.results = results;
}

EditResults.prototype.build = function() {
  var content = '<div class="block">' +
                '<h3>Edit Suggestions</h3>' +
                '<div>' + this.results + '</div>' +
                '</div>';
  return content;
};

// Make EditResults globally available
this.EditResults = EditResults;