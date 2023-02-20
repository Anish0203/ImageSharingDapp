import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Input from "@mui/material/Input";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
// import Typography from "@mui/material/Typography";
// import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
// import IconButton from "@mui/material/IconButton";
// import FavoriteIcon from "@mui/icons-material/Favorite";
import Grid from "@mui/material/Grid";

const ViewFile = ({ contract, account }) => {
  const [address, setAddress] = useState("");
  const [listOfAddress, setListOfAddress] = useState([]);
  const [data, setData] = useState("");
  //console.log(listOfAddress);
  const [selectedAddress, setSelectedAddress] = useState("");

  useEffect(() => {
    const loadAddress = async () => {
      let addressArray;
      addressArray = await contract.view_address();
      const isEmpty = Object.keys(addressArray).length === 0;
      if (!isEmpty) {
        setListOfAddress([...addressArray]);
      } else {
        setListOfAddress([]);
      }
    };
    account && loadAddress();
  }, [account,contract,address]);

  const handleChange = (e) => {
    setAddress(e.target.value);
    console.log("Changed");
  };
  const view = async () => {
    if (selectedAddress === "") {
      alert("Please select an address");
    }
    console.log(selectedAddress);
    let dataArray;
    dataArray = await contract.view_files(selectedAddress);
    console.log(dataArray);
    const isEmpty = Object.keys(dataArray).length === 0;

    if (!isEmpty) {
      setData(dataArray);
    } else {
      setData("");
      alert("No image found");
    }
  };

  const revoke = ()=>{
    contract.remove_address(address);
    setAddress("");
  }

  const handleDelete = (img)=>{
    contract.remove_file(img);
    console.log(img);
    view();
  }


  return (
    <>
      <div>
        <FormControl sx={{ m: 5, minWidth: 200 }}>
          <InputLabel id="demo-simple-select-label">Select Address</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={address}
            label="Address"
            onChange={handleChange}
          >
            {listOfAddress.map((adr) => (
              <MenuItem key={adr} value={adr}>
                {adr}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button sx={{ m: 6, ml: 1 }} variant="contained" onClick={revoke} disabled={!address}>
          Revoke
        </Button>
        </div>
        <div>
        <Input
              placeholder="Enter Address" sx={{ m: 6, mr:2 }}
              onChange={(e) => setSelectedAddress(e.target.value)}
            ></Input>
        <Button sx={{ m: 6, ml: 1 }} variant="contained" onClick={view}>
          View File
        </Button>
      </div>
      <div>
        <Grid
          container
          spacing={2}
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
        >
          {data &&
            data.map((img, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card sx={{ maxWidth: 345 }}>
                  <a href={img} key={i} >
                    {/* <img key={i} src={`https://gateway.pinata.cloud/ipfs${img.substring(6)}`} alt="new"></img> */}
                    <CardMedia
                      component="img"
                      height="194"
                      image={`https://gateway.pinata.cloud/ipfs${img.substring(
                        6
                      )}`}
                      alt="Image"
                    />
                  </a>
                  {/* <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a
                      type specimen book.
                    </Typography>
                  </CardContent> */}
                  {account===selectedAddress?
                  <CardActions disableSpacing>
                    <Button variant="contained" color="error" onClick={()=>handleDelete(img)}>Delete</Button>
                  </CardActions>:""}
                </Card>
              </Grid>
            ))}
        </Grid>
      </div>
    </>
  );
};

export default ViewFile;
