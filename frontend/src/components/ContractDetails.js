import React from "react";

const ContractDetails = ({
    address,
    sales,
    balance,
    price,
    deedState,
    // lastEdited,
}) => {
    return (
        <div style={{
            marginTop: "1.5rem",
            // marginLeft: "1rem",
            
            width: "28rem",
            maxHeight: "28rem",

            border: "1px solid black",
            borderRadius: "0.5rem",
            padding: "0.5rem 1rem 1rem 1rem",

            background: "white",
        }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexFlow: "column",
            }}>
                {/* <h1>art DeedContract</h1> */}
                <h1>Buy the art with {price} ETH</h1>
            </div>
            
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <img
                    style={{
                        maxWidth: "12rem",
                        // maxHeight: "10rem",
                    }}
                    src="./art.jpg" 
                    alt = "art"
                />
            </div>
            
            <p>The contract:</p>
            <p><b>{address}</b></p>
            <p>Total sales: <b>{sales}</b></p>
            {/* {lastEdited && <p>Last edited: {lastEdited}</p>} */}
            <p>The current state of this deed contract is <b>{deedState}</b>.</p>
            <p>The current balance of this deed contract is <b>{balance} ETH</b>.</p>

            {/* <p>The price for this contract is <b>{price} ETH.</b></p> */}
        </div>
    );
}

export default ContractDetails;
