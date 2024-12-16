import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase/Firebase'; // Ensure the correct path to Firebase setup
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Button,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const colors = ['#FFE0B2', '#FFCCBC', '#D1C4E9', '#B2EBF2', '#C8E6C9', '#FFECB3', '#F8BBD0', '#D7CCC8', '#DCEDC8'];

function ExamTimeTableView() {
  const [authLoading, setAuthLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [pdfClasses, setPdfClasses] = useState({});
  const [selectedClass, setSelectedClass] = useState('');
  const [pdfUrls, setPdfUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/'); // Redirect to login page if not authenticated
      } else {
        setAuthLoading(false);
      }
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, [navigate]);

  // Fetch classes on component mount
  useEffect(() => {
    if (!authLoading) {
      axios.get('https://portalbackend-production-31b4.up.railway.app/api/timetables/classes')
        .then((response) => {
          setClasses(response.data);
          console.log('Classes fetched successfully:', response.data);

          // Fetch PDFs for all classes to determine which have updates
          response.data.forEach((cls) => {
            fetchClassPdfs(cls, true);
          });
        })
        .catch((error) => {
          console.error('Error fetching classes:', error);
        });
    }
  }, [authLoading]);

  const fetchClassPdfs = (className, checkOnly = false) => {
    setLoading(true);
    axios.get(`https://portalbackend-production-31b4.up.railway.app/api/exam-timetables/view/${className}`)
      .then((response) => {
        if (!checkOnly) {
          setPdfUrls(response.data);
          setSelectedClass(className);
        }

        // Update the state to indicate if a class has PDFs
        setPdfClasses((prevState) => ({
          ...prevState,
          [className]: response.data.length > 0,
        }));

        setLoading(false);
        console.log(`PDFs fetched for class ${className}:`, response.data);
      })
      .catch((error) => {
        console.error(`Error fetching PDFs for class ${className}:`, error);
        setLoading(false);
      });
  };

  if (authLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: '#f5f5f5',
        padding: 4,
        flexDirection: 'column',
        width: '100%',
      }}
    >
      <Typography variant="h4" gutterBottom>
        View Exam Timetables
      </Typography>

      <Grid container spacing={3}>
        {classes.map((cls, index) => (
          <Grid item xs={12} sm={6} md={4} key={cls}>
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                backgroundColor: colors[index % colors.length],
                cursor: 'pointer',
                textAlign: 'center',
                '&:hover': {
                  backgroundColor: '#ccc',
                },
              }}
              onClick={() => fetchClassPdfs(cls)}
            >
              <Typography variant="h6">{cls}</Typography>
              {pdfClasses[cls] && (
                <Typography variant="body2" sx={{ color: 'green' }}>
                  PDF Updated
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {loading && <CircularProgress sx={{ mt: 3 }} />}

      {selectedClass && (
        <Box sx={{ mt: 3, width: '100%' }}>
          <Typography variant="h5" gutterBottom>
            Exam Timetables for {selectedClass}
          </Typography>

          <Grid container spacing={3}>
            {pdfUrls.length === 0 ? (
              <Grid item xs={12}>
                <Typography>No exam timetable PDFs available for this class.</Typography>
              </Grid>
            ) : (
              pdfUrls.map((pdf, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper
                    elevation={2}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: 2,
                      marginBottom: 2,
                    }}
                  >
                    <PictureAsPdfIcon sx={{ color: 'red', fontSize: 40, marginRight: 2 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ marginBottom: 1 }}>
                        {pdf.fileName}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        href={pdf.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ marginRight: 2 }}
                      >
                        View PDF
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      )}
    </Box>
  );
}

export default ExamTimeTableView;
