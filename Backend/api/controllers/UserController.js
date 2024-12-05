const { registerUser, loginUser, getUserByUsername, editUserByUsername, deleteUserByUsername, getAllUsersFromDb } = require('../services/UserService');

// Handle user registration
// Password validation function
function validatePassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?])(?=.{8,})/;
  return passwordRegex.test(password);
}

async function register(req, res) {
  const { password } = req.body;  // Extract the password from the request body
  
  // Validate the password
  if (!validatePassword(password)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
    });
  }

  try {
    const user = await registerUser(req.body);  // Call your existing registerUser function
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Handle user login
async function login(req, res) {
  try {
    const { username, password } = req.body;
    const { token, user } = await loginUser(username, password);
    res.json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Get user details by username
async function getUser(req, res) {
  try {
    const username = req.params.username;
    const user = await getUserByUsername(username);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Edit user details by username
async function editUser(req, res) {
  try {
    const username = req.params.username;
    const updatedData = req.body;
    const updatedUser = await editUserByUsername(username, updatedData);
    res.json({ message: 'User details updated successfully', updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete user by username
async function deleteUser(req, res) {
  try {
    const username = req.params.username;
    const deletedUser = await deleteUserByUsername(username);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get all users
async function getAllUsers(req, res) {
  try {
    const users = await getAllUsersFromDb();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { 
  register, 
  login, 
  getUser, 
  editUser, 
  deleteUser, 
  getAllUsers 
};
