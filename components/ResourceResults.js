function ResourceResults(resources) {
  this.resources = resources;
}

ResourceResults.prototype.build = function() {
  var content = '<div class="resource-results">' +
                '<h2>Suggested Resources</h2>';
  
  this.resources.forEach(function(resource, index) {
    content += '<div class="resource-item">' +
                '<a href="' + resource.url + '">' + resource.name + '</a>' +
                '<p class="explanation">Why this resource is relevant</p>' +
                '</div>';
  });
  
  content += '<button onclick="google.script.run.addResources()">ADD RESOURCES</button>' +
              '</div>';
  
  return content;
};

// This function should be defined in Code.js or another server-side file
// function addResources() {
//   // Implement the logic to add the resources
//   console.log('Adding resources');
// }

// Make ResourceResults globally available
this.ResourceResults = ResourceResults;