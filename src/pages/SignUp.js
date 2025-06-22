// ===== src/pages/SignUp.jsx =====
import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

import {
  Avatar,
  Box,
  Button,
  Card,
  Stack,
  InputAdornment,
  Link,
  TextField,
  Typography,
  useTheme
} from '@mui/material';

import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import ImageIcon from '@mui/icons-material/Image';

export default function SignUp() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPreview(photoURL);
  }, [photoURL]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!displayName.trim() || !phone.trim() || !address.trim()) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName, photoURL });
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName,
        lastName,
        email: user.email,
        phoneNumber: phone,
        address,
        photoURL,
        createdAt: serverTimestamp()
      });
      navigate('/');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.primary[50]} 0%, ${theme.palette.secondary[100]} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Card
        elevation={8}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          maxWidth: 1000,
          width: '100%',
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        {/* Left Image Side */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#f5f5f5',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <img
            src="/sign1.png"
            alt="Signup Illustration"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </Box>

        {/* Right Form Side */}
        <Box
          sx={{
            flex: 1,
            p: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Stack spacing={2} alignItems="center" width="100%">
            <Avatar sx={{ background: 'linear-gradient(90deg,green,yellow)', width: 64, height: 64 }}>
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5">Sign Up</Typography>

            {error && (
              <Typography variant="body2" color="error" textAlign="center">
                {error}
              </Typography>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <Stack spacing={2}>
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    )
                  }}
                />
                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    )
                  }}
                />
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    )
                  }}
                />
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon />
                      </InputAdornment>
                    )
                  }}
                />
                <TextField
                  required
                  fullWidth
                  label="Phone Number"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon />
                      </InputAdornment>
                    )
                  }}
                />
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={2}
                  label="Address"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeIcon />
                      </InputAdornment>
                    )
                  }}
                />
                <TextField
                  fullWidth
                  label="Profile Photo URL (optional)"
                  value={photoURL}
                  onChange={e => setPhotoURL(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ImageIcon />
                      </InputAdornment>
                    ),
                    endAdornment: preview ? (
                      <InputAdornment position="end">
                        <Avatar src={preview} sx={{ width: 32, height: 32 }} />
                      </InputAdornment>
                    ) : null
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 'bold',
                    background: `linear-gradient(90deg, green, yellow)`,
                    color: '#fff',
                    '&:hover': {
                      opacity: 0.9
                    }
                  }}
                >
                  {loading ? 'Creating account…' : 'Sign Up'}
                </Button>

                <Typography variant="body2" textAlign="center">
                  Already have an account?{' '}
                  <Link component={RouterLink} to="/signin">
                    Sign in
                  </Link>
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
}
