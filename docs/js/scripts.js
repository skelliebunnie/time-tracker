const clockContainer=document.querySelector("#clock_container"),timersContainer=document.querySelector("#timers_container"),CLOCK=document.querySelector("#clock"),DOTS_CONTAINER=document.querySelector("#dotsContainer"),LINE_CONTAINER=document.querySelector("#lineContainer"),LINE=document.querySelector("#line"),CIRCLE_CONTAINER=document.querySelector("#circleContainer"),CIRCLE=document.querySelector("#circleContainer .circle"),FILL_CIRCLE=document.querySelector("#circleContainer .fill-circle");let clockSize={width:clockContainer.clientWidth,height:clockContainer.clientHeight,circle:clockContainer.clientWidth-40,radius:(clockContainer.clientWidth-40)/2},OPTIONS={},CLOCK_INTERVAL=setInterval(showClockTime,1e3),TIMER_INTERVALS={},storedTimers=localStorage.getItem("timers")?JSON.parse(localStorage.getItem("timers")):null,TIME_ENTRIES={};function getChildren(e,t){for(var s=[];e;e=e.nextSibling)1==e.nodeType&&e!=t&&s.push(e);return s}function getSiblings(e){return getChildren(e.parentNode.firstChild,e)}function localTimers(e){let t;return"get"===e&&(t=void 0!==localStorage.getItem("timers")?JSON.parse(localStorage.getItem("timers")):{message:"no timers found"}),"set"!==e&&"save"!==e||(localStorage.setItem("timers",JSON.stringify(TIMER_INTERVALS)),t={message:"saved timers"}),"clear"===e&&(localStorage.removeItem("timers"),t={message:"timers removed"}),t}function updateTitle(e,t){TIMER_INTERVALS[e].title=t,localTimers("save")}function showTimerTime(e,t,s=!1){if(s){let s=dayjs(TIMER_INTERVALS[t].start),a=dayjs().diff(s,"second",!0),l={h:Math.floor(a/3600),m:Math.floor(a/60%60),s:Math.floor(a%60)};TIMER_INTERVALS[t]={...TIMER_INTERVALS[t],secondsElapsed:Math.floor(a)},localTimers("save"),e.innerText=`${padTime(l.h)}:${padTime(l.m)}:${padTime(l.s)}`}else if(TIMER_INTERVALS[t].secondsElapsed>0){const s=TIMER_INTERVALS[t].secondsElapsed;let a={h:Math.floor(s/3600),m:Math.floor(s/60%60),s:Math.floor(s%60)};e.innerText=`${padTime(a.h)}:${padTime(a.m)}:${padTime(a.s)}`}else e.innerText="00:00:00"}function padTime(e){return e<10&&(e=`0${e}`),e}function updateClockSize(){clockSize={width:clockContainer.clientWidth,height:clockContainer.clientWidth,circle:clockContainer.clientWidth-40,radius:clockContainer.clientWidth/4-40}}function addDots(){for(;DOTS_CONTAINER.firstChild;)DOTS_CONTAINER.removeChild(DOTS_CONTAINER.firstChild);for(var e=clockSize.radius/3,t=(clockSize.width,0),s=2*Math.PI/59,a=1;a<=59;a++){let r=document.createElement("i");r.classList.add("dot",`dot-${a}`,"far","fa-circle","text-xxs","md:text-xs","m-0.5","text-accent-500","absolute"),r.setAttribute("data-idx",a);var l=window.innerWidth<640?8:12,i=l,c=Math.round(2*e*Math.cos(t)-l/2),o=Math.round(2*e*Math.sin(t)-i/2);r.style.top=`${o}px`,r.style.left=`${c}px`,t+=s,DOTS_CONTAINER.appendChild(r)}}function setCircle(){var e=clockSize.circle,t=clockSize.width,s=clockSize.height,a=clockSize.radius/1.5,l=.05*e;CIRCLE_CONTAINER.style.width=`${t}px`,CIRCLE_CONTAINER.style.height=`${s}px`,document.querySelectorAll(".circle").forEach((e=>{e.setAttribute("cy",s/2),e.setAttribute("cx",t/2),e.setAttribute("r",a),e.style.strokeWidth=l})),FILL_CIRCLE.style.strokeDasharray=3*e,FILL_CIRCLE.style.strokeDashoffset=3*e,updateCircle()}function updateCircle(e=null){if(null===e){e=(new Date).getSeconds()}var t=3*clockSize.circle;FILL_CIRCLE.style.strokeDashoffset=t-t*(e/85)}function updateOptions(){let e=void 0!==localStorage.getItem("timer_options")?JSON.parse(localStorage.getItem("timer_options")):null;const t={show_seconds:document.querySelector("[name='show_seconds']").checked,sec_numbers:document.querySelector("[name='sec_numbers']").checked,seconds_display:document.querySelector("[name='seconds_display']").value,hr24:document.querySelector("[name='hr24']").checked,clock_right:document.querySelector("[name='clock_right']").checked};OPTIONS=void 0===OPTIONS.show_seconds&&null!==e?e:t,localStorage.setItem("timer_options",JSON.stringify(OPTIONS)),Object.keys(OPTIONS).forEach((e=>{"seconds_display"!==e?OPTIONS[e]?document.querySelector(`[name="${e}"]`).setAttribute("checked",!0):document.querySelector(`[name="${e}"]`).removeAttribute("checked"):document.querySelector("[name='seconds_display']").value=OPTIONS.seconds_display})),updateLayout(),updateClockDisplay()}function updateClockDisplay(){if(document.querySelector("#seconds_display").classList.add("hidden"),DOTS_CONTAINER.classList.add("hidden"),LINE_CONTAINER.classList.add("hidden"),CIRCLE_CONTAINER.classList.add("hidden"),OPTIONS.show_seconds){document.querySelector("#seconds_display").classList.remove("hidden");const e=OPTIONS.seconds_display;"dots"===e?(DOTS_CONTAINER.classList.remove("hidden"),LINE_CONTAINER.classList.add("hidden"),CIRCLE_CONTAINER.classList.add("hidden")):"line"===e?(LINE_CONTAINER.classList.remove("hidden"),DOTS_CONTAINER.classList.add("hidden"),CIRCLE_CONTAINER.classList.add("hidden")):"circle"===e?(LINE_CONTAINER.classList.add("hidden"),DOTS_CONTAINER.classList.add("hidden"),CIRCLE_CONTAINER.classList.remove("hidden"),setCircle()):(DOTS_CONTAINER.classList.add("hidden"),LINE_CONTAINER.classList.add("hidden"),CIRCLE_CONTAINER.classList.add("hidden"))}}function showClockTime(){let e=new Date,t=e.getHours(),a=e.getMinutes(),l=e.getSeconds(),i=t>12?"PM":"AM";t>12&&!OPTIONS.hr24&&(t-=12),s=l<10?"0"+l:l;let c=`${t<10?"0"+t:t}:${a<10?"0"+a:a}`;if(OPTIONS.show_seconds&&OPTIONS.sec_numbers&&(c+=`:${s}`),OPTIONS.hr24||(c+=` ${i}`),OPTIONS.show_seconds&&"dots"===OPTIONS.seconds_display&&DOTS_CONTAINER.querySelectorAll(".dot").forEach((e=>{0===l?(e.classList.add("far"),e.classList.remove("fas")):parseInt(e.dataset.idx)<=l&&(e.classList.remove("far"),e.classList.add("fas"))})),OPTIONS.show_seconds&&"line"===OPTIONS.seconds_display){let e=l/59*100;LINE.style.width=`${e}%`}OPTIONS.show_seconds&&"circle"===OPTIONS.seconds_display&&updateCircle(l),CLOCK.innerText=c,clockSize.width!==clockContainer.clientWidth&&updateSecondsDisplay()}function updateSecondsDisplay(){updateClockSize(),"dots"===OPTIONS.seconds_display?addDots():"circle"===OPTIONS.seconds_display&&setCircle()}function updateLayout(){OPTIONS.clock_right?(clockContainer.classList.remove("place-top","md:place-left"),clockContainer.classList.add("place-bottom","md:place-right"),timersContainer.classList.remove("place-bottom","md:place-right"),timersContainer.classList.add("place-top","md:place-left")):(clockContainer.classList.remove("place-bottom","md:place-right"),clockContainer.classList.add("place-top","md:place-left"),timersContainer.classList.remove("place-top","md:place-left"),timersContainer.classList.add("place-bottom","md:place-right"))}document.querySelectorAll(".timer").forEach((e=>{const t=e.querySelector(".play-pause > i"),s=localTimers("get"),a=parseInt(e.dataset.idx);let l=e.querySelector(".time"),i=e.querySelector("[name='title']").value;TIMER_INTERVALS[a]={title:i,interval:null,start:dayjs(),secondsElapsed:0},TIME_ENTRIES[a]={title:i,date:dayjs().format("YYYY-MM-DD"),secondsElapsed:0},null!==s&&!s.message&&s[a]&&s[a].secondsElapsed&&(TIMER_INTERVALS[a]={...s[a],interval:null},i=TIMER_INTERVALS[a].title),localTimers("save"),showTimerTime(l,a),t.addEventListener("click",(function(){if("true"===t.dataset.playing)t.dataset.playing="false",t.classList.add("fa-play-circle"),t.classList.remove("fa-pause-circle"),clearInterval(TIMER_INTERVALS[a].interval);else{t.dataset.playing="true",t.classList.remove("fa-play-circle"),t.classList.add("fa-pause-circle"),TIMER_INTERVALS[a].start=dayjs().subtract(TIMER_INTERVALS[a].secondsElapsed,"seconds"),TIMER_INTERVALS[a].interval=setInterval((function(){showTimerTime(l,a,!0)}),500);let s=e.querySelector(".clear-time"),i=e.querySelector(".save-time");s.classList.remove("disabled"),i.classList.remove("disabled")}}))})),updateOptions(),addDots(),setCircle(),updateClockDisplay(),document.querySelectorAll("input.opt-input").forEach((e=>{e.addEventListener("click",(function(){updateOptions(),"clock_right"===e.name?updateLayout(e.value):(updateClockDisplay(),clearInterval(CLOCK_INTERVAL),CLOCK_INTERVAL=setInterval(showClockTime,1e3))}))})),document.querySelector("#seconds_display").addEventListener("change",(e=>{updateOptions()})),document.querySelectorAll(".timer").forEach((e=>{const t=e.querySelector("form"),s=parseInt(e.dataset.idx),a=localTimers("get"),l=e.querySelector(".play-pause > i");let i=e.querySelector(".clear-time"),c=e.querySelector(".save-time"),o=e.querySelector("[name='title']").value,r=e.querySelector(".time");null!==a&&!a.message&&a[s]&&(TIMER_INTERVALS[s]={...a[s],interval:null},o=TIMER_INTERVALS[s].title),e.querySelector("[name='title']").value!==o&&(e.querySelector("[name='title']").value=o),TIMER_INTERVALS[s].secondsElapsed>0&&(i.classList.remove("disabled"),c.classList.remove("disabled")),i.addEventListener("click",(function(){i.classList.contains("disabled")||(l.dataset.playing=!1,l.classList.remove("fa-pause-circle"),l.classList.add("fa-play-circle"),clearInterval(TIMER_INTERVALS[s].interval),TIMER_INTERVALS[s]={...TIMER_INTERVALS[s],interval:null,end:dayjs(),secondsElapsed:0},r.innerText="00:00:00",localTimers("save"),i.classList.add("disabled"),c.classList.add("disabled"))})),c.addEventListener("click",(function(){c.classList.contains("disabled")||(l.dataset.playing=!1,l.classList.remove("fa-pause-circle"),l.classList.add("fa-play-circle"),clearInterval(TIMER_INTERVALS[s].interval),TIMER_INTERVALS[s]={...TIMER_INTERVALS[s],end:dayjs(),interval:null},TIME_ENTRIES[s]={...TIME_ENTRIES[s],end:dayjs(),secondsElapsed:TIMER_INTERVALS[s].secondsElapsed},localTimers("save"),localTimeEntries("save"))})),t.addEventListener("submit",(function(e){e.preventDefault(),t.querySelector("input").blur(),updateTitle(s,e.target[0].value)})),t.querySelector("input").addEventListener("blur",(function(e){updateTitle(s,e.target.value)}))})),updateLayout();const tabsNav=document.querySelector("#tabs"),inactiveColor=tabsNav.dataset.inactiveColor;function localTimeEntries(e){let t;return"get"===e&&(t=void 0!==localStorage.getItem("time_entries")?JSON.parse(localStorage.getItem("time_entries")):{message:"no time_entries found"}),"set"!==e&&"save"!==e||(localStorage.setItem("time_entries",JSON.stringify(TIME_ENTRIES)),t={message:"saved time entries"}),"clear"===e&&(localStorage.removeItem("time_entries"),t={message:"timers removed"}),t}document.querySelectorAll(".tab").forEach((e=>{e.addEventListener("click",(function(){const t=e.dataset.content,s=e.dataset.color;e.classList.add("active",s),e.classList.remove(inactiveColor),getSiblings(e).forEach((e=>{e.classList.remove("active",s),e.classList.add(inactiveColor)})),document.querySelectorAll(".tab-content").forEach((e=>{e.getAttribute("id")===t||e.classList.contains("hidden")||e.classList.add("hidden"),e.getAttribute("id")===t&&e.classList.contains("hidden")&&e.classList.remove("hidden")}))}))}));