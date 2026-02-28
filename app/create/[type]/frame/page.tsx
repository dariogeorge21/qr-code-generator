'use client';

import { use } from 'react';
import BackButton from '../../../components/shared/BackButton';
import StepIndicator from '../../../components/shared/StepIndicator';
import ActionBar from '../../../components/shared/ActionBar';
import QRPreviewCanvas from '../../../components/QRPreviewCanvas';
import FrameTab from '../../../components/tabs/FrameTab';

export default function FramePage({ params }: { params: Promise<{ type: string }> }) {
    const { type } = use(params);

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-28 md:pb-8">
            <BackButton href={`/create/${type}/style`} label="Back" />
            <StepIndicator current={3} total={5} label="Frame" />

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Preview: shows first on mobile, second on desktop */}
                <div className="flex-1 min-w-0 order-1 lg:order-2">
                    <div className="lg:sticky lg:top-24">
                        <QRPreviewCanvas />
                    </div>
                </div>

                {/* Frame Options: shows second on mobile, first on desktop */}
                <div className="lg:w-[45%] shrink-0 order-2 lg:order-1">
                    <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-sm">
                        <h2 className="text-lg font-bold text-[var(--color-text)] mb-5">Customise Frame</h2>
                        <FrameTab />
                    </div>
                </div>
            </div>

            <ActionBar
                downloadHref={`/create/${type}/export`}
                continueHref={`/create/${type}/text`}
            />
        </div>
    );
}
