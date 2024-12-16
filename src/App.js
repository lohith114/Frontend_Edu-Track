import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Welcome from './Components/Welcome';
import ProfileInfo from './Components/ProfileInfo';
import SchoolInfo from './Pages/SchoolInfo';
import ManageFeeStatus from './Pages/ManageFeeStatus';
import Attendance from './Pages/Attendance';
import TimeTable from './Pages/TimeTable';
import ExamTimeTable from './Pages/ExamTimeTable';
import ExamTimeTableView from './Pages/ExamTimeTableView';
import ExamDashboard from './Pages/ExamDashboard';
import Login from './Components/Login';
import AllStudents from './Pages/AllStudents';
import Addexamreport from './Pages/Addexamreport';
import Report from './Pages/Report';
import MainPage from './Pages/MainPage';
import TimetableGenerator from './Pages/TimetableGenerator';
import TimetableUpload from './Pages/TimeTableUpload';
import TimeTableView from './Pages/TimeTableView';
import { CssBaseline, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import RegistrationForm from './Pages/RegistrationForm';
import Footer from './Components/Footer'; // Ensure correct import path
import { auth } from './Firebase/Firebase'; // Adjust the path if necessary

const theme = createTheme({
  palette: {
    primary: {
      main: '#282c34',
    },
    secondary: {
      main: '#61dafb',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null represents the loading state
  const [sidebarWidth, setSidebarWidth] = useState(60);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleSidebarToggle = (isExpanded) => {
    setSidebarWidth(isExpanded ? 240 : 60);
  };

  const PrivateRoute = ({ children }) => {
    if (isAuthenticated === null) {
      // You can return a loader or a placeholder while checking authentication
      return <div>Loading...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/Edu-Track" />;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box display="flex" flexDirection="row" sx={{ height: '100vh', width: '100%' }}>
          {isAuthenticated && (
            <Box
              width={sidebarWidth}
              sx={{
                transition: 'width 0.3s ease',
                height: '100vh',
              }}
            >
              <Sidebar onToggle={handleSidebarToggle} />
            </Box>
          )}

          <Box
            sx={{
              ml: `${sidebarWidth}px`,
              transition: 'margin-left 0.3s ease',
              flexGrow: 1,
              padding: 3,
              height: '100vh',
              mr: 10,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Routes>
              <Route path="/Edu-Track" element={<Login />} />
              <Route path="/welcome" element={<PrivateRoute><Welcome /></PrivateRoute>} />
              <Route path="/profileinfo" element={<PrivateRoute><ProfileInfo /></PrivateRoute>} />
              <Route path="/Manage-Fee-Status" element={<PrivateRoute><ManageFeeStatus /></PrivateRoute>} />
              <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />
              <Route path="/time-table" element={<PrivateRoute><TimeTable /></PrivateRoute>} />
              <Route path="/exam-timetable-upload" element={<PrivateRoute><ExamTimeTable /></PrivateRoute>} />
              <Route path="/exam-timetable-view" element={<PrivateRoute><ExamTimeTableView /></PrivateRoute>} />
              <Route path="/exam-dashboard" element={<PrivateRoute><ExamDashboard /></PrivateRoute>} />
              <Route path="/school-info" element={<PrivateRoute><SchoolInfo /></PrivateRoute>} />
              <Route path="/Student-Registration" element={<PrivateRoute><RegistrationForm /></PrivateRoute>} />
              <Route path="/View-Registered-Students" element={<PrivateRoute><AllStudents /></PrivateRoute>} />
              <Route path="/marks-management" element={<PrivateRoute><MainPage /></PrivateRoute>} />
              <Route path="/addexamreport" element={<PrivateRoute><Addexamreport /></PrivateRoute>} />
              <Route path="/report" element={<PrivateRoute><Report /></PrivateRoute>} />
              <Route path="/" element={<PrivateRoute><TimeTable /></PrivateRoute>} />
              <Route path="/generator" element={<PrivateRoute><TimetableGenerator /></PrivateRoute>} />
              <Route path="/upload" element={<PrivateRoute><TimetableUpload /></PrivateRoute>} />
              <Route path="/view" element={<PrivateRoute><TimeTableView /></PrivateRoute>} />
              {/* Catch-all route for any undefined route */}
              <Route path="*" element={<Navigate to="/Edu-Track" />} />
            </Routes>

            {/* Footer */}
            <Footer />
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
