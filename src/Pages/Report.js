import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../Firebase/Firebase"; // Firebase auth import
import { onAuthStateChanged } from "firebase/auth"; // Firebase auth state listener
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const ExamReport = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [reportData, setReportData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // State to track loading
  const [openDialog, setOpenDialog] = useState(false); // For dialog visibility
  const [deletingGrade, setDeletingGrade] = useState(null); // Store grade being deleted
  const navigate = useNavigate(); // To handle redirection

  // UseEffect to check if the user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/"); // Redirect to login page if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, [navigate]);

  const fetchReport = () => {
    if (!rollNumber) {
      setError("Please enter a valid roll number.");
      return;
    }

    setLoading(true); // Set loading to true when fetching
    fetch(`https://portalbackend-production-31b4.up.railway.app/report/${rollNumber}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch data.");
        }
        return response.json();
      })
      .then(data => {
        if (data.length === 0) {
          setError("No exam report found for the provided roll number.");
        } else {
          const groupedData = processData(data);
          setReportData(groupedData);
          setError(""); // Clear error if data is found
        }
        setLoading(false); // Stop loading once data is fetched
      })
      .catch(err => {
        setError("Failed to fetch data. Please check the roll number.");
        setLoading(false);
        console.error(err);
      });
  };

  const handleDeleteClick = (grade) => {
    setDeletingGrade(grade); // Set the grade to be deleted
    setOpenDialog(true); // Open the confirmation dialog
  };

  const confirmDelete = () => {
    setLoading(true);
    fetch(`https://portalbackend-production-31b4.up.railway.app/deletegrade/${deletingGrade}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to delete data.");
        }
        return response.json();
      })
      .then(() => {
        // Remove the deleted grade from reportData
        const updatedData = { ...reportData };
        delete updatedData[deletingGrade];
        setReportData(updatedData);
        setLoading(false);
        setOpenDialog(false); // Close the dialog after deletion
      })
      .catch(err => {
        setError("Failed to delete data.");
        setLoading(false);
        console.error(err);
      });
  };

  const cancelDelete = () => {
    setOpenDialog(false); // Close the dialog without deleting
  };

  const processData = (data) => {
    const groupedData = {};

    data.forEach(item => {
      const { rollNumber, firstName = "Unknown", lastName = "Unknown", subject, typeofexam, marks, grade } = item;

      if (!groupedData[grade]) {
        groupedData[grade] = { students: {}, examTypes: new Set() };
      }

      if (!groupedData[grade].students[rollNumber]) {
        groupedData[grade].students[rollNumber] = {
          firstName,
          lastName,
          subjects: {}
        };
      }

      if (!groupedData[grade].students[rollNumber].subjects[subject]) {
        groupedData[grade].students[rollNumber].subjects[subject] = {};
      }

      groupedData[grade].students[rollNumber].subjects[subject][typeofexam] = marks;
      groupedData[grade].examTypes.add(typeofexam);
    });

    Object.keys(groupedData).forEach(grade => {
      groupedData[grade].examTypes = Array.from(groupedData[grade].examTypes);
    });

    return groupedData;
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#7D0541' }}>
  Exam Report
</Typography>


      {/* Back to Hub Button */}
      <Box sx={{ position: 'absolute', top: 50, right: 100 }}>
        <Button
          variant="contained"
          onClick={() => navigate("/marks-management")}
          sx={{
            backgroundColor: "#4caf50",
            '&:hover': { backgroundColor: "#388e3c" },
            textTransform: 'none'
          }}
        >
          Back to Hub
        </Button>
      </Box>

      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Enter Roll Number"
            variant="outlined"
            fullWidth
            value={rollNumber}
            onChange={e => setRollNumber(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Button
            variant="contained"
            onClick={fetchReport}
            disabled={loading}
            sx={{ height: '100%', backgroundColor: '#006064', '&:hover': { backgroundColor: '#004d40' } }}
          >
            {loading ? <CircularProgress size={24} /> : "Fetch Report"}
          </Button>
        </Grid>
      </Grid>

      {error && (
        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {Object.keys(reportData).length > 0 ? (
        Object.entries(reportData).map(([grade, { students, examTypes }]) => (
          <Box key={grade} sx={{ mb: 4 }}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">{`Grade: ${grade}`}</Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDeleteClick(grade)}
                sx={{ mt: 1, mb: 2 }}
              >
                Delete Grade
              </Button>
              {Object.entries(students).map(([rollNumber, { firstName, lastName, subjects }]) => (
                <Box key={rollNumber} sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#1b5e20" }} // Applied custom color here
                  >
                    {`Roll Number: ${rollNumber} - ${firstName} ${lastName}`}
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>S.No</TableCell>
                          <TableCell>Subjects</TableCell>
                          {examTypes.map(examType => (
                            <TableCell key={examType}>{examType}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(subjects).map(([subject, exams], index) => (
                          <TableRow key={subject}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{subject}</TableCell>
                            {examTypes.map(examType => (
                              <TableCell key={examType}>
                                {exams[examType] !== undefined ? exams[examType] : "-"}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ))}
            </Paper>
          </Box>
        ))
      ) : (
        !loading && (
          <Typography variant="body1">
            No data available. Please fetch a report.
          </Typography>
        )
      )}

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={cancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this grade? This action cannot be undone.
          </Typography>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">Cancel</Button>
          <Button onClick={confirmDelete} color="error" disabled={loading}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExamReport;
