/* <![CDATA[ */
var data, newTable, dataSize, table;
var numberOfCols; 
var tableTargetOutput = "tableContent"; //ID of the element to print the TABLE;
var setTaskCount = "task-count";
var addActionCol = false;
var getID ,getStatus;
var isCheckin=false;   
var getTaskURL = "";
var isLoadTask = false;
var isFormPosted = false;				
var dataViewOptions = { 'hideColumns': [], 'columnOrder': [] };
var cssClassNames = {
    'headerRow': '',
    'tableRow': '',
    'oddTableRow': 'odd-background',
    'selectedTableRow': 'selected-state',
    'hoverTableRow': '',
    'headerCell': 'header-cell',
    'tableCell': '',
    'rowNumberCell': ''};

var options = {'showRowNumber': true, 'allowHtml': true, 'cssClassNames': cssClassNames, 'pageSize': 5};

var taskVersion = 0;
var guestCheckInURL = "/frontdesk/admin/checkinuser.html";

function getURLParams() {
	var temp = location.href;
	if(temp.indexOf("?")>0) {
		temp = temp.substr(temp.indexOf("?")+1,temp.length);
		var parArrayTemp = temp.split('&');
		var parArray = new Array();
		
		for(var i=0; i<parArrayTemp.length; i++) {
			parArray.push(parArrayTemp[i].split('='));
		}
		return parArray;
	} else return"";
}

function loadTaskData(statusState){
	
	var liveVersion = getKioskMessageVersion();	
	if(statusState==' ' || statusState=='closed'){
		if(currentTaskViewState != statusState){
			currentTaskViewState=statusState;
			taskVersion = liveVersion;
			window.history.replaceState('Object', 'Title', '?type='+currentTaskViewState);
			init(setServletURL + "?type="+currentTaskViewState);
		}
	} else if (liveVersion != taskVersion){
		taskVersion = liveVersion;
		init(setServletURL + "?type="+currentTaskViewState);
	}
}

function setTabFromURL(){ 
	var tabType = "";
	var newParamArr = new Array();
		newParamArr = getURLParams();
	
	try {
		for(var i=0; i<newParamArr.length; i++) {
			var tempParam = newParamArr[i][0];
			if(tempParam =="type")
				tabType =newParamArr[i][1].toLowerCase();
		}
	} catch(e) {}
	
	$(".nav-tabs li").removeClass("current");
	if(tabType == "closed") {
		$(".completed").parent("li").addClass("current");	
	} else {
		$(".new").parent("li").addClass("current");
	}
	
	return tabType;
}		

function loadOpenMsg(){
	$.ajax({ 
		url: init(setServletURL+"?type=Open"), 
		type: 'GET', 
		dataType: 'json', 
		success: function(data) { 
			$(".messages").html(data); 
		} 
	});
}

function loadClosedMsg(){
	$.ajax({ 
        url: init(setServletURL+"?type=Close"),
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            $(".messages").html(data);
        }
    });
}

function init(url) {
	
	var query = new google.visualization.Query(url+getTimeStamp(false));
		query.send(function(response) {
			handleQueryResponse(response);
		});
};

function handleQueryResponse(response){
	
	data = response.getDataTable();
	dataSize = data.getNumberOfRows();
	dataProperty = new DataTableMessageViewer(data);
	numberOfCols = data.getNumberOfColumns();
	
	if(dataSize > 0 ) {
		newTable = createTable();
		viewTable(newTable, tableTargetOutput);
	} else {
		$("#"+tableTargetOutput).html("<p class=\"message\">Sorry! no task was found at the moment</p>");
	}
};

function createTable() {
	var createTable = data; 
	return createTable;
}

