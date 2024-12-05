import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Typography, Box, Card, CardContent, Grid, TextField, Button, CircularProgress } from '@mui/material';

const AboutPage = () => {
  const { user } = useSelector((state) => state.user);
  const username = user?.username;

  const [userDetails, setUserDetails] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
    userType: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/getUser/${username}`);
        const { firstName, lastName, username, email } = response.data.user;
        setUserDetails({ firstName, lastName, username, email, userType: 1 });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user details');
        setLoading(false);
      }
    };

    if (username) {
      fetchUserDetails();
    }
  }, [username]);

  const handleUpdateUser = async () => {
    try {
      setLoading(true);
      setError('');
      const { firstName, lastName, email } = userDetails;
      const response = await axios.put(`http://localhost:3000/user/editUser/${username}`, {
        firstName,
        lastName,
        email,
        userType: 1,
      });
      setUserDetails(response.data.updatedUser);
      setEditable(false);
      setLoading(false);
    } catch (err) {
      setError('Failed to update user details');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  if (loading) {
    return (
      <Box
        sx={{
          padding: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#000',
        }}
      >
        <CircularProgress sx={{ color: '#FFF' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: 4,
        minHeight: '100vh',
        backgroundColor: '#000',
        color: '#FFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          marginBottom: 4,
          color: '#5DADE2',
        }}
      >
        Edit Profile
      </Typography>

      <Box
        sx={{
          marginBottom: 4,
          width: '100%',
          maxWidth: '800px',
          backgroundColor: '#1a1a1a',
          padding: 4,
          borderRadius: 4,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ color: '#aaa', marginBottom: 2 }}>
          User Details
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                backgroundColor: '#2c2c2c',
                color: '#FFF',
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  First Name
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  name="firstName"
                  value={userDetails.firstName}
                  onChange={handleInputChange}
                  disabled={!editable}
                  sx={{
                    input: { color: '#FFF', backgroundColor: '#333' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#555' },
                      '&:hover fieldset': { borderColor: '#888' },
                      '&.Mui-focused fieldset': { borderColor: '#5DADE2' },
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                backgroundColor: '#2c2c2c',
                color: '#FFF',
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Last Name
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  name="lastName"
                  value={userDetails.lastName}
                  onChange={handleInputChange}
                  disabled={!editable}
                  sx={{
                    input: { color: '#FFF', backgroundColor: '#333' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#555' },
                      '&:hover fieldset': { borderColor: '#888' },
                      '&.Mui-focused fieldset': { borderColor: '#5DADE2' },
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                backgroundColor: '#2c2c2c',
                color: '#FFF',
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Username
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  name="username"
                  value={userDetails.username}
                  disabled
                  sx={{
                    input: { color: '#FFF', backgroundColor: '#333' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#555' },
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                backgroundColor: '#2c2c2c',
                color: '#FFF',
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Email
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  name="email"
                  value={userDetails.email}
                  onChange={handleInputChange}
                  disabled={!editable}
                  sx={{
                    input: { color: '#FFF', backgroundColor: '#333' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#555' },
                      '&:hover fieldset': { borderColor: '#888' },
                      '&.Mui-focused fieldset': { borderColor: '#5DADE2' },
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Typography color="error" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
      )}

      {editable ? (
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateUser}
          sx={{
            backgroundColor: '#5DADE2',
            '&:hover': { backgroundColor: '#3498DB' },
          }}
        >
          Save Changes
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={() => setEditable(true)}
          sx={{
            backgroundColor: '#555',
            '&:hover': { backgroundColor: '#333' },
          }}
        >
          Edit Details
        </Button>
      )}
    </Box>
  );
};

export default AboutPage;
