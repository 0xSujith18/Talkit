import React from 'react';
import Sidebar from './Sidebar';
import Widgets from './Widgets';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex w-full min-h-screen bg-[var(--bg-primary)]">
            {/* Left Sidebar */}
            <div className="w-[250px] shrink-0 sticky top-0 h-screen py-6 pr-3 overflow-y-auto no-scrollbar border-r border-[var(--border)] hidden md:block">
                <Sidebar />
            </div>

            {/* Main Scrollable Content */}
            <div className="flex-1 min-w-0 border-r border-[var(--border)]">
                {children}
            </div>

            {/* Right Sidebar (Widgets) */}
            <div className="w-[350px] shrink-0 sticky top-0 h-screen py-6 pl-6 overflow-y-auto no-scrollbar hidden lg:block">
                <Widgets />
            </div>
        </div>
    );
}

