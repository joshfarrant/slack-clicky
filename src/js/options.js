document.getElementById('clear').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'CLEAR_STATE' }, (response) => {
    if (response.ok === true) {
      alert('Date cleared!'); // eslint-disable-line
    }
  });
}, false);
