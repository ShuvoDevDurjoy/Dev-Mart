import React from 'react';
import {createRoot} from 'react-dom/client'
import './resetPassword.css'
import SellerResetPassword from './Container/ResetPassword/SellerResetPassword';
createRoot(document.getElementById('SellerResetPasswordRoot')).render(
  <SellerResetPassword />
);
