// This file no longer uses module imports for Firebase.
// Instead, it relies on the Firebase scripts being loaded globally in index.html,
// making the `firebase` object available on the `window`.
// This is a robust strategy to prevent module resolution conflicts.

// Cast window to `any` to access the globally loaded firebase object.
const globalFirebase = (window as any).firebase;

if (!globalFirebase) {
    throw new Error("A biblioteca Firebase não foi carregada. Verifique as tags <script> em seu index.html.");
}

// Your web app's Firebase configuration is read from the window object.
// This is set in the <script> tag in index.html.
const firebaseConfig = (window as any).__FIREBASE_CONFIG__;

if (!firebaseConfig?.apiKey) {
    // Throwing an error provides a clearer failure mode than just logging.
    throw new Error("Configuração do Firebase não encontrada em window.__FIREBASE_CONFIG__. Verifique seu arquivo index.html.");
}

// Initialize Firebase using the global object.
if (!globalFirebase.apps.length) {
    globalFirebase.initializeApp(firebaseConfig);
}

// Get all required services from the now-guaranteed-to-be-augmented global object.
const auth = globalFirebase.auth();
const db = globalFirebase.firestore();
const storage = globalFirebase.storage();
const googleProvider = new globalFirebase.auth.GoogleAuthProvider();
const Timestamp = globalFirebase.firestore.Timestamp;
const FieldValue = globalFirebase.firestore.FieldValue;

// Re-export the global object under the name 'firebase'.
// This maintains the same contract for other files in the app,
// which expect to import `firebase` and use types like `firebase.User`.
const firebase = globalFirebase;


// Export everything for use throughout the app.
export {
    firebase,
    auth,
    db,
    storage,
    googleProvider,
    Timestamp,
    FieldValue
};