import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

import {
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
  useTheme
} from '@mui/material';

import EmailIcon from '@mui/icons-material/Email';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function SignIn() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div></div>
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url("/bg.jpg")`,
        backgroundSize: 'cover',
        background: `linear-gradient(135deg, ${theme.palette.primary[50]} 0%, ${theme.palette.secondary[100]} 100%)`,
        p: 2
      }}
    >
      <Card
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' }, // Stack on mobile, side-by-side on desktop
    maxWidth: 900,
    width: '100%',
    borderRadius: 3,
    overflow: 'hidden',
    minHeight: 500
  }}
  elevation={8}
>
  <Box
    sx={{
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      bgcolor: '#f5f5f5'
    }}
  >
    <img
      src="/sign.png"
      alt="Sign"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
    />
  </Box>
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
      <Avatar sx={{ background: 'linear-gradient(90deg, green, yellow)', width: 64, height: 64 }}>
        <LockOutlinedIcon fontSize="large" />
      </Avatar>
      <Typography variant="h5">Sign In</Typography>

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
          <Button
            type="submit"
            fullWidth
            size="large"
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 'bold',
              background: `linear-gradient(90deg, green, yellow)`,
              color: '#fff',
              '&:hover': { opacity: 0.9 }
            }}
          >
            Sign In
          </Button>

          <Typography variant="body2" textAlign="center">
            Don’t have an account?{' '}
            <Link component={RouterLink} to="/signup" underline="hover">
              Sign Up
            </Link>
          </Typography>
        </Stack>
      </Box>
    </Stack>
  </Box>
</Card>

    </Box>
    </div>
  );
}
