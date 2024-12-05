import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  TextField,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const UserTransactionChat = () => {
  const { user } = useSelector((state) => state.user);
  const username = user?.username || "User";
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setError("Please enter a query.");
      return;
    }

    const userMessage = { text: query, type: "user" };
    setChatHistory((prev) => [...prev, userMessage]);
    setQuery("");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/openai/query", {
        username,
        query,
      });

      const botResponse = { text: res.data.response, type: "bot" };
      setChatHistory((prev) => [...prev, botResponse]);
      setError("");
    } catch (err) {
      setError("Error: Could not fetch response.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#000",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px",
        color: "#fff",
      }}
    >
      {/* Chat Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "#1E1E1E", // Dark grey for the chat area
          borderRadius: "8px",
          padding: "20px",
          position: "relative",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Placeholder Text */}
        {chatHistory.length === 0 && !query && (
          <Typography
            variant="h6"
            align="center"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontWeight: "bold",
              textAlign: "center",
              background: "linear-gradient(90deg, #1e90ff, #ff69b4, #ff4500)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textFillColor: "transparent",
            }}
          >
            Hi there! I'm QuikChat. How can I assist you today?
          </Typography>
        )}


        {/* Chat Messages */}
        {chatHistory.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent:
                message.type === "user" ? "flex-end" : "flex-start",
              marginBottom: "10px",
            }}
          >
            <Typography
              sx={{
                background: message.type === "user" ? "#2F80ED" : "#333",
                color: message.type === "user" ? "#fff" : "#f0f0f0",
                padding: "10px 15px",
                borderRadius: "20px",
                maxWidth: "80%",
                wordBreak: "break-word",
              }}
            >
              {message.text}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Input Section */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "600px",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#1E1E1E",
          borderRadius: "50px",
          padding: "10px 15px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
          marginTop: "20px",
        }}
      >
        <TextField
          placeholder="Type your message..."
          variant="standard"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            disableUnderline: true,
            style: {
              color: "#fff",
              padding: "10px",
            },
          }}
        />
        <IconButton
          onClick={handleSubmit}
          disabled={isLoading}
          sx={{
            backgroundColor: "#2F80ED",
            color: "#fff",
            "&:hover": { backgroundColor: "#1A5FCF" },
            padding: "10px",
          }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : <ArrowForwardIcon />}
        </IconButton>
      </Box>

      {/* Error Message */}
      {error && (
        <Typography color="error" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default UserTransactionChat;
