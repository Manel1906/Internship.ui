const do_gl_init_timeline = function (contentDiv, data, customOptions) {

	var defaultOption = {
		mode: 'vertical',
		verticalStartPosition: 'left',
		verticalTrigger: '15%'
	};
	
	var options = 		$.extend(true, {}, defaultOption);

	if(customOptions)	$.extend(true, options, customOptions);

	try{
		$(contentDiv).timeline(options);
	}catch(e){
		console.log(e);
	}	
}


//----------------------------------------------------------------------
const do_gl_init_timespace = function (contentDiv, data, customOptions) {

	var defaultOption = {
//			timeType: 'date',
//			useTimeSuffix: false,
//			startTime: 500,
//			endTime: 2050,
//			markerIncrement: 50,
			
			data: data
	};
	
	var options = 		$.extend(true, {}, defaultOption);

	if(customOptions)	$.extend(true, options, customOptions);

	try{
		$(contentDiv).timespace(options);
	}catch(e){
		console.log(e);
	}	
}

//*************************
//**CUSTOMIZE OPTIONS**
//*************************
/*
//max width in pixels
maxWidth: 1000,

//max height in pixels
maxHeight: 280,

//the amount of pixels to move the Timespace on navigation
//0 to disable
navigateAmount: 200,

//The multiplier to use with navigateAmount when dragging the time table horizontally
dragXMultiplier: 1,

//The multiplier to use with navigateAmount when dragging the time table vertically
dragYMultiplier: 1,

//selected event
//0 for first event, -1 to disable
selectedEvent: 0,

//if the time table should shift when an event is selected
shiftOnEventSelect: true,

//If the window should scroll to the event display box on event selection (only applies if the time table height is greater than the window height)
scrollToDisplayBox: true,

//jQuery object to use for the event display box
customEventDisplay: null,

//or '<a href="https://www.jqueryscript.net/time-clock/">date</a>'
timeType: 'hour',

//using 12-Hour time
use12HourTime: true,

//if a suffix should be added to the displayed time (e.g. '12 AM' or '300 AD')
useTimeSuffix: true,

//receives the lowercase suffix string and returns a formatted string
timeSuffixFunction: s => ' ' + s[0].toUpperCase() + s[1].toUpperCase(),

//start/end time
startTime: 0,
endTime: 23,

//the amount of time markers to use
//0 to calculate from startTime, endTime, and markerIncrement
markerAmount: 0,

//the amount of time between each marker
markerIncrement: 1,

//width of marker
markerWidth: 100,

controlText: {
	navLeft: 'Move Left',
	navRight: 'Move Right',
	drag: 'Drag',
	eventLeft: 'Previous Event',
	eventRight: 'Next Event',
}
*/

//*************************
//**EXAMPLE**
//*************************
//$('#timelineClock').timespace({
//
//	// Set the time suffix function for displaying as '12 A.M.'
//	timeSuffixFunction: s => ' ' + s[0].toUpperCase() + '.' + s[1].toUpperCase() + '.',
//	selectedEvent: -1,
//	data: {
//		headings: [
//			{start: 0, end: 6, title: 'Night'},
//			{start: 6, end: 12, title: 'Morning'},
//			{start: 12, end: 18, title: 'Afternoon'},
//			{start: 18, end: 24, title: 'Evening'},
//		],
//		events: [
//			{start: 6.50, title: 'Breakfast', description: 'Eat a healthy breakfast.'},
//			{start: 8, end: 10, title: 'Walk', description: 'Go for a walk.'},
//			{start: 14, title: 'Lunch', description: 'Eat a healthy lunch.'},
//			{start: 14.75, title: 'Meeting', description: 'Meeting with Co-workers.'},
//		]
//	},
//
//});
//
//$('#timeline').timespace({
//
//	timeType: 'date',
//	useTimeSuffix: false,
//	startTime: 500,
//	endTime: 2050,
//	markerIncrement: 50,
//	data: {
//		headings: [
//			{start: 500, end: 1750, title: 'Dark Ages'},
//			{start: 1750, end: 1917, title: 'Age of Revolution'},
//			{start: 1971, title: 'Information Age'},
//		],
//		events: [
//			{start: 1440, title: 'Gutenberg\'s Printing Press', width: 200},
//			{start: 1517, end: 1648, title: 'The Reformation',
//				description: $('<p>The Reformation was a turning point in the history of the world. '
//					+ 'Martin Luther was a key player in this event as he stood up against Papal tyranny '
//					+ 'and church apostasy.</p><p>Many other reformers followed in the steps of Luther '
//					+ 'and followed the convictions of their hearts, even unto death.</p>')},
//			{start: 1773, title: 'Boston Tea Party'},
//			{start: 1775, end: 1783, title: 'American Revolution', description: 'Description:', callback: function () {
//
//				this.container.find('.jqTimespaceDisplay section').append(
//					'<p>This description was brought to you by the callback function. For information on the American Revolution, '
//					+ '<a target="_blank" href="https://en.wikipedia.org/wiki/American_Revolution">visit the Wikipedia page.</a></p>'
//				);
//
//			}},
//			{start: 1789, title: 'French Revolution'},
//			{start: 1914, end: 1918, title: 'World War I', noDetails: true},
//			{start: 1929, end: 1939, title: 'Great Depression',
//				description: 'A period of global economic downturn. Many experienced unemployment and the basest poverty.'
//			},
//		]
//	},
//
//}, function () {
//
//	// Edit the navigation amount
//	this.navigateAmount = 500;
//
//});