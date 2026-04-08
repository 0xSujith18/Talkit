import React from 'react';
import Sidebar from './Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex w-full min-h-screen bg-[var(--bg-primary)]">
            {/* Left Sidebar */}
            <div className="w-[250px] shrink-0 sticky top-0 h-screen pt-12 pb-6 pr-3 overflow-y-auto no-scrollbar border-r border-[var(--border)] hidden md:block">
                <Sidebar />
            </div>

            {/* Main Scrollable Content */}
            <div className="flex-1 min-w-0 border-r border-[var(--border)]">
                {children}
            </div>

            {/* Right Sidebar (Widgets) removed as per user request */}
        </div>
    );
}

