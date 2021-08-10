import React, { useState, useEffect, createRef } from 'react';
import { ethers } from 'ethers';
import Deed from '../artifacts/contracts/Deed.sol/Deed.json'
import {
	humanReadableDeedState,
	humanReadableUnixTimestamp,
      } from "./formatter";
import moment from "moment";
import 'semantic-ui-css/semantic.min.css';
import { Sticky } from 'semantic-ui-react';
import PreviousBuyers from './PreviousBuyers';
import Balance from './Balance';
import ContractDetails from './ContractDetails';
import Seller from './users/Seller';
import Buyer from './users/Buyer';
import Visitor from './users/Visitor';




const deedAddress = ''; //address

const provider = new ethers.providers.Web3Provider(window.ethereum);
const contract = new ethers.Contract(deedAddress, Dapp.abi, provider);
async function requestAccount() {
	try {
	  await window.ethereum.request({ method: 'eth_requestAccounts' });
	} catch (error) {
	  console.log("error");
	  console.error(error)
      
	  alert("Login to Metamask first");
	}
      }
      

const Dapp = () => {
	const [contractEnd, setContractEnd] = useState(true);
	const[deed, setDeed] = useState({
		state: null,
		balance: 0,
		price: 1, //default
		sales: 0,
		previousBuyers: []
	});
	const [seller, setSeller] = useState();
	const [sellerBalance, setSellerBalance] = useState();
	const[buyer, setBuyer] = useState();
	const [buyerBalance, setBuyerBalance] = useState();
	const [user, setUser] = useState();
	const [userBalance, setUserBalance] = useState();
	const [role, setRole] = useState();


	useEffect(() => {
		async function fetchData() {
	    
		  try {
		    // Contract Events
	    
		    contract.on("Closed", async (when, event) => {
		      event.removeListener(); // Solve memory leak with this.
	    
		      const contractState = await contract.state();
		      const contractBalance = await provider.getBalance(contract.address);
		      const previousBuyers = await contract.listPreviousBuyers();
	    
		      setDeed({
			...deed,
			state: humanReadableDeedState(contractState), 
			balance: ethers.utils.formatEther(contractBalance.toString()),
			previousBuyers,
		      })
	    
		      const contractSeller = await contract.seller();
		      const contractSellerBalance = await provider.getBalance(contractSeller);
		      setSellerBalance(ethers.utils.formatEther(contractSellerBalance));
	    
		      console.log("Event - Closed");
		      console.log(`State - ${humanReadableDeedState(contractState)}`);
		      console.log(`${moment(humanReadableUnixTimestamp(when)).fromNow()} - ${humanReadableUnixTimestamp(when)}`)
		    });
	    
		    contract.on("ConfirmPurchase", async (when, by, event) => {
		      event.removeListener(); // Solve memory leak with this.
	    
		      const contractState = await contract.state();
		      const contractBalance = await provider.getBalance(contract.address);
		      const previousBuyers = await contract.listPreviousBuyers();
	    
		      setDeed({
			...deed,
			state: humanReadableDeedState(contractState),
			balance: ethers.utils.formatEther(contractBalance.toString()),
			previousBuyers,
		      })
	    
		      setBuyer(by);
		      const contractBuyerBalance = await provider.getBalance(by);
		      setBuyerBalance(ethers.utils.formatEther(contractBuyerBalance));
	    
		      setRole("buyer");
		      console.log("This visitor became the buyer of this contract");
	    
		      console.log("Event - ConfirmPurchase");
		      console.log(`By - ${by}`);
		      console.log(`State - ${humanReadableDeedState(contractState)}`);
		      console.log(`${moment(humanReadableUnixTimestamp(when)).fromNow()} - ${humanReadableUnixTimestamp(when)}`)
		    });
	    
		    contract.on("SellerRefundBuyer", async (when, event) => {
		      event.removeListener(); // Solve memory leak with this.
	    
		      const contractState = await contract.state();
		   
	    
		      setDeed({
			...deed,
			state: humanReadableDeedState(contractState),
			
		      })
	    
		      console.log("This seller refunded the buyer of this contract");
	    
		
		      console.log("Event - SellerRefundBuyer");
		      console.log(`State - ${humanReadableDeedState(contractState)}`);
		      console.log(`${moment(humanReadableUnixTimestamp(when)).fromNow()} - ${humanReadableUnixTimestamp(when)}`)
		    });
	    
		    contract.on("ConfirmReceived", async (when, by, event) => {
		      event.removeListener(); // Solve memory leak with this.
	    
		      const contractState = await contract.state();
		      const contractBalance = await provider.getBalance(contract.address);
		      const previousBuyers = await contract.listPreviousBuyers();
		      console.log(previousBuyers);
	    
		      setDeed({
			...deed,
			state: humanReadableDeedState(contractState),
			balance: ethers.utils.formatEther(contractBalance.toString()),
			previousBuyers,
		      })
	    
		      setBuyer(by);
		      const contractBuyerBalance = await provider.getBalance(by);
		      setBuyerBalance(ethers.utils.formatEther(contractBuyerBalance));
	    
		      console.log("Event - ConfirmReceived");
		      console.log(`By - ${by}`);
		      console.log(`State - ${humanReadableDeedState(contractState)}`);
		      console.log(`${moment(humanReadableUnixTimestamp(when)).fromNow()} - ${humanReadableUnixTimestamp(when)}`)
		    });
	    
		    contract.on("SellerRefunded", async (when, event) => {
		      event.removeListener(); // Solve memory leak with this.
	    
		      const contractState = await contract.state();
		      const contractBalance = await provider.getBalance(contract.address);
	    
		      const previousBuyers = await contract.listPreviousBuyers();
		      console.log(previousBuyers);
	    
		      setDeed({
			...deed,
			state: humanReadableDeedState(contractState),
			balance: ethers.utils.formatEther(contractBalance.toString()),
			previousBuyers,
		      })
	    
		      const contractSeller = await contract.seller();
		      const contractSellerBalance = await provider.getBalance(contractSeller);
		      setSellerBalance(ethers.utils.formatEther(contractSellerBalance));
	    
		      console.log("Event - SellerRefunded");
		      console.log(`State - ${humanReadableDeedState(contractState)}`);
		      console.log(`${moment(humanReadableUnixTimestamp(when)).fromNow()} - ${humanReadableUnixTimestamp(when)}`)
		    });
	    
		    contract.on("Restarted", async (when, event) => {
		      event.removeListener();
	    
		      const contractState = await contract.state();
		      const contractBalance = await provider.getBalance(contract.address);
		      const previousBuyers = await contract.listPreviousBuyers();
	    
		      setDeed({
			...deed,
			state: humanReadableDeedState(contractState),
			balance: ethers.utils.formatEther(contractBalance.toString()),
			previousBuyers,
		      })
		      const contractSeller = await contract.seller();
		      const contractSellerBalance = await provider.getBalance(contractSeller);
		      setSellerBalance(ethers.utils.formatEther(contractSellerBalance));
	    
		      setBuyer();
		      setBuyerBalance();
	    
		      console.log("Event - Restarted");
		      console.log(`State - ${humanReadableDeedState(contractState)}`);
		      console.log(`${moment(humanReadableUnixTimestamp(when)).fromNow()} - ${humanReadableUnixTimestamp(when)}`);
		    });
	    
		    contract.on("End", async (_when, _event) => {
		      // event.removeListener() doesn't work
	    
		      setContractEnd(false);
		    });
	    
		    // Contract State
		    const contractState = await contract.state()
		    const contractBalance = await provider.getBalance(contract.address);
		    const contractPrice = await contract.price()
		    // const contractSales = await contract.totalSales();
		    const contractPreviousBuyers = await contract.listPreviousBuyers();
		    // console.log(contractPreviousBuyers);
	    
		    setDeed({
		      state: humanReadableDeedState(contractState),
		      balance: ethers.utils.formatEther(contractBalance.toString()),
		      price: ethers.utils.formatEther(contractPrice.toString()),
		      // sales: contractSales.toString(),
		      previousBuyers: contractPreviousBuyers,
		    })
	    
		    const contractSeller = await contract.seller();
		    setSeller(contractSeller);
		    const contractSellerBalance = await provider.getBalance(contractSeller);
		    setSellerBalance(ethers.utils.formatEther(contractSellerBalance));
	    
		    const contractBuyer = await contract.buyer()
		    setBuyer(contractBuyer);
		    const contractBuyerBalance = await provider.getBalance(contractBuyer);
		    setBuyerBalance(ethers.utils.formatEther(contractBuyerBalance)); // Should make this part work again.
	    
		    const signer = provider.getSigner(); // user
	    
		    const contractUser = await signer.getAddress();
		    setUser(contractUser);
		    const contractUserBalance = await provider.getBalance(contractUser);
		    setUserBalance(ethers.utils.formatEther(contractUserBalance));
	    
		    if (contractUser === contractSeller) {
		      setRole("seller");
		    } else if (contractUser === contractBuyer) {
		      setRole("buyer");
		    } else {
		      setRole("visitor");
		    }
		  } catch (error) {
		    console.log("error");
		    console.error(error);
		  }
		}
	    
		fetchData();
	      }, []);
	    
	      // Use context to save Contract and Provider and sperad these functions to each components that need them.
	    
	      async function close() {
		if (!deed.state || deed.state !== "Sale") {
		  return;
		}
	    
		if (typeof window.ethereum !== 'undefined') {
		  await requestAccount()
	    
		  const signer = provider.getSigner(); // Your current metamask account;
	    
	    
		  const forClose = new ethers.Contract(deedAddress, Deed.abi, signer);
	    
		  const transaction = await forClose.close();
		  await transaction.wait();
		}
	      }
	    
	      // Visitor
	      async function purchase() {
		if (!deed.state || deed.state !== "Sale") {
		  return;
		}
	    
		if (typeof window.ethereum !== 'undefined') {
		  await requestAccount()
	    
		  const signer = provider.getSigner(); // Your current metamask account;
		  const forPurchase = new ethers.Contract(deedAddress, Deed.abi, signer); // Should I make this all the time?
	    
		
		  const transaction = await forPurchase.confirmPurchase({ value: ethers.utils.parseEther("2.0") });
		  await transaction.wait();
		}
	      }
	    
	      async function receive() {
		if (!deed.state || deed.state !== "Locked") {
		  return;
		}
	    
		if (typeof window.ethereum !== 'undefined') {
		  await requestAccount()
	    
		  const signer = provider.getSigner(); // Your current metamask account;
		  const contract = new ethers.Contract(deedAddress, Deed.abi, signer);
	    
		
		  const transaction = await contract.confirmReceived();
		  await transaction.wait();
	    
		}
	      }
	    
	      async function refundBuyer() {
		if (!deed.state || deed.state !== "Locked") return
	    
		if (typeof window.ethereum !== 'undefined') {
		  await requestAccount()
	    
		  const signer = provider.getSigner(); // Your current metamask account;
	    
		  const forRefund = new ethers.Contract(deedAddress, Deed.abi, signer);
		  const transaction = await forRefund.refundBuyer();
		  await transaction.wait();
	    
		}
	      }
	    
	      async function refundSeller() {
		if (!deed.state || deed.state !== "Release") return
	    
		if (typeof window.ethereum !== 'undefined') {
		  await requestAccount()
	    
		  const signer = provider.getSigner(); // Your current metamask account;
	    
		  const forRefund = new ethers.Contract(deedAddress, Deed.abi, signer);
		  const transaction = await forRefund.refundSeller();
		  await transaction.wait();
	    
		}
	      }
	    
	      async function restart() {
		if (!deed.state) return

		if (typeof window.ethereum !== 'undefined') {
		  await requestAccount()
	    
		  const signer = provider.getSigner(); // Your current metamask account;
	    
		  const forRestart = new ethers.Contract(deedAddress, Deed.abi, signer);
		  const transaction = await forRestart.restartContract({ value: ethers.utils.parseEther("2.0") });
		  await transaction.wait();
	    
		}
	      }
	    
	      async function end() {
		if (!deed.state) return
		
	    
		if (typeof window.ethereum !== 'undefined') {
		  await requestAccount()
	    
		  const signer = provider.getSigner(); // Your current metamask account;
	    
		  const forEnd = new ethers.Contract(deedAddress, Deed.abi, signer);
		  const transaction = await forEnd.end();
		  await transaction.wait();
		}
	      }
		
	    
	      // End event
	      if (!contractEnd) {
		return null;
	      }
	    
	      if (!deed.state) {
		return null;
	      }
	    
	     
	      let balance;
	      if (role === "seller") {
		balance = sellerBalance
	      } else if (role === "buyer") {
		balance = buyerBalance;
	      } else {
		balance = userBalance;
	      }

	return (
		<div>
		<Sticky >
			<Balance
			balance={balance}
			// setAccountAddress={setAccountAddress} 
			/>
		</Sticky>
		<div style={{
			// borderTop: "1px solid black",
			margin: "0 auto",
			display: "flex",
			flexFlow: "column",
			alignItems: "center",

			background: "#efefef",
			minHeight: "100vh",
		}}>
			<ContractDetails
			address={contract.address}
			sales={deed.previousBuyers.length}
			deedState={deed.state}
			price={deed.price}
			balance={deed.balance}
			/>

			<br />

			{deed.previousBuyers.length > 0 && <div style={{
			

			width: "28rem",
			marginBottom: "1.5rem",

			border: "1px solid black",
			borderRadius: "0.5rem",
			padding: "0.5rem 1rem 1rem 1rem",

			background: "white",
			}} ><PreviousBuyers previousBuyers={deed.previousBuyers} /></div>}

			{role && <div style={{

			width: "28rem",
			marginBottom: "1.5rem",

			border: "1px solid black",
			borderRadius: "0.5rem",
			padding: "0.5rem 1rem 1rem 1rem",

			background: "white",
			}} >
			{role === "seller" && <Seller
			address={seller}
			buyer={buyer}
			// balance={sellerBalance}

			deedState={deed.state}
			close={close}

			refundBuyer={refundBuyer}
			refundSeller={refundSeller}

			restart={restart}
			end={end}
			/>}

			{role === "visitor" && <Visitor
			address={user}
			seller={seller}
			// balance={userBalance}

			deedState={deed.state}

			purchase={purchase}
			/>}

			{/* Visitor to buyer with event listener and set state */}

			{role === "buyer" && <Buyer
			address={buyer}
			seller={seller}
			// balance={buyerBalance}

			deedState={deed.state}

			receive={receive}
			/>}
			</div>}
		  </div>
		</div>
		);
	
}
	      

export default Dapp;
