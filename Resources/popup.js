const activateRightClickButton = document.getElementById('toggle-button');
const statusText = document.getElementById("status");

activateRightClickButton.addEventListener('click', (event) => {
  // Update the popup UI
  statusText.textContent = "Right-Click Mode Enabled";
  statusText.style.color = "green"; // Optional color change for emphasis

  activateRightClickButton.disabled = true;
  activateRightClickButton.textContent = "Waiting for Click...";

  // Query the active tab before injecting the content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // Use the Scripting API to execute a script
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: activateRightClick
    });
  });
});

// this function will execute in the client page
function activateRightClick() {
  const debug = false;

  function clickActions(event) {
    if (debug) {
      console.log("click");
    }
  
    if (debug) {
      console.log("Simulating right click operation");
    }
      
    // Prevent the default left-click action
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();
  
    // Create a new contextmenu event (right-click equivalent)
    const rightClickEvent = new MouseEvent('contextmenu', {
      bubbles: true,   // Ensures the event bubbles up to the DOM
      cancelable: false, // Allows the event to be canceled
      view: window,    // The view in which the event is generated
      clientX: event.clientX, // Mouse X-coordinate
      clientY: event.clientY, // Mouse Y-coordinate
    });
  
    if (debug) {
      console.log("click::::" + event.x + ", Y: " + event.y + "\n" + event.target);
    }
  
  
    // Remove the toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 500); // Remove from DOM after fade-out
    }, 50);
  
    event.target.dispatchEvent(rightClickEvent);
  
    document.removeEventListener('click', event);
  
  }

  const toast = document.createElement('div');

  // Create and show the toast
  function createToast() {
    // Check if a toast already exists
    if (document.getElementById('right-click-toast')) {
      return;
    }

    toast.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
    }, true);

    // Create a toast element
    toast.id = 'right-click-toast';
    toast.innerHTML = `
      <span>Right-Click Mode is Enabled</span>
      `;
      // <button id="cancel-right-click">Cancel</button>

    // Add CSS for the toast
    const style = document.createElement('style');
    style.textContent = `
      #right-click-toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.3);
        font-family: Arial, sans-serif;
        font-size: 14px;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
      }

      #right-click-toast.show {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);

    // Append the toast to the body
    document.body.appendChild(toast);

    // Show the toast
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
  }

  // Remove the toast and the click listener
  function exitRightClickMode() {
    if (debug) {
      console.log("Exiting Right-Click Mode");
    }

    // Remove the event listener
    document.removeEventListener('click', clickActions, true);
  }

  // Initialize Right-Click Mode
  createToast();

  document.addEventListener('click', clickActions, {
    capture: true, // Trigger the listener in the capturing phase
    once: true,   // Allow multiple clicks
  });
}
