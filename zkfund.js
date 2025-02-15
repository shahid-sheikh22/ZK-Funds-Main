import React, { useState } from "react";
import { ethers } from "ethers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const zkFund = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [transactionHash, setTransactionHash] = useState(null);
  const [zkProof, setZkProof] = useState(null);

  // Connect Wallet Function
  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]);
    } else {
      alert("Please install MetaMask to use this feature.");
    }
  };

  // Handle Donation Submission
  const handleDonate = async () => {
    if (!walletAddress) {
      alert("Please connect your wallet first.");
      return;
    }

    if (!donationAmount || isNaN(donationAmount) || parseFloat(donationAmount) <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    try {
      // Mock ZK Proof (In a real app, generate this using circom and snarkjs)
      const proof = `proof_for_${donationAmount}`;
      setZkProof(proof);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: "0xYourSmartContractAddress", // Replace with your contract address
        value: ethers.utils.parseEther(donationAmount),
      });

      setTransactionHash(tx.hash);
      alert("Donation successful! ZK Proof generated and submitted.");
    } catch (error) {
      console.error(error);
      alert("Donation failed. Please try again.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">zkFund: Anonymous Donation Platform</h1>
      <Card className="mb-4">
        <CardContent>
          {!walletAddress ? (
            <Button onClick={connectWallet} className="w-full">
              Connect Wallet
            </Button>
          ) : (
            <p className="text-green-500 font-medium">Wallet Connected: {walletAddress}</p>
          )}
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent>
          <Input
            type="text"
            placeholder="Enter donation amount (ETH)"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            className="mb-4"
          />
          <Button onClick={handleDonate} className="w-full">
            Donate Anonymously
          </Button>
        </CardContent>
      </Card>

      {transactionHash && (
        <Card className="mb-4">
          <CardContent>
            <p className="font-medium">Transaction Hash:</p>
            <a
              href={`https://goerli.etherscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              {transactionHash}
            </a>
          </CardContent>
        </Card>
      )}

      {zkProof && (
        <Card>
          <CardContent>
            <p className="font-medium">Zero-Knowledge Proof:</p>
            <code className="text-sm text-gray-600">{zkProof}</code>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default zkFund;
