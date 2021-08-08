const { expect } = require('chai');



const humanReadableUnixTimeStamp = (timeStampInt) => {
	return new Date(timeStampInt * 1000);
}

describe("Deed events and state", function () {
	let Deed, deed, owner;
	let closedEvent;

	beforeEach(async () => {
		Deed = await ethers.getContractFactory("Deed");
		deed = await Deed.deploy({ value: ethers.utils.parseEther("2.0") });
		await deed.deployed();
		 [_, owner] = await ethers.getSigners();

		closedEvent = new Promise((res, rej) => {
			deed.on('Closed', (when, event) => {
			  event.removeListener();
		  
			  res({
			    when,
			  });
			});
		  
			setTimeout(() => {
			  rej(new Error('timeout'));
			}, 40000);
	        });
        });

	it('should set contract state to closed', async () => {
		expect (await deed.owner()).to.equal(owner.address);   
		expect(await deed.totalSales()).to.equal(0);
		expect(await deed.this.state()).to.equal(0);
		await deed.close();
		let event = await closedEvent;
		console.log('Closed'); 
		console.log(humanReadableUnixTimeStamp(event.when.toString()));
		expect(await deed.state()).to.equal(3); //sold
	});
})