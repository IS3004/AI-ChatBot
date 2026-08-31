Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

//#region src/patchRequest.ts
/**
* Clones a request without its body or signal for authentication.
*
* @internal
*/
const patchRequest = (request) => {
	const clonedRequest = new Request(request.url, {
		headers: request.headers,
		method: request.method,
		redirect: request.redirect,
		cache: request.cache
	});
	if (clonedRequest.method !== "GET" && clonedRequest.body !== null && !("duplex" in clonedRequest)) clonedRequest.duplex = "half";
	return clonedRequest;
};

//#endregion
exports.patchRequest = patchRequest;
//# sourceMappingURL=patchRequest.js.map