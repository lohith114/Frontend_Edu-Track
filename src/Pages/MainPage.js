import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../Firebase/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Button, Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';

// Styled components for the buttons with different colors
const StyledButton = styled(Button)(({ theme, color }) => ({
  width: 200,
  height: 200,
  margin: theme.spacing(2),
  backgroundColor: color,
  color: theme.palette.primary.contrastText,
  fontSize: '18px',
  fontWeight: 'bold',
  borderRadius: '15px', // Square with rounded corners
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center', // Center content vertically
  alignItems: 'center', // Center content horizontally
  transition: 'transform 0.3s ease, background-color 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)', // Button scale effect
    backgroundColor: theme.palette.secondary.main, // Hover color change
  },
  '&:active': {
    transform: 'scale(0.95)', // Active scale effect
  },
}));

const MainPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if the user is authenticated when the component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/"); // Redirect to login if not authenticated
      } else {
        setIsLoading(false); // Stop showing the loading spinner if user is authenticated
      }
    });

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, [navigate]);

  // Show loading spinner while checking authentication state
  if (isLoading) {
    return <Typography variant="h6" align="center">Loading...</Typography>;
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ height: '100vh', textAlign: 'center' }}>
      {/* Header at the top with new styles */}
      <Typography variant="h4" sx={{ fontFamily: 'Roboto, sans-serif', color: '#7D0541', marginTop: -30, marginBottom: 4 }}>
        Marks Management
      </Typography>

      {/* Container for buttons */}
      <Box display="flex" flexDirection="row" justifyContent="center">
        <StyledButton component={Link} to="/addexamreport" color="#b388ff" startIcon={<SchoolIcon />}>
          Add Student Marks
        </StyledButton>
        <StyledButton component={Link} to="/report" color="#e53935" startIcon={<AssessmentIcon />}>
          View Student Marks
        </StyledButton>
      </Box>
    </Box>
  );
};

export default MainPage;
