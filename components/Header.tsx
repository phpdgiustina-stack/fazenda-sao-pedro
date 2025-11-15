import React from 'react';
import { DocumentChartBarIcon, SparklesIcon, PlusIcon, CalendarDaysIcon, ClipboardDocumentCheckIcon, MapPinIcon } from './common/Icons';
// FIX: Centralized Firebase imports. Now importing everything from the single source of truth.
import { AppUser } from '../types';

type ViewType = 'dashboard' | 'reports' | 'calendar' | 'tasks' | 'management';

interface HeaderProps {
    currentView: ViewType;
    setCurrentView: (view: ViewType) => void;
    onAddAnimalClick: () => void;
    // FIX: Corrected the type for the Firebase user object to `firebase.auth.User`.
    user: AppUser;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, onAddAnimalClick, user }) => {
  const NavButton: React.FC<{view: ViewType, label: string, children: React.ReactNode}> = ({ view, label, children }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`px-3 py-2 flex items-center gap-2 text-sm font-medium rounded-md transition-colors ${
        currentView === view ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-base-700 hover:text-white'
      }`}
    >
      {children}
      {label}
    </button>
  );

  const handleLogout = () => {
    // With mock authentication, logout is disabled.
    // In a real app, this would be: auth.signOut();
    alert("O logout está desabilitado no modo de demonstração.");
  };

  return (
    <header className="bg-base-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <SparklesIcon className="h-8 w-8 text-brand-primary-light" />
            <span className="ml-3 text-xl font-bold text-white">São Pedro IA</span>
          </div>
          <div className="flex items-center">
            <nav className="hidden md:flex space-x-1 sm:space-x-2">
               <NavButton view="dashboard" label="Painel">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
               </NavButton>
                <NavButton view="management" label="Manejo">
                  <MapPinIcon className="w-5 h-5"/>
               </NavButton>
                <NavButton view="calendar" label="Agenda">
                  <CalendarDaysIcon className="w-5 h-5"/>
               </NavButton>
                <NavButton view="tasks" label="Tarefas">
                  <ClipboardDocumentCheckIcon className="w-5 h-5"/>
               </NavButton>
               <NavButton view="reports" label="Relatórios">
                  <DocumentChartBarIcon className="w-5 h-5"/>
               </NavButton>
            </nav>
            <button
                onClick={onAddAnimalClick}
                className="ml-4 flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-dark focus:ring-offset-base-900 transition-colors"
                aria-label="Cadastrar Novo Animal"
            >
                <PlusIcon className="w-5 h-5" />
                <span className="hidden sm:inline ml-2">Cadastrar</span>
            </button>
             <div className="ml-4 flex items-center">
                <span className="text-sm text-gray-300 hidden lg:block">Olá, {user.displayName?.split(' ')[0]}</span>
                <button onClick={handleLogout} className="ml-3 text-sm text-gray-400 hover:text-white" title="Sair">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                    </svg>
                </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;