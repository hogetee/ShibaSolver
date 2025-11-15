'use client';

import { useEffect, useRef } from 'react';

interface GoogleSignInButtonProps {
  onSuccess: (response: any) => void;
  className?: string;
}

export default function GoogleSignInButton({ onSuccess, className = "" }: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeGoogleAuth = () => {
      // Load Google OAuth script
      if (window.google && buttonRef.current) {
        // Clear any existing button content first
        buttonRef.current.innerHTML = '';
        
        window.google.accounts.id.initialize({
          client_id: '793748976757-g3vog3do94a090h7niis00a9o7mss299.apps.googleusercontent.com',
          callback: onSuccess,
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          // width: '300',
          type: 'standard',
          text: 'signin_with',
          shape: 'rectangular',
        });
        return;
      }

      if (!document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (window.google && buttonRef.current) {
            window.google.accounts.id.initialize({
              client_id: '793748976757-g3vog3do94a090h7niis00a9o7mss299.apps.googleusercontent.com',
              callback: onSuccess,
            });

            window.google.accounts.id.renderButton(buttonRef.current, {
              theme: 'outline',
              size: 'large',
              // width: '300',
              type: 'standard',
              text: 'signin_with',
              shape: 'rectangular',
            });
          }
        };
        document.head.appendChild(script);
      }
    };

    const timer = setTimeout(initializeGoogleAuth, 100);
    
    return () => clearTimeout(timer);
  }, [onSuccess]);

  return (
    <div className={`w-full ${className}`}>
      <div ref={buttonRef} className="w-full"></div>
    </div>
  );
}
