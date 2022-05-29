import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

export const wrapNavigate = (Component) => {
  const Wrapper = (props) => {
    const navigate = useNavigate();
    
    return (
      <Component
        navigate={navigate}
        {...props}
        />
    );
  };
  
  return Wrapper;
};

