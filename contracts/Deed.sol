//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

contract Deed {
    uint public price;
    address payable public seller;
    address payable public buyer;

    address[] previousBuyers;

    enum State {
        Sale,  
        Locked, 
        Release, 
        Closed, 
        Complete
    }
    // The state variable has a default value of the first member, `State.sale`
    State public state;
    modifier condition(bool _condition){
        //pre-condition has to be met before even starting function execution
        require(_condition);
        _;
    }
    modifier onlyBuyer(){
        require(msg.sender == buyer,
        "Only buyer can call this."
        );
        _;
    }
    modifier onlySeller(){
        require(msg.sender == seller,
        "Only seller can call this."
        );
        _;
    }
    //prevent the seller from becoming the buyer
    modifier notSeller(){
        require (
            msg.sender != seller,
            "Seller shouldn't buy"
        );
        _;
    }
    modifier inState (State _state){
        require (
            state == _state,
            "Invalid state."
        );
        _;
    }

    event Closed(
        uint256 when
    );

    event ConfirmPurchase(
        uint256 when,
        address by
    );

    event ConfirmReceived(
        uint256 when,
        address by
    );

    event SellerRefundBuyer(
        uint256 when
    );

    event SellerRefunded(
        uint256 when
    );

    event Restarted(
        uint256 when
    );

    event End (
        uint256 when
    );

    constructor() payable {
        seller = payable(msg.sender);
        price = msg.value / 2;
        require((2 * price) == msg.value, "Value has to be even.");
    }

    function close() 
    public
    onlySeller
    inState(State.Sale)
    {
        state = State.Closed;
        seller.transfer(address(this).balance);

        emit Closed ( 
            block.timestamp
        );
    }

    function confirmPurchase()
        public
        notSeller
        inState(State.Sale)
        condition(msg.value == (2 * price))
        payable
    {
        buyer = payable (msg.sender);
        state = State.Locked;

        emit ConfirmPurchase(
            block.timestamp,
            buyer
        );
    }
    function confirmReceived()
        public
        onlyBuyer
        inState(State.Locked)
    {
        state = State.Release;
        buyer.transfer(price);
        emit ConfirmReceived(
            block.timestamp,
            buyer
        );
    }

    function refundBuyer()
        public
        onlySeller
        inState(State.Locked)
    {
        state = State.Sale;
        buyer = payable(0);

        emit SellerRefundBuyer(
            block.timestamp
        );
    }

    function refundSeller()
        public
        onlySeller
        inState(State.Release)
    {
        state = State.Complete;

        seller.transfer(3 * price);

        previousBuyers.push(buyer);

        emit SellerRefunded(
            block.timestamp
        );
    }

    function restartContract()
        public
        onlySeller
        payable
    {
        if (state == State.Closed || state == State.Complete){
            require((2 * price) == msg.value, "Value has to be equal to initial amount");
            state = State.Sale;

            //Reset buyer to allow her to buy again.
            buyer = payable(0);
            emit Restarted(
                block.timestamp
            );
        }
    }

    function listPreviousBuyers() public view returns (address [] memory){
        return previousBuyers;
    }
    //total previousBuyers
    function totalSales() public view returns (uint count){
        return previousBuyers.length;
    }
    function end ()
        public
        onlySeller
    {
        if (state == State.Closed || state == State.Complete){
            emit End(
                block.timestamp
            );
            //state == State.End
            selfdestruct(seller);
        }
    }
}


