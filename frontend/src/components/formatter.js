const humanReadableUnixTimestamp = (timestampInt) => {
	return new Date(timestampInt * 1000);
    }
    
    const humanReadableDeedState = (deedState) => {
	if (deedState === 0) {
	    return "Sale";
	} else if (deedState === 1) {
	    return "Locked";
	} else if (deedState === 2) {
	    return "Release";
	} else if (deedState === 3) {
	    return "Closed";
	} else if (deedState === 4) {
	    return "Complete";
	}
	
    }
    
    export {
	humanReadableUnixTimestamp,
	humanReadableDeedState,
    }