// src/auth/Auth0.js
import Auth0Lib from "react-native-auth0";  // 👈 rename the import

const Auth0 = new Auth0Lib({                // 👈 your exported instance uses capital A
  domain: "dev-50b7l3gq87zelfvn.us.auth0.com",
  clientId: "ivXMLy73Sa5I8MKI89OTfY19OLyeFEog",
});

export default Auth0;
