import React, { useState, useEffect } from 'react';
import { auth } from '../Firebase/Firebase';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Avatar,
    Typography,
    Card,
    CardContent,
    Button,
    Stack,
    CircularProgress,
} from '@mui/material';

function ProfileInfo() {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setUserData({
                email: user.email,
                displayName: user.displayName || 'No name set',
                photoURL: user.photoURL || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKDnI9ruH113ERMUf-pnbwqQea-AXP1FrF46jtxwOb4w0UXRTqLpCAsMuAnBJNUGpZ2EI&usqp=CAU', // Fallback if no photo
            });
        } else {
            navigate('/profileinfo'); // Redirect to login if not authenticated
        }
    }, [navigate]);

    if (!userData) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                padding: 2,
            }}
        >
            <Card
                sx={{
                    maxWidth: 400,
                    width: '100%',
                    textAlign: 'center',
                    boxShadow: 3,
                    padding: 2,
                    borderRadius: 3,
                }}
            >
                <CardContent>
                    <Avatar
                        src={userData.photoURL}
                        alt="Profile"
                        sx={{
                            width: 150,
                            height: 150,
                            margin: '0 auto 20px',
                            border: '2px solid #6c63ff',
                        }}
                    />
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        color="primary"
                        sx={{ mb: 1 }}
                    >
                        {userData.displayName}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        sx={{ mb: 3 }}
                    >
                        {userData.email}
                    </Typography>
                    <Stack spacing={2} direction="row" justifyContent="center">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/welcome')}
                            sx={{ textTransform: 'none' }}
                        >
                            Go Home
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => navigate('/settings')}
                            sx={{ textTransform: 'none' }}
                        >
                            Edit Profile
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}

export default ProfileInfo;
