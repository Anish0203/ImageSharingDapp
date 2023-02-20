import Button from "@mui/material/Button";
import { useState } from "react";
import axios from "axios";

const FileForm = ({ contract, account }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const setFunction = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);

    e.preventDefault();
  };

  const submitFile = async (e) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: "0946f94eceb5f49c33c7",
            pinata_secret_api_key:
              "0453b92a01de4f230a3ffa4e2969608e32a524933a7f675f35b27cd1ea4d8818",
            "Content-Type": "multipart/form-data",
          },
        });

        const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
        console.log(ImgHash);
        contract.add_file(ImgHash);
        //Take a look at your Pinata Pinned section, you will see a new file added to you list.
        console.log("Submitted: ", file);
        alert("Image uploaded successfully");
        setFile(null);
        setFileName("");
      } catch (error) {
        console.log("Error sending File to IPFS: ");
        console.log(error);
      }
    }
  };
  return (
    <>
      <div className="upload-file">
        <Button
          sx={{ mr: 2 }}
          onChange={setFunction}
          variant="contained"
          component="label"
        >
          Upload File
          <input hidden accept="image/*" multiple type="file" />
        </Button>
        {file ? fileName : " No Image selected "}
        {file ? (
          <Button onClick={submitFile} sx={{ ml: 2 }} variant="contained">
            Submit
          </Button>
        ) : (
          <Button sx={{ ml: 2 }} variant="contained" disabled>
            Submit
          </Button>
        )}
      </div>
    </>
  );
};

export default FileForm;

/*
API Key: 23fed1cf6a6bc9d057ed
 API Secret: ad3649e7b02ec169a33c08e354e21019f2c3fba8de0371005ed34429256f4716
 JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxZjhlODk3ZC01YmZmLTQ2ZjUtOTM5YS0xYjk2ZDE5MzJjMDUiLCJlbWFpbCI6ImFuaXNoYWdhcndhbDIwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIyM2ZlZDFjZjZhNmJjOWQwNTdlZCIsInNjb3BlZEtleVNlY3JldCI6ImFkMzY0OWU3YjAyZWMxNjlhMzNjMDhlMzU0ZTIxMDE5ZjJjM2ZiYThkZTAzNzEwMDVlZDM0NDI5MjU2ZjQ3MTYiLCJpYXQiOjE2NzM3NjY0ODh9.6dSdqZutu26elVXAOmxlpuQ-O_nyOkVCgnctb5LuWm8

*/
