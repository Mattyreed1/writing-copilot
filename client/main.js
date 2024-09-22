function onLoad() {
  console.log('Sidebar loaded');

  // Event bindings
  document.getElementById('edit-btn').addEventListener('click', () => handleAIOperation('edit'));
  document.getElementById('rewrite-btn').addEventListener('click', () => handleAIOperation('rewrite'));
  document.getElementById('continue-btn').addEventListener('click', () => handleAIOperation('continue'));
  document.getElementById('find-quotes').addEventListener('click', handleFindQuotes);
  document.getElementById('find-citations').addEventListener('click', handleFindResources);

  // Load writer styles from the server and populate the select input
  google.script.run.withSuccessHandler(function(styles) {
    var select = document.getElementById('writer-style-select');
    styles.forEach(function(style) {
      var option = document.createElement('option');
      option.value = style;
      option.textContent = style;
      select.appendChild(option);
    });
  }).getWriterStyles();

  // Load writing styles from the server and populate the select input
  google.script.run.withSuccessHandler(function(styles) {
    var select = document.getElementById('writing-style-select');
    styles.forEach(function(style) {
      var option = document.createElement('option');
      option.value = style;
      option.textContent = style;
      select.appendChild(option);
    });
  }).getWritingStyles();

  // Check for initial text selection and update UI accordingly
  checkTextSelection();

  // Periodically check for text selection every second
  setInterval(checkTextSelection, 1000);
}

function handleAIOperation(operation) {
  var writerSelect = document.getElementById('writer-style-select');
  var styleSelect = document.getElementById('writing-style-select');
  var selectedWriters = Array.from(writerSelect.selectedOptions).map(option => option.value);
  var selectedStyles = Array.from(styleSelect.selectedOptions).map(option => option.value);

  if (!selectedWriters.length || !selectedStyles.length) {
    alert('Please select at least one writer style and one writing style.');
    return;
  }

  document.getElementById('ai-result').textContent = 'Loading...';

  google.script.run
    .withSuccessHandler(function(suggestion) {
      if (suggestion.startsWith('Error:')) {
        document.getElementById('ai-result').textContent = suggestion;
      } else {
        document.getElementById('ai-result').innerHTML = suggestion;
      }
    })
    .withFailureHandler(function(error) {
      document.getElementById('ai-result').textContent = 'Error: ' + error.message;
    })
    .getAISuggestions(selectedWriters, selectedStyles, operation);
}

function handleFindQuotes() {
  google.script.run
    .withSuccessHandler(function(quotes) {
      document.getElementById('ai-result').innerHTML = quotes;
    })
    .withFailureHandler(function(error) {
      document.getElementById('ai-result').textContent = 'Error: ' + error.message;
    })
    .findQuotes();
}

function handleFindResources() {
  // Implement the logic to find resources
  // Similar to handleFindQuotes
}

function checkTextSelection() {
  // Implement the logic to check text selection and update UI
}

// Call onLoad when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', onLoad);
