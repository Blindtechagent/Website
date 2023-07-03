window.addEventListener('load', function() {
      setTimeout(function() {
        var preloader = document.querySelector('.preloader');
        preloader.remove(); // Remove the preloader element from the document
      }, 3000);

      setTimeout(function() {
        var loadingText = document.getElementById('loading-text');
        loadingText.textContent = 'LOADING finish';
        loadingText.focus(); // Set focus to the loading text
      }, 2000);
    });
  