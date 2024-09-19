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
  // Your initialization code here
  console.log('Sidebar loaded');
}
