import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, Avatar, Stack, Divider,Button,CardActions,Tooltip, } from '@mui/material';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link as RouterLink }    from 'react-router-dom';
import EditIcon         from '@mui/icons-material/Edit';
export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const navigate  = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    };
    fetchUserData();
  }, []);

  if (!userData) return <Typography>Loading...</Typography>;

  const { uid,displayName, lastName, email, phoneNumber, address, photoURL } = userData;

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
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center',
          gap: 4,
          width: '80%',
        }}
      >
        <Card sx={{ bgcolor: 'rgba(25, 203, 25, 0.3)',flex: 1, height: 350, p: 3, textAlign: 'center',borderRadius: '36px' }}>
          <Avatar src={photoURL} alt="Profile" sx={{ width: 200, height: 200,bgcolor: 'rgba(25, 203, 25, 0.3)', borderRadius: '36px', mx: 'auto', mb: 2, objectFit: 'cover' }} />
          <Typography variant="h6">{displayName} {lastName}
            <Tooltip title="Edit">
    <Button size="small" color='black' onClick={() => navigate(`/profile/edit/${uid}`)}>
      <EditIcon fontSize="small" />
    </Button>
  </Tooltip>
          </Typography>
           <CardActions sx={{ p: 2 }}>
            <Button
              variant="contained"
              fullWidth
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
              onClick={() => signOut(auth)}
            >
              Sign Out
            </Button>
          </CardActions>
        </Card>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Card sx={{bgcolor:'rgb(248, 248, 10,0.3)', width: '100%', height: 180, textAlign: 'center', p: 3,borderRadius: '36px' }}>
            <Typography variant="h6" gutterBottom>Contact Information</Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={1}>
              <Typography><strong>Email:</strong> {email}</Typography>
              <Typography><strong>Phone:</strong> {phoneNumber}</Typography>
              <Typography><strong>Address:</strong> {address}</Typography>
            </Stack>
          </Card>

          <Card sx={{bgcolor:'rgb(248, 248, 10,0.3)', width: '100%', height: 95, textAlign: 'center', p: 3,borderRadius: '36px' }}>
            <Typography variant="h6" gutterBottom>Order Details</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography>No orders yet.</Typography>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
