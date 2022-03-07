import React from "react";
// import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import Button from "react-bootstrap/Button";
// import { useAuth0 } from "@auth0/auth0-react";

function handleLogin(instance) {
    instance.loginPopup(loginRequest).catch(e => {
        console.error(e);
    });
}

/**
 * Renders a button which, when selected, will open a popup for login
 */
// export const SignInButton = () => {
//     const { instance } = useMsal();

//     return (
//         <Button variant="secondary" className="ml-auto" onClick={() => handleLogin(instance)}>Sign in using Popup</Button>
//     );
// }

function generateVerifier() {
    const array = new Uint32Array(28)
    window.crypto.getRandomValues(array)
  
    return Array.from(array, (item) => `0${item.toString(16)}`.substr(-2)).join(
      ''
    )
  }

async function generateCodeChallenge(codeVerifier) {
    var digest = await window.crypto.subtle.digest("SHA-256",
        new TextEncoder().encode(codeVerifier));

    return window.btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

async function getToken(verifier, code) {
    const tenant = "f438bf46-6810-4949-a0d3-838cf39e6fef";
    const host = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`
    const clientId = '6f7f3232-f9a1-488b-848e-22caa6fea12f'
    const redirectUri = `http%3A%2F%2Flocalhost%3A3000`
    const grantType = 'authorization_code';
    // Get code from query params
    // const urlParams = new URLSearchParams(window.location.search)
    // const code = urlParams.get('code')
  
    // Build params to send to token endpoint
    const params = `client_id=${clientId}&
      grant_type=${grantType}&
      code_verifier=${verifier}&
      redirect_uri=${redirectUri}&
      code=${code}`
  
    // Make a POST request
    try {
      const response = await fetch(host, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      })
      const data = await response.json()
  
      // Token
      console.log(data)
    } catch (e) {
      console.log(e)
    }
  }

const getOAuthPopupFeatures = ({width, height, top}: Box) => {
    const {outerWidth, innerWidth, outerHeight, innerHeight, screenX, screenY} = window
    const startX = screenX + (outerWidth - innerWidth) / 2
    const startY = screenY + (outerHeight - innerHeight) / 2
    const left = Math.round(startX + (innerWidth - width) / 2)
    // 64 is the Parabol header
    const topOff = Math.round(startY + (innerHeight - height) / 2 + top)
    return `popup,width=${width},height=${height},left=${left},top=${topOff}`
  }

// fetch = window.fetch.bind(window)
async function openAuth() {
    // fetch = window.fetch.bind(window)
    const plainVerifier = generateVerifier();
    const code = await generateCodeChallenge(plainVerifier);
    const tenant = "f438bf46-6810-4949-a0d3-838cf39e6fef";
    const clientId = "6f7f3232-f9a1-488b-848e-22caa6fea12f";
    const redirect = "http%3A%2F%2Flocalhost%3A3000"
    // const url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=6731de76-14a6-49ae-97bc-6eba6914391e&response_type=code&redirect_uri=${redirect}&response_mode=query&scope=openid%20offline_access%20https%3A%2F%2Fgraph.microsoft.com%2Fmail.read&state=12345&code_challenge=${code}&code_challenge_method=S256`;
    const url = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirect}&response_mode=query&scope=openid%20offline_access%20https%3A%2F%2Fgraph.microsoft.com%2Fmail.read&state=12345&code_challenge=${code}&code_challenge_method=S256`;

    const popout = window.open(
        url, 
        "New OAuth",
        getOAuthPopupFeatures({width: 500, height: 750, top: 56})
    );
    // popout.close()
    const handler = (event) => {
        console.log(event);
        console.log(event.data)
        console.log(window.location.origin, ' ?= ', event.origin)
        if (typeof event.data !== 'object' || event.origin !== window.location.origin ) {
            console.log("misdirected!")
            return
        }
        const params = new URLSearchParams(popout.location.search);
        const authCode = params.get('code');
        const state = params.get('state');
        console.log(authCode);
        const token = getToken(plainVerifier, authCode);
        // const {code, state} = event.data
        // if (state !== providerState || typeof code !== 'string') return
        // submitMutation()
        // AddAtlassianAuthMutation(atmosphere, {code, teamId}, {onError, onCompleted})
        console.log(token);
        popout && popout.close()
        window.removeEventListener('message', handler)
    }
    window.addEventListener('message', handler)
    // listen for changes
    var currentPage = popout.location.href;
    setInterval(function()
    {
        if (currentPage != popout.location.href)
        {
            // page has changed, set new page as 'current'
            currentPage = popout.location.href;
    
            // your custom code here
            window.postMessage({'data': {'message': 'Redirect has occured.'}})
        }
    }, 500);
    // const token = getToken(plainVerifier, authCode)
    
    // window.postMessage("Auth flow started!")
}

export const SignInButton = () => {
    // const { instance } = useMsal();

    return (
        <Button variant="secondary" className="ml-auto" onClick={openAuth}>Sign in using Popup</Button>
    );
}
// export const SignInButton = () => {
//     const { loginWithRedirect } = useAuth0();

//     return (
//         <Button variant="secondary" className="ml-auto" onClick={() => loginWithRedirect()}>Sign in using Popup</Button>
//     );
// }