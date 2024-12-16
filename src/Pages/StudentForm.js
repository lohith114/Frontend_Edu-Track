import React, { useState } from "react";
import axios from "axios";
import { TextField, Select, MenuItem, Button, FormControl, InputLabel, FormHelperText, CircularProgress, Grid } from "@mui/material";

const StudentForm = () => {
  const [formData, setFormData] = useState({
    Class: "",
    RollNumber: "",
    NameOfTheStudent: "",
    ParentEmail: "",
    Section: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.Class) newErrors.Class = "Class is required";
    if (!formData.RollNumber.trim()) newErrors.RollNumber = "Roll Number is required";
    if (!formData.NameOfTheStudent.trim()) newErrors.NameOfTheStudent = "Student Name is required";
    if (!formData.ParentEmail.trim()) newErrors.ParentEmail = "Parent's Gmail ID is required";
    if (!formData.Section.trim()) newErrors.Section = "Section is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveToGoogleSheet = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post("https://portalbackend-production-31b4.up.railway.app/save", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.status === 200) {
        alert(response.data.message);
      } else {
        alert("Failed to save data. Please try again.");
      }

      setFormData({
        Class: "",
        RollNumber: "",
        NameOfTheStudent: "",
        ParentEmail: "",
        Section: "",
      });
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      saveToGoogleSheet(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  return (
    <div style={{ maxWidth: '600px', margin: '-4rem auto 0', padding: '1.5rem', border: '1px solid #e0e0e0', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '1rem' }}>Student Attendance Registration</h2>
      <p style={{ textAlign: 'center', color: '#7f8c8d', marginBottom: '2rem' }}>Fill in the form below to register student details for attendance tracking.</p>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.Class}>
              <InputLabel>Select Class</InputLabel>
              <Select name="Class" value={formData.Class} onChange={handleChange}>
                <MenuItem value="" disabled>Select class</MenuItem>
                {Array.from({ length: 10 }, (_, i) => (
                  <MenuItem key={i + 1} value={`Class${i + 1}`}>Class {i + 1}</MenuItem>
                ))}
              </Select>
              {errors.Class && <FormHelperText>{errors.Class}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="RollNumber"
              label="Roll Number"
              value={formData.RollNumber}
              onChange={handleChange}
              fullWidth
              error={!!errors.RollNumber}
              helperText={errors.RollNumber}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="NameOfTheStudent"
              label="Name of the Student"
              value={formData.NameOfTheStudent}
              onChange={handleChange}
              fullWidth
              error={!!errors.NameOfTheStudent}
              helperText={errors.NameOfTheStudent}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="ParentEmail"
              label="Parent's Gmail ID"
              type="email"
              value={formData.ParentEmail}
              onChange={handleChange}
              fullWidth
              error={!!errors.ParentEmail}
              helperText={errors.ParentEmail}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="Section"
              label="Section"
              value={formData.Section}
              onChange={handleChange}
              fullWidth
              error={!!errors.Section}
              helperText={errors.Section}
            />
          </Grid>

          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <Button
               type="submit"
                 variant="contained"
                    sx={{
                       backgroundColor: "##64ffda", 
                           color: "white", 
                              size: "large", // Button size
                                   '&:hover': {
                                 backgroundColor: "#004d40", 
                            },
                       }}
                 disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
             {loading ? 'Submitting...' : 'Submit'}
           </Button>
           </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default StudentForm;
