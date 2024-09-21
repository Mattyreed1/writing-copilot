$(document).ready(function() {
  console.log('Sidebar loaded');

  // Event bindings
  $('#edit-btn').click(() => handleAIOperation('edit'));
  $('#rewrite-btn').click(() => handleAIOperation('rewrite'));
  $('#continue-btn').click(() => handleAIOperation('continue'));
  $('#find-quotes').click(handleFindQuotes);
  $('#find-citations').click(handleFindResources);

  // Initialize Select2 for multiple select inputs
  $('#writer-style-select, #writing-style-select').select2({
    width: '100%',
    placeholder: function() {
      return $(this).attr('placeholder');
    },
    allowClear: true,
    multiple: true
  });

  // Load writer styles from the server and populate the select input
  google.script.run.withSuccessHandler(function(styles) {
    var select = $('#writer-style-select');
    styles.forEach(function(style) {
      select.append($('<option></option>').val(style).text(style));
    });
    select.trigger('change');
  }).getWriterStyles();

  // Load writing styles from the server and populate the select input
  google.script.run.withSuccessHandler(function(styles) {
    var select = $('#writing-style-select');
    styles.forEach(function(style) {
      select.append($('<option></option>').val(style).text(style));
    });
    select.trigger('change');
  }).getWritingStyles();

  // Check for initial text selection and update UI accordingly
  checkTextSelection();

  // Periodically check for text selection every second
  setInterval(checkTextSelection, 1000);
});

function handleAIOperation(operation) {
  var selectedWriters = $('#writer-style-select').select2('data').map(item => item.text);
  var selectedStyles = $('#writing-style-select').select2('data').map(item => item.text);

  if (!selectedWriters.length || !selectedStyles.length) {
    alert('Please select at least one writer style and one writing style.');
    return;
  }

  $('#ai-result').text('Loading...');

  google.script.run
<<<<<<< HEAD
    .withSuccessHandler(function(suggestion) {
      if (suggestion.startsWith('Error:')) {
        $('#ai-result').text(suggestion);
=======
    .withSuccessHandler(function(text) {
      if (text) {
        google.script.run
          .withSuccessHandler(function(suggestion) {
            $('#ai-result').html(suggestion);
          })
          .withFailureHandler(function(error) {
            $('#ai-result').text('Error: ' + error);
          })
          .getAISuggestions(text, selectedWriters, selectedStyles, operation);
>>>>>>> parent of f9a9f65... add better error handling
      } else {
        $('#ai-result').html(suggestion);
      }
    })
    .withFailureHandler(function(error) {
      $('#ai-result').text('Error: ' + error.message);
    })
    .getAISuggestions(selectedWriters, selectedStyles, operation);
}

function handleFindQuotes() {
  // Implement the logic to find quotes
  google.script.run
    .withSuccessHandler(function(quotes) {
      $('#ai-result').html(quotes);
    })
    .withFailureHandler(function(error) {
      $('#ai-result').text('Error: ' + error.message);
    })
    .findQuotes();
}

function handleFindResources() {
  // Implement the logic to find resources
  google.script.run
    .withSuccessHandler(function(resources) {
      $('#citations-output').html(resources);
    })
    .withFailureHandler(function(error) {
      $('#citations-output').text('Error: ' + error.message);
    })
    .findCitations();
}

function checkTextSelection() {
  google.script.run.withSuccessHandler(updateUIBasedOnSelection).getSelectedText();
}

function updateUIBasedOnSelection(selectedText) {
  const hasSelection = selectedText.trim().length > 0;
  $('#no-selection-message').toggle(!hasSelection);
  $('#edit-btn, #rewrite-btn, #continue-btn, #find-quotes, #find-citations').prop('disabled', !hasSelection);
}
