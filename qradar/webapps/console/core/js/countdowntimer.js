var iCounter=0;
var tCounter=null;
var iCounterInit=0;
var oCounter=null;
var oOnManualRefresh=null;
var oOnAutoRefresh=null;
var oOnPause=null;
var oOnResume=null;
var btnARefresh=null;
var btnRefresh=null;
var btnPause=null;
var isCountDown=true;
var tBlinker=null;
var borderColor="green";
var counterStopped=true;
var bCounterPaused=false;
var lofasz = 0;

function getCounterValue()
{return parseInt(oCounter.getAttribute("countervalue"));}
function paddZero(s)
{if((s+"").length==1)
return"0"+s;return s;}

function setCounterValue(counterValue)
{if(oCounter)
{oCounter.setAttribute("countervalue",counterValue);
var mins=parseInt(counterValue/60);
var secs=(counterValue-(mins*60));
var lblMessage=i18n("qradar.dashboard.messages.timeSinceRefresh");
if(isCountDown)
lblMessage=i18n("qradar.dashboard.messages.timeUntilRefresh");
if(bCounterPaused)
lblMessage=i18n("qradar.dashboard.messages.refreshPaused");
var formattedCounterValue="";
if(mins>59)
{var hrs=parseInt(mins/60);mins-=(hrs*60);
formattedCounterValue=lblMessage+" "+paddZero(hrs)+":"+paddZero(mins)+":"+paddZero(secs);}
else
{formattedCounterValue=lblMessage+" 00:"+paddZero(mins)+":"+paddZero(secs);}
oCounter.textContent=formattedCounterValue;}}

function fnPauseCounter()
{stopCounter();
bCounterPaused=true;
if(!tBlinker)tBlinker=window.setInterval(blinkCounter,100);
if(typeof(oOnPause)=="function")oOnPause();
document.getElementById("playpause").src="/console/core/img/icons/play_icon.gif";
setCounterValue(getCounterValue());}

function pauseCounter()
{if(!tBlinker)
fnPauseCounter();else
fnResumeCounter();}

function getCookie(name, def) {
	let status = def;
	document.cookie.split("; ").forEach(function(e) {
		let a = e.split('=');
		if(a[0] == name) status = a[1];
	})
	return status;
}

function getAutoRefreshStatus() {
	let status = getCookie("AutoRefresh", "0");
	if(status * 1 == 1) return true;
	return false;
}

function getAutoRefreshInterval() {
	let status = getCookie("AutoRefreshTime", "30");
	if(status == null) return 30;
	if((status * 1) + "" == "NaN") return 30;
	return status * 1;
}

function startAutoRefresh() {
	document.cookie="AutoRefresh=1";
	isCountDown = true;
iCounterInit=getAutoRefreshInterval();
iCounter=iCounterInit;
setCounterValue(iCounter);
oCounter.style.color="green";	
}

function AutoRefresh()
{
	if(getAutoRefreshStatus()) {
	document.cookie="AutoRefresh=0";
isCountDown = false;	
iCounterInit=1;
iCounter=iCounterInit;setCounterValue(iCounter);
oCounter.style.color="black";
	}else {
startAutoRefresh();
	}
}

function Prompt()
{
	let sec = window.prompt("Set refresh time in seconds");
	if(sec == null) return false;
	if((sec * 1) + "" == "NaN" || sec < 5) {
		alert("Kérem 4-nél nagyobb számot adjon meg!");
		return false;
	}
	document.cookie = "AutoRefreshTime=" + sec;
	startAutoRefresh();
	return false;
}

function fnResumeCounter()
{window.clearInterval(tBlinker);
if(oCounter.style.color=="blue")oCounter.style.color="black";
document.getElementById("playpause").src="/console/core/img/icons/pause_icon.gif";
tBlinker=null;bCounterPaused=false;if(typeof(oOnResume)=="function")oOnResume();
setCounterValue(getCounterValue());startCounter();}

function isCounting()
{return tBlinker==null;}

function blinkCounter()
{oCounter.style.color=borderColor;borderColor=(borderColor=="blue"?"black":"blue");}

function startCounter()
{
	
	if(bCounterPaused)
return;if(tCounter==null)
tCounter=window.setTimeout(updateCounter,1000);counterStopped=false;}

function stopCounter()
{if(bCounterPaused)
return;window.clearTimeout(tCounter);tCounter=null;counterStopped=true;}

function resetCounter()
{iCounter=iCounterInit;setCounterValue(iCounter);}

