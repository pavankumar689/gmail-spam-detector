// Send a message to the content script to get the latest result
function getResult() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'getResult' }, function (response) {
      const resultDiv = document.getElementById('result');
      if (response && response.result) {
        resultDiv.textContent = 'Result: ' + response.result.toUpperCase();
        if (response.result.toLowerCase() === 'spam') {
          resultDiv.style.color = '#e74c3c';
        } else if (response.result.toLowerCase() === 'ham') {
          resultDiv.style.color = '#2ecc40';
        } else {
          resultDiv.style.color = '#333';
        }
      } else {
        resultDiv.textContent = 'No email detected or not scanned yet.';
        resultDiv.style.color = '#333';
      }
    });
  });
}

document.getElementById('rescan').addEventListener('click', function () {
  const resultDiv = document.getElementById('result');
  resultDiv.textContent = 'Rescanning...';
  resultDiv.style.color = '#333';
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'rescan' }, function (response) {
      setTimeout(getResult, 1200); // Wait a bit for scan to complete
    });
  });
});

document.addEventListener('DOMContentLoaded', getResult); 