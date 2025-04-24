/// <reference types="chrome"/>export const chromeConfig = {
manifest_version: 3,
    name;
"Sozu Wallet",
    version;
"1.0.0",
    description;
"Sozu Wallet Chrome Extension",
    action;
{
    default_popup: "index.html";
}
permissions: ["storage"],
    web_accessible_resources;
[{
        resources: ["assets/*"],
        matches: ["<all_urls>"]
    }];
;
