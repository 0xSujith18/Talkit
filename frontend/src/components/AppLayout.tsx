import React from 'react';
import Sidebar from './Sidebar';

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

            {/* Empty Right Sidebar for layout balancing */}
            <div className="app-sidebar-right"></div>
        </div>
    );
}

