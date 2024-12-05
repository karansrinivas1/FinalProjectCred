// src/components/JobCard.js
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const JobCard = ({ title, company, location, description }) => {
    return (
        <Card sx={{ margin: 2, padding: 2, maxWidth: 400 }}>
            <CardContent>
                <Typography variant="h6" component="div">{title}</Typography>
                <Typography variant="subtitle1" color="text.secondary">{company}</Typography>
                <Typography variant="subtitle2" color="text.secondary">{location}</Typography>
                <Box mt={2}>
                    <Typography variant="body2">{description}</Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default JobCard;
