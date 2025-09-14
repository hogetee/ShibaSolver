"use client";

import { useState, useEffect } from 'react';

type ConsentChoice = 'accepted' | 'rejected' | null;

export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentChoice>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const savedConsent = localStorage.getItem('cookie-consent') as ConsentChoice;
    
    if (savedConsent) {
      setConsent(savedConsent);
      setShowModal(false);
    } else {
      setShowModal(true);
    }
  }, []);

  const acceptAll = () => {
    setConsent('accepted');
    setShowModal(false);
    localStorage.setItem('cookie-consent', 'accepted');
    
    // TODO: Connect to API when backend is ready
    // Example: await apiCall('/api/cookies/accept', { method: 'POST' });
  };

  const rejectAll = () => {
    setConsent('rejected');
    setShowModal(false);
    localStorage.setItem('cookie-consent', 'rejected');
    
    // TODO: Connect to API when backend is ready
    // Example: await apiCall('/api/cookies/reject', { method: 'POST' });
  };

  const resetConsent = () => {
    localStorage.removeItem('cookie-consent');
    setConsent(null);
    setShowModal(true);
  };

  return {
    hasConsented: consent !== null,
    consentChoice: consent,
    showModal,
    acceptAll,
    rejectAll,
    resetConsent,
  };
}
