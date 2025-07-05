// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute   from './components/PrivateRoute';
import Navbar       from './components/Navbar';
import SignIn     from './pages/SignIn';
import SignUp     from './pages/SignUp';
import Profile    from './pages/Profile';
import Home       from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import ProductForm from './pages/ProductForm';
import EditProfile from './pages/Edit';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Navbar />
        <Routes>
          {/* public */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="/admin" element={
  <PrivateRoute>
    <AdminDashboard />
  </PrivateRoute>
}/>
<Route path="/admin/product/:id" element={
  <PrivateRoute>
    <ProductForm />
  </PrivateRoute>
}/>
<Route path="/profile/edit/:id" element={<EditProfile/>} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;