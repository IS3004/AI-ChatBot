import type { EnterpriseConnectionCustomAttributeJSON, EnterpriseConnectionJSON, EnterpriseConnectionOauthConfigJSON, EnterpriseConnectionSamlConnectionJSON, EnterpriseConnectionSamlConnectionLoginHintJSON } from './JSON';
/**
 * The `login_hint` configuration included on a Backend API {@link EnterpriseConnectionSamlConnection} response.
 */
export declare class EnterpriseConnectionSamlConnectionLoginHint {
    /** How the SAML connection emits the `login_hint` sent to the IdP: `'email_address'` sends the typed identifier, `'custom_attribute'` sends the value stored at the user `publicMetadata` key named by `source`, and `'off'` omits the `login_hint`. */
    readonly mode: 'email_address' | 'custom_attribute' | 'off';
    /** The user `publicMetadata` key the `login_hint` value is read from. Only set when `mode` is `'custom_attribute'`. */
    readonly source?: string | undefined;
    constructor(
    /** How the SAML connection emits the `login_hint` sent to the IdP: `'email_address'` sends the typed identifier, `'custom_attribute'` sends the value stored at the user `publicMetadata` key named by `source`, and `'off'` omits the `login_hint`. */
    mode: 'email_address' | 'custom_attribute' | 'off', 
    /** The user `publicMetadata` key the `login_hint` value is read from. Only set when `mode` is `'custom_attribute'`. */
    source?: string | undefined);
    static fromJSON(data: EnterpriseConnectionSamlConnectionLoginHintJSON): EnterpriseConnectionSamlConnectionLoginHint;
}
/**
 * A custom attribute mapping included on a Backend API {@link EnterpriseConnection} response.
 */
export declare class EnterpriseConnectionCustomAttribute {
    /** The display name of the custom attribute. */
    readonly name: string;
    /** The key the custom attribute is stored under. */
    readonly key: string;
    /** The SSO (SAML or OIDC) attribute path the value is read from. */
    readonly ssoPath: string;
    /** The SCIM attribute path the value is read from. */
    readonly scimPath: string;
    /** Whether the custom attribute holds multiple values. */
    readonly multiValued: boolean;
    constructor(
    /** The display name of the custom attribute. */
    name: string, 
    /** The key the custom attribute is stored under. */
    key: string, 
    /** The SSO (SAML or OIDC) attribute path the value is read from. */
    ssoPath: string, 
    /** The SCIM attribute path the value is read from. */
    scimPath: string, 
    /** Whether the custom attribute holds multiple values. */
    multiValued: boolean);
    static fromJSON(data: EnterpriseConnectionCustomAttributeJSON): EnterpriseConnectionCustomAttribute;
}
/**
 * The Backend `EnterpriseConnectionSamlConnection` object holds information about a SAML enterprise connection for an instance or organization.
 */
