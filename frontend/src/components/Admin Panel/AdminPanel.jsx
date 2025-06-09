import React from 'react';
import { Link, NavLink, useLocation, Outlet } from 'react-router-dom';
import { assets } from '../../assets/admin_assets/assets.js';
import { useUserContext } from '../../context/UserContext';

const AdminPanel = () => {
    const location = useLocation();
    const { logout } = useUserContext();

    const sidebarLinks = [
        { name: "Add Product", path: "/admin-panel", icon: assets.add_icon },
        { name: "Overview", path: "/admin-panel/overview", icon: assets.order_icon },
        { name: "Orders", path: "/admin-panel/orders", icon: assets.order_icon },
    ];

    
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-4 md:px-8 border-b border-gray-200 py-3 bg-white shadow-sm">
                <Link to="/">
                    <img className="cursor-pointer w-32 md:w-40" src={assets.logo} alt='logo' />
                </Link>
                <div className="flex items-center gap-5 text-gray-600 cursor-pointer">
                    <span className="font-medium hidden md:block">Hi! Admin</span>
                    <button
                        onClick={logout}
                        className="border border-red-300 bg-red-50 hover:bg-red-100 text-red-600 rounded-full text-sm px-4 py-1 transition"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Sidebar + Main Content */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="md:w-64 w-16 border-r border-gray-200 bg-white pt-6 flex flex-col">
                    <nav className="flex-1 flex flex-col gap-1">
                        {sidebarLinks.map((item) => (
                            <NavLink
                                to={item.path}
                                key={item.name}
                                end={item.path === '/admin-panel'}
                                className={({ isActive }) =>
                                    `flex items-center py-3 px-4 gap-3 rounded-l-lg transition-all group
                                    ${isActive
                                        ? "border-r-4 md:border-r-[6px] border-indigo-500 bg-indigo-50 text-indigo-600 font-semibold shadow"
                                        : "hover:bg-gray-100 text-gray-700"
                                    }`
                                }
                            >
                                <img src={item.icon} alt={item.name} className="w-7 h-7" />
                                <span className="md:block hidden text-center">{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8 bg-gray-50 min-h-[calc(100vh-64px)]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;
