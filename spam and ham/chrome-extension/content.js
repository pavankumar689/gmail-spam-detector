let lastResult = null;
let lastMessage = null;
let resultTimeout = null;

function showResult(result) {
  let resultDiv = document.getElementById('spam-detector-result');
  if (!resultDiv) {
    resultDiv = document.createElement('div');
    resultDiv.id = 'spam-detector-result';
    resultDiv.style.position = 'fixed';
    resultDiv.style.top = '80px';
    resultDiv.style.right = '40px';
    resultDiv.style.zIndex = 9999;
    resultDiv.style.background = '#fff';
    resultDiv.style.border = '2px solid #333';
    resultDiv.style.padding = '10px 20px';
    resultDiv.style.fontSize = '18px';
    resultDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    resultDiv.style.borderRadius = '8px';
    resultDiv.style.display = 'flex';
    resultDiv.style.alignItems = 'center';
    // Dismiss button
    const closeBtn = document.createElement('span');
    closeBtn.textContent = '✖';
    closeBtn.style.marginLeft = '16px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => {
      clearTimeout(resultTimeout);
      resultDiv.remove();
    };
    resultDiv.appendChild(closeBtn);
    document.body.appendChild(resultDiv);
  }
  resultDiv.childNodes[0].textContent = `Spam Detector: ${result.toUpperCase()}`;
  // Highlight if spam
  if (result.toLowerCase() === 'spam') {
    resultDiv.style.background = '#ffeaea';
    resultDiv.style.border = '2px solid #e74c3c';
  } else {
    resultDiv.style.background = '#eaffea';
    resultDiv.style.border = '2px solid #2ecc40';
  }
  // Remove the result box after 3 seconds
  clearTimeout(resultTimeout);
  resultTimeout = setTimeout(() => {
    if (resultDiv && resultDiv.parentNode) {
      resultDiv.remove();
    }
  }, 3000);
}

function getEmailBodyText() {
  // Try to get all visible email bodies (Gmail can have multiple in conversation view)
  const bodies = Array.from(document.querySelectorAll('div.a3s'));
  // Filter out hidden or empty bodies
  const visibleBodies = bodies.filter(div => div.offsetParent !== null && div.innerText.trim().length > 0);
  // Join all visible bodies' text
  return visibleBodies.map(div => div.innerText.trim()).join('\n\n');
}

function scanEmail() {
  const message = getEmailBodyText();
  // Only scan if the message is different from the last scanned one
  if (message && message.length > 20 && message !== lastMessage) {
    lastMessage = message; // Only update here!
    fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    })
    .then(res => res.json())
    .then(data => {
      lastResult = data.result;
      showResult(data.result);
    })
    .catch(err => {
      lastResult = null;
      showResult('Error');
    });
  }
}

// Observe Gmail for new emails
const observer = new MutationObserver(() => {
  scanEmail();
});
observer.observe(document.body, { childList: true, subtree: true });

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getResult') {
    sendResponse({ result: lastResult });
  } else if (request.type === 'rescan') {
    scanEmail();
    setTimeout(() => sendResponse({ result: lastResult }), 1000); // Wait for scan
    return true; // async response
  }
});
