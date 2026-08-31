Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
const require_chunk = require('./_chunks/chunk-C_NdSu1c.js');
let js_cookie = require("js-cookie");
js_cookie = require_chunk.__toESM(js_cookie);

//#region src/cookie.ts
/**
* Creates helper methods for dealing with a specific cookie.
*
* @example
* ```ts
* const cookie = createCookieHandler('my_cookie')
*
* cookie.set('my_value');
* cookie.get() // 'my_value';
* cookie.remove()
* ```
*/
function createCookieHandler(cookieName) {
	return {
		get() {
			return js_cookie.default.get(cookieName);
		},
		/**
		* Setting a cookie will use some defaults such as path being set to "/".
		*/
		set(newValue, options = {}) {
			js_cookie.default.set(cookieName, newValue, options);
		},
		/**
		* On removing a cookie, you have to pass the exact same path/domain attributes used to set it initially
		* > IMPORTANT! When deleting a cookie and you're not relying on the default attributes, you must pass the exact same path, domain, secure and sameSite attributes that were used to set the cookie.
		*
		* @see https://github.com/js-cookie/js-cookie#basic-usage
		*/
		remove(cookieAttributes) {
			js_cookie.default.remove(cookieName, cookieAttributes);
		}
	};
}

//#endregion
exports.createCookieHandler = createCookieHandler;
//# sourceMappingURL=cookie.js.map