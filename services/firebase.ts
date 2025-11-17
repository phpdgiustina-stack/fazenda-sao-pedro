// This file no longer uses module imports for Firebase.
// Instead, it relies on the Firebase scripts being loaded globally in index.html,
// making the `firebase` object available on the `window`.
// This is a robust strategy to prevent module resolution conflicts.

// Cast window to `any` to access the globally loaded firebase object.
const globalFirebase = (window as any).firebase;

let auth: any = null;
let db: any = null;
let storage: any = null;
let googleProvider: any = null;
let Timestamp: any = null;
let FieldValue: any = null;

if (!globalFirebase) {
    console.error("A biblioteca Firebase não foi carregada. Verifique as tags <script> em seu index.html.");
} else {
    // Your web app's Firebase configuration is read from the window object.
    // This is set in the <script> tag in index.html.
    const firebaseConfig = (window as any).__FIREBASE_CONFIG__ || {};

    // CRITICAL FIX: Check for a valid config BEFORE initializing.
    // If the config is missing or has the placeholder key, we DO NOT initialize.
    // This prevents the app-crashing error that causes the black screen.
    if (firebaseConfig?.apiKey && firebaseConfig.apiKey !== 'YOUR_API_KEY') {
        // Initialize Firebase ONLY if the config is valid.
        if (!globalFirebase.apps.length) {
            globalFirebase.initializeApp(firebaseConfig);
        }

        // Get all required services from the now-initialized global object.
        auth = globalFirebase.auth();
        db = globalFirebase.firestore();
        storage = globalFirebase.storage();
        googleProvider = new globalFirebase.auth.GoogleAuthProvider();
        Timestamp = globalFirebase.firestore.Timestamp;
        FieldValue = globalFirebase.firestore.FieldValue;
    } else {
        console.warn("Configuração do Firebase não encontrada ou incompleta em window.__FIREBASE_CONFIG__. O aplicativo será executado em modo de erro para solicitar a configuração correta.");
        // auth, db, etc., will remain null, which will be handled by the UI.
    }
}

// Re-export the global object under the name 'firebase'.
const firebase = globalFirebase;

// Export everything for use throughout the app.
// If initialization failed, some of these will be null.
export {
    firebase,
    auth,
    db,
    storage,
    googleProvider,
    Timestamp,
    FieldValue
};
