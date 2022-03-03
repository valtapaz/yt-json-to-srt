//1. Get "events" object
//2. Object name ++
//3. tStartMs: (/60 up to whole #, maybe 2ce if counting hours); call its own function, esp. to benefit step 4?
//4. dDurationMs: tStartMs += dDurationMs
//5. (The easy part) the line itself is around segs[0].utf8
function convert(value) {
	// Establish base variables
	let subJson;
	let success = true;
	// Define subJson and test whether the submitted value is valid JSON
	try {
		subJson = JSON.parse(value);
	} catch (e) {
		subJson = null;
		success = false;
		console.log(`The string appears not to be valid JSON. Full error text: "${e}"`);
	}
	// If it is, and the value isn't null and has an events child node, proceed
	if (subJson && subJson.events && success) {
		const events = subJson.events;
		let srtContent = '';
		for (let i in events) {
			// For each event, gather start time and duration, then combine both for end time
			let tStartMs    = events[i].tStartMs;
			let dDurationMs = events[i].dDurationMs;
			let tEndMs      = events[i].tStartMs + events[i].dDurationMs;
			
			// Gather line number & translate start/end millisecond numbers to SRT format
			let eventNum = Number(i) + 1;
			let srtStart = srtify(tStartMs);
			let srtEnd   = srtify(tEndMs);

			// Combine line number and SRT times into a full line & add to srtContent object
			let timeframe = `${srtStart} --\> ${srtEnd}`;
			let line = `${eventNum}\n${timeframe}\n${events[i].segs[0].utf8}\n\n`

			//For fun, the entire content above in one line: let line = `${Number(i)+1}\n${srtIfy(events[i].tStartMs)} --\> ${srtIfy(events[i].tEndMs)}\n${events[i].segs[0].utf8}\n\n`
			srtContent += line;
			
		}
		// Log finished srtContent
		console.log(srtContent);
	} else if (success && !subJson.events) {
		// If structure is JSON but doesn't contain events child node, say so
		console.log('Invalid JSON subtitle: "events" child node not detected.');
	}

	// Subtract hours, minutes, and seconds from the millisecond number, adding 1-2 "0"s as needed for SRT format accuracy
	function srtify(tMs) {
		let hours   = String(Math.floor(tMs / 3600000));
		if (hours.length === 1) {hours = '0' + hours;}
		tMs -= (hours*3600000);

		let minutes = String(Math.floor(tMs / 60000));
		if (minutes.length === 1) {minutes = '0' + minutes;}
		tMs -= (minutes*60000);

		let seconds = String(Math.floor(tMs / 1000));
		if (seconds.length === 1) {seconds = '0' + seconds;}
		tMs -= (seconds*1000);

		let milliseconds = String(tMs);
		while (milliseconds.length < 3) {milliseconds = '0' + milliseconds}
		let full = `${hours}:${minutes}:${seconds},${milliseconds}`;
		return full;
	}
}