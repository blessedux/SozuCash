// Constants for DOM element IDs
export const INJECTED_CONTAINER_ID = 'sozucash-injected-container';
export const INJECTED_IFRAME_ID = 'sozucash-injected-iframe';
export const HIDE_ORIGINAL_CLASS = 'sozu-hide-original';

// SVG path for the wallet icon
export const walletIconPath = 'M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8zm-7-8.5c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zm0 5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z';

// CSS Styles as a template string
export const getComponentStyles = () => `
    /* Button Styles */
    .sozu-wallet-button {
      display: inline-flex;
      align-items: center;
      height: 50px;
      padding: 0 16px;
      border-radius: 9999px;
      transition: background-color 0.2s;
      text-decoration: none;
      cursor: pointer;
      margin: 4px 0 4px 6px;
      box-sizing: border-box;
      width: auto;
      position: relative;
      color: rgb(231, 233, 234);
    }

    .sozu-wallet-button:hover {
      background-color: rgba(231, 233, 234, 0.1);
    }

    .sozu-wallet-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      margin-right: 12px;
    }

    .sozu-wallet-icon img {
      border-radius: 6px;
    }

    .sozu-wallet-icon svg {
      width: 26px;
      height: 26px;
      fill: rgb(231, 233, 234);
      stroke: rgb(231, 233, 234);
      stroke-width: 0.2;
    }

    .sozu-wallet-text {
      font-family: "Segoe UI", Helvetica, Arial, sans-serif;
      color: rgb(231, 233, 234);
      font-size: 20px;
      font-weight: 400;
      letter-spacing: normal;
      margin-right: 0;
      white-space: nowrap;
    }

    /* Styles for the injected UI container and iframe */
    #${INJECTED_CONTAINER_ID} {
      width: 350px;
      height: 600px;
      margin-top: 0;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      overflow: hidden;
      position: fixed;
      z-index: 1000;
      pointer-events: auto !important;
      
      /* Transition Styles */
      opacity: 0;
      filter: blur(8px);
      visibility: hidden;
      transition: opacity 0.5s ease-in-out, filter 0.5s ease-in-out, visibility 0s linear 0.5s;
    }
    
    #${INJECTED_CONTAINER_ID}.visible {
        opacity: 1;
        filter: blur(0);
        visibility: visible;
        transition: opacity 0.5s ease-in-out, filter 0.5s ease-in-out, visibility 0s linear 0s;
    }

    #${INJECTED_IFRAME_ID} {
      display: block;
      width: 350px;
      height: 600px;
      border: none;
      pointer-events: auto !important;
    }

    /* Active state for the button icon */
    .sozu-wallet-button.active .sozu-wallet-icon img {
        filter: invert(1);
    }
    
    /* Media Query for smaller screens */
    @media (max-width: 1280px) {
        .sozu-wallet-button .sozu-wallet-text {
            display: none;
        }
        .sozu-wallet-button .sozu-wallet-icon {
            margin-right: 0;
        }
        .sozu-wallet-button {
             padding: 0 12px;
             width: 50px;
        }
    }
`; 