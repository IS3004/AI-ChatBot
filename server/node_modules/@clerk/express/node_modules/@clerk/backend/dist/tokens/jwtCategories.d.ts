export declare const JWT_CATEGORY_SESSION_TOKEN = "cl_B7d4PD111AAA";
export declare const JWT_CATEGORY_JWT_TEMPLATE = "cl_B7d4PD222AAA";
export declare const JWT_CATEGORY_M2M_TOKEN = "cl_B7d4PD333AAA";
export declare const JWT_CATEGORY_IGNORE = "cl_I7d4PD111III";
/**
 * Whether `cat` marks a JWT as something other than a session token. Handshake tokens are
 * minted with the session-token category too. An absent `cat` is accepted for tokens minted
 * before the category rollout.
 */
export declare function isNonSessionJwtCategory(cat?: string): boolean;
/** Malformed tokens return `false`; signature verification is left to reject them. */
export declare function hasNonSessionJwtCategory(token: string): boolean;
//# sourceMappingURL=jwtCategories.d.ts.map