function viewTable(dataView, objOutput) {
	
	if(addActionCol)
	dataView.addColumn('string', 'Action');
	
	$("."+setTaskCount).text(dataSize).parent().removeClass("hidden");
	for(rownum=0; rownum < dataSize; rownum++) {
		for(colnum=0; colnum < dataView.getNumberOfColumns(); colnum++) {
			if(dataView.getColumnLabel(colnum) == "Status" || colnum == 5) {
				var setStatus = "status-new";
					
				if(data.getValue(rownum,5) == "Completed")
					setStatus = "status-completed";
				else if(data.getValue(rownum,5) == "Unable to complete")
					setStatus = "status-unable";
				else if(data.getValue(rownum,5) == "Canceled")
					setStatus = "status-canceled"
				else if(data.getValue(rownum,5) != "New")
					setStatus = "status-pending"; 
				
				dataView.setValue(rownum, 5, "<span class=\"status "+setStatus+"\">" + data.getValue(rownum,5) + "</span>");
				
			}
			
			if( dataView.getColumnLabel(colnum) == "VIP" ) {
				var setVIPstatus = "status-vip";
				
				if(data.getValue(rownum,7) == "High")
					dataView.setValue(rownum, 7, "<span class=\"status "+setVIPstatus+"\">&nbsp;</span>");
				else 
					dataView.setValue(rownum, 7, "");
					
			}
			/*if(dataView.getColumnLabel(colnum) == "Action" || colnum == 7 && addActionCol) 
				dataView.setValue(rownum, 7, "<span id=\"action-"+data.getValue(rownum,0)+"\" class=\"action\"><a href=\"#\" class=\"action delete\" ><i aria-hidden=\"true\" class=\"icon\">&#xE006;</i>Delete</a></span>");*/
				
		}
	}
	
	/*var monthYearFormatter = new google.visualization.DateFormat({ pattern: "MM/DD/yyyy" });
		monthYearFormatter.format(dataView, 1);*/
	
	var viewTable = new google.visualization.DataView(dataView);
	viewTable.hideColumns(dataViewOptions.hideColumns);
	viewTable.setColumns(dataViewOptions.columnOrder);
	
	table = new google.visualization.Table(document.getElementById(objOutput));
	table.draw(viewTable, options); //table.draw(data, options);	
	
	google.visualization.events.addListener(table, 'select', selectionHandler);
}

function selectionHandler() {
	/*var selectedData = table.getSelection(), row, item;
	row = selectedData[0].row;
	item = data.getValue(row,0);*/
	
	if(table.getSelection()[0].row != undefined || table.getSelection()[0].row != "undefined") {
		var row = table.getSelection()[0].row;
			getID = data.getValue(row, 0);
			getStatus = data.getValue(row, 5);
				
		$("#myModal").modal("show");
	}        
}
	
function getFormatDate(dataTable, rowNum){
	var thisValue = dataTable.getValue(rowNum, 1); //DATE_FORMAT(%d/%m/%Y - %h:%i %p);
	return thisValue;
}

var checkinMsg= "<div class=\"modal-info\">"+
				"<p>Loading... Please wait...</p>"+
				"</div>";

var successMsg= "<div class=\"modal-info\">"+
				"<p>Task has been updated.</p>"+
				"<a href=\"#\" data-dismiss=\"modal\" aria-hidden=\"true\" class=\"btn\">OK</a></div>";
var errorMsg ="<div class=\"modal-info error\">"+
				"<p>An error has occured, Please refresh the page and try again.</p>"+
				"<a href=\"#\" data-dismiss=\"modal\" aria-hidden=\"true\" class=\"btn\">OK</a></div>";
				
var loadingGif = new Image(); 
	loadingGif.src= "/application/images/loader-inverse.gif";
	$(loadingGif).attr("class","message-loader");

