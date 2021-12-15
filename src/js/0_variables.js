const clockContainer = document.querySelector("#clock_container");
const tabbedContentContainer = document.querySelector("#tabbedContent");
const timersContainer = document.querySelector("#timers_container");

/** CLOCK **/
const CLOCK = document.querySelector("#clock");

const DOTS_CONTAINER = document.querySelector("#dotsContainer");

const LINE_CONTAINER = document.querySelector("#lineContainer");
const LINE = document.querySelector("#line");

const CIRCLE_CONTAINER = document.querySelector("#circleContainer");
const CIRCLE = document.querySelector("#circleContainer .circle");
const FILL_CIRCLE = document.querySelector("#circleContainer .fill-circle");

let clockSize = { 
	width: clockContainer.clientWidth, 
	height: clockContainer.clientHeight,
	circle: clockContainer.clientWidth - 40,
	radius: (clockContainer.clientWidth - 40) / 2
};

let OPTIONS = {};

let CLOCK_INTERVAL = setInterval(showClockTime, 1000);

/** TIMERS **/
let TIMER_INTERVALS = {};
let storedTimers = localStorage.getItem('sktt_timers') ? JSON.parse(localStorage.getItem('sktt_timers')) : null;

/** TIME ENTRIES **/
let TIME_ENTRIES = {};
let storedTimeEntries = localStorage.getItem('sktt_time_entries') ? JSON.parse(localStorage.getItem('sktt_time_entries')) : null;