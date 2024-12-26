import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RedirectHandler({ hasFoodItems, eircode }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasFoodItems && eircode) {
      navigate(`/drinks/${eircode}`);
    }
  }, [hasFoodItems, eircode, navigate]);

  return null; // This component doesn't render anything
}

export default RedirectHandler;