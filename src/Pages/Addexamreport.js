import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from "../Firebase/Firebase"; // Import Firebase auth
import { onAuthStateChanged } from "firebase/auth"; // Firebase auth state listener
import { useNavigate } from "react-router-dom"; // To navigate to the login page
import { TextField, Button, Box, Typography, Grid, LinearProgress, Snackbar, Alert } from "@mui/material"; // Import MUI components

const Addexamreport = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [examData, setExamData] = useState([
    {
      subject: '',
      marks: '',
      grade: '',
      typeofexam: ''
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  const [openSnackbar, setOpenSnackbar] = useState(false); // Track snackbar visibility
  const navigate = useNavigate(); // For redirection

  // UseEffect to check if the user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/"); // Redirect to login page if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, [navigate]);

  const handleInputChange = (index, event) => {
    const values = [...examData];
    values[index][event.target.name] = event.target.value;
    setExamData(values);
  };

  const addExamDataField = () => {
    setExamData([
      ...examData,
      {
        subject: '',
        marks: '',
        grade: '',
        typeofexam: ''
      }
    ]);
  };

  const handleDeleteField = (index) => {
    const values = [...examData];
    values.splice(index, 1);
    setExamData(values);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Show progress bar on submit
    axios
      .post('https://portalbackend-production-31b4.up.railway.app/addexamreport', { rollNumber, examData })
      .then((response) => {
        setIsSubmitting(false); // Hide progress bar on successful submission
        setOpenSnackbar(true); // Show success message
        // Reset the form
        setRollNumber('');
        setExamData([
          {
            subject: '',
            marks: '',
            grade: '',
            typeofexam: ''
          }
        ]);
      })
      .catch((error) => {
        setIsSubmitting(false); // Hide progress bar if error occurs
        console.error('Error adding exam report:', error);
      });
  };

  const handleBackToHub = () => {
    navigate("/marks-management"); // Navigate to /marks-management page
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ padding: 3, position: 'relative' }}>
      {/* Back to Hub Button */}
      <Button
        onClick={handleBackToHub}
        variant="contained"
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 10,
          fontSize: '12px',
          padding: '8px 16px',
          backgroundColor: '#006064',
          '&:hover': {
            backgroundColor: '#004d40',
          },
        }}
      >
        Back to Hub
      </Button>

      {/* Title */}
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ color: '#7D0541' }}
      >
        Add Exam Report
      </Typography>

      {/* Progress Bar */}
      {isSubmitting && <LinearProgress sx={{ mb: 2 }} />}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          {/* Roll Number */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Roll Number"
              variant="outlined"
              fullWidth
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              required
            />
          </Grid>
        </Grid>

        {/* Dynamic Exam Data Fields */}
        <Grid container spacing={2} alignItems="center" sx={{ marginTop: 2 }}>
          {examData.map((data, index) => (
            <Grid container item spacing={2} key={index}>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Subject"
                  variant="outlined"
                  name="subject"
                  value={data.subject}
                  onChange={(e) => handleInputChange(index, e)}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Marks"
                  variant="outlined"
                  name="marks"
                  type="number"
                  value={data.marks}
                  onChange={(e) => handleInputChange(index, e)}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Grade"
                  variant="outlined"
                  name="grade"
                  value={data.grade}
                  onChange={(e) => handleInputChange(index, e)}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Type of Exam"
                  variant="outlined"
                  name="typeofexam"
                  value={data.typeofexam}
                  onChange={(e) => handleInputChange(index, e)}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteField(index)}
                  sx={{
                    fontSize: '12px',
                    padding: '8px 16px',
                  }}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          ))}
        </Grid>

        {/* Add More Fields Button */}
        <Button
          type="button"
          variant="outlined"
          onClick={addExamDataField}
          sx={{
            marginTop: 2,
            fontSize: '12px',
            padding: '8px 16px',
            borderColor: '#006064',
            color: '#006064',
            '&:hover': { backgroundColor: '#e0f7fa', borderColor: '#004d40' },
          }}
        >
          Add More Subjects
        </Button>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          sx={{
            marginTop: 2,
            fontSize: '14px',
            padding: '10px 20px',
            backgroundColor: '#388e3c',
            '&:hover': { backgroundColor: '#1b5e20' },
            width: 'auto',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Submit
        </Button>
      </form>

      {/* Snackbar for success message */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Marks have been updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Addexamreport;
