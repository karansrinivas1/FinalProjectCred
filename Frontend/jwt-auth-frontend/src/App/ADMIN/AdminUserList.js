

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Button,
  Snackbar,
  Box,
  TableContainer,
} from "@mui/material";
import axios from "axios";

const AdminUserList = () => {
  const { user } = useSelector((state) => state.user);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:3000/user/getAllUsers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEmployees(response.data.users);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch employee data.");
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (user.type !== 1) {
    return (
      <Typography
        variant="h6"
        color="error"
        align="center"
        sx={{ marginTop: "20px" }}
      >
        You are not authorized to view this page.
      </Typography>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#000",
          color: "#fff",
        }}
      >
        <CircularProgress color="inherit" />
        <Typography variant="body1" sx={{ marginTop: "10px" }}>
          Loading employees...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#000",
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:3000/user/deleteUser/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee._id !== userId)
      );

      setSnackbarMessage("User successfully deleted!");
      setOpenSnackbar(true);
    } catch (err) {
      console.error("Failed to delete user:", err);
      setError("Failed to delete user");
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#000",
        color: "#fff",
        minHeight: "100vh",
        padding: "20px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper
        sx={{
          backgroundColor: "#1a1a1a",
          color: "#fff",
          width: "100%",
          maxWidth: "1200px",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            marginBottom: "20px",
            fontWeight: "bold",
            color: "#FFF",
          }}
        >
          User List
        </Typography>
        <TableContainer
          sx={{
            overflowX: "auto",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  First Name
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Last Name
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Username
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Email
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow
                  key={employee._id}
                  sx={{
                    backgroundColor: "#1a1a1a",
                    "&:hover": { backgroundColor: "#2a2a2a" },
                  }}
                >
                  <TableCell sx={{ color: "#fff" }}>
                    {employee.firstName}
                  </TableCell>
                  <TableCell sx={{ color: "#fff" }}>
                    {employee.lastName}
                  </TableCell>
                  <TableCell sx={{ color: "#fff" }}>
                    {employee.username}
                  </TableCell>
                  <TableCell sx={{ color: "#fff" }}>
                    {employee.email}
                  </TableCell>
                  <TableCell>
                    <Button
                      color="error"
                      onClick={() => handleDeleteUser(employee._id)}
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: "#e74c3c",
                        "&:hover": {
                          backgroundColor: "#c0392b",
                          transform: "scale(1.05)",
                          transition: "all 0.2s ease",
                        },
                      }}
                    >
                      DELETE
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
        />
      </Paper>
    </Box>
  );
};

export default AdminUserList;

