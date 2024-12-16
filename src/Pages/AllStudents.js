import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Button,
  Modal,
  Grid,
  IconButton,
  CircularProgress,
} from "@mui/material";
import * as XLSX from "xlsx";
import EditIcon from "@mui/icons-material/Edit";
import { auth } from "../Firebase/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function AllStudents() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rollNumberFilter, setRollNumberFilter] = useState("");  // Roll number filter state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [updatedStudent, setUpdatedStudent] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("https://portalbackend-production-31b4.up.railway.app/allstudents");
        if (!response.ok) throw new Error("Failed to fetch students");
        const data = await response.json();
        setStudents(data);
        setFilteredStudents(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    if (rollNumberFilter.trim() === "") {
      setFilteredStudents(students); // Reset to show all students if filter is empty
    } else {
      setFilteredStudents(
        students.filter((student) =>
          student.rollNumber.toString().includes(rollNumberFilter)
        )
      );
    }
  }, [rollNumberFilter, students]);

  const downloadExcel = () => {
    const studentsWithoutFeeStatus = filteredStudents.map(({ feeStatus, ...student }) => student);
    const worksheet = XLSX.utils.json_to_sheet(studentsWithoutFeeStatus);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "All Students");
    XLSX.writeFile(workbook, "All_Students.xlsx");
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setUpdatedStudent({ ...student });
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedStudent(null);
    setUpdatedStudent({});
  };

  const handleUpdateStudent = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(
        `https://portalbackend-production-31b4.up.railway.app/updateStudent/${selectedStudent.rollNumber}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedStudent),
        }
      );
      if (!response.ok) throw new Error("Failed to update student details");
      alert("Student details updated successfully!");
      setOpenModal(false);
      setUpdatedStudent({});
      const responseStudents = await fetch("https://portalbackend-production-31b4.up.railway.app/allstudents");
      const updatedStudents = await responseStudents.json();
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <Modal
        open={loading}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            padding: "20px",
            width: "300px",
            textAlign: "center",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <CircularProgress sx={{ marginBottom: "10px" }} />
          <Typography variant="h6">Hold on, we are getting ready...</Typography>
        </Box>
      </Modal>
    );
  }

  if (error) return <div>Error: {error}</div>;

  return (
    <Box
      sx={{
        maxWidth: "1200px",
        margin: "auto",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#F5F5F5",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#7D0541", // Corrected header color
          }}
        >
          All Students
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Filter by Roll Number"
            variant="outlined"
            value={rollNumberFilter}
            onChange={(e) => setRollNumberFilter(e.target.value)}
            sx={{ marginRight: "10px" }}
          />
          <Button
            variant="contained"
            onClick={downloadExcel}
            sx={{
              backgroundColor: "#00695c", // Button 
              color: "#fff",
              "&:hover": {
                backgroundColor: "#004d40", 
              },
            }}
          >
            Download Excel
          </Button>
        </Box>
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          maxWidth: "100%",
          overflowX: "auto",
        }}
      >
        <Table
          sx={{
            minWidth: 650,
            "& .MuiTableCell-root": { fontSize: "12px", padding: "6px" },
            "& .MuiTableHead-root": {
              backgroundColor: "#7D0541", // Table header color matches header
            },
            "& .MuiTableCell-head": {
              color: "#fff", // White text for header cells
            },
          }}
          aria-label="students table"
        >
          <TableHead>
            <TableRow>
              {[
                "Roll Number",
                "First Name",
                "Last Name",
                "Gender",
                "Date of Birth",
                "Parent Name",
                "Parent Email",
                "Parent Contact",
                "Cast",
                "Region",
                "Year of Admission",
                "Actions",
              ].map((header, index) => (
                <TableCell key={index} sx={{ fontWeight: "bold" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.rollNumber}>
                <TableCell>{student.rollNumber}</TableCell>
                <TableCell>{student.firstName}</TableCell>
                <TableCell>{student.lastName}</TableCell>
                <TableCell>{student.gender}</TableCell>
                <TableCell>{student.dob}</TableCell>
                <TableCell>{student.parentName}</TableCell>
                <TableCell>{student.parentEmail}</TableCell>
                <TableCell>{student.parentContact}</TableCell>
                <TableCell>{student.cast}</TableCell>
                <TableCell>{student.region}</TableCell>
                <TableCell>{student.yearOfAdmission}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(student)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={openModal}
        onClose={handleModalClose}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            padding: "20px",
            width: "500px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "20px" }}>
            Modify Student Details
          </Typography>
          <Grid container spacing={2}>
            {[
              { label: "First Name", key: "firstName" },
              { label: "Last Name", key: "lastName" },
              { label: "Gender", key: "gender" },
              { label: "Date of Birth", key: "dob" },
              { label: "Parent Name", key: "parentName" },
              { label: "Parent Email", key: "parentEmail" },
              { label: "Parent Contact", key: "parentContact" },
              { label: "Cast", key: "cast" },
              { label: "Region", key: "region" },
              { label: "Year of Admission", key: "yearOfAdmission" },
            ].map((field, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <TextField
                  fullWidth
                  label={field.label}
                  value={updatedStudent[field.key] || ""}
                  onChange={(e) =>
                    setUpdatedStudent({
                      ...updatedStudent,
                      [field.key]: e.target.value,
                    })
                  }
                />
              </Grid>
            ))}
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "20px",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateStudent}
              disabled={isUpdating}
              sx={{
                backgroundColor: "#7D0541", // Matching update button color to header
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#6a0432",
                },
              }}
            >
              {isUpdating ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Update"
              )}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default AllStudents;
