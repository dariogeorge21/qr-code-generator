'use client';

import { useEffect, useState } from 'react';

export default function MobilePreviewToggle() {
    const [isViewingPreview, setIsViewingPreview] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const customisationEl = document.getElementById('customisation-options');

            if (!customisationEl) return;

            const customisationRect = customisationEl.getBoundingClientRect();

            // If the top of the customisation options is above the middle of the screen, we're viewing customisation
            const windowHeight = window.innerHeight;
            if (customisationRect.top < windowHeight * 0.4) {
                setIsViewingPreview(false);
            } else {
                setIsViewingPreview(true);
            }
        };

        // Run once on mount
        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleSection = () => {
        const targetId = isViewingPreview ? 'customisation-options' : 'preview-container';

        // For smooth scrolling with offset for navbar
        const element = document.getElementById(targetId);
        if (element) {
            const yOffset = -80; // Adjust for typical navbar height
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <button
            onClick={toggleSection}
            className="lg:hidden fixed top-24 right-4 z-[60] bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full shadow-lg font-medium text-sm flex items-center gap-2 transition-transform active:scale-95 border-2 border-white/20"
            aria-label={isViewingPreview ? 'Go to Customise' : 'Go to Preview'}
        >
            {isViewingPreview ? (
                <>
                    Customise
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </>
            ) : (
                <>
                    Preview
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </>
            )}
        </button>
    );
}
