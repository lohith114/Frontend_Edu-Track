import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Typography,
  TextField,
  Box,
  Button,
  Snackbar,
  Alert,
  LinearProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import * as XLSX from "xlsx";
import { auth } from "../Firebase/Firebase"; // Import Firebase auth
import { onAuthStateChanged } from "firebase/auth"; // Firebase auth state listener
import { useNavigate } from "react-router-dom"; // To navigate to the login page

const ManageFeeStatus = () => {
  const [students, setStudents] = useState([]); // State to hold students data
  const [filteredStudents, setFilteredStudents] = useState([]); // State to hold filtered students data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors
  const [filter, setFilter] = useState(""); // State to handle filter input
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar visibility
  const [openDialog, setOpenDialog] = useState(true); // State to control Dialog visibility
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

  // Fetch students data
  const fetchStudents = async () => {
    try {
      const response = await fetch("https://portalbackend-production-31b4.up.railway.app/allstudents");
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      const data = await response.json();
      setStudents(data); // Set the fetched data to state
      setFilteredStudents(data); // Initially, show all students
    } catch (err) {
      setError(err.message); // Set the error if fetch fails
    } finally {
      setLoading(false); // Stop the loading spinner
    }
  };

  // Fetch students data on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Function to handle fee status changes
  const handleFeeStatusChange = async (rollNumber, newStatus) => {
    try {
      const response = await fetch(`https://portalbackend-production-31b4.up.railway.app/updateFeeStatus/${rollNumber}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feeStatus: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update fee status");
      }

      // After updating the fee status, refresh the student data
      fetchStudents(); // Refresh the data by calling the fetch function

      // Show Snackbar message on successful update
      setSnackbarOpen(true);

      // Auto-close the Snackbar after 2 seconds
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 2000);
    } catch (err) {
      console.error("Error updating fee status:", err);
      alert("Failed to update fee status");
    }
  };

  // Handle filter input change
  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);

    // Filter students by roll number
    if (value === "") {
      setFilteredStudents(students); // If no filter, show all students
    } else {
      setFilteredStudents(
        students.filter((student) =>
          student.rollNumber.toString().includes(value) // Filter by roll number
        )
      );
    }
  };

  // Function to generate Excel and trigger download
  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredStudents);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "FeeStatus");
    XLSX.writeFile(wb, "students_fee_status.xlsx");
  };

  // Function to determine color based on fee status
  const getFeeStatusColor = (feeStatus) => {
    switch (feeStatus) {
      case "PAID":
        return "green";
      case "UNPAID":
        return "red";
      case "PARTIALLY PAID":
        return "orange";
      default:
        return "black"; // Default color
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", paddingLeft: "20px" }}>
      {/* Header */}
      <Typography
        variant="h5" // Increased header size
        component="h2"
        style={{
          fontWeight: "bold",
          color: "#7D0541",
          marginBottom: "20px",
          marginTop: "50px", // Move header lower
        }}
      >
        Manage Fee Status
      </Typography>

      {/* Filter input on the left side, with gap between Excel button */}
      <Box
        sx={{
          position: "absolute",
          top: "40px",
          right: "300px", // Move filter box further left
          zIndex: 1,
          backgroundColor: "#fff",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <TextField
          label="Filter by Roll Number"
          variant="outlined"
          value={filter}
          onChange={handleFilterChange}
          style={{
            backgroundColor: "#f8f8f8", // Light background for filter
            color: "#7D0541", // Match filter text color with theme
            width: "175px", // Decrease width to match button size
          }}
        />
      </Box>

      {/* Download Excel Button */}
      <Box
        sx={{
          position: "absolute",
          top: "60px",
          right: "140px", // Adjust position of button next to filter, adding gap
          zIndex: 1,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadExcel}
          style={{
            backgroundColor: "#217346", // Button color
            color: "#fff", // White text
          }}
        >
          Download Excel
        </Button>
      </Box>

      {/* Progress bar and dialog message */}
      {loading && (
        <>
          <LinearProgress style={{ marginTop: "30px" }} />
          <Dialog open={openDialog}>
            <DialogTitle>Your journey begins shortly...</DialogTitle>
            <DialogContent>
              <Typography variant="body1" align="center">
                Preparing the magic carpet...
              </Typography>
            </DialogContent>
            <DialogActions>
              {/* Optional close button */}
            </DialogActions>
          </Dialog>
        </>
      )}

      {/* Table */}
      <TableContainer component={Paper} style={{ marginTop: "60px", maxWidth: "1000px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  fontSize: "14px", // Decreased font size
                  fontWeight: "bold", // Bold text
                  color: "#000000", // Deep black color
                  padding: "5px", // Reduced padding for a more compact look
                }}
              >
                Roll Number
              </TableCell>
              <TableCell
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#000000",
                  padding: "5px",
                }}
              >
                First Name
              </TableCell>
              <TableCell
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#000000",
                  padding: "5px",
                }}
              >
                Last Name
              </TableCell>
              <TableCell
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#000000",
                  padding: "5px",
                }}
              >
                Fee Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.rollNumber}>
                <TableCell style={{ fontSize: "13px", padding: "5px" }}>
                  {student.rollNumber}
                </TableCell>
                <TableCell style={{ fontSize: "13px", padding: "5px" }}>
                  {student.firstName}
                </TableCell>
                <TableCell style={{ fontSize: "13px", padding: "5px" }}>
                  {student.lastName}
                </TableCell>
                <TableCell style={{ fontSize: "13px", padding: "5px" }}>
                  <Select
                    value={student.feeStatus || "UNPAID"} // Default to "UNPAID" if null
                    onChange={(e) =>
                      handleFeeStatusChange(student.rollNumber, e.target.value)
                    }
                    sx={{
                      color: getFeeStatusColor(student.feeStatus), // Apply color based on status
                    }}
                  >
                    <MenuItem value="PAID" style={{ color: "green" }}>Paid</MenuItem>
                    <MenuItem value="UNPAID" style={{ color: "red" }}>Unpaid</MenuItem>
                    <MenuItem value="PARTIALLY PAID" style={{ color: "orange" }}>Partially Paid</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar for success message */}
      <Snackbar
        open={snackbarOpen}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" sx={{ backgroundColor: "#0d47a1", color: "#fff" }}>
          Ta-da! Status update is live
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ManageFeeStatus;
