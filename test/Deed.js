const { expect } = require('chai');



const humanReadableUnixTimestamp = (timestampInt) => {
	return new Date(timestampInt * 1000);
}
describe("Deed Events and State", function() {
	
	let Deed, deed, seller; // seller is owner
      
	let closedEvent;
	beforeEach(async () => {
		
	    
		Deed = await ethers.getContractFactory("Deed");
		deed = await Deed.deploy({ value: ethers.utils.parseEther("2.0") });  
	    
		[seller, _] = await ethers.getSigners();
	    
		
		// EVENTS
		closedEvent = new Promise((resolve, reject) => {
		  deed.on('Closed', (when, event) => {
		    event.removeListener();
	    
		    resolve({
		      when,
		    });
		  });
	    
		  setTimeout(() => {
		    reject(new Error('timeout'));
		  }, 60000)
		});
	});
	it("Should set the contract state to 'Closed'.", async function () {
		
		expect(await deed.seller()).to.equal(seller.address);
	    
		expect(await deed.totalSales()).to.equal(0); // Should be 0
		expect(await deed.state()).to.equal(0); // Sale
	    
		
		await deed.close();
	    
		let event = await closedEvent;
		console.log("Closed");
		console.log(humanReadableUnixTimestamp(event.when.toString()));
	    
		expect(await deed.state()).to.equal(3); // Closed
	      });
});