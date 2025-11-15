"use client";

import React, { useState, useEffect } from "react";
import { useCookieConsent } from "@/hooks/useCookieConsent";

export default function CookieConsentModal() {
  const { hasConsented, acceptAll, showModal } = useCookieConsent();

  return (
    <div
      className={`fixed inset-0 flex items-end justify-start z-50 p-4 font-display transition-opacity duration-500 ${
        showModal ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-accent-600 rounded-2xl p-8 max-w-2xs w-full text-white transform transition-all duration-500 ease-out ${
          showModal ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Title */}
        <div className="mb-3">
          <h2 className="sm:text-2xl text-lg font-bold">Cookies Consent</h2>
          {/* <h2 className="text-2xl font-bold">Consent</h2> */}
        </div>

        {/* Body Text */}
        <div className="mb-6 space-y-4">
          <div>
            <p className="text-white/90 sm:text-sm text-xs mb-2">
              We use essential cookies to ensure our service works properly,
              such as:
            </p>
            <ul className="text-white/80 sm:text-sm text-xs pl-4 space-y-1">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Storing your login session</span>
              </li>
            </ul>
          </div>

          <div>
            <div className="mb-3">
              <h2 className="sm:text-lg text-md font-bold">Data Privacy</h2>
            </div>
            <ul className="text-white/80 sm:text-sm text-xs pl-4 space-y-1">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  These cookies are used only for essential functionality
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>We do not share cookie data with any third parties</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={acceptAll}
            className="flex-auto sm:text-xl text-sm bg-accent-200 text-accent-600 font-bold py-3 px-6 rounded-xl hover:bg-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
