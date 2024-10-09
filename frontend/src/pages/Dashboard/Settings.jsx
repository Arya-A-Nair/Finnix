import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  DialogContentText,
  TextField,
} from '@mui/material';
import AuthContext from '../../context/AuthContext';
import requests from '../../config/requests';
import axios from '../../config/axios';
import { useSnackbar } from 'notistack';
import ConfirmModal from '../../components/ConfirmModal';
import { FaUserPlus } from 'react-icons/fa';

const columns = [
  {
    field: 'id',
    headerName: 'ID',
    flex: 1,
  },
  {
    field: 'email',
    headerName: 'Email',
    // editable: true,
    flex: 1,
  },
  // {
  //   field: "password",
  //   headerName: "Password",
  //   editable: true,
  //   flex: 1,
  //   renderCell: ({ row }) => {
  //     return <Box>{row.password}</Box>;
  //   },
  // },
  {
    field: 'role',
    headerName: 'Role',
    // editable: true,
    flex: 1,
  },
  {
    field: 'sendInvite',
    headerName: '',
    width: 150,
    sortable: false,
    disableColumnMenu: true,
    disableCellSelect: true,
    renderCell: ({ row }) => <Button variant="outlined">Invite Again</Button>,
  },
  {
    field: 'delete',
    headerName: '',
    width: 100,
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ row }) => <Button variant="outlined">Delete</Button>,
  },
];

function Settings() {
  const { getApiHeadersWithToken } = React.useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const [usersList, setUsersList] = React.useState([]);
  const [deleteId, setDeleteId] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [userDetails, setUserDetails] = useState({
    email: '',
    role: '',
  });

  const addUserDetails = (event) => {
    const { name, value } = event.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const fetchUsers = React.useCallback(async () => {
    const { data } = await axios.get(
      requests.getUsers,
      getApiHeadersWithToken()
    );
    if (data?.data?.users) setUsersList(data.data.users);
  }, [getApiHeadersWithToken]);
  React.useEffect(() => {
    try {
      fetchUsers();
    } catch (error) {
      enqueueSnackbar('Unable to fetch All Users List', { variant: 'error' });
    }
  }, [enqueueSnackbar, fetchUsers]);

  const handleOnCellClick = (params, event) => {
    if (params.field === 'delete') {
      setDeleteId(params.row.id);
    } else if (params.field === 'sendInvite') {
      try {
        const sendInvitaion = async () => {
          const response = await axios.post(
            requests.sendInvitation,
            {
              _id: params.row.id,
            },
            getApiHeadersWithToken()
          );
          if (response.status === 200 && !response.data.error)
            enqueueSnackbar('Invitation sent successfully', {
              variant: 'success',
            });
        };
        sendInvitaion();
      } catch (error) {
        enqueueSnackbar('Unable to send Invitation', { variant: 'error' });
      }
    }
  };

  const deleteUser = async () => {
    try {
      const response = await axios.post(
        requests.deleteUser,
        {
          id: deleteId,
        },
        getApiHeadersWithToken()
      );
      if (response.status === 200 && !response.data.error) {
        enqueueSnackbar('Successfully deleted user', {
          variant: 'success',
        });
        setDeleteId(null);
        setUsersList((prev) => prev.filter((user) => user.id !== deleteId));
        fetchUsers();
      }
    } catch (error) {
      enqueueSnackbar('Unable to Delete User', { variant: 'error' });
    }
  };

  async function handleAddUser() {
    try {
      const response = await axios.post(
        requests.addNewUser,
        {
          email: userDetails.email,
          role: userDetails.role,
        },
        getApiHeadersWithToken()
      );

      if (response.status === 201) {
        enqueueSnackbar('User Added Successfully', { variant: 'success' });
        fetchUsers();
      }
      closeDialog();
    } catch (error) {
      enqueueSnackbar('Unable to Add User', { variant: 'error' });
      if (error.response.data.error === 'User already exists')
        enqueueSnackbar('User already exists', { variant: 'error' });
      else enqueueSnackbar('Unable to Add User', { variant: 'error' });
    }
  }

  function closeDialog() {
    setOpen(false);
    setUserDetails({
      email: '',
      role: '',
    });
  }

  return (
    <>
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" children="Manage Users" />
          <Button
            variant="contained"
            startIcon={<FaUserPlus />}
            onClick={() => {
              setOpen(true);
            }}
          >
            Add User
          </Button>
        </Box>
        <Box
          sx={{
            height: 350,
            width: 'auto',
            flexDirection: 'column',
            mt: '0.5rem',
          }}
        >
          <DataGrid
            rows={usersList}
            columns={columns}
            disableColumnFilter
            disableColumnSelector
            disableRowSelectionOnClick
            disableDensitySelector
            // pageSizeOptions={[3]}
            // initialState={{
            //   ...usersList.initialState,
            //   pagination: { paginationModel: { pageSize: 3 } },
            // }}
            sx={{
              px: '1rem',
              bgcolor: 'background.default',
              '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus':
                {
                  outline: 'none',
                },
            }}
            onCellClick={handleOnCellClick}
          />
        </Box>
      </Box>
      <ConfirmModal
        open={!!deleteId}
        question={'Are you sure you want to delete user?'}
        message={'Once deleted user cannot be retrived'}
        handleClose={() => setDeleteId(null)}
        handleConfirm={deleteUser}
      />
      <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>Add New User Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add new user, please enter the email address and user role here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            name="email"
            sx={{
              my: 3,
            }}
            required
            value={userDetails.email}
            onChange={addUserDetails}
          />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={userDetails.role}
              label="Role"
              onChange={addUserDetails}
              name="role"
            >
              <MenuItem value={'bank_employee'}>Bank Employee</MenuItem>
              <MenuItem value={'police'}>Police</MenuItem>
              <MenuItem value={'Admin'}>Admin</MenuItem>
              <MenuItem value={'User'}>User</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleAddUser}>Add User</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Settings;
