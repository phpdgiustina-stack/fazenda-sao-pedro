import React from 'react';
import { XMarkIcon } from './Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  // Extrair para uma função nomeada garante que a assinatura correta seja usada
  // para o evento onClick do backdrop e do botão.
  const handleClose = () => {
    onClose();
  };

  // Este manipulador previne que cliques dentro do modal se propaguem para
  // o backdrop, o que fecharia o modal incorretamente.
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 bg-base-900 bg-opacity-75 flex justify-center items-center z-50 p-4" 
      onClick={handleClose}
    >
      <div 
        className="bg-base-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={handleContentClick}
      >
        <div className="flex justify-between items-center p-4 border-b border-base-700">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
