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
    .withSuccessHandler(function(suggestion) {
      if (suggestion.startsWith('Error:')) {
        $('#ai-result').text(suggestion);
      } else {
        $('#ai-result').html(suggestion);
      }
    })
    .withFailureHandler(function(error) {
      $('#ai-result').text('Error: ' + error.message);
    })
    .getAISuggestions(selectedWriters, selectedStyles, operation);
}

function displayAIResult(result) {
  $('#ai-result').html(result);
}

function handleError(error) {
  $('#ai-result').text('Error: ' + error.message);
}

$(document).ready(function() {
  // Initialize Select2
  $('#writer-style-select, #writing-style-select').select2({
    width: '100%',
    placeholder: function() {
      return $(this).attr('placeholder');
    },
    allowClear: true,
    multiple: true
  });

  // Load writer styles
  google.script.run.withSuccessHandler(function(styles) {
    var select = $('#writer-style-select');
    styles.forEach(function(style) {
      select.append($('<option></option>').val(style).text(style));
    });
    select.trigger('change');
  }).getWriterStyles();

  // Load writing styles
  google.script.run.withSuccessHandler(function(styles) {
    var select = $('#writing-style-select');
    styles.forEach(function(style) {
      select.append($('<option></option>').val(style).text(style));
    });
    select.trigger('change');
  }).getWritingStyles();

  // AI Suggestions button click handlers
  $('#edit-btn').click(() => handleAIOperation('edit'));
  $('#rewrite-btn').click(() => handleAIOperation('rewrite'));
  $('#continue-btn').click(() => handleAIOperation('continue'));

  // Find quotes and resources button click handlers
  $('#find-quotes').click(handleFindQuotes);
  $('#find-citations').click(handleFindResources);

  // Check for initial text selection
  checkTextSelection();

  // Check for text selection periodically
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
    .withSuccessHandler(function(suggestion) {
      if (suggestion.startsWith('Error:')) {
        $('#ai-result').text(suggestion);
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
  // ... (keep the existing code)
}

function handleFindResources() {
  // ... (keep the existing code)
}

function checkTextSelection() {
  google.script.run.withSuccessHandler(updateUIBasedOnSelection).getSelectedText();
}

function updateUIBasedOnSelection(selectedText) {
  const hasSelection = selectedText.trim().length > 0;
  $('#no-selection-message').toggle(!hasSelection);
  $('#edit-btn, #rewrite-btn, #continue-btn, #find-quotes, #find-citations').prop('disabled', !hasSelection);
}
