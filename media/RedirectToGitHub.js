function redirectToGitHub() {
    var currentURL = window.location.href; 
    var urlObject = new URL(currentURL); 
  
    var domain = urlObject.hostname;
    var path = urlObject.pathname;
  
    if (path.charAt(0) === '/') {
      path = path.substr(1);
    }
  
    var gitHubURL = 'https://github.com/Nick-DL/nick-dl.github.io/blob/main/' + path;
  
    window.location.href = gitHubURL;
  }

function EditToGitHub() {
    var currentURL = window.location.href; 
    var urlObject = new URL(currentURL); 
  
    var domain = urlObject.hostname;
    var path = urlObject.pathname;
  
    if (path.charAt(0) === '/') {
      path = path.substr(1);
    }
  
    var gitHubEditURL = 'https://github.com/Nick-DL/nick-dl.github.io/edit/main/' + path;
  
    if (!window.location.href.endsWith("index.html")) {
      window.location.href = gitHubEditURL + "index.html";
    }

    else {
      window.location.href = gitHubEditURL;
    }
  }