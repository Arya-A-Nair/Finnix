import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Typography, Box, Button } from '@mui/material';
import requests from '../../config/requests';
import axios from '../../config/axios';
import AuthContext from '../../context/AuthContext';
import { enqueueSnackbar } from 'notistack';
import { DataGrid } from '@mui/x-data-grid';
import { AiOutlineCheckCircle, AiFillDelete } from 'react-icons/ai';
import { BiArrowBack } from 'react-icons/bi';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYXJ5YXJveCIsImEiOiJjbGtwZGhsZGIyYXp0M2RrZzQ1YmRjeGVxIn0.t-ZYbpmvLe1KJdbh_RzkVQ';

const data = [
  [84.09252, 20.126544],
  [72.8869, 19.0749],
  [77.540296, 35.27113],
  [74.391281, 33.512488],
  [79.514329, 30.172141],
];

const from = [
  [72.8869, 19.0749],
  [77.540296, 35.27113],
  [74.391281, 33.512488],
  [79.514329, 30.172141],
];

const to = [84.09252, 20.126544];

const columns = [
  // {
  //   field: 'aadharNumber',
  //   headerName: 'Aadhar Number',
  //   flex: 1,
  // },
  {
    field: 'accountNumber',
    headerName: 'Account Number',
    flex: 1,
  },
  {
    field: 'firstName',
    headerName: 'Name',
    flex: 1,
    renderCell: ({ row }) => {
      return `${row.firstName} ${row.lastName}`;
    },
  },
  {
    field: 'bankBranch',
    headerName: 'Branch',
    flex: 1,
  },
  {
    field: 'bankName',
    headerName: 'Bank Name',
    flex: 1,
  },
  // {
  //   field: 'createdAt',
  //   headerName: 'Created At',
  //   flex: 1,
  //   renderCell: (params) => {
  //     return new Date(params.value).toLocaleString();
  //   },
  // },
  // {
  //   field: 'descriptionOfFraud',
  //   headerName: 'Description of Fraud',
  //   flex: 1,
  // },
  // {
  //   field: 'type',
  //   headerName: 'Type',
  //   flex: 1,
  // },
  // {
  //   field: 'typeOfFraud',
  //   headerName: 'Type of Fraud',
  //   flex: 1,
  // },
  // {
  //   field: 'updatedAt',
  //   headerName: 'Updated At',
  //   flex: 1,
  //   renderCell: (params) => {
  //     return new Date(params.value).toLocaleString();
  //   },
  // },
];

let map = null;

