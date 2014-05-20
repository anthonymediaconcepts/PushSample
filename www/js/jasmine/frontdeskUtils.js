/* <![CDATA[ */

var dataProperty;
var hasError = false;
var sessionTimeoutURL = "/sessiontimeout.html";

var miliSec = 1000;
var seconds = miliSec * 60; //60 - 1 minute
var minutes = seconds * 30; //30minutes
var sessionTimer = minutes;
var timeoutHandler;

function clearErrorMessage() {
	try {
		$(".message, .message.error, .error, .message-loader").remove();
	} catch(e) {}
};

function init(url) { 
	var query = new google.visualization.Query(url);
	query.send(handleQueryResponse);
};

function selectHandler() {
	selectedData = chart.getSelection();
	row = selectedData[0].row;
	item = data.getValue(row, 0);
	location.href = '/frontdesk/concierge/task_details.html?taskid='+item;
}
function handleQueryResponse(response){
	
	resetTimer();
	timeoutHandler = setTimeout("expireSession()", sessionTimer);
	
    if (response.isError()){
		
		/*errorHandler($(".search-results"), response.getMessage());
		try {
			$(".message-loader").remove();
		} catch(e) {}*/
			
        return;
    } else {
		
		clearErrorMessage();
		
		if(isStatus){	
				
			data = response.getDataTable();
			dataSize = data.getNumberOfRows();
			dataProperty = new DataTableMessageViewer(data);		

			if(dataSize > 0) {
				$("#list-status").removeClass("hidden");
				$(".message.error").remove();
				appendWithTransformationHTMLCode('list-status',jsStatusList, data, userTransformations);  //#compareListHotelID
				//google.visualization.events.addListener(chart, 'select', selectHandler);
				
				/*setMessageDetails($(".search-results"));
				/*if(!setOnload){
					setActiveFlexiDate();	
					setOnload = true;
				}*/

			} else {
				/*errorHandler($(".search-results"));
				setMessageDetails($(".search-results"));*/
                // TODO: I have taken this out for now. Maybe replace with softer message or colours as not really an error - JHB
				//var errorString = "<div class=\"message alert error\">There are no current task pending</div>";
				//$("#list-status").addClass("hidden");
				//$(errorString).insertAfter("#list-status");
			}
		}
    }
}

function loadOpenMsg(){
	$.ajax({ 
			url: init(setServletURL+"?type=Open"+getTimeStamp(false)), 
			type: 'GET', 
			dataType: 'json', 
			success: function(data) { 
				$(".messages").html(data); 
			} 
		});
}

function loadClosedMsg(){
	$.ajax({ 
			url: init(setServletURL+"?type=Open"+getTimeStamp(false)), 
			type: 'GET', 
			dataType: 'json', 
			success: function(data) { 
				$(".messages").html(data); 
			} 
		});
}

function expireSession() {
	window.location.replace(sessionTimeoutURL);	
};

function resetTimer() {
	clearTimeout(timeoutHandler);
};

function enableLoader() {
	$.blockUI({ message: "<div id='loader-bg'><div id='spinner'><img src='/application/images/please_wait/globe16.gif' alt='Please Wait...' title='Please Wait..' /><span id='text'>Please Wait</span></div></div>", overlayCSS: { opacity: 0.2}, css: { border: '0px solid'} });
}

function disableLoader() {
	$.unblockUI();	
}

function errorHandler(obj, message){
	var errorString = "";
	
	if(message==undefined) {
		var getErrorDetails = dataProperty.getErrorDetail();
		
		if (getErrorDetails == "" || getErrorDetails == null) {
			//do nothing	
		} else {
			errorString = "<div class=\"message alert error\">" + getErrorDetails + "</div>";	
			$(errorString).insertAfter(obj);
		}
		
	} else {
		if($(".message.alert.error").length >= 1) {
			$(".message.alert.error").html(message);
		} else {
			errorString = "<div class=\"message alert error\">" + message + "</div>";
			$(errorString).insertAfter(obj);	
		}
	}
	
	try { 
		$(".data-loader").remove();
	} catch(e) { }
	
	hasError = true;	
	return hasError;
	
    
};
function initScroll(objRefresh, objUp, objDown) {
	
	
	var footerHeight = $('[data-role="footer"]').outerHeight(true),
        headerHeight = $('[data-role="header"]').outerHeight(true),
        padding = 55; //15*2; //ui-content padding
		
	$("#widget-container-wrapper,#"+objRefresh).height( $(window).innerHeight() - headerHeight - footerHeight - padding );
	
	var iScroller = new iScroll(objRefresh, {
		hScrollbar: false, 
		vScrollbar: false,
		useTransition: true
	});

};

