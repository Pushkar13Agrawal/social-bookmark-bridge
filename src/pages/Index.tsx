import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Redirect the old Index to our new Landing page
const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/');
  }, [navigate]);

  return null;
};

export default Index;
