
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppUser } from './types';
import { auth, googleProvider } from './services/firebase';
import Spinner from './components/common/Spinner';
import { SparklesIcon } from './components/common/Icons';

// --- GOOGLE AUTHENTICATION ---
// O sistema de autenticação anônima foi substituído por "Login com Google".
// Isso permite que os usuários tenham contas persistentes e acessem seus
// dados de múltiplos dispositivos.

const GoogleIcon: React.FC = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.332,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);


const LoginScreen: React.FC<{ onLogin: () => Promise<void> }> = ({ onLogin }) => {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    const handleLoginClick = async () => {
        setIsLoggingIn(true);
        setLoginError(null);
        try {
            await onLogin();
            // On success, the onAuthStateChanged listener will handle the UI transition.
        } catch (error: any) {
            if (error.code !== 'auth/popup-closed-by-user') {
                 setLoginError("Falha no login. Por favor, tente novamente.");
            }
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-900 flex flex-col justify-center items-center text-white p-8 text-center">
            <SparklesIcon className="h-16 w-16 text-brand-primary-light mb-4" />
            <h1 className="text-4xl font-bold">São Pedro IA</h1>
            <p className="text-base-300 mt-2">Gerencie seu rebanho com inteligência.</p>
            <div className="mt-12">
                <button
                    onClick={handleLoginClick}
                    disabled={isLoggingIn}
                    className="inline-flex items-center bg-white text-gray-700 font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                    {isLoggingIn ? <Spinner /> : <GoogleIcon />}
                    <span>Entrar com Google</span>
                </button>
                {loginError && <p className="text-red-400 mt-4">{loginError}</p>}
            </div>
        </div>
    );
};


const RootComponent: React.FC = () => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
        setError(
            "A configuração do Firebase é inválida ou está ausente. " +
            "O aplicativo não pode se conectar ao banco de dados."
        );
        setLoading(false);
        return;
    }
    
    const unsubscribe = auth.onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        const appUser: AppUser = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || 'Usuário',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        };
        setUser(appUser);
        setError(null);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const handleGoogleLogin = async () => {
      if (!auth || !googleProvider) {
          throw new Error("Autenticação não inicializada.");
      }
      await auth.signInWithPopup(googleProvider);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-base-900 flex flex-col justify-center items-center text-white">
        <Spinner />
        <p className="mt-4">Autenticando sessão...</p>
      </div>
    );
  }

  if (error) {
    const isFirebaseConfigError = error?.includes("configuração do Firebase é inválida");

    return (
      <div className="min-h-screen bg-base-900 flex flex-col justify-center items-center text-white p-8 text-center">
         <h2 className="text-2xl font-bold text-red-400 mb-4">
            {isFirebaseConfigError ? "Ação Necessária: Configuração" : "Erro de Conexão"}
         </h2>
        <p className="max-w-2xl">
            {error || "Ocorreu um erro inesperado. Por favor, recarregue a página."}
        </p>
        {isFirebaseConfigError && (
            <div className="mt-6 bg-base-800 p-6 rounded-lg text-left max-w-3xl w-full">
                <p className="font-bold text-lg mb-2">Como resolver:</p>
                <ol className="list-decimal list-inside space-y-2 text-base-200">
                  <li>Acesse o <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-brand-primary-light underline hover:text-brand-primary">Console do Firebase</a> e selecione seu projeto.</li>
                  <li>Clique no ícone de engrenagem (⚙️) e vá para <strong className="text-base-100">Configurações do Projeto</strong>.</li>
                  <li>Na aba "Geral", role para baixo até a seção "Seus apps".</li>
                  <li>Selecione seu app da Web e na seção "SDK setup and configuration", escolha a opção <strong className="text-base-100">"Config"</strong>.</li>
                  <li><strong className="text-yellow-300">Copie o objeto de configuração inteiro</strong>, que começa com <code className="bg-base-700 px-1 rounded text-sm">const firebaseConfig = {'{'} ... {'}'}</code>.</li>
                  <li>Abra o arquivo <code className="bg-base-700 px-1 rounded text-sm">index.html</code> no seu editor de código.</li>
                  <li>Encontre o script que define <code className="bg-base-700 px-1 rounded text-sm">window.__FIREBASE_CONFIG__</code> e <strong className="text-yellow-300">substitua o objeto de exemplo INTEIRO</strong> pelo que você copiou do Firebase.</li>
                  <li>Salve o arquivo e <strong className="text-base-100">recarregue esta página</strong>.</li>
              </ol>
            </div>
        )}
      </div>
    );
  }

  if (!user) {
      return <LoginScreen onLogin={handleGoogleLogin} />;
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