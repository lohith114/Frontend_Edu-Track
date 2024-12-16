import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../Firebase/Firebase"; // Ensure the path to Firebase setup is correct
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";

// Styled Paper for cleaner card-like layout
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#f9f9f9",
  boxShadow: theme.shadows[3],
  textAlign: "center",
}));

const CreateSheet = () => {
  const [sheetName, setSheetName] = useState("");
  const [logMessage, setLogMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/"); // Redirect to login if not authenticated
      } else {
        setAuthLoading(false); // Stop loading when user is authenticated
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [navigate]);

  const handleCreateSheet = async () => {
    setLoading(true);
    setLogMessage("");
    try {
      await axios.post(`https://portalbackend-production-31b4.up.railway.app/sheet/create`, { sheetName });
      setLogMessage(`Sheet "${sheetName}" created successfully!`);
      setSheetName(""); // Reset the form
    } catch (error) {
      console.error("Error creating sheet:", error);
      setLogMessage(`Failed to create sheet "${sheetName}".`);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    // Show a loading spinner while checking authentication
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
          Create New Class Sheet
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Enter the class name for which you'd like to create a new attendance sheet.
        </Typography>
        
        <Box mb={2}>
          <TextField
            label="Class Sheet Name"
            fullWidth
            variant="outlined"
            margin="normal"
            value={sheetName}
            onChange={(e) => setSheetName(e.target.value)}
            disabled={loading}
          />
        </Box>

        {logMessage && (
          <Alert severity={logMessage.includes("failed") ? "error" : "success"} sx={{ mb: 2 }}>
            {logMessage}
          </Alert>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateSheet}
          fullWidth
          disabled={loading || !sheetName}
          sx={{
            padding: "12px 0",
            textTransform: "none",
            fontSize: "16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="secondary" />
          ) : (
            "Create Sheet"
          )}
        </Button>
      </StyledPaper>
    </Container>
  );
};

export default CreateSheet;
