import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase/Firebase"; // Update path if needed
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Paper,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { styled } from "@mui/system";

// Styled Paper for cleaner card-like layout
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#f9f9f9",
  boxShadow: theme.shadows[3],
}));

const ModifyStudent = () => {
  const [authLoading, setAuthLoading] = useState(true);
  const [classInput, setClassInput] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [nameOfTheStudent, setNameOfTheStudent] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [section, setSection] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // For "Processing" state
  const [logMessage, setLogMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false); // For success snackbar
  const [openDialog, setOpenDialog] = useState(false); // For displaying modify form popup
  const navigate = useNavigate();

  const classes = ["Class1", "Class2", "Class3", "Class4", "Class5", "Class6", "Class7", "Class8", "Class9", "Class10"];

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

  // Fetch student details for editing
  const handleSearchStudent = async () => {
    if (!classInput || !rollNumber) {
      setLogMessage("Please provide Class and Roll Number!");
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch("https://portalbackend-production-31b4.up.railway.app/search-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Class: classInput, RollNumber: rollNumber }),
      });

      const result = await response.json();

      if (response.ok) {
        setNameOfTheStudent(result.NameOfTheStudent || "");
        setParentEmail(result.ParentEmail || ""); // Changed from FatherName to ParentEmail
        setSection(result.Section || "");
        setOpenDialog(true); // Open the dialog with student data
        setLogMessage("Student data fetched successfully!");
      } else {
        setLogMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      setLogMessage("Failed to fetch student data.");
    } finally {
      setIsSearching(false);
    }
  };

  // Update student details
  const handleUpdateStudent = async () => {
    if (!classInput || !rollNumber || !nameOfTheStudent || !parentEmail || !section) {
      setLogMessage("Please fill all the fields before updating!");
      return;
    }

    setIsUpdating(true); // Start the "Processing" state

    try {
      const response = await fetch("https://portalbackend-production-31b4.up.railway.app/update-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Class: classInput,
          RollNumber: rollNumber,
          NameOfTheStudent: nameOfTheStudent,
          ParentEmail: parentEmail, // Changed from FatherName to ParentEmail
          Section: section,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setLogMessage("Student updated successfully!");
        setOpenSnackbar(true); // Show success notification
        setOpenDialog(false); // Close the modify form dialog after update
      } else {
        setLogMessage(`Error updating student: ${result.error}`);
      }
    } catch (error) {
      console.error("Error updating student:", error);
      setLogMessage("Failed to update student.");
    } finally {
      setIsUpdating(false); // End the "Processing" state
    }
  };

  if (authLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <StyledPaper>
        <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
          Modify Student
        </Typography>
        {logMessage && <Alert severity={logMessage.includes("failed") ? "error" : "success"} sx={{ mb: 2 }}>{logMessage}</Alert>}

        <Box component="form">
          <FormControl fullWidth margin="normal">
            <InputLabel>Class</InputLabel>
            <Select
              value={classInput}
              onChange={(e) => setClassInput(e.target.value)}
              disabled={isSearching}
            >
              {classes.map((className, index) => (
                <MenuItem key={index} value={className}>{className}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Roll Number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            placeholder="Enter Roll Number"
            fullWidth
            margin="normal"
            disabled={isSearching}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSearchStudent}
            disabled={isSearching}
            fullWidth
            sx={{ mt: 3 }}
          >
            {isSearching ? <CircularProgress size={24} color="secondary" /> : "Search Student"}
          </Button>
        </Box>
      </StyledPaper>

      {/* Dialog for Modify Form */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Modify Student Information</DialogTitle>
        <DialogContent>
          <TextField
            label="Name of the Student"
            value={nameOfTheStudent}
            onChange={(e) => setNameOfTheStudent(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Parent's Gmail ID"
            value={parentEmail}
            onChange={(e) => setParentEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Section"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Close
          </Button>
          <Button
            onClick={handleUpdateStudent}
            color="secondary"
            variant="contained"
            disabled={isUpdating}
          >
            {isUpdating ? <CircularProgress size={24} color="secondary" /> : "Update Student"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Student data updated successfully!"
      />
    </Container>
  );
};

export default ModifyStudent;
