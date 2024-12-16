import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { auth } from '../Firebase/Firebase'; // Ensure correct import
import { onAuthStateChanged } from 'firebase/auth';

const Footer = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);  // User is authenticated
      } else {
        setIsAuthenticated(false); // User is not authenticated
      }
    });

    return () => unsubscribe();
  }, []);

  if (!isAuthenticated) {
    return null; // Don't render the footer if not authenticated
  }

  return (
    <Box
      sx={{
        backgroundColor: '#f5f7fa',
        padding: 2,
        textAlign: 'center',
        position: 'relative',
        bottom: 0,
        width: '100%',
        boxShadow: 2,
      }}
    >
      <Typography variant="body2" color="#D81B60">
        &copy; {new Date().getFullYear()} LMKS. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
