import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress
} from '@mui/material';

const UserSheet = () => {
  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    Username: "",
    Password: "",
  });
  const [logMessage, setLogMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Hang on, fetching user data...");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://portalbackend-production-31b4.up.railway.app/getUsers");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLogMessage("Failed to load user data.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData({
      Username: users[index][0],
      Password: users[index][1],
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.post("https://portalbackend-production-31b4.up.railway.app/updateUser", {
        CurrentUsername: users[editIndex][0],
        NewUsername: formData.Username,
        CurrentPassword: users[editIndex][1],
        NewPassword: formData.Password,
      });
      console.log("Backend response:", response.data.message);
      setLogMessage("User info updated successfully!");
      fetchUserData(); // Refresh the user data
      setEditIndex(null);
      setFormData({
        Username: "",
        Password: "",
      });
    } catch (error) {
      console.error("Error updating user info:", error);
      setLogMessage("Failed to update user info.");
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <>
      {/* Move this text outside of the page/container */}
      <Typography variant="h4" align="center" gutterBottom fontWeight="bold" color="primary" sx={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)' }}>
        Teachers Login Details
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start', // Aligns the container towards the top of the screen
          minHeight: '100vh', // Ensures the full viewport height is used
          paddingTop: '60px', // Adjust the top padding to make space for the fixed title
        }}
      >
        <Container maxWidth="lg" sx={{ backgroundColor: '#fafafa', borderRadius: '8px', boxShadow: 2, padding: '20px' }}>
          {logMessage && (
            <Alert severity={logMessage.includes('failed') ? 'error' : 'success'} sx={{ mb: 2 }}>
              {logMessage}
            </Alert>
          )}

          {loading && (
            <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
              <LinearProgress sx={{ mb: 2 }} />
              <Typography variant="body1" color="textSecondary">{loadingMessage}</Typography>
            </Box>
          )}

          <TableContainer component={Paper} sx={{ borderRadius: '8px' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: '#e8f5e9' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: '#388e3c' }}>Username</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#388e3c' }}>Password</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#388e3c' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      '&:hover': { backgroundColor: '#f1f1f1' },
                      backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff',
                    }}
                  >
                    <TableCell>{user[0]}</TableCell>
                    <TableCell>{user[1]}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEdit(index)}
                        sx={{
                          borderRadius: '20px',
                          textTransform: 'none',
                          '&:hover': { backgroundColor: '#d1e7dd' }
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Edit User Information Dialog */}
          <Dialog open={editIndex !== null} onClose={() => setEditIndex(null)}>
            <DialogTitle>Edit User Information</DialogTitle>
            <DialogContent>
              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <TextField
                  label="Username"
                  name="Username"
                  value={formData.Username}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  placeholder="Enter new username"
                  sx={{
                    mb: 2,
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#ccc' },
                      '&:hover fieldset': { borderColor: '#4caf50' },
                    },
                  }}
                />
                <TextField
                  label="Password"
                  name="Password"
                  value={formData.Password}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  placeholder="Enter new password"
                  type="password"
                  sx={{
                    mb: 2,
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#ccc' },
                      '&:hover fieldset': { borderColor: '#4caf50' },
                    },
                  }}
                />
                {loading && <LinearProgress sx={{ mb: 2 }} />}
                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                      paddingX: 4,
                      paddingY: 1.5,
                      borderRadius: '25px',
                      fontWeight: 'bold',
                      '&:hover': { backgroundColor: '#388e3c' }
                    }}
                  >
                    Save
                  </Button>
                </Box>
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditIndex(null)} color="secondary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </>
  );
};

export default UserSheet;
