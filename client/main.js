function onJQueryLoad() {
  $(document).ready(function() {
    google.script.run.withSuccessHandler(onLoad).showSidebar();
  });
}

// Check if jQuery is loaded
if (typeof jQuery != 'undefined') {
  onJQueryLoad();
} else {
  console.error('jQuery failed to load');
}

function onLoad() {
  console.log('Sidebar loaded');
  
  $('#edit-btn').click(() => handleAIOperation('edit'));
  $('#rewrite-btn').click(() => handleAIOperation('rewrite'));
  $('#continue-btn').click(() => handleAIOperation('continue'));
}

function handleAIOperation(operation) {
  var selectedWriters = $('#writer-style-select').select2('data').map(item => item.text);
  var selectedStyles = $('#writing-style-select').select2('data').map(item => item.text);
  
  if (!selectedWriters.length || !selectedStyles.length) {
    alert('Please select at least one writer style and one writing style.');
    return;
  }
  
  $('#ai-result').text('Loading...');
  
  google.script.run
    .withSuccessHandler(function(text) {
      if (text) {
        google.script.run
          .withSuccessHandler(function(suggestion) {
            if (suggestion.startsWith('Error:')) {
              $('#ai-result').text(suggestion);
            } else {
              $('#ai-result').html(suggestion);
            }
          })
          .withFailureHandler(function(error) {
            $('#ai-result').text('Error: ' + error);
          })
          .getAISuggestions(text, selectedWriters, selectedStyles, operation);
      } else {
        $('#ai-result').text('No text selected. Please select some text in the document.');
      }
    })
    .withFailureHandler(function(error) {
      $('#ai-result').text('Error: ' + error);
    })
    .getSelectedText();
}

function displayAIResult(result) {
  $('#ai-result').html(result);
}

function handleError(error) {
  $('#ai-result').text('Error: ' + error.message);
}