function updateCounter() {
	if(counterStopped||bCounterPaused) return;
	if(isCountDown) iCounter-=1;
	else iCounter+=1;
	if(isCountDown&&iCounter<=0) {
		if(typeof(oOnAutoRefresh)=="function") {
			oOnAutoRefresh();
		}
		iCounter=iCounterInit;
	}
	setCounterValue(iCounter);
	tCounter=window.setTimeout(updateCounter,1000);
}

function initCounter(oCnt,countdownTime,onRefresh,isPause)
{return initCounterWithSeparateCallbacks(oCnt,countdownTime,onRefresh,onRefresh,null,null,isPause);}

function initCounterWithSeparateCallbacks(oCnt,countdownTime,onManualRefresh,onAutoRefresh,onPause,onResume,isPause)
{if(oCnt)
{if(!isCountDown)
countdownTime=0;iCounter=countdownTime;iCounterInit=countdownTime;oOnManualRefresh=onManualRefresh;oOnAutoRefresh=onAutoRefresh;oOnPause=onPause;oOnResume=onResume;
if(isPause) {
	oCnt.innerHTML =  " <div id=\"_COUNTDOWN_\" style=\"height:12px;padding-top:1px;padding-right:10px;white-space:nowrap;float:left;text-align:right;font-size:14px;\" countervalue=\"" +countdownTime +"\">00:00:00</div>";
	oCnt.innerHTML += "<a style=\"text-decoration:none;\" id=\"_PAUSE_\">&nbsp;<img id=\"playpause\" style=\"cursor:pointer\" src=\"/console/core/img/icons/pause_icon.gif\" /></a>";
	oCnt.innerHTML += "<a style=\"text-decoration:none;\" id=\"_REFRESH_\">&nbsp;<img style=\"cursor:pointer\" src=\"/console/core/img/icons/refresh_icon.gif\" /></a>";
	oCnt.innerHTML += "<a style=\"text-decoration:none;\" id=\"_REFRESH2_\">&nbsp;<img style=\"cursor:pointer\" src=\"/console/core/img/icons/refresh_icon2.gif\" /></a> ";
} else {
	oCnt.innerHTML =  " <div id=\"_COUNTDOWN_\" style=\"height:12px;padding-top:1px;padding-right:10px;white-space:nowrap;float:left;text-align:right;font-size:14px;\" countervalue=\"" +countdownTime +"\">00:00:00</div>";
	oCnt.innerHTML += "<a style=\"text-decoration:none;\" id=\"_REFRESH_\">&nbsp;<img style=\"cursor:pointer\" src=\"/console/core/img/icons/refresh_icon.gif\" /></a>";
	oCnt.innerHTML += "<a style=\"text-decoration:none;\" id=\"_REFRESH2_\">&nbsp;<img style=\"cursor:pointer\" src=\"/console/core/img/icons/refresh_icon2.gif\" /></a>";
}
oCounter=domapi.getElm("_COUNTDOWN_");
if(getAutoRefreshStatus()) startAutoRefresh();
btnRefresh=domapi.getElm("_REFRESH_");
btnARefresh = domapi.getElm("_REFRESH2_");
btnRefresh.title=i18n("qradar.dashboard.messages.refreshCounter");
btnARefresh.title = i18n("qradar.dashboard.messages.refreshCounter2");
btnPause=domapi.getElm("_PAUSE_");if(btnARefresh)
domapi.addEvent( btnARefresh, "click", AutoRefresh);
domapi.addEvent( btnARefresh, "contextmenu", Prompt);
if(btnPause)domapi.addEvent(btnPause,"click",pauseCounter);
domapi.addEvent(btnRefresh,"click",onManualRefresh);
setCounterValue(countdownTime);}}
console.log(document.location.href);

domapi.regHook("show",function(e,args){if((e.DA_TYPE=="POPUPMENU"||e.DA_TYPE=="FLYOVER")&&tCounter!=null&&tBlinker==null)
{stopCounter();}});domapi.regHook("hide",function(e,args){if(((e.DA_TYPE=="POPUPMENU"&&!e.parentItem)||e.DA_TYPE=="FLYOVER")&&tCounter==null&&tBlinker==null&&(typeof(inSaveCriteria)=="undefined"||inSaveCriteria==false)&&(typeof(inAddFilter)=="undefined"||inAddFilter==false))
{startCounter();}});domapi.unloadHooks.push(function(){iCounter=null;tCounter=null;iCounterInit=null;oCounter=null;oOnManualRefresh=null;oOnAutoRefresh=null;oOnPause=null;oOnResume=null;});