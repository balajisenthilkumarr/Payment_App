import React from 'react';


const Navbar = ({ userid }) => {
    return (
        <nav className="bg-[#2D4B96] p-4 flex justify-between items-center text-white">
            {/* Logo and Text */}
            <div className="flex items-center space-x-2">
                {/* Logo */}
                <img 
                    src="https://via.placeholder.com/40" // Replace with your logo image URL
                    alt="PaymentApp Logo"
                    className="w-8 h-8" // Adjust size of logo
                />
                <div className="text-lg font-bold">PaymentApp</div>
            </div>

            {/* User Information or Login Button */}
            {userid ? (
                <div className="flex items-center">
                    {userid.profileIcon && (
                        <img 
                            src={userid.profileIcon} 
                            alt="Profile Icon" 
                            className="w-8 h-8 rounded-full mr-2" 
                        />
                    )}
                    <div className="text-sm">
                        <span className="font-semibold">{userid.name}</span>
                        <br />
                        <span className="text-xs">{userid.email}</span>
                    </div>
                </div>
            ) : (
                <button className="bg-white text-blue-600 px-4 py-2 rounded">Login</button>
            )}
        </nav>
    );
};

export default Navbar;
