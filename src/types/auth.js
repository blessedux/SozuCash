/// <reference types="chrome"/>export interface User {
id: string;
username: string;
profile_image_url ?  : string;
export var AuthErrorCode;
(function (AuthErrorCode) {
    AuthErrorCode["UNAUTHORIZED"] = "unauthorized";
    AuthErrorCode["USER_CANCELLED"] = "user_cancelled";
    AuthErrorCode["POPUP_BLOCKED"] = "popup_blocked";
    AuthErrorCode["NETWORK_ERROR"] = "network_error";
    AuthErrorCode["CONSENT_REQUIRED"] = "consent_required";
})(AuthErrorCode || (AuthErrorCode = {}));
