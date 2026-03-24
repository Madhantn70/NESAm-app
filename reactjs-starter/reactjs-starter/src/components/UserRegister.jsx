import React, { useState } from 'react';
import userService from '../services/userService';

const UserRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    
    const newUser = {
      fullName: "John Doe",
      mobileNumber: "1234567890",
      email: "john@example.com",
      irttaaId: "ID123"
    };

    try {
      const result = await userService.register(newUser);
      alert('User registered successfully!');
    } catch (err) {
      // Accessing the custom error message from the API if available
      const message = err.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleRegister} disabled={loading}>
        {loading ? 'Processing...' : 'Register User'}
      </button>
    </div>
  );
};

export default UserRegister;