function onJQueryLoad() {
  // Your jQuery code here
  $(document).ready(function() {
    google.script.run.withSuccessHandler(onLoad).showSidebar();
  });
}

// Check if jQuery is loaded
if (typeof jQuery != 'undefined') {
  onJQueryLoad();
} else {
  // If jQuery isn't loaded yet, wait for it
  window.addEventListener('load', function() {
    if (typeof jQuery != 'undefined') {
      onJQueryLoad();
    } else {
      console.error('jQuery failed to load');
    }
  });
}

function onLoad() {
  google.script.run.withSuccessHandler(populateStyles).getWriterStyles();
}

function populateStyles(styles) {
  var select = $('#styleSelect');
  styles.forEach(function(style) {
    select.append(new Option(style, style));
  });
  
  select.select2({
    placeholder: "Select writing styles",
    allowClear: true
  });
}