$(function() {

	if($(".dropdown").length > 0) {
		$(".dropdown a, .dropdown h3").click(function(e) {
			e.preventDefault();
			var $this = $(this),
				$parent = $this.parents(".dropdown"),
				$children = $parent.find("ul");
				
				$parent.toggleClass("active");
				if($parent.hasClass("active")) {
					$children.addClass("show")
				} else {
					$children.removeClass("show");
				}

		});
	}
	
	$(".check-in").click(function(event) {
		event.preventDefault();
		isCheckin = true;
		getTaskURL = guestCheckInURL;
		$("#myModal").modal("show");
	});
	
	$(".task-menu a").click(function(event) {
		event.preventDefault();
		isLoadTask = true;
		getTaskURL = $(this).attr("href");
		$("#myModal").modal("show");		
	});
	

	/*$(".modal-body form :submit").live('click', function(event){
		event.preventDefault();
		if(isLoadTask || isCheckin) {
			$('.modal-body').html(loadingGif);
			var strParams = new Array;
			var stringParams = "";
			$(this).closest("form").find("input:checked,input:text,input[type=number],input[type=email],input:hidden,input:password,input:submit,select option:selected,textarea").each(function() {
				var params = {};
				var thisParam = "";
				var OldArrayName = "";
				
				ArrayName = this.name || this.id || this.parentNode.name || this.parentNode.id || this.parentNode.parentNode.name || this.parentNode.parentNode.id;
				thisParam = params[ArrayName];
				
				if (thisParam == null) {
					thisParam = new Array(1);
					thisParam[0] = this.value;
					strParams.push(this.value);
					OldArrayName = ArrayName;
				}
				else {
					thisParam.length = thisParam.length + 1;
					thisParam[thisParam.length - 1] = this.value;
				}
					
				if($(this).attr('type') == 'radio' || $(this).attr('type') == 'checkbox' ) {
					
					if ($(this).attr('checked') == true || $(this).attr('checked') == 'checked' || $(this).is(':checked') ) {
						params[ArrayName] = thisParam; 
						stringParams += "&"+this.name+"="+this.value;
					} else {
						//do nothing	
					}
				} else if ($(this).attr('type') == 'submit') {
					if ($(this).attr('checked') == true || $(this).attr('checked') == 'checked' || $(this).is(':checked') ) {
						params[ArrayName] = thisParam;
						stringParams += "&"+this.name+"="+this.value;
					}	
				} else {
					params[ArrayName] = thisParam;
					stringParams += "&"+this.name+"="+this.value;	
				}
			});
			
			var http = location.protocol;
			var slashes = http.concat("//");
			var host = slashes.concat(window.location.hostname)+getTaskURL;
			if(!isCheckin)
				host = "";
			
			if(getTaskURL == "")
				getTaskURL = $(this).closest("form").attr("action")+"?"+stringParams.substring(1);
			else
				getTaskURL = host+getTaskURL.substring(0,getTaskURL.indexOf("?"))+"?"+stringParams.substring(1)
					
				
			
			$.ajax({
				url:getTaskURL , //+"&AdditionalField1=0&RoomNumber=890&isPosted=True",
				type: 'POST',
				//dataType : 'html',
				//context: $(this),
				error: function (msg) {
					$(".modal-body").html(errorMsg);
				},
				success: function(xmldata, textStatus) {
				
					if(isCheckin) {
						successMsg = checkinMsg;
						window.location.href =getTaskURL; //host+getTaskURL.substring(0,getTaskURL.indexOf("?"))+"?"+stringParams.substring(1);
					}
			
					$(".modal-body").html(successMsg);
					isFormPosted = true;
				}
			});
		}
		
	}); */
		
	$('#myModal').on('shown', function () {
	
		if(isLoadTask)
			$(".modal-body").load(getTaskURL+getTimeStamp(false)+ " .form-container");
		else if(isCheckin) {
			$(".modal-body").load("/jasmine3.0/jsps/frontdesk/checkin/lobbyCheckin.jsp"+getTimeStamp(true),function(){
				$("#CheckinCode_MyAccountForm").focus();	
			});
           // $(".modal-body").html($(".form-include").html());
		} else
			$(".modal-body").load("/jasmine3.0/jsps/frontdesk/task/taskDetail.jsp?taskid="+getID+getTimeStamp(false));
	});
	
	$('#myModal').on('hidden', function () {
		$(".modal-body").html(loadingGif);
		if(isLoadTask && isFormPosted) location.reload();
		isCheckin = false;
		isLoadTask = false;
		isFormPosted = false;
	});	
});

/* ]]> */