function Complaints() {
  const { getApiHeadersWithToken } = React.useContext(AuthContext);
  const [complaints, setComplaints] = useState(null);
  const [data, setData] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [currentViewPort, setCurrentViewPort] = useState({
    center: [76.933659, 23.699865],
    zoom: 4,
  });

  useEffect(() => {
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v11',
      center: currentViewPort.center,
      zoom: currentViewPort.zoom,
    });
  }, [currentViewPort]);

  React.useEffect(() => {
    try {
      const fetchComplaints = async () => {
        const { data, status } = await axios.get(
          requests.getAllComplaints,
          getApiHeadersWithToken()
        );
        if (status === 200) {
          setComplaints(data?.complains);
          let complains = data?.complains;
          let newData = [];
          for (let i = 0; i < complains.length; i++) {
            const response = await axios.get(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${complains[i].bankBranch}.json?access_token=pk.eyJ1IjoiYXJ5YXJveCIsImEiOiJjbGtwZGhsZGIyYXp0M2RrZzQ1YmRjeGVxIn0.t-ZYbpmvLe1KJdbh_RzkVQ`
            );
            newData.push({
              center: response.data.features[0].center,
              type: complains[i].type,
            });
          }
          setData(newData);
          newData.map((item) => {
            console.log(item);
            const marker = new mapboxgl.Marker(
              item.type === 'pending' ? { color: 'red' } : { color: 'green' }
            )
              .setLngLat([item.center[0], item.center[1]]) // Coordinates for the point to be displayed
              .addTo(map);
          });
        }
      };
      fetchComplaints();
    } catch (error) {
      enqueueSnackbar('Unable to get Complaints list', { variant: 'error' });
    }
  }, [getApiHeadersWithToken]);

  async function acceptComplaint(id) {
    try {
      const response = await axios.post(
        requests.updateStatus,
        { id, status: true },
        getApiHeadersWithToken()
      );

      if (response.status === 200) {
        enqueueSnackbar('Complaint accepted', { variant: 'success' });
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to accept complaint ' + error.message, {
        variant: 'error',
      });
    }
  }

  async function deleteComplaint(id) {
    try {
      const response = await axios.post(
        requests.updateStatus,
        { id, status: false },
        getApiHeadersWithToken()
      );

      if (response.status === 200) {
        enqueueSnackbar('Complaint deleted', { variant: 'success' });
        window.location.reload();
        // Handle UI updates or data fetching if needed
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to delete complaint', { variant: 'error' });
    }
  }
  return (
    <Box
      sx={{
        width: '100%',
        height: '95%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        bgcolor: 'background.default',
        borderRadius: '0.5rem',
      }}
    >
      <Box
        sx={{
          height: '100%',
          width: '60%',
          borderRadius: '0.5rem',
        }}
        id="map"
      >
        Map
      </Box>
      <Box
        sx={{
          display: 'flex',
          width: '40%',
          height: '100%',
        }}
      >
        {selectedNode ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              // alignSelf: 'center',
              width: '100%',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '90%',
              }}
            >
              <Typography
                variant="h5"
                fontWeight={700}
                color="primary"
                my={2}
                children="Complaint Details"
                sx={{
                  textDecoration: 'underline',
                  textAlign: 'center',
                }}
              />
              {Object.keys(selectedNode).map((item) => (
                <Box
                  key={item}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    // marginBottom: theme.spacing(1),
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color="primary"
                    textAlign="start"
                  >
                    {item}:
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={500}
                    color="primary"
                    sx={{
                      textDecoration: 'underline',
                    }}
                    textAlign="end"
                  >
                    {selectedNode[item]}
                  </Typography>
                </Box>
              ))}
              <Button
                onClick={() => {
                  setSelectedNode(null);
                  map.flyTo({
                    center: currentViewPort.center,
                    zoom: currentViewPort.zoom,
                  });
                }}
                variant="outlined"
                sx={{ marginTop: 2 }}
                startIcon={<BiArrowBack />}
              >
                Back
              </Button>
              <Box
                sx={{
                  width: '100%',
                  gap: '1rem',
                  display: 'flex',
                  mt: 2,
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<AiOutlineCheckCircle />}
                  fullWidth
                  color="success"
                  onClick={() => acceptComplaint(selectedNode['Ticket ID'])}
                >
                  Accept
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AiFillDelete />}
                  fullWidth
                  color="error"
                  onClick={() => deleteComplaint(selectedNode['Ticket ID'])}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width="100%"
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
                flexDirection: 'column',
                width: '100%',
                mt: 1,
              }}
            >
              <Typography
                variant="h5"
                fontWeight={700}
                color="primary"
                children="Received Complaints"
                sx={{
                  textDecoration: 'underline',
                }}
                my={1}
              />
              <Box
                sx={{
                  height: 250,
                  width: '100%',
                  flexDirection: 'column',
                  my: 1,
                  display: 'flex',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}
              >
                <DataGrid
                  rows={
                    complaints
                      ?.map((item, index) => ({ ...item, id: index }))
                      .filter((c) => c.type === 'pending') || []
                  }
                  loading={!complaints}
                  columns={columns}
                  disableColumnFilter
                  disableColumnSelector
                  disableRowSelectionOnClick
                  disableDensitySelector
                  onRowClick={async (params) => {
                    console.log(params.row);
                    setSelectedNode({
                      Name: `${params.row.firstName} ${params.row.lastName}`,
                      'Ticket ID': params.row._id,
                      'Bank Name': params.row.bankName,
                      Branch: params.row.bankBranch,
                      'Account Number': params.row.accountNumber,
                      'Aadhar Number': params.row.aadharNumber,
                      Fraud: params.row.typeOfFraud,
                      Description: params.row.descriptionOfFraud,
                    });
                    // setCurrentViewPort({
                    //   center: [params.row.id][0], [params.row.id][1]],
                    //   zoom: 10,
                    // })
                    const response = await axios.get(
                      `https://api.mapbox.com/geocoding/v5/mapbox.places/${params.row.bankBranch}.json?access_token=pk.eyJ1IjoiYXJ5YXJveCIsImEiOiJjbGtwZGhsZGIyYXp0M2RrZzQ1YmRjeGVxIn0.t-ZYbpmvLe1KJdbh_RzkVQ`
                    );
                    map.flyTo({
                      center: [
                        response.data.features[0].center[0],
                        response.data.features[0].center[1],
                      ],
                      zoom: 10,
                    });
                  }}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
                flexDirection: 'column',
                width: '100%',
                mt: 1,
              }}
            >
              <Typography
                variant="h5"
                fontWeight={700}
                color="primary"
                children="Accepted Complaints"
                sx={{
                  textDecoration: 'underline',
                }}
                my={1}
              />
              <Box
                sx={{
                  height: 250,
                  width: '100%',
                  flexDirection: 'column',
                  my: 1,
                  display: 'flex',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}
              >
                <DataGrid
                  rows={
                    complaints
                      ?.map((item, index) => ({ ...item, id: index }))
                      .filter((c) => c.type === 'accepted') || []
                  }
                  loading={!complaints}
                  columns={columns}
                  disableColumnFilter
                  disableColumnSelector
                  disableRowSelectionOnClick
                  disableDensitySelector
                  onRowClick={async (params) => {
                    console.log(params.row);
                    setSelectedNode({
                      Name: `${params.row.firstName} ${params.row.lastName}`,
                      'Ticket ID': params.row._id,
                      'Bank Name': params.row.bankName,
                      Branch: params.row.bankBranch,
                      'Account Number': params.row.accountNumber,
                      'Aadhar Number': params.row.aadharNumber,
                      Fraud: params.row.typeOfFraud,
                      Description: params.row.descriptionOfFraud,
                    });
                    // setCurrentViewPort({
                    //   center: [params.row.id][0], [params.row.id][1]],
                    //   zoom: 10,
                    // })
                    const response = await axios.get(
                      `https://api.mapbox.com/geocoding/v5/mapbox.places/${params.row.bankBranch}.json?access_token=pk.eyJ1IjoiYXJ5YXJveCIsImEiOiJjbGtwZGhsZGIyYXp0M2RrZzQ1YmRjeGVxIn0.t-ZYbpmvLe1KJdbh_RzkVQ`
                    );
                    map.flyTo({
                      center: [
                        response.data.features[0].center[0],
                        response.data.features[0].center[1],
                      ],
                      zoom: 10,
                    });
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Complaints;
