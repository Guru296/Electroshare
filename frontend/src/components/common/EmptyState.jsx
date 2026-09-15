import React from 'react';

const EmptyState = ({ icon: Icon, title, message, actionText, onAction }) => {
  return (
    <div className="bg-white p-12 rounded-lg border border-slate-100 text-center shadow-sm max-w-md mx-auto">
      {Icon && (
        <div className="inline-flex justify-center items-center bg-slate-100 p-4 rounded-full mb-4">
          <Icon className="text-slate-400" size={32} />
        </div>
      )}
      <h3 className="text-xl font-bold text-slate-700 mb-2">{title}</h3>
      <p className="text-slate-500 mb-6">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-6 rounded-md transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
