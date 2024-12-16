import React, { useState } from 'react';
import { auth } from '../Firebase/Firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import logo from './Logo_LMKS (1).png';

function Header() {
    const [isDropdownVisible, setIsDropdownVisible] = useState(null); // Changed to Menu anchor element
    const user = auth.currentUser;
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/Edu-Track'); // Redirect to login page after logout
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const toggleDropdown = (event) => {
        setIsDropdownVisible(event.currentTarget); // Sets anchor for dropdown
    };

    const closeDropdown = () => {
        setIsDropdownVisible(null); // Close dropdown
    };

    const goToProfileInfo = () => {
        navigate('/profileinfo'); // Navigate to ProfileInfo page
        closeDropdown();
    };

    // Fallback URL for profile picture if the user doesn't have a profile photo
    const defaultProfilePic = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKDnI9ruH113ERMUf-pnbwqQea-AXP1FrF46jtxwOb4w0UXRTqLpCAsMuAnBJNUGpZ2EI&usqp=CAU";

    return (
        <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center" 
            p={2} 
            bgcolor="#003366" // Darker background color
            color="white" 
            width="100%" 
            position="fixed" 
            top={0} 
            left={0} 
            zIndex={1000} 
            boxShadow={3} // More prominent shadow
            borderBottom="2px solid #1F2A44" // Subtle border for separation
            borderRadius="0 0 10px 10px" // Rounded corners at the bottom
        >
            {/* Logo Section */}
            <Box display="flex" alignItems="center">
                <img 
                    src={logo} 
                    alt="Logo" 
                    style={{ 
                        width: '90px', 
                        height: 'auto', 
                        borderRadius: '15px', // Rounded logo for a unique look
                        transition: 'all 0.3s ease', 
                    }} 
                    className="logo-hover-effect" // Adding hover effect on the logo
                />
            </Box>

            {/* User Information Section */}
            {user && (
                <Box display="flex" alignItems="center" position="relative">
                    {/* Display user email in a smaller size */}
                    <Typography variant="body2" sx={{ mr: 2, fontSize: '14px', fontWeight: 'lighter' }}>
                        {user.email}
                    </Typography>

                    {/* Profile Icon */}
                    <IconButton 
                        onClick={toggleDropdown} 
                        sx={{ p: 0, ml: 2, transition: 'transform 0.2s ease' }}
                        className="profile-icon-hover"
                    >
                        <img 
                            src={user.photoURL || defaultProfilePic} 
                            alt="Profile" 
                            style={{ 
                                width: '40px', 
                                height: '40px', 
                                borderRadius: '50%', 
                                objectFit: 'cover', 
                                transition: 'transform 0.2s ease', 
                            }} 
                            className="profile-icon-hover"
                        />
                    </IconButton>

                    {/* Dropdown Menu */}
                    <Menu
                        anchorEl={isDropdownVisible}
                        open={Boolean(isDropdownVisible)}
                        onClose={closeDropdown}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <MenuItem onClick={goToProfileInfo}>Profile Info</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </Box>
            )}
        </Box>
    );
}

export default Header;
