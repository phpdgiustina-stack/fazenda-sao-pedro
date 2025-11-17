
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppUser } from './types';
import { auth } from './services/firebase';
import Spinner from './components/common/Spinner';

// --- REAL ANONYMOUS AUTHENTICATION ---
// To solve persistent write errors, we are now using Firebase's anonymous
// authentication. This creates a real, temporary user session, allowing the
// app to securely interact with Firestore according to the security rules,
// which require an authenticated user (request.auth != null).

const RootComponent: React.FC = () => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If auth is null, it means Firebase wasn't configured correctly or failed to initialize.
    if (!auth) {
        setError(
            "A configuração do Firebase é inválida ou está ausente. " +
            "O aplicativo não pode se conectar ao banco de dados."
        );
        setLoading(false);
        return;
    }

    // This function attempts to sign in the user anonymously.
    const signInAnonymously = async () => {
      try {
        await auth.signInAnonymously();
        // The onAuthStateChanged listener below will handle setting the user state.
      } catch (authError: any) { // Using `any` to safely access `code` property
        console.error("Anonymous sign-in failed:", authError);
        if (authError.code === 'auth/admin-restricted-operation' || authError.code === 'auth/operation-not-allowed') {
            setError(
                "A autenticação anônima não está ativada no seu projeto Firebase. " +
                "Para que o aplicativo funcione, você precisa habilitar este método de login."
            );
        } else {
            setError("Não foi possível autenticar com o servidor. Verifique sua conexão e a configuração do Firebase.");
        }
        setLoading(false);
      }
    };

    // Listen for authentication state changes.
    const unsubscribe = auth.onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        // User is signed in.
        const appUser: AppUser = {
          uid: firebaseUser.uid,
          displayName: 'Usuário Convidado', // Anonymous users don't have a display name.
          email: null,
          photoURL: null,
        };
        setUser(appUser);
        setError(null);
        setLoading(false);
      } else {
        // No user is signed in, so we attempt to sign them in.
        signInAnonymously();
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-900 flex flex-col justify-center items-center text-white">
        <Spinner />
        <p className="mt-4">Autenticando sessão...</p>
      </div>
    );
  }

  if (error || !user) {
    const isAnonAuthError = error?.includes("autenticação anônima não está ativada");
    const isFirebaseConfigError = error?.includes("configuração do Firebase é inválida");
    const isConfigError = isAnonAuthError || isFirebaseConfigError;

    const renderErrorDetails = () => {
        if (isFirebaseConfigError) {
            return (
              <ol className="list-decimal list-inside space-y-2 text-base-200">
                  <li>Acesse o <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-brand-primary-light underline hover:text-brand-primary">Console do Firebase</a> e selecione seu projeto.</li>
                  <li>Clique no ícone de engrenagem (⚙️) e vá para <strong className="text-base-100">Configurações do Projeto</strong>.</li>
                  <li>Na aba "Geral", role para baixo até a seção "Seus apps".</li>
                  <li>Selecione seu app da Web e na seção "SDK setup and configuration", escolha a opção <strong className="text-base-100">"Config"</strong>.</li>
                  {/* FIX: Replaced template literal with escaped curly braces to fix Netlify build error. */}
                  <li><strong className="text-yellow-300">Copie o objeto de configuração inteiro</strong>, que começa com <code className="bg-base-700 px-1 rounded text-sm">const firebaseConfig = {'{'} ... {'}'}</code>.</li>
                  <li>Abra o arquivo <code className="bg-base-700 px-1 rounded text-sm">index.html</code> no seu editor de código.</li>
                  <li>Encontre o script que define <code className="bg-base-700 px-1 rounded text-sm">window.__FIREBASE_CONFIG__</code> e <strong className="text-yellow-300">substitua o objeto de exemplo INTEIRO</strong> pelo que você copiou do Firebase.</li>
                  <li>Salve o arquivo e <strong className="text-base-100">recarregue esta página</strong>.</li>
              </ol>
            );
        }
        if (isAnonAuthError) {
            return (
              <ol className="list-decimal list-inside space-y-2 text-base-200">
                  <li>Acesse o <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-brand-primary-light underline hover:text-brand-primary">Console do Firebase</a>.</li>
                  <li>Selecione o seu projeto.</li>
                  <li>No menu à esquerda, vá para <strong className="text-base-100">Authentication</strong> (na seção Compilação).</li>
                  <li>Clique na aba <strong className="text-base-100">Sign-in method</strong> (ou "Método de login").</li>
                  <li>Encontre <strong className="text-base-100">Anônimo</strong> na lista de provedores e clique no ícone de lápis para editar.</li>
                  <li>Ative o provedor e clique em <strong className="text-base-100">Salvar</strong>.</li>
                  <li>Após salvar, <strong className="text-base-100">recarregue esta página</strong>.</li>
              </ol>
            );
        }
        return null;
    };

    return (
      <div className="min-h-screen bg-base-900 flex flex-col justify-center items-center text-white p-8 text-center">
         <h2 className="text-2xl font-bold text-red-400 mb-4">
            {isConfigError ? "Ação Necessária: Configuração" : "Erro de Conexão"}
         </h2>
        <p className="max-w-2xl">
            {error || "Ocorreu um erro inesperado. Por favor, recarregue a página."}
        </p>
        {isConfigError && (
            <div className="mt-6 bg-base-800 p-6 rounded-lg text-left max-w-3xl w-full">
                <p className="font-bold text-lg mb-2">Como resolver:</p>
                {renderErrorDetails()}
            </div>
        )}
      </div>
    );
  }

  return <App user={user} />;
};


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>
);