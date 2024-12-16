import 'jspdf-autotable';
import { useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from '@mui/material';
import { jsPDF } from 'jspdf';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const classes = ['Nursery', 'LKG', 'UKG', 'CLASS-1', 'CLASS-2', 'CLASS-3', 'CLASS-4', 'CLASS-5', 'CLASS-6', 'CLASS-7', 'CLASS-8', 'CLASS-9', 'CLASS-10'];

const TimetableGenerator = () => {
    const [formData, setFormData] = useState({
        day: '',
        subject: '',
        startTime: '',
        endTime: '',
        classStandard: '',
    });

    const [studentClass, setStudentClass] = useState('');
    const [timeSlots, setTimeSlots] = useState([]);
    const [timetable, setTimetable] = useState([]);
    const [lunchBreak, setLunchBreak] = useState({ startTime: '', endTime: '', applyToAllDays: true, customDays: [] });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleStudentClassChange = (e) => {
        setStudentClass(e.target.value);
    };

    const handleLunchChange = (e) => {
        const { name, value, checked } = e.target;
        if (name === 'applyToAllDays') {
            setLunchBreak({ ...lunchBreak, [name]: checked });
        } else if (name === 'customDays') {
            const customDays = checked 
                ? [...lunchBreak.customDays, value] 
                : lunchBreak.customDays.filter(day => day !== value);
            setLunchBreak({ ...lunchBreak, customDays });
        } else {
            setLunchBreak({ ...lunchBreak, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const timeSlot = `${formData.startTime} - ${formData.endTime}`;
        if (!timeSlots.includes(timeSlot)) {
            setTimeSlots([...timeSlots, timeSlot]);
        }
        setTimetable([...timetable, { ...formData, studentClass }]);
        setFormData({ day: '', subject: '', startTime: '', endTime: '', classStandard: '' });
    };

    const handleLunchSubmit = (e) => {
        e.preventDefault();
        const lunchTimeSlot = `${lunchBreak.startTime} - ${lunchBreak.endTime}`;
        if (!timeSlots.includes(lunchTimeSlot)) {
            setTimeSlots([...timeSlots, lunchTimeSlot]);
        }
    };

    const handleDelete = (day, slot) => {
        const newTimetable = timetable.filter(entry => !(entry.day === day && `${entry.startTime} - ${entry.endTime}` === slot));
        setTimetable(newTimetable);
    };

    const handleDeleteTimeSlot = (slot) => {
        const newTimeSlots = timeSlots.filter(timeSlot => timeSlot !== slot);
        setTimeSlots(newTimeSlots);
        const newTimetable = timetable.filter(entry => `${entry.startTime} - ${entry.endTime}` !== slot);
        setTimetable(newTimetable);
    };

    const generatePDF = () => {
        const doc = new jsPDF('landscape'); // Set orientation to landscape
    
        const tableColumn = ['Day', ...timeSlots];
        const tableRows = [];
    
        daysOfWeek.forEach(day => {
            const row = [day];
            timeSlots.forEach(slot => {
                const entry = timetable.find(entry => entry.day === day && `${entry.startTime} - ${entry.endTime}` === slot);
                const isLunchBreak = lunchBreak.applyToAllDays
                    ? `${lunchBreak.startTime} - ${lunchBreak.endTime}` === slot
                    : lunchBreak.customDays.includes(day) && `${lunchBreak.startTime} - ${lunchBreak.endTime}` === slot;
                row.push(entry ? entry.subject : isLunchBreak ? 'Lunch Break' : '');
            });
            tableRows.push(row);
        });
    
        doc.text(`Class: ${studentClass}`, 14, 16);
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 30,
            theme: 'grid', // Optional: Add table styling
            styles: {
                fontSize: 25, // Change this value to adjust the font size
            },
            headStyles: {
                fontSize: 25, // Change this value to adjust the header font size
            },
            bodyStyles: {
                fontSize: 20, // Change this value to adjust the body font size
            },
        });
    
        doc.save('timetable.pdf');
    };

    return (
        <Box p={2} display="flex" flexDirection="column" gap={1} alignItems="center">
            {/* Back Button - Aligned to the Right */}
            <Box display="flex" justifyContent="flex-end" width="100%" mb={2}>
            <Button
    variant="contained"
    style={{ backgroundColor: '#7cb342' }}
    onClick={() => window.history.back()}
>
    Back
</Button>

            </Box>

            <FormControl fullWidth size="small" sx={{ maxWidth: 250 }}>
                <InputLabel>Student Class</InputLabel>
                <Select
                    value={studentClass}
                    onChange={handleStudentClassChange}
                    required
                >
                    <MenuItem value="">Select Class</MenuItem>
                    {classes.map((cls) => (
                        <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} md={6}>
                    <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={1}>
                        <h3 style={{ fontSize: '1rem' }}>Add Class</h3>
                        <FormControl fullWidth size="small">
                            <InputLabel>Day</InputLabel>
                            <Select
                                name="day"
                                value={formData.day}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="">Select Day</MenuItem>
                                {daysOfWeek.map((day) => (
                                    <MenuItem key={day} value={day}>{day}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            size="small"
                            sx={{ marginBottom: 1 }}
                        />
                        <TextField
                            label="Start Time"
                            name="startTime"
                            type="time"
                            value={formData.startTime}
                            onChange={handleChange}
                            required
                            InputLabelProps={{ shrink: true }}
                            size="small"
                        />
                        <TextField
                            label="End Time"
                            name="endTime"
                            type="time"
                            value={formData.endTime}
                            onChange={handleChange}
                            required
                            InputLabelProps={{ shrink: true }}
                            size="small"
                        />
                        <Button type="submit" variant="contained" color="primary" size="small">
                            Add Class
                        </Button>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box component="form" onSubmit={handleLunchSubmit} display="flex" flexDirection="column" gap={1}>
                        <h3 style={{ fontSize: '1rem' }}>Add Lunch Break</h3>
                        <TextField
                            label="Start Time"
                            name="startTime"
                            type="time"
                            value={lunchBreak.startTime}
                            onChange={handleLunchChange}
                            required
                            InputLabelProps={{ shrink: true }}
                            size="small"
                            sx={{ marginBottom: 1 }}
                        />
                        <TextField
                            label="End Time"
                            name="endTime"
                            type="time"
                            value={lunchBreak.endTime}
                            onChange={handleLunchChange}
                            required
                            InputLabelProps={{ shrink: true }}
                            size="small"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="applyToAllDays"
                                    checked={lunchBreak.applyToAllDays}
                                    onChange={handleLunchChange}
                                    size="small"
                                />
                            }
                            label="Apply to All Days"
                        />
                        {!lunchBreak.applyToAllDays && (
                            <FormGroup>
                                {daysOfWeek.map((day) => (
                                    <FormControlLabel
                                        key={day}
                                        control={
                                            <Checkbox
                                                name="customDays"
                                                value={day}
                                                checked={lunchBreak.customDays.includes(day)}
                                                onChange={handleLunchChange}
                                                size="small"
                                            />
                                        }
                                        label={day}
                                    />
                                ))}
                            </FormGroup>
                        )}
                        <Button type="submit" variant="contained" color="primary" size="small">
                            Add Lunch Break
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Day</TableCell>
                            {timeSlots.map((slot, index) => (
                                <TableCell key={index} size="small">{slot}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {daysOfWeek.map((day) => (
                            <TableRow key={day}>
                                <TableCell>{day}</TableCell>
                                {timeSlots.map((slot, index) => {
                                    const entry = timetable.find(
                                        (entry) => entry.day === day && `${entry.startTime} - ${entry.endTime}` === slot
                                    );
                                    const isLunchBreak = lunchBreak.applyToAllDays
                                        ? `${lunchBreak.startTime} - ${lunchBreak.endTime}` === slot
                                        : lunchBreak.customDays.includes(day) && `${lunchBreak.startTime} - ${lunchBreak.endTime}` === slot;
                                    return (
                                        <TableCell key={index}>
                                            {entry ? entry.subject : isLunchBreak ? 'Lunch Break' : ''}
                                            {entry && (
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDelete(day, slot)}
                                                    style={{ marginLeft: 8 }}
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Button onClick={generatePDF} variant="contained" color="primary" style={{ marginTop: 16, fontSize: '0.875rem' }}>
                Generate PDF
            </Button>
        </Box>
    );
};

export default TimetableGenerator;
