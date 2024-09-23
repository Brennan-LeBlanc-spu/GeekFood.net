import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const Notification = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'error' ? 'bg-red-100' : 'bg-green-100';
  const textColor = type === 'error' ? 'text-red-800' : 'text-green-800';

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-md shadow-md ${bgColor} ${textColor}`}>
      <div className="flex items-center">
        <span className="mr-2">{message}</span>
        <button onClick={() => setIsVisible(false)} className="text-gray-500 hover:text-gray-700">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Notification;