import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../Firebase/Firebase"; // Make sure this path is correct
import { onAuthStateChanged } from "firebase/auth";
import { Button, Container, Grid, Paper, Typography, CircularProgress } from "@mui/material";
import StudentForm from "./StudentForm";
import CreateSheet from "./CreateSheet";
import ModifyStudent from "./ModifyStudent";
import UserSheet from "./UserSheet";
import ViewAttendance from "./ViewAttendance";
import ViewFullAttendance from "./ViewFullAttendance";

const Attendance = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/"); // Redirect to login if not authenticated
      } else {
        setIsLoading(false); // Stop showing the loading spinner
      }
    });

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, [navigate]);

  const renderContent = () => {
    switch (currentView) {
      case "studentForm":
        return <StudentForm />;
      case "userSheet":
        return <UserSheet />;
      case "viewAttendance":
        return <ViewAttendance />;
      case "modifyStudent":
        return <ModifyStudent />;
      case "viewFullAttendance":
        return <ViewFullAttendance />;
      case "createSheet":
        return <CreateSheet />;
      default:
        return (
          <Paper sx={{ padding: 3, textAlign: "center" }}>
            {/* Header Section */}
            <Typography variant="h4" gutterBottom sx={{ color: "#7D0541" }}>
              Welcome to the Attendance Dashboard
            </Typography>
            <Typography variant="body1" paragraph>
              Manage students, classes, and attendance records effortlessly.
            </Typography>
            
            <Grid container spacing={2} justifyContent="center">
              {/* Action Buttons */}
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ backgroundColor: "#ff1744", '&:hover': { backgroundColor: "#d50032" } }}
                  onClick={() => setCurrentView("studentForm")}
                  startIcon={<span role="img" aria-label="student">&#128100;</span>}
                >
                  Student Registration
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={() => setCurrentView("userSheet")}
                  startIcon={<span role="img" aria-label="class">&#128196;</span>}
                >
                  Class Teacher Login Details
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  onClick={() => setCurrentView("viewAttendance")}
                  startIcon={<span role="img" aria-label="view">&#128065;</span>}
                >
                  View Attendance (Class Wise)
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  fullWidth
                  variant="contained"
                  color="warning"
                  onClick={() => setCurrentView("modifyStudent")}
                  startIcon={<span role="img" aria-label="modify">&#9998;</span>}
                >
                  Modify Student Information
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  onClick={() => setCurrentView("viewFullAttendance")}
                  startIcon={<span role="img" aria-label="full-attendance">&#128200;</span>}
                >
                  Full Attendance Data/Delete
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  fullWidth
                  variant="contained"
                  color="info"
                  onClick={() => setCurrentView("createSheet")}
                  startIcon={<span role="img" aria-label="create">&#10000;</span>}
                >
                  Create New Class
                </Button>
              </Grid>
            </Grid>
          </Paper>
        );
    }
  };

  if (isLoading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ marginTop: 3 }}>
      {currentView !== "dashboard" && (
        <Button
          variant="contained"
          sx={{
            marginBottom: 4,
            marginLeft: -5,  // Ensure the button starts from the left
            backgroundColor: "#33691e", 
            color: "white", 
            fontWeight: "bold",
            borderRadius: "25px", 
            padding: "8px 8px", 
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", 
            '&:hover': {
              backgroundColor: "#cddc39", 
              boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.2)",
            },
          }}
          onClick={() => setCurrentView("dashboard")}
          startIcon={<span role="img" aria-label="back">&#11013;</span>}
        >
          Back to Dashboard
        </Button>
      )}
      {renderContent()}
    </Container>
  );
};

export default Attendance;
