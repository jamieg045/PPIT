import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the cart in sessionStorage after payment success
    sessionStorage.removeItem('cart');

    // Optionally, redirect the user back to another page
    setTimeout(() => {
      navigate('/menu');
    }, 3000); // Redirect after 3 seconds
  }, [navigate]);

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Thank you for your purchase. Redirecting you back to the menu...</p>
    </div>
  );
}

export default Success;