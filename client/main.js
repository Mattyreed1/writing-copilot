$(function() {
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

  $(document).ready(function() {
    google.script.run.withSuccessHandler(onLoad).showSidebar();
  });
});
