import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase/Firebase'; // Update path if needed
import {
    Box,
    Button,
    Typography,
    Grid,
    CircularProgress
} from '@mui/material';

const TimeTable = () => {
    const [authLoading, setAuthLoading] = useState(true);
    const navigate = useNavigate(); // Using useNavigate for routing

    // Authentication check
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate("/"); // Redirect to login page if not authenticated
            } else {
                setAuthLoading(false); // Allow component to render for authenticated users
            }
        });

        return () => unsubscribe(); // Cleanup on component unmount
    }, [navigate]);

    // Handle navigation to different views
    const handleTimetableGenerator = () => navigate('/generator');
    const handleTimetableUpload = () => navigate('/upload');
    const handleTimetableView = () => navigate('/view');

    if (authLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 4 }}>
            {/* Header with color #7D0541 */}
            <Typography variant="h4" component="h1" sx={{ color: '#7D0541', textAlign: 'center', marginBottom: 4 }}>
                Timetable Management
            </Typography>

            {/* Shared Buttons with updated square styles */}
            <Grid container spacing={2} justifyContent="center" sx={{ marginBottom: 4 }}>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleTimetableGenerator}
                        sx={{
                            width: 150, // Set width and height to make it square
                            height: 150,
                            borderRadius: '8px', // Optional: makes the corners slightly rounded
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            '&:hover': {
                                backgroundColor: '#4CAF50', // Green on hover
                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            },
                            '&:active': {
                                transform: 'scale(0.98)',
                            },
                        }}
                    >
                        <Typography variant="body1" sx={{ color: 'white', textAlign: 'center' }}>
                            Timetable Generator
                        </Typography>
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleTimetableUpload}
                        sx={{
                            width: 150,
                            height: 150,
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            '&:hover': {
                                backgroundColor: '#FF5722', // Orange on hover
                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            },
                            '&:active': {
                                transform: 'scale(0.98)',
                            },
                        }}
                    >
                        <Typography variant="body1" sx={{ color: 'white', textAlign: 'center' }}>
                            Timetable Upload
                        </Typography>
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleTimetableView}
                        sx={{
                            width: 150,
                            height: 150,
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            '&:hover': {
                                backgroundColor: '#388E3C', // Green on hover
                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            },
                            '&:active': {
                                transform: 'scale(0.98)',
                            },
                        }}
                    >
                        <Typography variant="body1" sx={{ color: 'white', textAlign: 'center' }}>
                            View Timetable
                        </Typography>
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TimeTable;
