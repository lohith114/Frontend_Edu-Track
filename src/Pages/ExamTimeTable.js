import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase/Firebase"; // Ensure the correct path to Firebase setup
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  LinearProgress,
  Paper,
  IconButton,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
// import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/system";

const StyledFileDrop = styled(Box)(({ theme, isDragOver }) => ({
  border: `2px dashed ${isDragOver ? theme.palette.primary.main : theme.palette.grey[400]}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: "center",
  color: isDragOver ? theme.palette.primary.dark : theme.palette.text.secondary,
  transition: "background-color 0.3s ease",
  backgroundColor: isDragOver ? theme.palette.action.hover : theme.palette.background.paper,
  cursor: "pointer",
}));

function ExamTimeTable() {
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  // Check user authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/"); // Redirect to login if not authenticated
      } else {
        setAuthLoading(false);
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [navigate]);

  const [file, setFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [open, setOpen] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    axios
      .get("https://portalbackend-production-31b4.up.railway.app/api/timetables/classes")
      .then((response) => setClasses(response.data))
      .catch((error) => console.error("Error fetching classes:", error));
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProgress(0);
      setSuccess(false);
    }
  };

  const handleFileUpload = () => {
    if (!file || !selectedClass) return;

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    axios
      .post(`https://portalbackend-production-31b4.up.railway.app/api/exam-timetables/upload/${selectedClass}`, formData, {
        onUploadProgress: (progressEvent) => {
          setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        },
      })
      .then((response) => {
        setPdfUrl(response.data.url);
        setLoading(false);
        setSuccess(true);
        setOpenNotification(true);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        setLoading(false);
      });
  };

  const handleDelete = useCallback(() => {
    axios
      .delete(`https://portalbackend-production-31b4.up.railway.app/api/exam-timetables/delete/${selectedClass}`)
      .then(() => {
        setPdfUrl(null);
        setSuccess(false);
      })
      .catch((error) => {
        console.error("Error deleting file:", error);
      });
  }, [selectedClass]);

  const handleDialogOpen = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);
  const handleConfirmDelete = () => {
    handleDelete();
    handleDialogClose();
  };
  const handleNotificationClose = () => {
    setOpenNotification(false);
    setFile(null);
    setProgress(0);
    setSuccess(false);
  };
  const handleClassChange = (event) => setSelectedClass(event.target.value);

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
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: "#f5f5f5",
        padding: 4,
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          width: 301,
          textAlign: "left",
          marginBottom: { xs: 3, md: 0 },
          marginRight: { md: 3 },
        }}
      >
        <Typography variant="h5" gutterBottom>
          Upload Exam Timetable
        </Typography>

        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel id="class-select-label">Select Class</InputLabel>
          <Select
            labelId="class-select-label"
            id="class-select"
            value={selectedClass}
            label="Select Class"
            onChange={handleClassChange}
          >
            {classes.map((cls) => (
              <MenuItem key={cls} value={cls}>
                {cls}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <StyledFileDrop
          isDragOver={isDragOver}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            handleFileChange(e);
            setIsDragOver(false);
          }}
          onClick={() => document.getElementById("fileInput").click()}
        >
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          {file ? (
            <Typography>{file.name}</Typography>
          ) : (
            <>
              <Typography>Drag & Drop to Upload File</Typography>
              <Typography>OR</Typography>
              <Button variant="contained" size="small" sx={{ mt: 2 }}>
                Browse File
              </Button>
            </>
          )}
        </StyledFileDrop>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleFileUpload}
          disabled={!file || loading || !selectedClass}
        >
          {loading ? <CircularProgress size={20} /> : pdfUrl ? "Update PDF" : "Upload PDF"}
        </Button>

        {loading && <LinearProgress variant="determinate" value={progress} sx={{ mt: 2 }} />}
        {progress > 0 && (
          <Typography sx={{ mt: 1 }} align="center">
            {progress}%
          </Typography>
        )}
        {success && (
          <Typography sx={{ mt: 2, color: "success.main" }} align="center">
            File uploaded successfully!
          </Typography>
        )}
      </Paper>

      {pdfUrl ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", ml: 4 }}>
          <Typography variant="h6" gutterBottom>
            Uploaded PDF
          </Typography>
          <Card
            sx={{
              width: 100,
              height: 120,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              border: "2px solid red",
              borderRadius: 2,
              boxShadow: 3,
              mt: 2,
              mb: 2,
              backgroundColor: "white",
              position: "relative",
            }}
          >
            <PictureAsPdfIcon sx={{ color: "red", fontSize: 40 }} />
            <Typography variant="body2" sx={{ color: "black", mt: 1 }}>
              PDF
            </Typography>
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                top: 5,
                right: 5,
                bgcolor: "white",
                border: "1px solid red",
                ":hover": { bgcolor: "red", color: "white" },
              }}
              onClick={handleDialogOpen}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Card>
        </Box>
      ) : (
        <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
          No file uploaded yet.
        </Typography>
      )}

      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this file? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openNotification}
        onClose={handleNotificationClose}
      >
        <DialogTitle>File Uploaded</DialogTitle>
        <DialogContent>
  <DialogContentText>
    Your file has been uploaded successfully!
  </DialogContentText>
</DialogContent>
<DialogActions>
  <Button onClick={handleNotificationClose}>OK</Button>
</DialogActions>
</Dialog>
</Box>
);
}

export default ExamTimeTable;
