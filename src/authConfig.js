export const msalConfig = {
    auth: {
      clientId: "9AA6B608-AAF2-4B34-81E4-E68C3F572FBB/user_impersonation",
      authority: "https://app.vssps.visualstudio.com", // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
      protocolMode: "OIDC",
      redirectUri: "https://localhost:3000",
    },
    cache: {
      cacheLocation: "sessionStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
  };
  
  // Add scopes here for ID token to be used at Microsoft identity platform endpoints.
  export const loginRequest = {
   scopes: ["vso.work_write"]
  };
  
  // Add the endpoints here for Microsoft Graph API services you'd like to use.
  export const graphConfig = {
      graphMeEndpoint: "Enter_the_Graph_Endpoint_Here/v1.0/me"
  };