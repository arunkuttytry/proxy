import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add as AddIcon, Refresh as RefreshIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/proxies';

function Dashboard() {
  const [proxies, setProxies] = useState([]);
  const [open, setOpen] = useState(false);
  const [newProxy, setNewProxy] = useState({ ip: '', port: '' });

  const fetchProxies = async () => {
    try {
      const response = await axios.get(API_URL);
      setProxies(response.data);
    } catch (error) {
      toast.error('Failed to fetch proxies');
      console.error('Error fetching proxies:', error);
    }
  };

  useEffect(() => {
    fetchProxies();
  }, []);

  const handleAddProxy = async () => {
    try {
      // Validate IP and port
      if (!newProxy.ip || !newProxy.port) {
        toast.error('Please enter both IP and port');
        return;
      }

      await axios.post(API_URL, newProxy);
      setOpen(false);
      setNewProxy({ ip: '', port: '' });
      fetchProxies();
      toast.success('Proxy added successfully');
    } catch (error) {
      toast.error(error.response?.data?.details || 'Failed to add proxy');
      console.error('Error adding proxy:', error);
    }
  };

  const handleDeleteProxy = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchProxies();
      toast.success('Proxy deleted successfully');
    } catch (error) {
      toast.error('Failed to delete proxy');
      console.error('Error deleting proxy:', error);
    }
  };

  const handleRegenerateConfig = async () => {
    try {
      await axios.post(`${API_URL}/regenerate`);
      toast.success('Configuration regenerated successfully');
    } catch (error) {
      toast.error('Failed to regenerate configuration');
      console.error('Error regenerating config:', error);
    }
  };

  const columns = [
    { field: 'ip', headerName: 'IP Address', flex: 1 },
    { field: 'port', headerName: 'Port', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleDeleteProxy(params.row.id)}
          title="Delete Proxy"
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            3Proxy Manager
          </Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleRegenerateConfig}
              sx={{ mr: 2 }}
            >
              Regenerate Config
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
            >
              Add Proxy
            </Button>
          </Box>
        </Box>

        <DataGrid
          rows={proxies}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          autoHeight
          disableSelectionOnClick
          getRowId={(row) => row.id}
        />
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Proxy</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="IP Address"
            fullWidth
            value={newProxy.ip}
            onChange={(e) => setNewProxy({ ...newProxy, ip: e.target.value })}
            placeholder="e.g., 192.168.1.1"
            helperText="Enter a valid IP address"
          />
          <TextField
            margin="dense"
            label="Port"
            type="number"
            fullWidth
            value={newProxy.port}
            onChange={(e) => setNewProxy({ ...newProxy, port: e.target.value })}
            placeholder="e.g., 8080"
            helperText="Port must be between 1 and 65535"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddProxy} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Dashboard; 