export declare class EnterpriseConnectionSamlConnection {
    /** The unique identifier for the SAML connection. */
    readonly id: string;
    /** The name to use as a label for the connection. */
    readonly name: string;
    /** The Entity ID as provided by the Identity Provider (IdP). */
    readonly idpEntityId: string | undefined;
    /** The Single-Sign On URL as provided by the Identity Provider (IdP). */
    readonly idpSsoUrl: string | undefined;
    /** The X.509 certificate as provided by the Identity Provider (IdP). */
    readonly idpCertificate: string | undefined;
    /** The Unix timestamp when the Identity Provider (IdP) certificate was issued. */
    readonly idpCertificateIssuedAt: number | undefined;
    /** The Unix timestamp when the Identity Provider (IdP) certificate expires. */
    readonly idpCertificateExpiresAt: number | undefined;
    /** The URL which serves the Identity Provider (IdP) metadata. */
    readonly idpMetadataUrl: string | undefined;
    /**
     * The XML content of the Identity Provider (IdP) metadata file.
     * @deprecated The Backend API does not return this field, so it is always `undefined`.
     */
    readonly idpMetadata: string | undefined;
    /** The Assertion Consumer Service (ACS) URL of the connection. */
    readonly acsUrl: string | undefined;
    /** The Entity ID as provided by the Service Provider (Clerk). */
    readonly spEntityId: string | undefined;
    /** The metadata URL as provided by the Service Provider (Clerk). */
    readonly spMetadataUrl: string | undefined;
    /**
     * Whether the connection syncs user attributes between the IdP and Clerk.
     * @deprecated The Backend API does not return this field on the nested SAML connection, so it is always `undefined`. Use the top-level `syncUserAttributes` on {@link EnterpriseConnection} instead.
     */
    readonly syncUserAttributes: boolean | undefined;
    /** Whether users with an email address subdomain are allowed to use this connection. */
    readonly allowSubdomains: boolean;
    /** Whether IdP-initiated SSO is allowed. */
    readonly allowIdpInitiated: boolean;
    /** Whether the SAML connection is active. */
    readonly active: boolean;
    /** Whether the SAML connection requires force authentication. */
    readonly forceAuthn: boolean;
    /** The `login_hint` configuration of the SAML connection. */
    readonly loginHint: EnterpriseConnectionSamlConnectionLoginHint;
    constructor(
    /** The unique identifier for the SAML connection. */
    id: string, 
    /** The name to use as a label for the connection. */
    name: string, 
    /** The Entity ID as provided by the Identity Provider (IdP). */
    idpEntityId: string | undefined, 
    /** The Single-Sign On URL as provided by the Identity Provider (IdP). */
    idpSsoUrl: string | undefined, 
    /** The X.509 certificate as provided by the Identity Provider (IdP). */
    idpCertificate: string | undefined, 
    /** The Unix timestamp when the Identity Provider (IdP) certificate was issued. */
    idpCertificateIssuedAt: number | undefined, 
    /** The Unix timestamp when the Identity Provider (IdP) certificate expires. */
    idpCertificateExpiresAt: number | undefined, 
    /** The URL which serves the Identity Provider (IdP) metadata. */
    idpMetadataUrl: string | undefined, 
    /**
     * The XML content of the Identity Provider (IdP) metadata file.
     * @deprecated The Backend API does not return this field, so it is always `undefined`.
     */
    idpMetadata: string | undefined, 
    /** The Assertion Consumer Service (ACS) URL of the connection. */
    acsUrl: string | undefined, 
    /** The Entity ID as provided by the Service Provider (Clerk). */
    spEntityId: string | undefined, 
    /** The metadata URL as provided by the Service Provider (Clerk). */
    spMetadataUrl: string | undefined, 
    /**
     * Whether the connection syncs user attributes between the IdP and Clerk.
     * @deprecated The Backend API does not return this field on the nested SAML connection, so it is always `undefined`. Use the top-level `syncUserAttributes` on {@link EnterpriseConnection} instead.
     */
    syncUserAttributes: boolean | undefined, 
    /** Whether users with an email address subdomain are allowed to use this connection. */
    allowSubdomains: boolean, 
    /** Whether IdP-initiated SSO is allowed. */
    allowIdpInitiated: boolean, 
    /** Whether the SAML connection is active. */
    active: boolean, 
    /** Whether the SAML connection requires force authentication. */
    forceAuthn: boolean, 
    /** The `login_hint` configuration of the SAML connection. */
    loginHint: EnterpriseConnectionSamlConnectionLoginHint);
    static fromJSON(data: EnterpriseConnectionSamlConnectionJSON): EnterpriseConnectionSamlConnection;
}
/**
 * OAuth configuration included on a Backend API {@link EnterpriseConnection} response.
 */
export declare class EnterpriseConnectionOauthConfig {
    /**
     * The unique identifier for the OAuth configuration.
     */
    readonly id: string;
    /**
     * The name to use as a label for the configuration.
     */
    readonly name: string;
    /**
     * The OAuth client ID.
     */
    readonly clientId: string | undefined;
    /**
     * The OpenID Connect discovery URL.
     */
    readonly discoveryUrl: string | undefined;
    /**
     * The public URL of the OAuth provider logo, if available.
     */
    readonly logoPublicUrl: string | undefined;
    /**
     * The date when the configuration was first created.
     */
    readonly createdAt: number;
    /**
     * The date when the configuration was last updated.
     */
    readonly updatedAt: number;
    /**
     * The OAuth provider key of the configuration. For example, `'custom_oidc'`.
     */
    readonly providerKey: string;
    /**
     * The OAuth authorization URL.
     */
    readonly authUrl: string | undefined;
    /**
     * The OAuth token URL.
     */
    readonly tokenUrl: string | undefined;
    /**
     * The OAuth user info URL.
     */
    readonly userInfoUrl: string | undefined;
    /**
     * Whether the OAuth configuration requires PKCE.
     */
    readonly requiresPkce: boolean;
    constructor(
    /**
     * The unique identifier for the OAuth configuration.
     */
    id: string, 
    /**
     * The name to use as a label for the configuration.
     */
    name: string, 
    /**
     * The OAuth client ID.
     */
    clientId: string | undefined, 
    /**
     * The OpenID Connect discovery URL.
     */
    discoveryUrl: string | undefined, 
    /**
     * The public URL of the OAuth provider logo, if available.
     */
    logoPublicUrl: string | undefined, 
    /**
     * The date when the configuration was first created.
     */
    createdAt: number, 
    /**
     * The date when the configuration was last updated.
     */
    updatedAt: number, 
    /**
     * The OAuth provider key of the configuration. For example, `'custom_oidc'`.
     */
    providerKey: string, 
    /**
     * The OAuth authorization URL.
     */
    authUrl: string | undefined, 
    /**
     * The OAuth token URL.
     */
    tokenUrl: string | undefined, 
    /**
     * The OAuth user info URL.
     */
    userInfoUrl: string | undefined, 
    /**
     * Whether the OAuth configuration requires PKCE.
     */
    requiresPkce: boolean);
    static fromJSON(data: EnterpriseConnectionOauthConfigJSON): EnterpriseConnectionOauthConfig;
}
/**
 * The Backend `EnterpriseConnection` object holds information about an enterprise connection (SAML or OAuth) for an instance or organization.
 */
