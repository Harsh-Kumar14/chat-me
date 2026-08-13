// import { initializeApp, cert } from "firebase-admin";

// import serviceAccount from "../serviceAccountKey.json" with {type: "json"};

// export const app=initializeApp({
//     credential:cert(serviceAccount)
// })

import { initializeApp, cert } from "firebase-admin";

const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString("utf8")
);

export const app = initializeApp({
  credential: cert(serviceAccount),
});