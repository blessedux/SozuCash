/// <reference types="chrome"/>// Type definitions for Chrome extension API

interface ChromeRuntime {
  sendMessage: (message: any) => void;
  onMessage: {
    addListener: (
      callback: (message: any, sender: any, sendResponse: Function) => void
    ) => void;
  };
  onInstalled: {
    addListener: (callback: (details: any) => void) => void;
  };
  getURL: (path: string) => string;
}

interface ChromeTabs {
  create: (createProperties: { url: string }) => void;
}

interface ChromeAction {
  onClicked: {
    addListener: (callback: (tab: any) => void) => void;
  };
}

declare global {
  interface Window {
    chrome: {
      runtime: ChromeRuntime;
      tabs: ChromeTabs;
      action: ChromeAction;
    };
  }
  
  const chrome: {
    runtime: ChromeRuntime;
    tabs: ChromeTabs;
    action: ChromeAction;
  };
} 