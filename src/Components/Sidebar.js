import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { auth } from '../Firebase/Firebase';
import logo from './Logo_LMKS (1).png';
import { onAuthStateChanged } from 'firebase/auth';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
} from '@mui/material';
import {
    Home,
    HelpCenter,
    Payment,
    Schedule,
    CheckCircle,
    EventNote,
    AddCircle,
    People,
    Assessment,  
} from '@mui/icons-material';

const Sidebar = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                navigate('/');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    if (!isAuthenticated) {
        return null;
    }

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const menuItems = [
        { text: 'Home', icon: <Home sx={{ marginTop: '-2px' }} />, path: '/welcome' },
        { text: 'Student Registration', icon: <AddCircle />, path: '/Student-Registration' },
        { text: 'View Registered Students', icon: <People />, path: '/View-Registered-Students' },
        { text: 'Manage Fee Status', icon: <Payment />, path: '/Manage-Fee-Status' },
        { text: 'Time Table', icon: <Schedule />, path: '/time-table' },
        { text: 'Attendance', icon: <CheckCircle />, path: '/attendance' },
        { text: 'Marks Management', icon: <Assessment />, path: '/Marks-Management' },
        { text: 'Exam Dashboard', icon: <EventNote />, path: '/Exam-Dashboard' },
        { text: 'Know us Better', icon: <HelpCenter />, path: '/school-info' },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                sx={{
                    width: isCollapsed && !isHovered ? 70 : 250,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: isCollapsed && !isHovered ? 70 : 250,
                        boxSizing: 'border-box',
                        background: isHovered
                            ? 'linear-gradient(145deg, rgba(62, 0, 47, 0.8), rgba(62, 0, 47, 0.9))'
                            : 'linear-gradient(145deg, rgba(62, 0, 47, 0.8), rgba(62, 0, 47, 0.9))',
                        backdropFilter: 'blur(1px)',
                        border: 'none',
                        boxShadow: 'none',
                        color: '#fff',
                        transition: 'width 0.3s ease',
                        zIndex: 900,
                        position: 'fixed',
                        height: '100vh',
                    },
                }}
            >
                {/* Logo at the top of Sidebar */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '10px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                >
                    <img
                        src={logo}
                        alt="Logo"
                        style={{
                            width: '100px',
                            height: 'auto',
                            transition: 'all 0.3s ease',
                        }}
                    />
                </Box>

                {/* Navigation Menu */}
                <List sx={{ marginTop: '15px' }}> {/* Adds margin to the entire list */}
    {menuItems.map((item) => (
        <ListItem
            button
            key={item.text}
            component={NavLink}
            to={item.path}
            sx={{
                display: 'flex',
                alignItems: 'center',
                margin: '5px 10px',
                padding: '10px',
                color: '#FFFFFF', // Icons
                textDecoration: 'none',
                borderRadius: '10px',
                transition: 'background-color 0.3s ease, transform 0.2s ease',
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'scale(1.05)',
                },
                '&.active': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                },
            }}
        >
            <ListItemIcon
                sx={{
                    color: 'inherit',
                    justifyContent: 'center',
                    minWidth: 'auto',
                }}
            >
                {item.icon}
            </ListItemIcon>
            <ListItemText
                primary={item.text}
                sx={{
                    color: 'inherit',
                    fontWeight: 500,
                    display: isCollapsed && !isHovered ? 'none' : 'block',
                    whiteSpace: 'nowrap',
                }}
            />
        </ListItem>
    ))}
</List>

            </Drawer>

            <Box
                sx={{
                    flexGrow: 1,
                    marginLeft: isCollapsed && !isHovered ? '70px' : '250px',
                    padding: 2,
                    transition: 'margin-left 0.3s ease',
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Sidebar;
