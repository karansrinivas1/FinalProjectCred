import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Box, CircularProgress, Grid, ButtonGroup, Button, IconButton } from '@mui/material';
import { Line, Bar, Pie } from 'react-chartjs-2';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const HomePage = () => {
    const { user } = useSelector((state) => state.user); // Getting user details from Redux store
    const username = user?.username; // Extracting username from Redux store

    const [spendingData, setSpendingData] = useState(null);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('1M'); // Default period: 1 month
    const [chartType, setChartType] = useState('line'); // Default chart type: Line
    const [showAllTransactions, setShowAllTransactions] = useState(false);

    const periodMapping = {
        '1D': 'day',
        '1W': 'week',
        '1M': 'month',
        '1Y': 'year',
        '5Y': 'year',
    };

    const handlePeriodChange = (event) => {
        setSelectedPeriod(event.target.value);
    };

    const handleChartTypeChange = (type) => {
        setChartType(type);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const period = periodMapping[selectedPeriod];

                // Fetch spending trend data
                const spendingResponse = await axios.post('http://localhost:3000/api/transactions/spending-trend', {
                    username,
                    period,
                });

                // Fetch recent transactions
                const transactionsResponse = await axios.get(`http://localhost:3000/api/transactions/${username}`);

                setSpendingData(spendingResponse.data);
                setRecentTransactions(transactionsResponse.data);
            } catch (error) {
                console.error('Error fetching data', error);
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchData();
        }
    }, [selectedPeriod, username]);

    const formatSpendingData = (data) => {
        if (!data || data.length === 0) {
            return {
                labels: [],
                datasets: [
                    {
                        label: 'Spending Trend',
                        data: [],
                        fill: false,
                        borderColor: 'rgba(75,192,192,1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.1,
                    },
                ],
            };
        }

        const labels = data.map((item) => item._id);
        const values = data.map((item) => item.totalAmount);

        return {
            labels,
            datasets: [
                {
                    label: 'Spending Trend',
                    data: values,
                    fill: false,
                    borderColor: 'rgba(75,192,192,1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1,
                },
            ],
        };
    };

    const renderChart = () => {
        const chartData = formatSpendingData(spendingData);

        if (chartType === 'line') return <Line data={chartData} />;
        if (chartType === 'bar') return <Bar data={chartData} />;
        if (chartType === 'pie') return <Pie data={chartData} />;
    };

    return (
        <Box
            sx={{
                padding: { xs: 2, sm: 4 },
                backgroundColor: '#000',
                color: '#FFF',
                minHeight: '100vh',
            }}
        >
            <Typography variant="h4" align="center" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                Welcome to Cred
            </Typography>

            {/* Chart Type Selection */}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                {['line', 'bar', 'pie'].map((type) => (
                    <Button
                        key={type}
                        onClick={() => handleChartTypeChange(type)}
                        sx={{
                            backgroundColor: chartType === type ? '#1F1F1F' : '#333',
                            color: chartType === type ? 'white' : '#BBB',
                            '&:hover': { backgroundColor: '#555' },
                            marginX: 1,
                            textTransform: 'uppercase',
                        }}
                    >
                        {type}
                    </Button>
                ))}
            </Box>

            {/* Period Selection */}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
                <ButtonGroup>
                    {['1D', '1W', '1M', '1Y', '5Y'].map((period) => (
                        <Button
                            key={period}
                            value={period}
                            onClick={handlePeriodChange}
                            sx={{
                                backgroundColor: selectedPeriod === period ? '#1F1F1F' : '#333',
                                color: selectedPeriod === period ? 'white' : '#BBB',
                                '&:hover': { backgroundColor: '#555' },
                                marginX: 1,
                            }}
                        >
                            {period}
                        </Button>
                    ))}
                </ButtonGroup>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress sx={{ color: '#FFF' }} />
                </Box>
            ) : (
                <Grid container spacing={4}>
                    {/* Chart Display */}
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                background: '#1F1F1F',
                                borderRadius: '16px',
                                padding: '20px',
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.8)',
                            }}
                        >
                            <Typography variant="h6" align="center" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
                                Spending Trends
                            </Typography>
                            {renderChart()}
                        </Box>
                    </Grid>

                    {/* Recent Transactions in Table Format */}
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                background: '#1F1F1F',
                                borderRadius: '16px',
                                padding: '20px',
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.8)',
                                overflowX: 'auto',
                            }}
                        >
                            <Typography variant="h6" align="center" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
                                Recent Transactions
                            </Typography>

                            {/* Table Headers */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '10px 0',
                                    borderBottom: '1px solid #333',
                                }}
                            >
                                <Typography sx={{ fontWeight: 'bold', width: '25%' }}>Merchant</Typography>
                                <Typography sx={{ fontWeight: 'bold', width: '15%' }}>Amount</Typography>
                                <Typography sx={{ fontWeight: 'bold', width: '35%' }}>Account</Typography>
                                <Typography sx={{ fontWeight: 'bold', width: '25%' }}>Transaction ID</Typography>
                            </Box>

                            {/* Table Rows */}
                            {recentTransactions.map((transaction) => (
                                <Box
                                key={transaction.transaction_id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '10px 0',
                                    borderBottom: '1px solid #333',
                                }}
                            >
                                <Typography sx={{ width: '25%' }}>{transaction.merchant_type}</Typography>
                                <Typography
                                    sx={{
                                        width: '15%',
                                        color:
                                            transaction.transaction_status === 'approved'
                                                ? 'green'
                                                : transaction.transaction_status === 'pending'
                                                ? 'orange'
                                                : 'red',
                                    }}
                                >
                                    ${transaction.transaction_amount.toFixed(2)}
                                </Typography>
                                <Typography sx={{ width: '35%' }}>
                                    {transaction.card_type} •••• {transaction.card_number.slice(-4)}
                                </Typography>
                                <Typography sx={{ width: '25%' }}>{transaction.transaction_id}</Typography>
                            </Box>
                            
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default HomePage;
