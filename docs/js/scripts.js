const COUNTER=document.querySelector("#counter"),LINE_CONTAINER=document.querySelector("#lineContainer"),LINE=document.querySelector("#line"),clockContainer=document.querySelector("#clock_container"),timersContainer=document.querySelector("#timers_container");let OPTIONS={};updateOptions(),updateLayout(),updateClockDisplay();const CLOCK=document.querySelector("#clock");let CLOCK_INTERVAL=setInterval(showClockTime,1e3),TIMER_INTERVALS={},storedTimers=localStorage.getItem("timers")?JSON.parse(localStorage.getItem("timers")):null;function localTimers(e){let t;return"get"===e&&(t=void 0!==localStorage.getItem("timers")?JSON.parse(localStorage.getItem("timers")):{message:"no timers found"}),"set"!==e&&"save"!==e||(localStorage.setItem("timers",JSON.stringify(TIMER_INTERVALS)),t={message:"complete"}),"clear"===e&&(localStorage.removeItem("timers"),t={message:"timers removed"}),t}function updateOptions(){let e=void 0!==localStorage.getItem("timer_options")?JSON.parse(localStorage.getItem("timer_options")):null;const t={show_seconds:document.querySelector("[name='show_seconds']").checked,seconds_display:document.querySelector("[name='seconds_display']").value,hr24:document.querySelector("[name='hr24']").checked,clock_right:document.querySelector("[name='clock_right']").checked};OPTIONS=void 0===OPTIONS.show_seconds&&null!==e?e:t,localStorage.setItem("timer_options",JSON.stringify(OPTIONS)),console.log("OPTIONS",OPTIONS),document.querySelector("[name='seconds_display']").value=OPTIONS.seconds_display,OPTIONS.show_seconds&&document.querySelector("[name='show_seconds']").setAttribute("checked",!0),OPTIONS.hr24&&document.querySelector("[name='hr24']").setAttribute("checked",!0),OPTIONS.clock_right&&document.querySelector("[name='clock_right']").setAttribute("checked",!0)}function updateLayout(){OPTIONS.clock_right?(clockContainer.classList.add("col-start-2"),timersContainer.classList.add("col-start-1")):(clockContainer.classList.remove("col-start-2"),timersContainer.classList.remove("col-start-1"))}function updateClockDisplay(){OPTIONS.show_seconds&&document.querySelector("#seconds_display").classList.remove("hidden"),OPTIONS.show_seconds&&"dots"===OPTIONS.seconds_display?(COUNTER.classList.remove("hidden"),LINE.style.width=0,LINE_CONTAINER.classList.add("hidden")):COUNTER.classList.add("hidden"),OPTIONS.show_seconds&&"line"===OPTIONS.seconds_display?(COUNTER.classList.add("hidden"),LINE_CONTAINER.classList.remove("hidden")):(LINE.style.width=0,LINE_CONTAINER.classList.add("hidden"))}function updateTitle(e,t){TIMER_INTERVALS[e].title=t,localTimers("save")}function formatDateTime(e,t=!1,s=!1,o=!1){let l,a,c,n,r,i,u="",m="";return void 0!==e.h&&(l=e.h>=10?e.h:`0${e.h}`,a=e.m>=10?e.m:`0${e.m}`,c=e.s>=10?e.s:`0${e.s}`,u=`${l}:${a}:${c}`),s&&(d=new Date,e.y=d.getFullYear(),e.n=d.getMonth()+1,e.d=d.getDate()),void 0!==e.y&&(n=e.y,r=e.n>=10?e.n:`0${e.n}`,i=e.d>=10?e.d:`0${e.d}`,m=`${n}-${r}-${i}`),o?t?`${m} ${u}`:void 0!==e.h?u:void 0!==e.y?m:JSON.stringify(e):t?{hour:l,minute:a,second:c,year:n,month:r,date:i}:void 0!==e.h?{hour:l,minute:a,second:c}:void 0!==e.y?{year:n,month:r,date:i}:e}function showClockTime(){let e=new Date,t=e.getHours(),s=e.getMinutes(),o=e.getSeconds(),l=e.getSeconds(),a=t>12?"PM":"AM";t>12&&!OPTIONS.hr24&&(t-=12),t=t<10?"0"+t:t,s=s<10?"0"+s:s,o=o<10?"0"+o:o;let c=`${t}:${s}`;if(OPTIONS.show_seconds&&"numbers"===OPTIONS.seconds_display&&(c+=`:${o}`),OPTIONS.hr24||(c+=` ${a}`),OPTIONS.show_seconds&&"dots"===OPTIONS.seconds_display){let e='<i class="fas fa-circle fa-xs mx-0.5"></i>';COUNTER.innerHTML=Array(l<59?l+1:1).fill(e).join("")}if(OPTIONS.show_seconds&&"line"===OPTIONS.seconds_display){let e=l/59*100;LINE.style.width=`${e}%`}CLOCK.innerText=c}function showTimerTime(e,t){let s=TIMER_INTERVALS[t];s.s<59?s.s++:s.s>=59&&s.m<59?(s.s=0,s.m++):s.s>=59&&s.m>=59&&(s.s=0,s.m=0,s.h++);let o=formatDateTime(s);TIMER_INTERVALS[t]={...TIMER_INTERVALS[t],...s},localTimers("save"),e.innerText=`${o.hour}:${o.minute}:${o.second}`}document.querySelectorAll(".opt-input").forEach((e=>{e.addEventListener("click",(function(){updateOptions(),console.log("OPTIONS",OPTIONS),"clock_right"===e.name?updateLayout(e.value):(updateClockDisplay(),clearInterval(CLOCK_INTERVAL),CLOCK_INTERVAL=setInterval(showClockTime,1e3))}))})),document.querySelectorAll(".timer").forEach((e=>{const t=e.querySelector(".play-pause > i"),s=e.querySelector("form"),o=localTimers("get");let l=e.querySelector(".clear-time"),a=parseInt(e.dataset.idx),c=e.querySelector(".time"),n=e.querySelector("[name='title']").value;TIMER_INTERVALS[a]={title:n,h:0,m:0,s:0,interval:null},null!==o&&!o.message&&o[a]?(TIMER_INTERVALS[a]={...o[a],interval:null},n=TIMER_INTERVALS[a].title):localTimers("save"),e.querySelector("[name='title']").value!==n&&(e.querySelector("[name='title']").value=n),(TIMER_INTERVALS[a].h>0||TIMER_INTERVALS[a].m>0||TIMER_INTERVALS[a].s>0)&&l.classList.remove("disabled");const r=formatDateTime(TIMER_INTERVALS[a],!1,!1,!0);c.innerText=r,t.addEventListener("click",(function(){"true"===t.dataset.playing?(t.dataset.playing="false",t.classList.add("fa-play-circle"),t.classList.remove("fa-pause-circle"),clearInterval(TIMER_INTERVALS[a].interval)):(t.dataset.playing="true",t.classList.remove("fa-play-circle"),t.classList.add("fa-pause-circle"),TIMER_INTERVALS[a].interval=setInterval((function(){showTimerTime(c,a,TIMER_INTERVALS[a])}),1e3),l.classList.remove("disabled"))})),l.addEventListener("click",(function(){l.classList.contains("disabled")||(clearInterval(TIMER_INTERVALS[a].interval),TIMER_INTERVALS[a]={...TIMER_INTERVALS[a],h:0,m:0,s:0,interval:null},c.innerText=formatDateTime(TIMER_INTERVALS[a],!1,!1,!0),localTimers("save"),l.classList.add("disabled"))})),s.addEventListener("submit",(function(e){e.preventDefault(),s.querySelector("input").blur(),updateTitle(a,e.target[0].value)})),s.querySelector("input").addEventListener("blur",(function(e){updateTitle(a,e.target.value)}))}));