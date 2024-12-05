import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../../services/api";
import { TextField, Button, Grid, Typography, Box } from "@mui/material";

const CreditCardManager = () => {
  const [cards, setCards] = useState([]);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardType, setCardType] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { user } = useSelector((state) => state.user);
  const username = user?.username;

  const getCardColor = (type) => {
    switch (type) {
      case "Amex":
        return "linear-gradient(145deg, #FFD700, #FFC107)";
      case "MasterCard":
        return "linear-gradient(145deg, #2C2C2C, #4F4F4F)";
      case "Visa":
        return "linear-gradient(145deg, #1A5276, #2980B9)";
      default:
        return "linear-gradient(145deg, #757575, #BDBDBD)";
    }
  };

  const detectCardType = (number) => {
    const patterns = {
      Visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      MasterCard: /^5[1-5][0-9]{14}$/,
      Amex: /^3[47][0-9]{13}$/,
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(number)) {
        return type;
      }
    }
    return "Unknown";
  };

  useEffect(() => {
    if (!username) return;
    const fetchCards = async () => {
      try {
        const response = await api.get(`api/credit-cards/${username}`);
        const cardsWithColors = response.data.data.cards.map((card) => ({
          ...card,
          color: getCardColor(card.cardType),
        }));
        setCards(cardsWithColors);
      } catch (err) {
        setError("Failed to retrieve credit cards.");
      }
    };

    fetchCards();
  }, [username]);

  const handleAddCard = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const newCard = {
        username,
        cardNumber,
        expiryDate,
        cvv,
        cardType: detectCardType(cardNumber),
        creditLimit: 1000,
        creditBalance: 3000,
      };

      await api.post("api/credit-cards/add-card", newCard);

      setMessage("Card added successfully!");
      setIsAddingCard(false);

      const updatedResponse = await api.get(`api/credit-cards/${username}`);
      const cardsWithColors = updatedResponse.data.data.cards.map((card) => ({
        ...card,
        color: getCardColor(card.cardType),
      }));
      setCards(cardsWithColors);
    } catch (err) {
      setError("Failed to add credit card. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        padding: "20px",
        textAlign: "center",
        backgroundColor: "#000",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      {!isAddingCard ? (
        <>
          <Typography variant="h4" gutterBottom>
            My Credit Cards
          </Typography>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            sx={{
              padding: {
                xs: 1, // Small padding for extra-small screens
                sm: 2, // Medium padding for small screens
                md: 3, // Larger padding for medium and up screens
              },
            }}
          >
            {cards.map((card, index) => (
              <Grid
                item
                key={index}
                xs={12}
                sm={6}
                md={4}
                lg={3} // Show more cards in a row on large screens
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: "320px",
                    height: "200px",
                    borderRadius: "15px",
                    background: card.color,
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    color: "#fff",
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ textTransform: "uppercase" }}>
                    {card.cardType || "Unknown"}
                  </Typography>
                  <Typography variant="h5" sx={{ letterSpacing: "2px" }}>
                    **** **** **** {card.cardNumber.slice(-4)}
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: "uppercase" }}>
                    {username?.toUpperCase()}
                  </Typography>
                  <Typography variant="body2">
                    Valid Thru: {card.expiryDate}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            sx={{
              marginTop: "20px",
              background: "linear-gradient(to right, #1e1e1e, #2a2a2a)",
              color: "#fff",
              "&:hover": { background: "#333" },
            }}
            onClick={() => setIsAddingCard(true)}
          >
            Add Another Card
          </Button>
        </>
      ) : (
        <Box
          sx={{
            maxWidth: "500px",
            width: "100%", // Full width on smaller devices
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Add Credit Card
          </Typography>
          <form onSubmit={handleAddCard}>
            <TextField
              fullWidth
              label="Card Number"
              variant="outlined"
              value={cardNumber}
              onChange={(e) => {
                setCardNumber(e.target.value);
                setCardType(detectCardType(e.target.value));
              }}
              margin="normal"
              required
              InputProps={{
                style: { color: "#fff", borderColor: "#fff" },
              }}
              InputLabelProps={{
                style: { color: "#fff" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#fff",
                  },
                  "&:hover fieldset": {
                    borderColor: "#fff",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#fff",
                  },
                },
              }}
            />
            <Typography sx={{ margin: "10px 0", color: "#BBB" }}>
              The detected card is {cardType || "Unknown"}.
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Expiry Date (MM/YY)"
                  variant="outlined"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                  InputProps={{
                    style: { color: "#fff" },
                  }}
                  InputLabelProps={{
                    style: { color: "#fff" },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#fff",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CVV"
                  variant="outlined"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  required
                  InputProps={{
                    style: { color: "#fff" },
                  }}
                  InputLabelProps={{
                    style: { color: "#fff" },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#fff",
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              sx={{
                marginTop: "20px",
                marginRight: "10px",
                background: "linear-gradient(to right, #1e1e1e, #2a2a2a)",
                color: "#fff",
              }}
            >
              Add Card
            </Button>
            <Button
              variant="outlined"
              sx={{
                marginTop: "20px",
                color: "#fff",
                borderColor: "#fff",
                "&:hover": { backgroundColor: "#444", borderColor: "#fff" },
              }}
              onClick={() => setIsAddingCard(false)}
            >
              Cancel
            </Button>
            {error && (
              <Typography color="error" sx={{ marginTop: "10px" }}>
                {error}
              </Typography>
            )}
            {message && (
              <Typography color="primary" sx={{ marginTop: "10px" }}>
                {message}
              </Typography>
            )}
          </form>
        </Box>
      )}
    </Box>
  );
};

export default CreditCardManager;
