import "./App.css";
import FileForm from "./components/FileForm";
import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import ViewFile from "./components/ViewFile";
import ShareButton from "./components/ShareButton";
import Paper from "@mui/material/Paper";
import Image from "./images/bg3.png";
import CardMedia from "@mui/material/CardMedia";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractAbi = Upload.abi;

function App() {
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  const connectWallet = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const loadProvider = async () => {
      if (provider) {
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        const contract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );
        console.log(contract);
        console.log(address);
        setContract(contract);
        setProvider(provider);
      } else {
        console.log("Metamask is not installed");
      }
    };
    provider && loadProvider();
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }
  });

  const styles = {
    paperContainer: {
      height: 300,
    },
  };
  return (
    <>
      <div>
        <CardMedia image={Image}>
          <h1 className="content">Welcome to Decentralised File Sharing</h1>

          <div className="buttons">
            <div className="connect-button">
              {account ? (
                <div>
                  <Button
                    sx={{ mr: 2 }}
                    onClick={connectWallet}
                    variant="contained"
                    disabled
                  >
                    Connect
                  </Button>
                  {account}
                </div>
              ) : (
                <Button
                  sx={{ mr: 2 }}
                  onClick={connectWallet}
                  variant="contained"
                >
                  Connect
                </Button>
              )}
            </div>

            <ShareButton contract={contract} account={account} />
          </div>
        </CardMedia>
      </div>

      <FileForm contract={contract} account={account} />
      <ViewFile contract={contract} account={account} />
    </>
  );
}

export default App;
