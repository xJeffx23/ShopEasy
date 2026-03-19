import { Bell, MessageSquare, Search } from "lucide-react";

export function Topbar() {
    return (
        <header className="flex items-center justify-between border-b bg-white px-6 py-4">
            <div className="flex items-center gap-6 text-sm text-gray-400">
                <span>Home</span>
                <span className="text-blue-600 font-medium">Dashboard</span>
                <span>Overview</span>
                <span>Schedule</span>
                <span>Inventory</span>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-400">
                    <Search size={16} />
                    <span>Search patients...</span>
                </div>

                <Bell size={18} className="text-gray-500" />
                <MessageSquare size={18} className="text-gray-500" />

                <div className="h-9 w-9 rounded-full bg-teal-200" />
            </div>
        </header>
    );
}