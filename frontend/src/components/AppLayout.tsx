import React from 'react';
import Sidebar from './Sidebar';
import Widgets from './Widgets';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="app-layout">
            {/* Left Sidebar */}
            <div className="app-sidebar-left">
                <Sidebar />
            </div>

            {/* Main Scrollable Content */}
            <div className="app-main-content">
                {children}
            </div>

            {/* Right Sidebar (Widgets) */}
            <div className="app-sidebar-right">
                <Widgets />
            </div>
        </div>
    );
}
