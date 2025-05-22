import React from 'react';
import {createRoot} from 'react-dom/client'
import './resetPassword.css'
import UserResetPassword from './Container/ResetPassword/UserResetPassword';
createRoot(document.getElementById('UserResetPasswordRoot')).render(
  <UserResetPassword />
);
