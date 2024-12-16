import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../Firebase/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import Header from './Header';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Button,
    Container
} from '@mui/material';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Welcome = () => {
    const [userEmail, setUserEmail] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [studentCount, setStudentCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [paymentStatusCounts, setPaymentStatusCounts] = useState({ paid: 0, unpaid: 0, partiallyPaid: 0 });
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [clickedButton, setClickedButton] = useState(null); // Track clicked button
    const navigate = useNavigate();

    const classes = ["Class1", "Class2", "Class3", "Class4", "Class5", "Class6", "Class7", "Class8", "Class9", "Class10"];
    const classButtons = [
        { label: "C1", class: "Class1", color: "#FF5733" },
        { label: "C2", class: "Class2", color: "#33FF57" },
        { label: "C3", class: "Class3", color: "#3357FF" },
        { label: "C4", class: "Class4", color: "#FF33A1" },
        { label: "C5", class: "Class5", color: "#FFD433" },
        { label: "C6", class: "Class6", color: "#33D4FF" },
        { label: "C7", class: "Class7", color: "#FF8C33" },
        { label: "C8", class: "Class8", color: "#33FFDD" },
        { label: "C9", class: "Class9", color: "#F333FF" },
        { label: "C10", class: "Class10", color: "#FF3357" },
    ];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email);
            } else {
                navigate('/'); // Redirect to login if not authenticated
            }
            setIsLoading(false);
        });

        const fetchStudentCount = async () => {
            try {
                const response = await axios.get('https://portalbackend-production-31b4.up.railway.app/studentcount');
                setStudentCount(response.data.studentCount);
            } catch (error) {
                console.error('Error fetching student count:', error);
            }
        };

        const fetchUserCount = async () => {
            try {
                const response = await axios.get('https://portalbackend-production-31b4.up.railway.app/getUsers');
                setUserCount(response.data.length);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchPaymentStatusCounts = async () => {
            try {
                const response = await axios.get('https://portalbackend-production-31b4.up.railway.app/feestatuscount');
                setPaymentStatusCounts({
                    paid: response.data.paid || 0,
                    unpaid: response.data.unpaid || 0,
                    partiallyPaid: response.data.partiallyPaid || 0,
                });
            } catch (error) {
                console.error('Error fetching payment status counts:', error);
            }
        };

        fetchStudentCount();
        fetchUserCount();
        fetchPaymentStatusCounts();

        if (selectedClass) {
            fetchAttendanceData(selectedClass);
        }

        return () => unsubscribe();
    }, [navigate, selectedClass]);

    const fetchAttendanceData = async (classSheet) => {
        try {
            const response = await axios.post('https://portalbackend-production-31b4.up.railway.app/attendance/tracker', { classSheet });
            setAttendanceData(response.data.tracker);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
        }
    };

    const handleClassChange = (className, label) => {
        setSelectedClass(className);
        setAttendanceData([]);
        setClickedButton(label); // Mark button as clicked
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div>
            <Header />
            <Box sx={{ marginTop: '100px', padding: 3, backgroundColor: '#f5f7fa', borderRadius: 2 }}>
                <Grid container spacing={3}>
                    {/* Card for Registered Students Count */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ backgroundColor: '#fce4ec', borderRadius: 2, padding: 3, boxShadow: 3, textAlign: 'center' }}>
                            <CardContent>
                                <Typography variant="h6" color="textSecondary" gutterBottom>Registered Students</Typography>
                                {isLoading ? <CircularProgress /> : <Typography variant="h4" color="#D81B60" sx={{ fontWeight: 'bold' }}>{studentCount}</Typography>}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Card for User Count */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ backgroundColor: '#e8f5e9', borderRadius: 2, padding: 3, boxShadow: 3, textAlign: 'center' }}>
                            <CardContent>
                                <Typography variant="h6" color="textSecondary" gutterBottom>Total Users</Typography>
                                {isLoading ? <CircularProgress /> : <Typography variant="h4" color="#388E3C" sx={{ fontWeight: 'bold' }}>{userCount}</Typography>}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Card for Payment Status */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ backgroundColor: '#e3f2fd', borderRadius: 2, padding: 3, boxShadow: 3, textAlign: 'center' }}>
                            <CardContent>
                                <Typography variant="h6" color="textSecondary" gutterBottom>Payment Status</Typography>
                                {isLoading ? (
                                    <CircularProgress />
                                ) : (
                                    <div>
                                        <Typography
                                            variant="body1"
                                            sx={{ color: '#388E3C', fontWeight: 'bold' }} // Green for Paid
                                        >
                                            Paid: {paymentStatusCounts.paid}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{ color: '#D32F2F', fontWeight: 'bold' }} // Red for Unpaid
                                        >
                                            Unpaid: {paymentStatusCounts.unpaid}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{ color: '#FF9800', fontWeight: 'bold' }} // Orange for Partially Paid
                                        >
                                            Partially Paid: {paymentStatusCounts.partiallyPaid}
                                        </Typography>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Main container with buttons on the left */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mt: 2 }}>
                    {/* Left side: Class Buttons */}
                    <Box sx={{ width: '250px', display: 'flex', flexDirection: 'column', gap: 2, mt: 16 }}>
                        {/* Row 1: C1 to C5 */}
                        <Box sx={{ display: 'flex', gap: 0.4 }}>
                            {classButtons.slice(0, 5).map((button, index) => (
                                <Button
                                    key={index}
                                    variant="contained"
                                    onClick={() => handleClassChange(button.class, button.label)}
                                    sx={{
                                        width: '50px',
                                        height: '50px',
                                        fontSize: '14px',
                                        borderRadius: '12px', // Rounded corners
                                        backgroundColor: button.color,
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: `${button.color}cc`, // Slightly darker on hover
                                        },
                                        animation: clickedButton === button.label ? 'crackEffect 0.3s ease-out forwards' : 'none', // Apply crack effect
                                    }}
                                >
                                    {button.label}
                                </Button>
                            ))}
                        </Box>

                        {/* Row 2: C6 to C10 */}
                        <Box sx={{ display: 'flex', gap: 0.4 }}>
                            {classButtons.slice(5).map((button, index) => (
                                <Button
                                    key={index}
                                    variant="contained"
                                    onClick={() => handleClassChange(button.class, button.label)}
                                    sx={{
                                        width: '50px',
                                        height: '50px',
                                        fontSize: '14px',
                                        borderRadius: '12px',
                                        backgroundColor: button.color,
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: `${button.color}cc`,
                                        },
                                        animation: clickedButton === button.label ? 'crackEffect 0.3s ease-out forwards' : 'none',
                                    }}
                                >
                                    {button.label}
                                </Button>
                            ))}
                        </Box>
                    </Box>

                    {/* Right side: Graph Container */}
                    <Box sx={{ width: 'calc(100% - 300px)', padding: 2 }}>
                        {/* Attendance Bar Chart */}
                        {selectedClass && (
                            <>
                                <Typography variant="h5" gutterBottom align="center">{selectedClass} %</Typography>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={attendanceData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="studentName" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="attendancePercentage" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </>
                        )}
                    </Box>
                </Box>
            </Box>
        </div>
    );
};

export default Welcome;
