import React, { useState } from 'react';
import mixpanel from 'mixpanel-browser';

export default function DownloadBanner() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) {
        return null;
    }

    const handleDownloadClick = () => {
      mixpanel.track("App Download Initiated", { "Source": "Download Banner" });
    }

    const handleDismissClick = () => {
      setIsVisible(false);
      mixpanel.track("App Download Dismissed", { "Source": "Download Banner" });
    }

    return (
      <div className="pointer-events-none fixed inset-x-0 bottom-0 px-6 pb-6">
        <div className="pointer-events-auto mr-auto max-w-xl rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-900/10">
          <p className="text-sm leading-6 text-gray-900">
            <strong>Would you like to download our App?</strong><br/> Create invoices and agreements faster from our App.
          </p>
          <div className="mt-4 flex items-center gap-x-5">
            <a
              href="https://apps.apple.com/us/app/klorah/id6478724132"
              className="rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
              target="_blank" rel="noopener noreferrer" // Open link in new tab
              onClick={handleDownloadClick}
            >
              Download
            </a>
            <button 
              type="button" 
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={handleDismissClick}
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    )
  }
