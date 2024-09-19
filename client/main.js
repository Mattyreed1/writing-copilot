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
  const selectedText = google.script.run.getSelectedText();
  const writers = $('#writer-select').val();
  const styles = $('#style-select').val();

  $('#ai-result').text('Loading...');

  google.script.run
    .withSuccessHandler(displayAIResult)
    .withFailureHandler(handleError)
    .getAISuggestions(selectedText, writers, styles, operation);
}

function displayAIResult(result) {
  $('#ai-result').html(result);
}

function handleError(error) {
  $('#ai-result').text('Error: ' + error.message);
}
