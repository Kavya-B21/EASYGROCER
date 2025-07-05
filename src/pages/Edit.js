
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Container,
  TextField,
  CircularProgress,
  Alert,
  Avatar,
  Typography,
  Stack,
  InputAdornment
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import ImageIcon from '@mui/icons-material/Image';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function EditUserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    displayName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    photoURL: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', id));
        if (snap.exists()) {
          const data = snap.data();
          setForm({
            displayName: data.displayName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phoneNumber: data.phoneNumber || '',
            address: data.address || '',
            photoURL: data.photoURL || ''
          });
        }
      } catch (err) {
        console.error(err);
        setError('Could not load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleChange = field => e => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  useEffect(() => {
    setPreview(form.photoURL);
  }, [form.photoURL]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        updatedAt: serverTimestamp()
      };
      await setDoc(doc(db, 'users', id), payload, { merge: true });
      navigate('/profile');
    } catch (err) {
      console.error(err);
      setError('Failed to update profile.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
          sx={{
            minHeight: '100vh',
            backgroundImage: `url("/profile.jpg")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            p: 4,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
      <Container maxWidth="sm">
        <Card elevation={8} sx={{bgcolor:'rgb(248, 248, 10,0.3)',flex: 1, height: 600, p: 3, textAlign: 'center',borderRadius: '36px' }}>
          <CardHeader title={<Typography variant="h5">Edit Profile</Typography>} sx={{ textAlign: 'center' }} />

          <CardContent>
            {error && <Alert severity="error">{error}</Alert>}

            <Stack spacing={2}>
              <TextField
                label="First Name"
                fullWidth
                value={form.displayName}
                onChange={handleChange('displayName')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleIcon />
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                label="Last Name"
                fullWidth
                value={form.lastName}
                onChange={handleChange('lastName')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleIcon />
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                label="Email"
                fullWidth
                value={form.email}
                onChange={handleChange('email')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                label="Phone Number"
                fullWidth
                value={form.phoneNumber}
                onChange={handleChange('phoneNumber')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                label="Address"
                fullWidth
                value={form.address}
                onChange={handleChange('address')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon />
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                label="Photo URL"
                fullWidth
                value={form.photoURL}
                onChange={handleChange('photoURL')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ImageIcon />
                    </InputAdornment>
                  ),
                  endAdornment: preview && (
                    <InputAdornment position="end">
                      <Avatar src={preview} sx={{ width: 40, height: 40 }} />
                    </InputAdornment>
                  )
                }}
              />
            </Stack>
          </CardContent>

          <CardActions sx={{ justifyContent: 'space-between', pt: 3 }}>
            <Button color='black' onClick={() => navigate('/profile')}>Cancel</Button>
            <Button variant="contained"
            sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 'bold',
                    background: `linear-gradient(90deg, green, yellow)`,
                    color: 'black',
                    '&:hover': {
                      opacity: 0.9
                    }
                  }} onClick={handleSubmit}>
              Save Changes
            </Button>
          </CardActions>
        </Card>
      </Container>
    </Box>
  );
}
