"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomUtils {
    escapeRegex(str) {
        return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }
    randAlphaNumeric(length) {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    genearteSecurityCode() {
        return Math.floor(100000 + Math.random() * 900000);
    }
}
exports.CustomUtils = CustomUtils;
//# sourceMappingURL=custom-utils.js.map