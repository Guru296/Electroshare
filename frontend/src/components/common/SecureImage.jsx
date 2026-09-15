import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const SecureImage = ({ src, alt, className, fallbackText = 'No Image' }) => {
  const [objectUrl, setObjectUrl] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let url = null;
    let isMounted = true;

    const fetchImage = async () => {
      if (!src) {
        setIsLoading(false);
        setHasError(true);
        return;
      }

      try {
        setIsLoading(true);
        setHasError(false);
        // Use existing Axios instance to automatically include JWT header
        const response = await api.get(src, {
          responseType: 'blob'
        });
        
        if (isMounted) {
          url = URL.createObjectURL(response.data);
          setObjectUrl(url);
        }
      } catch (err) {
        if (isMounted) {
          setHasError(true);
          console.error("Failed to load secure image:", err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchImage();

    // Cleanup: revoke the object URL to avoid memory leaks
    return () => {
      isMounted = false;
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [src]);

  if (!src || hasError) {
    return (
      <div className={`flex items-center justify-center text-slate-400 bg-slate-200 ${className || ''}`}>
        {fallbackText}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 ${className || ''}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <img
      src={objectUrl}
      alt={alt}
      className={className}
    />
  );
};

export default SecureImage;
