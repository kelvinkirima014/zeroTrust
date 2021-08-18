import React from "react";
import Button from '@material-ui/core/Button';

const Seller = ({
    address,
    // balance,
    buyer,

    deedState,

    close,

    refundBuyer,
    refundSeller,
    
    restart,
    end,
}) => {
    const fullWidth = {
        width: "100%"
    };;

    // alert(buyer);

    return (
        <>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <h1>You are the seller</h1>
            </div>

            <p>Your wallet is <b>{address}.</b></p>
            {buyer && buyer !== "0x0000000000000000000000000000000000000000" && <p>The buyer is <b>{buyer}.</b></p>}
            {/* <p>Your balance is <b>{balance} ETH.</b></p> */}

            {deedState === "Sale" && <p>"You need to have a buyer to sell this first."</p>}

            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexFlow: "column",
            }}>
                {deedState === "Sale" && <Button style={fullWidth} onClick={close} color="secondary" variant="contained">I want to close this ad</Button>}
                
                {deedState === "Locked" && <p>"Send the art to the client and wait for confirmation of your client before you receive the money or refund the buyer"</p>}
                {deedState === "Locked" && <Button style={fullWidth} onClick={refundBuyer} color="secondary" variant="contained">I want to refund the buyer.</Button>}
                
                {deedState === "Release" && <Button style={fullWidth} onClick={refundSeller} color="primary" variant="contained">I want to receive money from what I sold </Button>}
                
                {(deedState === "Closed" || deedState === "Complete") && <Button style={fullWidth} onClick={restart} color="primary" variant="contained">I want to sell the art again</Button>}
                {(deedState === "Closed" || deedState === "Complete") && <Button style={{
                    marginTop: "1rem",
                    ...fullWidth,
                }} onClick={end} color="secondary" variant="contained">I want to destroy this contract</Button>}
            </div>
        </>
    )
};

export default Seller;