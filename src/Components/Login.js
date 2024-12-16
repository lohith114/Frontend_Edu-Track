import React, { useState } from 'react';
import { auth } from '../Firebase/Firebase';
import {
    setPersistence,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    browserLocalPersistence,
    browserSessionPersistence,
} from 'firebase/auth';
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    TextField,
    Typography,
    CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import logo from './text.gif';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const persistenceType = keepLoggedIn ? browserLocalPersistence : browserSessionPersistence;

        try {
            await setPersistence(auth, persistenceType);
            await signInWithEmailAndPassword(auth, email, password);
            window.location.replace('/welcome'); // Redirect to welcome page
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const forgotPass = async () => {
        if (email) {
            try {
                await sendPasswordResetEmail(auth, email);
                alert('Password reset email sent! Please check your inbox.');
            } catch (error) {
                console.error('Error sending password reset email:', error);
                alert('Failed to send password reset email. Please try again.');
            }
        } else {
            alert('Please enter your email address to reset your password.');
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            bgcolor="linear-gradient(135deg, #6c63ff 30%, #99d98c 100%)"
            px={2}
        >
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    backgroundColor: '#fff',
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
                    textAlign: 'center',
                }}
            >
                <motion.img
                    src={logo}
                    alt="Logo"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
                    style={{ width: '80px', marginBottom: '20px' }}
                />
                <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    style={{ fontWeight: '600', color: '#333' }}
                >
                    Login to your account
                </Typography>
                <form onSubmit={handleLogin}>
                    <TextField
                        fullWidth
                        id="email"
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        variant="outlined"
                        margin="normal"
                        required
                        InputProps={{
                            style: { borderRadius: '8px' },
                        }}
                    />
                    <TextField
                        fullWidth
                        id="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        variant="outlined"
                        margin="normal"
                        required
                        InputProps={{
                            style: { borderRadius: '8px' },
                        }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={keepLoggedIn}
                                onChange={() => setKeepLoggedIn(!keepLoggedIn)}
                                color="primary"
                            />
                        }
                        label="Keep me logged in"
                        style={{ marginBottom: '15px' }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{
                            padding: '14px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            transition: 'all 0.3s ease',
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign in'}
                    </Button>
                </form>
                <Button
                    onClick={forgotPass}
                    variant="text"
                    color="primary"
                    size="small"
                    style={{ fontSize: '14px', marginTop: '10px' }}
                >
                    I forgot my password
                </Button>
            </motion.div>
        </Box>
    );
}

export default Login;
