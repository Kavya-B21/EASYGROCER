import React, { useEffect, useState }         from 'react';
import { useNavigate, Link as RouterLink }    from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  CircularProgress,
  Typography,
  Tooltip,
  useTheme,
  Avatar
}                                              from '@mui/material';
import AddIcon          from '@mui/icons-material/Add';
import EditIcon         from '@mui/icons-material/Edit';
import DeleteIcon       from '@mui/icons-material/Delete';
import { collection, onSnapshot, doc, deleteDoc }from 'firebase/firestore';
import { db }           from '../firebase/config';

export default function AdminDashboard() {
  const theme     = useTheme();
  const navigate  = useNavigate();
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId]   = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'products'),
      snap => {
        setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      err => {
        console.error(err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const handleDelete = async () => {
    await deleteDoc(doc(db, 'products', toDeleteId));
    setConfirmOpen(false);
    setToDeleteId(null);
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
        backgroundImage: `url("/profile.jpg")`,
        backgroundSize:'cover',
        background: `linear-gradient(135deg, ${theme.palette.primary[50]} 0%, ${theme.palette.secondary[100]} 100%)`,
        py: 6
      }}
    >
      <Container maxWidth="lg">
        {/* Page header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4">Admin Dashboard</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/admin/product/new"
            sx={{
              background: 'linear-gradient(90deg,rgb(25, 203, 25),rgb(248, 248, 10))',
              color: 'black',
              '&:hover': { opacity: 0.9 }
            }}
          >
            Add Product
          </Button>
        </Box>

        {/* Products table */}
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: 'rgba(126, 218, 28, 0.33)', 
    backdropFilter: 'blur(8px)',                 
    
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {['Name', 'Category', 'Price','Unit','Stock','Description', 'Actions'].map(h => (
                  <TableCell
                    key={h}
                    align={h === 'Actions' ? 'right' : 'left'}
                    sx={{
            backgroundColor: 'rgba(143, 239, 8, 0.46)', 
            backdropFilter: 'blur(4px)',                
            color: 'black',
            fontWeight: 'bold'
          }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((prod, index) => (
  <TableRow
    key={prod.id}
    hover
    sx={{
      backgroundColor: index % 2 === 0
        ? 'rgba(255, 255, 255, 0.2)' 
        : 'rgba(215, 241, 67, 0.31)' 
    }}
  >

                  <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {prod.name}<Avatar src={prod.imageUrl} sx={{ width: 32, height: 32 }} /></TableCell>
                  <TableCell>{prod.category}</TableCell>
                  <TableCell>₹{prod.price}</TableCell>
                  <TableCell>{prod.unit}</TableCell>
                  <TableCell>{prod.stock}{prod.unit}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 200,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {prod.description}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <Button size="small" color='black' onClick={() => navigate(`/admin/product/${prod.id}`)}>
                        <EditIcon fontSize="small" />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Button
                        size="small"
                        color="black"
                        onClick={() => {
                          setToDeleteId(prod.id);
                          setConfirmOpen(true);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Confirmation dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}