export declare class EnterpriseConnection {
    /**
     * The unique identifier for the connection.
     */
    readonly id: string;
    /**
     * The name to use as a label for the connection.
     */
    readonly name: string;
    /**
     * The domain of the enterprise. Sign-in flows using an email with this domain may use the connection.
     */
    readonly domains: Array<string>;
    /**
     * The Organization ID if the connection is scoped to an organization.
     */
    readonly organizationId: string | null;
    /**
     * Whether the connection is active or not.
     */
    readonly active: boolean;
    /**
     * Whether the connection syncs user attributes between the IdP and Clerk or not.
     */
    readonly syncUserAttributes: boolean;
    /**
     * Whether users with an email address subdomain are allowed to use this connection or not.
     * @deprecated The Backend API does not return this field at the top level, so it is always `undefined`. Use `samlConnection.allowSubdomains` instead.
     */
    readonly allowSubdomains: boolean | undefined;
    /**
     * Whether additional identifications are disabled for this connection.
     */
    readonly disableAdditionalIdentifications: boolean;
    /**
     * The date when the connection was first created.
     */
    readonly createdAt: number;
    /**
     * The date when the connection was last updated.
     */
    readonly updatedAt: number;
    /**
     * SAML connection details when the enterprise connection uses SAML.
     */
    readonly samlConnection: EnterpriseConnectionSamlConnection | null;
    /**
     * OAuth (OIDC) configuration when the enterprise connection uses OAuth.
     */
    readonly oauthConfig: EnterpriseConnectionOauthConfig | null;
    /**
     * The identity provider (IdP) of the connection. For example, `'saml_custom'` or `'oidc_custom'`.
     */
    readonly provider: string;
    /**
     * The public URL of the provider logo, if available.
     */
    readonly logoPublicUrl: string | undefined;
    /**
     * Whether existing users who are members of the organization can link their account to their enterprise identity.
     */
    readonly allowOrganizationAccountLinking: boolean;
    /**
     * Whether the connection can be used for sign-in and sign-up.
     */
    readonly authenticatable: boolean;
    /**
     * Whether Just-in-Time (JIT) provisioning of users is disabled for the connection.
     */
    readonly disableJitProvisioning: boolean;
    /**
     * The custom attribute mappings of the connection. Only returned when the custom attributes feature is enabled for the instance.
     */
    readonly customAttributes: EnterpriseConnectionCustomAttribute[] | undefined;
    constructor(
    /**
     * The unique identifier for the connection.
     */
    id: string, 
    /**
     * The name to use as a label for the connection.
     */
    name: string, 
    /**
     * The domain of the enterprise. Sign-in flows using an email with this domain may use the connection.
     */
    domains: Array<string>, 
    /**
     * The Organization ID if the connection is scoped to an organization.
     */
    organizationId: string | null, 
    /**
     * Whether the connection is active or not.
     */
    active: boolean, 
    /**
     * Whether the connection syncs user attributes between the IdP and Clerk or not.
     */
    syncUserAttributes: boolean, 
    /**
     * Whether users with an email address subdomain are allowed to use this connection or not.
     * @deprecated The Backend API does not return this field at the top level, so it is always `undefined`. Use `samlConnection.allowSubdomains` instead.
     */
    allowSubdomains: boolean | undefined, 
    /**
     * Whether additional identifications are disabled for this connection.
     */
    disableAdditionalIdentifications: boolean, 
    /**
     * The date when the connection was first created.
     */
    createdAt: number, 
    /**
     * The date when the connection was last updated.
     */
    updatedAt: number, 
    /**
     * SAML connection details when the enterprise connection uses SAML.
     */
    samlConnection: EnterpriseConnectionSamlConnection | null, 
    /**
     * OAuth (OIDC) configuration when the enterprise connection uses OAuth.
     */
    oauthConfig: EnterpriseConnectionOauthConfig | null, 
    /**
     * The identity provider (IdP) of the connection. For example, `'saml_custom'` or `'oidc_custom'`.
     */
    provider: string, 
    /**
     * The public URL of the provider logo, if available.
     */
    logoPublicUrl: string | undefined, 
    /**
     * Whether existing users who are members of the organization can link their account to their enterprise identity.
     */
    allowOrganizationAccountLinking: boolean, 
    /**
     * Whether the connection can be used for sign-in and sign-up.
     */
    authenticatable: boolean, 
    /**
     * Whether Just-in-Time (JIT) provisioning of users is disabled for the connection.
     */
    disableJitProvisioning: boolean, 
    /**
     * The custom attribute mappings of the connection. Only returned when the custom attributes feature is enabled for the instance.
     */
    customAttributes: EnterpriseConnectionCustomAttribute[] | undefined);
    static fromJSON(data: EnterpriseConnectionJSON): EnterpriseConnection;
}
//# sourceMappingURL=EnterpriseConnection.d.ts.map