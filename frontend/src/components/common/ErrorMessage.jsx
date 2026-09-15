import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message }) => {
  return (
    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-start gap-3 border border-red-100">
      <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
