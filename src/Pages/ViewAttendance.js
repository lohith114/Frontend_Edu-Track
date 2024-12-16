import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Snackbar,
  SnackbarContent
} from '@mui/material';

const ViewAttendance = () => {
  const [todayData, setTodayData] = useState([]);
  const [trackerData, setTrackerData] = useState([]);
  const [trackerSummary, setTrackerSummary] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [logMessage, setLogMessage] = useState("");
  const [viewMode, setViewMode] = useState("today");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const classes = ["Class1", "Class2", "Class3", "Class4", "Class5", "Class6", "Class7", "Class8", "Class9", "Class10"];

  useEffect(() => {
    if (selectedClass) {
      if (viewMode === "today") {
        fetchTodayData(selectedClass);
      } else if (viewMode === "tracker") {
        fetchTrackerData(selectedClass);
      }
    }
  }, [selectedClass, viewMode]);

  const fetchTodayData = async (classSheet) => {
    try {
      const response = await axios.get(`https://portalbackend-production-31b4.up.railway.app/attendance/current/${classSheet}`);
      setTodayData(response.data.todaySummary);
      setLogMessage(`Today's attendance for ${classSheet} fetched successfully!`);
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error fetching today's attendance:", error);
      setLogMessage(`Failed to fetch today's attendance for ${classSheet}.`);
      setOpenSnackbar(true);
    }
  };

  const fetchTrackerData = async (classSheet) => {
    try {
      const response = await axios.post(`https://portalbackend-production-31b4.up.railway.app/attendance/tracker`, { classSheet });
      setTrackerData(response.data.tracker);
      setTrackerSummary(response.data.summary);
      setLogMessage(`Attendance Data for ${classSheet} fetched successfully!`);
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error fetching attendance Data:", error);
      setLogMessage(`Failed to fetch attendance Data for ${classSheet}.`);
      setOpenSnackbar(true);
    }
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setTodayData([]);
    setTrackerData([]);
    setTrackerSummary(null);
    setLogMessage("");
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setTodayData([]);
    setTrackerData([]);
    setTrackerSummary(null);
    setLogMessage("");
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom align="center" fontWeight="bold" color="primary" sx={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)' }}>
        Student Attendance Status
      </Typography>

      <Container maxWidth="lg" sx={{ mt: 1, mb: 1 }}>  {/* Reduced margin-top value */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, mb: 3 }}>
          <FormControl sx={{ maxWidth: 200, width: '100%' }}>
            <InputLabel>Select Class</InputLabel>
            <Select
              value={selectedClass}
              onChange={handleClassChange}
              fullWidth
              label="Select Class"
              sx={{
                "& .MuiSelect-icon": {
                  color: '#ff1744', // Color for the dropdown icon
                },
                "& .MuiOutlinedInput-root": {
                  borderColor: '#ff1744', // Border color for Select input
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: '#ff1744', // Border color on hover
                },
                "& .MuiInputLabel-root": {
                  color: '#ff1744', // Input label color
                },
              }}
            >
              <MenuItem value="" disabled>Select class</MenuItem>
              {classes.map((className, index) => (
                <MenuItem key={index} value={className}>{className}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 3 }}>
            <Button
              variant={viewMode === "today" ? "contained" : "outlined"}
              onClick={() => handleViewModeChange("today")}
              sx={{
                width: '200px',
                borderRadius: '20px',
                fontWeight: 'bold',
                backgroundColor: viewMode === "today" ? '#ff1744' : 'transparent',
                color: viewMode === "today" ? 'white' : '#ff1744',
                border: `1px solid ${viewMode === "today" ? '#ff1744' : '#ff1744'}`,
                '&:hover': {
                  backgroundColor: '#ff1744',
                  color: 'white',
                },
              }}
            >
              View Today's Attendance
            </Button>
            <Button
              variant={viewMode === "tracker" ? "contained" : "outlined"}
              onClick={() => handleViewModeChange("tracker")}
              sx={{
                width: '200px',
                borderRadius: '20px',
                fontWeight: 'bold',
                backgroundColor: viewMode === "tracker" ? '#ff1744' : 'transparent',
                color: viewMode === "tracker" ? 'white' : '#ff1744',
                border: `1px solid ${viewMode === "tracker" ? '#ff1744' : '#ff1744'}`,
                '&:hover': {
                  backgroundColor: '#ff1744',
                  color: 'white',
                },
              }}
            >
              View Attendance Data
            </Button>
          </Box>
        </Box>

        {viewMode === "today" && selectedClass && (
          <div>
            <Typography variant="h5" gutterBottom>{selectedClass} - Today's Attendance</Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Roll Number</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Student Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {todayData.map((row, rowIndex) => (
                    <TableRow key={rowIndex} sx={{ '&:hover': { backgroundColor: '#f1f1f1' } }}>
                      <TableCell>{row.rollNumber}</TableCell>
                      <TableCell>{row.studentName}</TableCell>
                      <TableCell
                        sx={{
                          color: row.status === "Present" ? "green" : row.status === "Absent" ? "red" : "black",
                        }}
                      >
                        {row.status}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}

        {viewMode === "tracker" && selectedClass && (
          <div>
            <Typography variant="h5" gutterBottom>{selectedClass} - Attendance Data</Typography>
            {trackerSummary && (
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" sx={{ color: 'deepblue' }}>
                  <strong>Total Students:</strong> {trackerSummary.totalStudents}
                </Typography>
                <Typography variant="body1" sx={{ color: 'green' }}>
                  <strong>Present:</strong> {trackerSummary.totalPresent}
                </Typography>
                <Typography variant="body1" sx={{ color: 'red' }}>
                  <strong>Absent:</strong> {trackerSummary.totalAbsent}
                </Typography>
              </Box>
            )}
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Roll Number</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Student Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Section</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Total Present</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Total Absent</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Attendance Percentage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trackerData.map((row, rowIndex) => (
                    <TableRow key={rowIndex} sx={{ '&:hover': { backgroundColor: '#f1f1f1' } }}>
                      <TableCell>{row.rollNumber}</TableCell>
                      <TableCell>{row.studentName}</TableCell>
                      <TableCell>{row.section}</TableCell>
                      <TableCell>{row.totalPresent}</TableCell>
                      <TableCell>{row.totalAbsent}</TableCell>
                      <TableCell>{row.attendancePercentage}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <SnackbarContent
          message={logMessage}
          sx={{
            backgroundColor: logMessage.includes("Failed to fetch") ? 'red' : 'green', // Red for failure message, Green for success message
            color: 'white',
            borderRadius: '5px',
            padding: '10px',
          }}
        />
      </Snackbar>
    </>
  );
};

export default ViewAttendance;
