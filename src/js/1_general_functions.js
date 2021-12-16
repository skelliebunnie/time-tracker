/**
 * GENERAL FUNCTIONS
 */

function getChildren(n, skipMe){
    var r = [];
    for ( ; n; n = n.nextSibling ) 
       if ( n.nodeType == 1 && n != skipMe)
          r.push( n );        
    return r;
};

function getSiblings(n) {
    return getChildren(n.parentNode.firstChild, n);
}

function getTimeObject(seconds) {
	return {
		h: Math.floor(seconds / 3600),
		m: Math.floor(seconds / 60 % 60),
		s: Math.floor(seconds % 60)
	};
}

function getTimer(idx) {
	let res = null;
	res = document.querySelectorAll(".timer").forEach(timer => {
		if(timer.dataset["idx"] === idx) return timer;
	});

	return res;
}