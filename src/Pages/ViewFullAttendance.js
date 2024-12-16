import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { Grid, Button, CircularProgress, Select, MenuItem, InputLabel, FormControl, Box, TextField } from "@mui/material";

const ViewFullAttendance = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logMessage, setLogMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [notification, setNotification] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");  // State for search query

  const classes = ["Class1", "Class2", "Class3", "Class4", "Class5", "Class6", "Class7", "Class8", "Class9", "Class10"];

  useEffect(() => {
    if (selectedClass) {
      fetchAttendanceData(selectedClass);
    }
  }, [selectedClass]);

  const fetchAttendanceData = async (classSheet) => {
    setLoading(true);
    setLogMessage("");
    try {
      const response = await axios.get(`https://portalbackend-production-31b4.up.railway.app/attendance/full/${classSheet}`);
      setAttendanceData(response.data.attendanceData);
      setNotification(`Full attendance sheet for ${classSheet} fetched successfully!`);
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false); // Hide notification after 3 seconds
      }, 3000); 
    } catch (error) {
      console.error("Error fetching full attendance sheet:", error);
      setLogMessage(`Failed to fetch full attendance sheet for ${classSheet}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setAttendanceData([]);
    setLogMessage("");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (searchQuery) {
      const filteredData = attendanceData.filter(row =>
        row.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.rollNumber.toString().includes(searchQuery)
      );
      setAttendanceData(filteredData);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery(""); // Clear the search query
    fetchAttendanceData(selectedClass); // Reset to full attendance data
  };

  const handleDelete = async () => {
    setLoading(true);
    setLogMessage("");
    try {
      await axios.delete(`https://portalbackend-production-31b4.up.railway.app/attendance/full/${selectedClass}`);
      setAttendanceData([]);
      setLogMessage(`Full attendance sheet for ${selectedClass} deleted successfully!`);
      setOpenDialog(false);
    } catch (error) {
      console.error("Error deleting full attendance sheet:", error);
      setLogMessage(`Failed to delete full attendance sheet for ${selectedClass}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(attendanceData.map(row => ({
      'Roll Number': row.rollNumber,
      'Student Name': row.studentName,
      ...row.dates.reduce((acc, date, index) => ({ ...acc, [date]: row.statuses[index] }), {})
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, `Attendance_${selectedClass}.xlsx`);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto' }}>
      {/* Heading moved to the very top */}
      <h2 style={{ textAlign: 'center', marginTop: '0', marginBottom: '-3rem' }}>Full Attendance Sheet</h2>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <FormControl variant="outlined" sx={{ minWidth: 160 }}>
          <InputLabel>Select Class</InputLabel>
          <Select
            value={selectedClass}
            onChange={handleClassChange}
            label="Select Class"
            disabled={loading}
          >
            <MenuItem value="" disabled>Select class</MenuItem>
            {classes.map((className, index) => (
              <MenuItem key={index} value={className}>{className}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#2e7d32', width: '150px', '&:hover': { backgroundColor: '#388e3c' } }}
              onClick={handleExportToExcel}
              disabled={loading || !attendanceData.length}
            >
              Export to Excel
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#b71c1c', width: '150px', '&:hover': { backgroundColor: '#d32f2f' } }}
              onClick={handleOpenDialog}
              disabled={loading || !attendanceData.length}
            >
              Delete
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Search Bar moved to top-right */}
      <Box sx={{
        position: 'fixed', top: '20px', right: '20px', display: 'flex', alignItems: 'center',
        zIndex: 1000, backgroundColor: '#fff', padding: '0.5rem', borderRadius: '8px'
      }}>
        <TextField
          label="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          size="small"
          sx={{ marginRight: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{ backgroundColor: '#388e3c', '&:hover': { backgroundColor: '#2e7d32' } }}
        >
          Search
        </Button>
        {/* Clear Search Button */}
        <Button
          variant="outlined"
          onClick={handleClearSearch}
          sx={{ marginLeft: 2, backgroundColor: '#d32f2f', color: '#fff', '&:hover': { backgroundColor: '#b71c1c' } }}
        >
          Clear
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: 'center', margin: '2rem 0' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {attendanceData.length > 0 && (
            <Box sx={{ overflowX: 'auto', marginBottom: 2 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#e8f5e9' }}>
                    <th style={{ padding: '0.75rem', border: '1px solid #ddd', fontWeight: 'bold', color: '#388e3c' }}>Roll Number</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #ddd', fontWeight: 'bold', color: '#388e3c' }}>Student Name</th>
                    {attendanceData[0].dates.map((date, index) => (
                      <th key={index} style={{ padding: '0.75rem', border: '1px solid #ddd', fontWeight: 'bold', color: '#388e3c' }}>{date}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((row, rowIndex) => (
                    <tr key={rowIndex} style={{ backgroundColor: rowIndex % 2 === 0 ? '#fafafa' : '#fff' }}>
                      <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{row.rollNumber}</td>
                      <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{row.studentName}</td>
                      {row.statuses.map((status, index) => (
                        <td key={index} style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{status}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          )}
        </>
      )}

      {openDialog && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '10px', width: '400px', maxWidth: '90%' }}>
            <h3 style={{ color: '#d32f2f', marginBottom: '1rem' }}>Delete Attendance Sheet</h3>
            <p>Are you sure you want to delete the full attendance sheet for {selectedClass}?</p>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button onClick={handleCloseDialog} variant="outlined" color="primary">
                Cancel
              </Button>
              <Button onClick={handleDelete} variant="contained" color="error">
                Confirm
              </Button>
            </Box>
          </div>
        </div>
      )}

      {/* Notification Pop-up */}
      {showNotification && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', backgroundColor: '#4caf50', color: '#fff',
          padding: '1rem', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', zIndex: 1000
        }}>
          {notification}
        </div>
      )}
    </div>
  );
};

export default ViewFullAttendance;
