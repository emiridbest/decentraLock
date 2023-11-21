import { Inter } from "next/font/google";
import React, { useCallback, useEffect, useState } from "react";
import Web3 from "web3"; // Import Web3.js
import { contractAbi, contractAddress } from "../abi/planqsafe";
const inter = Inter({ subsets: ["latin"] });
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  const [contract, setContract] = useState(null);
  const [planqBalance, setPlanqBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isConnected, setConnected] = useState(false);

  async function connectToWallet() {
    console.log("getting balance");

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccount(accounts[0]);
      setConnected(true);
    } catch (error) {
      console.error("Failed to connect to MetaMask:", error);
      // Handle errors or display a message to the user
    }
  }

  async function disconnectWallet() {
    try {
      // You might want to add some disconnect logic here
      setConnected(false); // Update isConnected state when disconnected
      setAccount();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      if (!window.ethereum) throw new Error("Wallet extension not detected");

      window.ethereum.request({ method: "eth_requestAccounts" });
      const account = window.ethereum.requestAccounts({
        method: "eth_requestAccounts",
      });
      const web3Provider = new Web3(window.ethereum);
      const contract = new web3Provider.eth.Contract(
        contractAbi,
        contractAddress
      );
      setProvider(web3Provider);
      setContract(contract);
      setAccount(account[0]);
    }
  }, [account, contract]);

  const getBalance = useCallback(async () => {
    if (!window.ethereum) throw new Error("Celo wallet extension not detected");

    setAccount(account);
    const planqBalance = await contract.methods.getBalance(account).call(); // Use contract.methods
    setPlanqBalance(
      parseFloat(Web3.utils.fromWei(planqBalance.toString(), "ether"))
    ); // Use Web3.utils
  }, [account, contract]);

  async function handleDeposit(e) {
    e.preventDefault();
    if (!depositAmount || !provider) return;

    try {
      const gasLimit = 2000000;
      const depositAmountNumber = Web3.utils.toWei(depositAmount, "ether"); // Assuming depositAmount is a string
      // Assuming deposit is a method of your contract
      await contract.methods
        .deposit(depositAmountNumber)
        .send({ from: account, gas: gasLimit });

      getBalance();
      setDepositAmount("");
    } catch (error) {
      console.error(error);
      // Handle errors, e.g., display an error message to the user
    }
  }

  async function handleWithdraw(e) {
    e.preventDefault();
    const account = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    try {
      if (!account || !contract || !isConnected) {
        console.error("Account or contract not available");
        return;
      } else if (account || contract || isConnected) {
        console.log("Connected account:", account);

        const withdrawalResult = await contract.methods
          .withdraw()
          .send({ from: account[0], gas: 2000000 }); // Make sure to provide the "from" address
      } else if (withdrawalResult.status === true) {
        console.log("Withdrawal successful");
        console.log(withdrawalResult);
        getBalance();
      } else {
        console.error("Withdrawal failed");
      }
    } catch (error) {
      console.error("Error during withdrawal:", error);
    }
  }

  useEffect(() => {
    if (window.ethereum) {
      // MetaMask is installed
      // Additional logic can be added here
    } else {
      // MetaMask is not installed
      console.error("MetaMask not detected");
    }
  }, []);

  return (
    <main className={`flex min-h-screen flex-col p-5 ${inter.className}`}>
      <Header />
      <div className="flex flex-col items-center text-1xl">
        <p>
          Welcome to DecentraLock, where we are revolutionizing financial
          well-being!
          <br />
          DecentraLock embraces the concept of community.
        </p>
      </div>

      <div className="flex justify-center items-center p-10">
        {isConnected && account ? (
          <button
            type="button"
            onClick={disconnectWallet}
            className="bg-red-500 text-white py-2 px-6 rounded-full focus:outline-none hover:bg-red-600 transition duration-300"
          >
            Disconnect Wallet
          </button>
        ) : (
          <button
            type="button"
            onClick={connectToWallet}
            className="bg-green-500 text-white py-2 px-6 rounded-full focus:outline-none hover:bg-green-600 transition duration-300"
          >
            Connect Wallet
          </button>
        )}
      </div>

      <p className="flex flex-col items-center justify-between mt-6 text-lg text-gray-600">
        Your Planq Balance: {planqBalance.toFixed(2)} PLANQ
      </p>
      <div className="flex flex-col items-center justify-between">
        <form
          onSubmit={handleDeposit}
          className="mt-8 flex flex-col items-center"
        >
          <input
            type="number"
            step="0.01"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Enter deposit amount"
            className="w-full text-black bg-gray-100 border  border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="mt-9 bg-green-500 text-white py-2 px-6 rounded-full focus:outline-none hover:bg-blue-600 transition duration-300"
          >
            Deposit
          </button>
        </form>

        <button
          onClick={handleWithdraw}
          className="mt-9 bg-green-500 text-white py-2 px-6 rounded-full focus:outline-none hover:bg-red-600 transition duration-300"
        >
          Withdraw
        </button>
      </div>
      <Footer />
    </main>
  );
}