function loaded() {
	pullDownEl = document.getElementById('pullDown');
	pullUpEl = document.getElementById('pullUp');
	pullDownOffset = pullDownEl.offsetHeight;
	pullUpOffset = pullUpEl.offsetHeight;
	
	if(myScroll){
		myScroll.destroy();
		myScroll = null;
	}
	myScroll = new iScroll('pull-to-refresh', {
		hScrollbar: false, 
		vScrollbar: false,
		useTransition: true,
		onRefresh: function () {
			if (pullDownEl.className.match('loading')) {
				pullDownEl.className = 'fade-out';
				pullDownEl.querySelector('.pullDownIcon').innerHTML = '&#xe615;';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
			} else if (pullUpEl.className.match('loading')) {
				pullUpEl.className = '';
			}
		},
		onScrollMove: function () {
			if (this.y > 5 && !pullDownEl.className.match('flip')) {
				pullDownEl.className = 'flip';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
				this.minScrollY = 0;
			} else if (this.y < 5 && pullDownEl.className.match('flip')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownIcon').innerHTML = '&#xe615;';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
				this.minScrollY = -pullDownOffset;
			} else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
				pullUpEl.className = 'flip';
				this.maxScrollY = this.maxScrollY;
			} else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
				pullUpEl.className = '';
				this.maxScrollY = this.maxScrollY;
			}

		},
		onScrollEnd: function () {
			if (pullDownEl.className.match('flip')) {
				pullDownEl.className = 'loading';
				pullDownEl.querySelector('.pullDownIcon').innerHTML = '&#xe615;';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';				
				pullDownAction();	// Execute custom function (ajax call?)
			} else if (pullUpEl.className.match('flip')) {
				pullUpEl.className = 'loading';
			}
		}
	});
}

function loadedMsg() {
	
	pullDownEl = document.getElementById('pullDown-messages');
	pullUpEl = document.getElementById('pullUp-messages');
	pullDownOffset = pullDownEl.offsetHeight;
	pullUpOffset = pullUpEl.offsetHeight;
	
	if(myScroll){
		myScroll.destroy();
		myScroll = null;
	}
	
	myScroll = new iScroll('pull-to-refresh-messages', {
		hScrollbar: false, 
		vScrollbar: false,
		useTransition: true,
		onRefresh: function () {
			if (pullDownEl.className.match('loading')) {
				pullDownEl.className = 'fade-out';
				pullDownEl.querySelector('.pullDownIcon').innerHTML = '&#xe615;';
				pullDownEl.querySelector('.pullDownLabel2').innerHTML = 'Pull down to refresh...';
			} else if (pullUpEl.className.match('loading')) {
				pullUpEl.className = '';
			}
		},
		onScrollMove: function () {
			if (this.y > 5 && !pullDownEl.className.match('flip')) {
				pullDownEl.className = 'flip';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
				this.minScrollY = 0;
			} else if (this.y < 5 && pullDownEl.className.match('flip')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownIcon').innerHTML = '&#xe615;';
				pullDownEl.querySelector('.pullDownLabel2').innerHTML = 'Pull down to refresh...';
				this.minScrollY = -pullDownOffset;
			} else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
				pullUpEl.className = 'flip';
				this.maxScrollY = this.maxScrollY;
			} else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
				pullUpEl.className = '';
				this.maxScrollY = this.maxScrollY;
			}

		},
		onScrollEnd: function () {
			if (pullDownEl.className.match('flip')) {
				pullDownEl.className = 'loading';
				pullDownEl.querySelector('.pullDownIcon').innerHTML = '&#xe615';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';				
				pullDownActionMsg();	// Execute custom function (ajax call?)
			} else if (pullUpEl.className.match('flip')) {
				pullUpEl.className = 'loading';
			}
		}
	});
	
}
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

/* ]]> */