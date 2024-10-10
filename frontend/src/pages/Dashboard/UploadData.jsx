import React from "react";
import { Link } from "react-router-dom";

import axios from "../../config/axios";
import requests from "../../config/requests";
import AuthContext from "../../context/AuthContext";

import UploadBtn from "../../components/Dashboard/Upload/UploadBtn";

import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";

function UploadData() {
  const [files, setFiles] = React.useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const { getApiHeadersWithToken } = React.useContext(AuthContext);

  React.useEffect(() => {
    try {
      setFiles([]);
      const fetchFiles = async () => {
        const { data, status } = await axios.get(
          requests.getFiles,
          getApiHeadersWithToken()
        );
        if (status === 200) {
          setFiles(data.files);
        }
      };
      fetchFiles();
    } catch (error) {
      enqueueSnackbar("Unable to get files list", { variant: "error" });
    }
  }, [enqueueSnackbar, setFiles, getApiHeadersWithToken]);
  return (
    <div
      style={{
        display: "flex",
        // height: "90%",
        width: "100%",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <UploadBtn setFiles={setFiles} files={files} balanceStatus={false} />
      <Typography
        variant="h6"
        children="Past Uploaded Data"
        sx={{ marginTop: "2rem" }}
        color="primary"
      />
      <Divider style={{ width: "100%" }} />
      <List sx={{ height: "50vh", overflow: "auto" }}>
        {files.map((item, index) => (
          <ListItem key={index}>
            {index + 1}.&nbsp;
            <Link
              target="_blank"
              to={
                process.env.REACT_APP_BACKEND_API_DOMAIN +
                "/uploads/" +
                item.name
              }
            >
              <ListItemText
                primary={item.name}
                sx={{ textDecoration: "underline", cursor: "pointer" }}
              />
            </Link>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default UploadData;
