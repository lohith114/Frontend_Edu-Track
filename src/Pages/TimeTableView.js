import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Button
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useNavigate } from 'react-router-dom';

const colors = ['#FFEBEE', '#E3F2FD', '#E8F5E9', '#FFF3E0', '#F3E5F5', '#E0F2F1', '#F1F8E9', '#EDE7F6', '#FCE4EC'];

function TimeTableView() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [pdfClasses, setPdfClasses] = useState({});
  const [selectedClass, setSelectedClass] = useState('');
  const [pdfUrls, setPdfUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch the list of classes on component mount
  useEffect(() => {
    axios.get('https://portalbackend-production-31b4.up.railway.app/api/timetables/classes')
      .then((response) => {
        setClasses(response.data);
        console.log('Classes fetched successfully:', response.data);

        // Fetch PDFs for all classes to determine which have updates
        response.data.forEach(cls => {
          fetchClassPdfs(cls, true);
        });
      })
      .catch((error) => {
        console.error('Error fetching classes:', error);
      });
  }, []);

  // Fetch PDFs for a given class
  const fetchClassPdfs = (className, checkOnly = false) => {
    setLoading(true);
    axios.get(`https://portalbackend-production-31b4.up.railway.app/api/timetables/view/${className}`)
      .then((response) => {
        if (!checkOnly) {
          setPdfUrls(response.data);
          setSelectedClass(className);
        }

        // Update the state to indicate if a class has PDFs
        setPdfClasses(prevState => ({
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
        View Timetables
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

      {loading && (
        <CircularProgress
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,  // Optional, ensures the loader is on top of other content
          }}
        />
      )}

      {selectedClass && (
        <Box sx={{ mt: 3, width: '100%' }}>
          <Typography variant="h5" gutterBottom>
            Timetables for {selectedClass}
          </Typography>

          <Grid container spacing={3}>
            {pdfUrls.length === 0 ? (
              <Grid item xs={12}>
                <Typography>No PDFs available for this class.</Typography>
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

      {/* Back Button */}
      <Button
        onClick={() => navigate('/time-table')}
        variant="outlined"
        size="large"
        sx={{
          position: 'absolute',      // Positioning the button at the bottom
          bottom: 30,                // Distance from the bottom
          left: '50%',               // Center the button horizontally
          transform: 'translateX(-50%)', // Adjust for exact centering
          width: 200,                // Increase the width of the button
          padding: '10px 24px',      // Adjust padding for a larger button
          fontSize: '16px',          // Increase font size
          backgroundColor: "#aed581" // Button background color
        }}
      >
        Back
      </Button>
    </Box>
  );
}

export default TimeTableView;
