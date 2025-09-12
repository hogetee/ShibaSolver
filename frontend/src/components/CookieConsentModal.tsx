"use client";

import React, { useState, useEffect } from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';

export default function CookieConsentModal() {
  const { hasConsented, acceptAll, rejectAll, showModal } = useCookieConsent();

  return (
    <div className={`fixed inset-0 flex items-end justify-start z-50 p-4 font-display transition-opacity duration-500 ${
      showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <div 
        className={`bg-accent-600 rounded-2xl p-8 max-w-3xs w-full text-white transform transition-all duration-500 ease-out ${
          showModal ? 'translate-x-0' : '-translate-x-full'
        }`}>
        {/* Title */}
        <div className="mb-3">
          <h2 className="text-2xl font-bold">Cookies</h2>
          <h2 className="text-2xl font-bold">Consent</h2>
        </div>

        {/* Body Text */}
        <div className="mb-6">
          <p className="text-white/90 leading-relaxed text-sm">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. 
            Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. 
            Donec qu
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={acceptAll}
            className="flex-auto bg-accent-200 text-accent-600 font-bold py-3 px-6 rounded-xl hover:bg-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Accept All
          </button>
          <button
            onClick={rejectAll}
            className="flex-auto bg-accent-200 text-accent-600 font-bold py-3 px-6 rounded-xl hover:bg-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Reject All
          </button>
        </div>
      </div>
    </div>
  );
}
