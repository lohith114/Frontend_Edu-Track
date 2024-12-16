import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase/Firebase'; // Ensure the correct path to Firebase setup
import { Box, Button, Typography, Grid, CircularProgress, Paper, Fade } from '@mui/material';
import ExamTimeTable from './ExamTimeTable'; // Upload Timetable Component
import ExamTimeTableView from './ExamTimeTableView'; // View Timetable Component

const ExamDashboard = () => {
  const [view, setView] = useState('dashboard'); // 'dashboard', 'upload', 'view'
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/'); // Redirect to login if not authenticated
      } else {
        setAuthLoading(false); // Stop loading once authenticated
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [navigate]);

  const handleTimetableUpload = () => setView('upload');
  const handleTimetableView = () => setView('view');
  const handleBackToDashboard = () => setView('dashboard');

  if (authLoading) {
    // Show a loading spinner while checking authentication
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ backgroundColor: '#e8f5e9' }}>
        <CircularProgress size={60} sx={{ color: '#388e3c' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4, minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      {/* Dashboard Heading */}
      <Typography variant="h4" align="center" sx={{ marginBottom: 6, fontWeight: 'bold', color: '#7D0541' }}>
        Examination Dashboard
      </Typography>

      {/* Shared Buttons for Navigation */}
      {view === 'dashboard' && (
        <Grid container spacing={3} justifyContent="center" sx={{ marginBottom: 6 }}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleTimetableUpload}
              sx={{
                width: 150,
                height: 150,
                fontSize: '1rem',
                fontWeight: 'bold',
                borderRadius: '15px', // Rounded corners
                backgroundColor: '#006064', 
                boxShadow: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                '&:hover': {
                  backgroundColor: '#1565c0',
                  transform: 'scale(1.05)',
                },
              }}
            >
              Upload Exam Timetable
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
                fontSize: '1rem',
                fontWeight: 'bold',
                borderRadius: '15px', // Rounded corners
                backgroundColor: '#cddc39', // Light orange color
                boxShadow: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                '&:hover': {
                  backgroundColor: '#827717',
                  transform: 'scale(1.05)',
                },
              }}
            >
              View Exam Timetable
            </Button>
          </Grid>
        </Grid>
      )}

      {/* View Logic */}
      <Fade in={view !== 'dashboard'} timeout={500}>
        <Box>
          {view === 'dashboard' ? (
            <Typography variant="h6" align="center" color="textSecondary">
              Please select an action from the buttons above.
            </Typography>
          ) : view === 'upload' ? (
            <Paper sx={{ padding: 4, backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: 4 }}>
              <ExamTimeTable />
              <Box textAlign="center" mt={4}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleBackToDashboard}
                  sx={{
                    padding: '12px 24px',
                    fontSize: '1.1rem',
                    boxShadow: 3,
                    backgroundColor: '#d32f2f', // Soft red color
                    '&:hover': {
                      backgroundColor: '#c62828',
                    },
                  }}
                >
                  Back to Dashboard
                </Button>
              </Box>
            </Paper>
          ) : view === 'view' ? (
            <Paper sx={{ padding: 4, backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: 4 }}>
              <ExamTimeTableView />
              <Box textAlign="center" mt={4}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleBackToDashboard}
                  sx={{
                    padding: '12px 24px',
                    fontSize: '1.1rem',
                    boxShadow: 3,
                    backgroundColor: '#d32f2f', // Soft red color
                    '&:hover': {
                      backgroundColor: '#c62828',
                    },
                  }}
                >
                  Back to Dashboard
                </Button>
              </Box>
            </Paper>
          ) : null}
        </Box>
      </Fade>
    </Box>
  );
};

export default ExamDashboard;
