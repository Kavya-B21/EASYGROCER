import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CircularProgress,
  Container,
  TextField,
  Stack,
  Typography,
  Alert,
  useTheme,
  InputAdornment
} from '@mui/material';

import CategoryIcon from '@mui/icons-material/Category';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import BalanceIcon from '@mui/icons-material/Balance';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';

import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';

import { db } from '../firebase/config';

export default function ProductForm() {
  const theme = useTheme();
  const { id } = useParams(); // 'new' or doc ID
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';

  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    unit:'',
    stock:'',
    imageUrl: '',
    description: ''
  });
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');


  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const snap = await getDoc(doc(db, 'products', id));
          if (snap.exists()) {
            const data = snap.data();
            setForm({
              name: data.name,
              category: data.category,
              price: data.price.toString(),
              unit: data.unit,
              stock: data.stock.toString(),
              imageUrl: data.imageUrl || '',
              description: data.description || ''
            });
          }
        } catch (err) {
          console.error(err);
          setError('Could not load product.');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id, isEdit]);

   const handleChange = field => e =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  useEffect(() => {
    if (form.imageUrl) {
      setPreview(form.imageUrl);
    } else {
      setPreview('');
    }
  }, [form.imageUrl]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.price || isNaN(form.price)) {
      setError('Please enter a valid name and numeric price.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        category: form.category,
        price: parseFloat(form.price),
        imageUrl: form.imageUrl,
        unit:form.unit,
        stock: parseFloat(form.stock),
        description: form.description,
        updatedAt: serverTimestamp()
      };
      if (isEdit) {
        await setDoc(doc(db, 'products', id), payload, { merge: true });
      } else {
        await addDoc(collection(db, 'products'), {
          ...payload,
          createdAt: serverTimestamp()
        });
      }
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError('Failed to save product.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${theme.palette.primary[50]} 0%, ${theme.palette.secondary[100]} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.primary[50]} 0%, ${theme.palette.secondary[100]} 100%)`,
        py: 6
      }}
    >
      <Container maxWidth={false} sx={{ px: 2 }}>
        <Card
          elevation={8}
          sx={{
            width: '1000px',
            mx: 'auto',
            borderRadius: 7,
            backgroundImage: `url("/formbg.avif")`,
            backgroundSize: 'cover'
          }}
        >
          <CardHeader
            
            title={
              <Typography variant="h5">
                {isEdit ? 'Edit Product' : 'Add New Product'}
              </Typography>
            }
            sx={{ pt: 3, color:'black',textAlign:'center' }}
          />

          <CardContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                pr: 10
              }}
            >
              <Stack spacing={2} sx={{ width: '60%', maxWidth: 700 }}>

                <TextField
                  required
                  fullWidth
                  label="Name"
                  value={form.name}
                  onChange={handleChange('name')}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, display: 'flex', color: 'black' }}>
                        <CategoryIcon color="action" />
                      </Box>
                    ),
                    sx: {
                      color: 'black'
                    }
                  }}
                  InputLabelProps={{
                    sx: { color: 'black' }
                  }}
                />

                <TextField
                  fullWidth
                  label="Category"
                  value={form.category}
                  onChange={handleChange('category')}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, display: 'flex', color: 'black' }}>
                        <CategoryIcon color="action" />
                      </Box>
                    ),
                    sx: {
                      color: 'black'
                    }
                  }}
                  InputLabelProps={{
                    sx: { color: 'black' }
                  }}
                />

                <TextField
                  required
                  fullWidth
                  label="Price"
                  value={form.price}
                  onChange={handleChange('price')}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, display: 'flex', color: 'black' }}>
                        <MonetizationOnIcon color="action" />
                      </Box>
                    ),
                    sx: {
                      color: 'black'
                    }
                  }}
                  InputLabelProps={{
                    sx: { color: 'black' }
                  }}
                />
                <TextField
                  fullWidth
                  label="Measuring unit"
                  value={form.unit}
                  onChange={handleChange('unit')}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, display: 'flex', color: 'black' }}>
                        < BalanceIcon color="action" />
                      </Box>
                    ),
                    sx: {
                      color: 'black'
                    }
                  }}
                  InputLabelProps={{
                    sx: { color: 'black' }
                  }}
                />
                <TextField
                  fullWidth
                  label="Stock Quantity"
                  value={form.stock}
                  onChange={handleChange('stock')}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, display: 'flex', color: 'black' }}>
                        < ProductionQuantityLimitsIcon color="action" />
                      </Box>
                    ),
                    sx: {
                      color: 'black'
                    }
                  }}
                  InputLabelProps={{
                    sx: { color: 'black' }
                  }}
                />
                <TextField
                  fullWidth
                  label="Image URL"
                  value={form.imageUrl}
                  onChange={handleChange('imageUrl')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ImageIcon />
                      </InputAdornment>
                    ),
                    endAdornment: preview && (
                      <InputAdornment position="end">
                        <Avatar src={preview} sx={{ width: 48, height: 48 }} />
                      </InputAdornment>
                    ),
                    sx: { color: 'black' }
                  }}
                  InputLabelProps={{
                    sx: { color: 'black' }
                  }}
                />

                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  value={form.description}
                  onChange={handleChange('description')}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, display: 'flex', color: 'black' }}>
                        <DescriptionIcon color="action" />
                      </Box>
                    ),
                    sx: {
                      color: 'black'
                    }
                  }}
                  InputLabelProps={{
                    sx: { color: 'black' }
                  }}
                />
              </Stack>
            </Box>
          </CardContent>

          <CardActions sx={{ justifyContent: 'space-between', px: 3, pb: 3 }}>
            <Button onClick={() => navigate('/admin')} variant="text" color=''>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                background: 'linear-gradient(90deg,rgb(25, 203, 25),rgb(248, 248, 10))',
                color: 'black',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
                '&:hover': { opacity: 0.9 }
              }}
            >
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </CardActions>
        </Card>
      </Container>
    </Box>
  );
}
