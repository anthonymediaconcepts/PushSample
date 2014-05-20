// JavaScript Document
var _isLoggedIn = false;
var setTID = 0;
var g_uid = 0; 
var uxn = "";
var uxp = "";
var mapapiloaded = false;
var g_domain = "http://demo.mediaconcepts.org";  
//var g_domain = "http://local.demo.com";
var storeMenuItemArrObj;

$(function() {
	
	if ( window.localStorage.getItem("username") != null ) {
		
		_isLoggedIn = true;
		g_uid = window.localStorage.getItem("uid");
		$(".icon-account").addClass("online");
	}
    
});

var uiActivepage; 
var landing_center_lat=1.2799821;
var landing_center_lng=103.8432709;
var enableFullScreen = false;
var brandName = "jasmine";
var isFrontDesk = false;
var findMyLoc = true;
var isForBooking = false;
var PROPERTY = false;
var getAddInfo = false;
var propPID='0';
	
var docid='1333';
var regionView="";
var landing="no";
var landing_zoom = 12;
var mapsearch = "find";
			
if(propPID != 0) PROPERTY = true;


var taskVersion = 0;
var setServletURL = g_domain+"/kiosk/todolist";
var isStatus = true;
var data, myData, dataBrand = null;
var dataSize;
var chart;

var userTransformations = {
	text: null,
	data: null,
	row: null,
	brandData: null,

	convert: function ()
		{

		try
			{
			//Distance
			var idVal = getRowData(this.data, this.row, 'ID');
			this.text = this.text.replace("%ID%", idVal);

			var dueLabel = data.getColumnLabel(1);
			this.text = this.text.replace("%dueLabel%", dueLabel);

			var dueVal = getRowData(this.data, this.row, 'Due By');
			this.text = this.text.replace("%DueBy%", dueVal);

			var taskVal = getRowData(this.data, this.row, 'Task');
			this.text = this.text.replace("%Task%", taskVal);

			var roomLabel = data.getColumnLabel(3);
			this.text = this.text.replace("%roomLabel%", roomLabel);

			var roomVal = getRowData(this.data, this.row, 'Room');
			this.text = this.text.replace("%Room%", statusVal);
				if(roomVal != 0)
					this.text = this.text.replace("%ishidden%", ""); 		
				else 
					this.text = this.text.replace("%ishidden%", "hidden"); 		

			var nameVal = getRowData(this.data, this.row, 'Name');
			this.text = this.text.replace("%Name%", statusVal);

			var statusVal = getRowData(this.data, this.row, 'Status');
			this.text = this.text.replace("%Status%", statusVal);

			var statusClass = getRowData(this.data, this.row, 'Status');
			this.text = this.text.replace("%statusClass%", statusClass.toLowerCase());

			var descriptionVal = getRowData(this.data, this.row, 'Description');
			this.text = this.text.replace("%Description%", descriptionVal);
		
			var isGreyOut = getRowData(this.data, this.row, 'GreyOut') == "Y" ? " greyout" : "" ;
			this.text = this.text.replace("%isGreyOut%", isGreyOut);
			}
		catch (e)
			{
			return("");
			}
		return(this.text);
		}
};


			
$( document ).delegate(".page-content", "pageshow", function() {
	
	var obj = $.mobile.path.parseUrl($.mobile.activePage[0].baseURI);
		obj = obj.directory;
		
	var stringArray  = obj.split('www/');
	var countChar = countString(stringArray[1] , '/');
	var url = "";
	var g = countChar;
	while(g > 0 ){
		url = url + "../";
		g--;
	}
	
	$(".icon-account").attr("href" ,  url + "myaccount.html" );
	$(".icon-menu").attr("href" ,  url + "index.html" );
	$(".logoLink").attr("href" ,   url + "index.html" );
	uiActivepage = $(".ui-page.ui-page-active");
	
	var getPageID = $(this).attr("id");
	var getFormID = $(this).find("form:eq(0)");
	var getFormAction = $(getFormID).attr("action");
	
	if(getPageID == "findMyWay"){
		$(".icon-find-my-way-back").click(function(){
			
			navigator.geolocation.getCurrentPosition(function onSuccess(position){
				sourceLat  = position.coords.latitude;
				sourceLong = position.coords.longitude;
	
				destLatitude = 1.28573;
				destLongitude = 103.853928;

				if(navigator.userAgent.indexOf("Android") != -1){
					url = "http://maps.apple.com/maps?saddr=" + sourceLat + "," + sourceLong + "&daddr=" + destLatitude +","+ destLongitude;
				}
				else if (navigator.userAgent.indexOf("iPad") != -1){
					url = "maps:saddr=" + sourceLat + "," + sourceLong + "&daddr=" + destLatitude + "," + destLongitude;
				}
				else if (navigator.userAgent.indexOf("iPhone") != -1){
					url = "maps:saddr=" + sourceLat + "," + sourceLong + "&daddr=" + destLatitude + "," + destLongitude;
				}

				window.location = url;	

			}, function onError(error){
				 	alert("code : " + error.code + '\n' +
                          "message: " + error.message + '\n');
			});

				

		});
	}

	if(getPageID == "placesToGo" ){
		
		$("ul.list-attractions .list-items").click(function(){
			var placeID = $(this).attr("id");
			var sourceLat , sourceLong , destLatitude , destLongitude ;
			navigator.geolocation.getCurrentPosition(function onSuccess(position){
				sourceLat  = position.coords.latitude;
				sourceLong = position.coords.longitude;

				if(placeID == "merlion"){
					destLatitude =  1.2869;
					destLongitude = 103.8547;
				}else if(placeID == "marina"){
					destLatitude =  1.2826;
					destLongitude = 103.8584;
				}else if(placeID == "gardens"){
					destLatitude =  1.2833;
					destLongitude = 103.8667;
				}else if(placeID == "chinatown"){
					destLatitude =  1.2836;
					destLongitude = 103.8442;
				}else if(placeID == "india"){
					destLatitude =  1.3078;
					destLongitude = 103.8525;
				}else if(placeID == "orchard"){
					destLatitude =  1.3051;
					destLongitude = 103.8319;
				}

				if(navigator.userAgent.indexOf("Android") != -1){
					url = "http://maps.apple.com/maps?saddr=" + sourceLat + "," + sourceLong + "&daddr=" + destLatitude + "," + destLongitude;
				}
				else if (navigator.userAgent.indexOf("iPad") != -1){
					url = "maps:saddr=" + sourceLat + "," + sourceLong + "&daddr=" + destLatitude + "," + destLongitude;
				}
				else if (navigator.userAgent.indexOf("iPhone") != -1){
					url = "maps:saddr=" + sourceLat + "," + sourceLong + "&daddr=" + destLatitude + "," + destLongitude;
				}
				
				window.location = url;			

			} , function onError(error){
				 	alert("code : " + error.code + '\n' +
                          "message: " + error.message + '\n');
			});

		});	

	}

	if(getPageID=="checkout"){

		$("#ProceedButton_MyAccountForm").click(function(){
			
			$("#myModal .modal-body").html("Thank you for staying with us. Your check-out is complete. Your bill will be sent to you through email.");
			$("#myModal").modal("show");
			window.localStorage.setItem("checkout" , true);	
			
			$("#myModal .closeBtn , #myModal .close").click(function(){
				$.mobile.changePage( "index.html", {
					transition: "slide",
					reverse: true
				});
			});	

		});	

	}

	if(getPageID=="loyalty"){

		//alert(JSON.parse(window.localStorage.getItem("personDetails"))[0].name);

		$("#userName").text(JSON.parse(window.localStorage.getItem("personDetails"))[0].name);
		$("#userTPoints").text(JSON.parse(window.localStorage.getItem("personDetails"))[0].totalPoints);
	}
	if(getPageID=="loyaltyItemList"){
		$(".no-points #userTPoints").text(JSON.parse(window.localStorage.getItem("personDetails"))[0].totalPoints);
	}

	if(getPageID == "loyaltyRedeem" ){
		
		$(".head.termConditions").on("tap" ,function(){
				if($(this).hasClass("expandable")){
					$(".collapsible-content").hide();
					$(this).removeClass("expandable");
					$(this).find(".icon").removeClass("icon-minus").addClass("icon-plus");
				}else{
					$(".collapsible-content").show();
					$(this).addClass("expandable");
					$(this).find(".icon").removeClass("icon-plus").addClass("icon-minus");
				}
				initScroll('pull-to-refresh-loyaltyRedeem', 'pullUp-loyaltyRedeem', 'pullDown-loyaltyRedeem');
		});
	}

	

	if(getPageID=="homepage") {
		loaded();
        
        //$(".nav.nav-pills").addClass("active");
		//$(".home-screen").addClass("hidden");
		//$(".menu.widget-container").removeClass("hidden");
		
        //$(".icon-grid.icon-menu").removeClass("hidden");			
		
        
	} else if(getPageID == "homepage" && window.localStorage.getItem("username") != null ) {
		
		$(".nav.nav-pills").addClass("active");
		$(".home-screen").addClass("hidden");
		$(".menu.widget-container").removeClass("hidden");
		
		$(".icon-grid.icon-menu").removeClass("hidden");			
		
		loadMessageData();
		loaded(); 
		//initScroll("pull-to-refresh", "pullUp", "pullDown" );
		
	} else if(getFormID !==undefined && getFormAction !== undefined && getPageID != "homepage") {
		//$(getFormID).attr("action", g_domain+getFormAction+"?uId=" + escape(uxn)  +  "&uIp=" + escape(uxp)).ajaxSubmit();	
		$(getFormID).find("#uId").val( uxn );
		$(getFormID).find("#uIp").val( uxp );
		$(getFormID).attr("action", g_domain+getFormAction).ajaxSubmit();	
		
	}
	
	//check if page has iscroll
	if($(":jqmData(role=page)").hasClass("has-iScroll")){
		var getRefreshID = $(this).find($(".pRefresh")).attr("id");
		var getUpID = $(this).find($(".pUp")).attr("id");
		var getDownID = $(this).find($(".pDown")).attr("id");	

		initScroll(getRefreshID, getUpID, getDownID);
	}

	if($(this).hasClass("jsGmap")) {
		
		/*if(!mapapiloaded) {
			var mapapi = document.createElement('script'); mapapi.type = 'text/javascript';
			mapapi.src = ('http:' == document.location.protocol ? 'https://' : 'http://') + 'maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&language=en&libraries=weather,places'; 
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(mapapi, s); 	
		}*/
		
		
		if(google.maps) {
			
			mapapiloaded = true;
			propPID = "1"; //THIS SHOULD BE DEFINED DYNAMICALLY AFTER FRONTDESK LOGIn
			var mapsearch = "find";
			PROPERTY = false;
			isFrontDesk = true;
			enableFullScreen = true;
			landing="yes";
			
			initializeMap();
			//$('#content-center').append($('<div id="directions_placeholder"></div>'));
			//$('#content-center').append($('<div id="directions_panel"></div>'));
			$('<div id="directions_placeholder"></div>').insertBefore("#"+getUpID);
			$('<div id="directions_panel"></div>').insertBefore("#"+getUpID);			
		}
	}
	$("a.redeemThisItem").on("tap" , redeemPoints);
	
});


function getItemList(catId){
	window.localStorage.setItem("selectedCatId" , catId );
	$.mobile.changePage('loyalty_itemlist.html', {transition: 'slide'});
}

function redeemItem(obj){
	//alert(obj.code);
	window.localStorage.setItem("selectedItem" , JSON.stringify(obj) );
	$.mobile.changePage('loyalty_redeem.html', {transition: 'slide'});

}

function redeemPoints(){

	var curPoints = JSON.parse(window.localStorage.getItem("personDetails"))[0].totalPoints;
	RedeemItemModal();
	//RedeemItemModal();
	//if()
	//var latestPoints = 
}


var homemenu=false;
$( document ).delegate(".page-content", "pagebeforeshow", function() {
	
	var getPageID = $(this).attr("id");

	if(window.localStorage.getItem("username") != null) {
		$(".icon-large.icon-account").addClass("online");
		if(!homemenu) showWidgetNav();
		homemenu=true;
	}
		
	if($(":jqmData(role=page)").hasClass('pullToRefresh') )
	{
		if($(this).attr("id")=="messages"){
			loadedMsg();
		}
	}

	if(getPageID=="checkout"){

		if(window.localStorage.getItem("checkout")){
			$(".statusMsg.checkout").text("You have already completed checkout");
			$("#ProceedButton_MyAccountForm").addClass("hidden");
		}

	}


	if(getPageID == "loyaltyRedeem" ){
		
		var selectedObj = JSON.parse(window.localStorage.getItem("selectedItem"));
		var htmlStr = "";
		
		htmlStr += "<h1 class='head'>" + selectedObj.title + "</h1>" ;
		htmlStr += "<div class='big-banner'><img alt='" + selectedObj.img.alt + "' src='" + selectedObj.img.largeImg + "'></div>";
		htmlStr += "<p>" + selectedObj.description + "</p>";
		htmlStr += "<div class='tnc'></div>";
		htmlStr += "<div class='box-panel'>";
		htmlStr += "<form class='form-block' id='RedeemPoints'><fieldset>";
		htmlStr += "<span class='value'>"+ selectedObj.points +" points</span>";
		//htmlStr += "<a class='btn-submit' href='#' onclick='redeemPoints("+ selectedObj.points +")'  data-transition='slide' >REDEEM</a>";
		htmlStr += "<a class='btn-submit redeemThisItem' href='#'   data-transition='slide' >REDEEM</a>";	
		htmlStr += "</fieldset></form></div>";
		//htmlStr += "<div class='redeem-btn overflow-btn'><a href='#' data-transition='slide' onclick='redeemPoints("+ selectedObj.points +")' >Redeem Now!</a></div>";

		$("#loyalty-redeem").html(htmlStr);

		var termConditions = "<h2 class='head termConditions collapsible'><i class='icon icon-plus'></i>Terms & Conditions</h2>";
		termConditions += "<ol class='collapsible-content' style='display:none'>";
		termConditions += "<li>Redemption of awards is subject to availability at time of request.</li>";
		termConditions += "<li>Awards are not exchangeable for cash.</li>";
		termConditions += "<li>Mini Bar items may be consumed immediately after confirmation of redemption. Items consumed before confirmation of redemption will be deducted from final bill during check-out.</li>";
		termConditions += "<li>F&B items will be delivered through room service upon confirmation of redemption.</li>";
		termConditions += "<li>Spa treatments must be booked and used during within 1 year from date of redemption.</li></ol>";

		$(".tnc").html(termConditions);

	}

	if(getPageID == "loyaltyItemList" ){
	
		 $.getJSON('../json/'+ window.localStorage.getItem("selectedCatId") +'_list.json', function(response) {
			var htmlStr = "<ul class='list-content-items list-content-items-inner'>";
			for(var i=0 ; i < response.length ; i++){
				htmlStr += "<li class='list-item'><a title='"+ response[i].title +"' href='#' \ data-transition='slide' onclick=\'redeemItem("+ JSON.stringify(response[i]) +")\' >";
				htmlStr += "<span class='img-loyaltyItemList'><img alt='"+ response[i].img.alt +"' src='"+ response[i].img.src +"'></span><span class='list-item-content'>";
				htmlStr += "<span class='item-info'><span class='title'>" + response[i].title + "</span>";
				htmlStr += "<span class='desc'>"+ response[i].description +"</span></span>";
				htmlStr += "<span class='item-points'>"+ response[i].points +" pts</span></span></a></li>";
			}	
			$(".loyalty-block.list-content-block").html(htmlStr);
		});
	}

	if(getPageID == "loyalty" ){
		
		$.getJSON('../json/userDetails.json', function(response) {
			if(!(window.localStorage.getItem("personDetails")))
				window.localStorage.setItem("personDetails" , JSON.stringify(response) );
				//$.cookie("personDetails" , JSON.stringify(response));	

		}).fail(function( jqxhr, textStatus, error) {
			var err = textStatus + ", " + error;
			console.log(err);
		});;

		 $.getJSON('../json/redeemCategory.json', function(response) {
			var htmlStr = "<ul class='list-content-items'>";
			var selectedObj = [];
			for(var i=0 ; i < response.length ; i++ ){
				htmlStr += "<li class='list-item'><a title='" + response[i].title + "' href='#'  data-transition='slide' onclick=getItemList('"+ response[i].catId +"') ><span class='title'>" + response[i].catName + "</span><span class='img-facilities'><img alt='" + response[i].img.alt + "' src='" + response[i].img.src + "'></span></a></li>";	
			}
			htmlStr += "</ul>";
        	$(".loyalty-block.list-content-block").html(htmlStr);
          })
		  .fail(function( jqxhr, textStatus, error) {
			var err = textStatus + ", " + error;
			console.log(err);
		  });
	}

	if(getPageID == "myAccount" || getPageID == "details")
		{
			if ( window.localStorage.getItem("username") != null ) 
			{
				$("#myaccount-page").empty();
				var uid = window.localStorage.getItem("uid");
				var username = window.localStorage.getItem("username");
				var roomNo = window.localStorage.getItem("roomNo");
				var booking = window.localStorage.getItem("booking");
				var status = window.localStorage.getItem("bookingStatus");
				var checkin = window.localStorage.getItem("checkIn");
				var checkout = window.localStorage.getItem("checkOut");
				var email = window.localStorage.getItem("email");
				var mobile = window.localStorage.getItem("mobile") != null ? window.localStorage.getItem("mobile") : "";
			
				var myAccForm = $("<form id='MyAccountForm' method='post' name='MyAccountForm' action='/jasmine3.0/jsps/frontdesk/phonegap/authenticate.jsp?bookingcode=' class='form-horizontal'></form>").appendTo("#myaccount-page");
				$("<input type='hidden' name='FormPosted_MyAccountForm' value='Yes' />").appendTo(myAccForm);
				$("<input type='hidden' name='FormPosted' value='Yes' />").appendTo(myAccForm);
				$("<div id='formErrors_MyAccountForm' class='formErrors'></div>").appendTo(myAccForm);
				var welMsg = $("<div class='welcome-msg quick-info'>").appendTo(myAccForm);
				$("<h2 class='welcome-user name'>Welcome, <span id='username' >"+ username +"</span></h2>").appendTo(welMsg);
				$("<p>Checked in at Room <span id='roomNo' >" + roomNo + "</span></p>").appendTo(welMsg);
				$("<div class='form-bricks highlight col-2 clear'><div class='form-field'><span class='label'>Booking </span><span class='value' id='booking' >" + booking + "</span></div><div class='form-field'><span class='label'>Booking Status</span> <span class='value' id='status' >" + status + "</span></div></div><div class='form-field highlight'><span class='label'>Stay</span> From <span class='value' id='checkin' > " + checkin + " </span> To <span class='value' id='checkout' >" + checkout + "</span></div>").appendTo(myAccForm);
				var fieldset = $("<fieldset></fieldset>").appendTo(myAccForm);
				var ul = $("<ul class='form-field-list'></ul>").appendTo(fieldset);
				$("<li class='form-field'><label class='label_UserName_MyAccountForm ' for='UserName_MyAccountForm'>Email Address </label> <input name='UserName_MyAccountForm'  type='email' id='UserName_MyAccountForm' placeholder='Email Address' readonly='readonly' value='"+ email +"' /></li>").appendTo(ul);
				$("<li class='form-field'><label class='label_Password_MyAccountForm ' for='Password_MyAccountForm'>Password </label> <input name='Password_MyAccountForm'  type='password' id='Password_MyAccountForm' placeholder='Password' value='' /></li>").appendTo(ul);
				$("<li class='form-field'><label class='label_MobileNumber_MyAccountForm ' for='MobileNumber_MyAccountForm'>Mobile Number </label><input name='MobileNumber_MyAccountForm'  type='tel' id='MobileNumber_MyAccountForm' placeholder='Mobile Number' value='"+ mobile +"' /><span class='form-help'>The mobile number should be in the format +Country Number</span></li>").appendTo(ul);
				$("<li class='form-field checkbox hidden'>  <span class='checkbox_wrap'><input name='KeepLoggedIn_MyAccountForm'  type='checkbox' id='KeepLoggedIn_MyAccountForm' value='Yes' /></span> <label class='label_KeepLoggedIn_MyAccountForm ' for='KeepLoggedIn_MyAccountForm'>Keep me logged in </label></li>").appendTo(ul);
				var submitDIV = $("<div class='form-submit form-actions'></div>").appendTo(myAccForm);
				$("<input name='ProceedButton_MyAccountForm'  type='submit' id='ProceedButton_MyAccountForm' class='btn btn-submit' onclick='this.checked=true; ' value='Save &amp; Exit' /><a href='#' onClick='logout();' class='btn btn-link jsLogout'>Log Out</a>").appendTo(submitDIV);
				$("<input type='hidden' name='javaScriptStatus' value='off' class='javaScriptStatus' />").appendTo(myAccForm);
			}
		}
});

var isRoomServiceCheckout = false;
$( document ).delegate(".page-content", "pagebeforecreate", function() {
	
	var getPageID = $(this).attr("id");
	
	if(getPageID=="messages") initTaskList();	
	else if(getPageID=="taskdetails") loadTaskDetails(getPageID);
	else if(getPageID =="feedback") 
		{
		$(".rate-list .smile").click(function() {
			var getParent = $(this).parents(".rate-box");
			$(getParent).find(".smile").removeClass("active");
			$(getParent).find(".rate-score").attr("value",$(this).html());
			$(this).addClass("active");
		});
		}
	else if(getPageID =="bookRestaurant")
		{
			$("#restaurant-name").change(function() {
				$("#rest-details li").addClass("hidden");
				if( $(this).val() != "")
					$("#rest-details li."+$(this).find("option:selected").attr("class")).removeClass("hidden");
				
				//adjust content height
				initScroll('pull-to-refresh-bookRestaurant', 'pullUp-bookRestaurant', 'pullDown-bookRestaurant');
			});	
		}
	else if(getPageID =="roomServiceMenu")
		{
			
			if ( window.localStorage.getItem("menu_item") != null ) {
			
				storeMenuItemArrObj = $.parseJSON(window.localStorage.getItem("menu_item"))
			} else {	
				storeMenuItemArrObj = {"menu_item":[]};
			}
			
			var Items = defaultItemsConfig;
				Items.itemUnitPrice=".price-holder";
				Items.itemThumb=".img-con .thumb";
				Items.itemCode=".item_code";
				Items.itemAddTrigger=".add-to-cart";
				Items.itemTotalAmount=".cart-total-price";
				Items.itemTotalQty=".cart-item-count";
				Items.itemRowCss=".menu-item";
				Items.itemName=".item-name";
				Items.itemExtraContainer=".extra-container";
				Items.itemCookiePath="/frontdesk";
				Items.itemCookieTitle="menu_item";
				Items.formExtraBtn=".extra-button";
				Items.formExtraContainer=".option-container";
				Items.formModalId="#myModal";
				Items.formModalBody=".modal-body";
				Items.formMessage1="Please select your preference";

				function fixDiv() {
				  /*var $cache = $('.frontdesk-concierge-sublist'); 
				  if ($(window).scrollTop() > 100) 
					$cache.css({'position': 'fixed', 'top': '10px'}); 
				  else
					$cache.css({'position': 'fixed', 'top': 'auto'});*/
				}
				$(window).scroll(fixDiv);
				fixDiv();
			
			var menuLink = $(".sub-menu .menu-loader a");
			$(".sub-menu .menu-loader a").click(function(event) {
				event.preventDefault();
				var getID = $(this).parent(".menu-loader").attr("id");
				menuLink.removeClass("active");
				$(this).addClass("active");
		
				$(".menu-list ul > li.item:not(."+getID+")").fadeOut(function() {
					$(this).addClass("hidden");
					$(".menu-list ul > li.item."+getID).fadeIn(function() {
						$(this).removeClass("hidden");
						var getRefreshID = $("#"+getPageID).find($(".pRefresh")).attr("id");
						var getUpID = $("#"+getPageID).find($(".pUp")).attr("id");
						var getDownID = $("#"+getPageID).find($(".pDown")).attr("id");	
						initScroll(getRefreshID, getUpID, getDownID);
					});
				});
				
			});

    		addCartFunction(Items);
			
			$(".modal-footer .btn-primary").on("click",function() {
				$(".modal.modal-cart "+Items.formExtraBtn).trigger("click");
			});

			var thisMenuObj = $(".frontdesk-concierge-sublist .sub-menu");
			var outObj = $(".menu-list");
			var appendObj = false;
			buildMenuAsSelectBox(thisMenuObj, outObj, appendObj, getPageID);
			
			isRoomServiceCheckout=false;
			
		}
	else if(getPageID =="roomServiceCheckout") 
		{
		
			isRoomServiceCheckout=true;
			sumOfCookieItems(storeMenuItemArrObj.menu_item, defaultItemsConfig);
			
		//	alert(storeMenuItemArrObj.menu_item);
	
			//initUpdateDeleteCart(".update-item", ".delete-item", storeMenuItemArrObj, defaultItemsConfig);
			
			$(".btn-success.check-out , .btn-success.check-out2").click(function(){
				$("#myModal .modal-body").html("Your order has been placed. Please allow 15-20 minutes for it to arrive.");
				$("#myModal").modal("show");
			});	

			$(".checkoutContinue").click(function(){
				//clear window.localStorage.getItem("menu_item");
				//window.localStorage("menu_item").clear(); 
				window.localStorage.removeItem("menu_item");
				//window.localStorage.setItem("menu_item", []);
				//window.localStorage.clear();
				
				$.mobile.changePage( "../../index.html" , {
					transition: "flip",
					reverse: false,
					changeHash: true
				});

				/*$.mobile.changePage( "../../index.html", {
					transition: "flip",
					reverse: false,
					changeHash: true
				});*/
				//$.mobile.back();

				$('#myModal').modal('toggle');
			});

		}		
			
});

var viewCart = function(){
	if($(".cart-item-count").text() > 0)
		$.mobile.changePage('view.html', {transition: 'slide'});
}
		
var logout = function() {
	window.localStorage.clear();
	window.location.href = "index.html"  //window.location.replace("index.html");
}

//ListStatus Data
var jsStatusList = "<li id=\"stat-%Row%\" class=\"teaser frontdesk-content list-tasks %isGreyOut%\">" +
		"<h3 class=\"title task-title\"><a href=\"task_details.html?taskid=%ID%\" title=\"%Task%\" data-transition=\"slide\">%Task%</a></h3>" +
		"<p class=\"stat-%statusClass% status\">%Status%</p>" +
		"<div class=\"task-info\">" +
		"<p class=\"desc\">%Description%</p>" +
		"<p class=\"room-numb %ishidden%\"><span class=\"label\">%roomLabel%</span><span class=\"value\"> %Room%</span></p></div>" +
		"<p class=\"due\"><i class=\"icon icon-clock\"></i><span class=\"label\">%dueLabel%:</span><span class=\"value\"> %DueBy%</span></p>" +
		"<a class=\"btn btn-link view-details icon-large icon-forward\" href=\"task_details.html?taskid=%ID%\" onclick=\"setTaskID(%ID%)\"; title=\"%Status%\" data-transition=\"slide\">view details</a>" +
		"</div></li>";

var currentTaskViewState="Open";

function loadMessageData() {
	var uxn = window.localStorage.getItem("uxn");
	var uxp = window.localStorage.getItem("uxp");			
	var getUserInfo = jasmineAjaxUtil("TaskOpenMessageCountAndUserInfo", null, g_domain, uxn, uxp);				
	var msgCount = getUserInfo.split(",")[0];
	$(".count").text(msgCount);
}
		
function showWidgetNav() {
    if( $(".home-screen").hasClass("hidden") )
		{
			$(".home-screen").removeClass("hidden");					
			$(".widget-container").addClass("hidden"); loaded();	
			$(".nav.nav-pills").removeClass("active");
		}
	else 
		{
			$(".home-screen").addClass("hidden");	
			$(".widget-container").removeClass("hidden"); loaded();
			$(".nav.nav-pills").addClass("active");
		}    
}
		        
function setTabFromURL()
	{
	var getURL = $(location).attr('href');
	if(getURL.split("?").length > 1) {
		var splitURL = getURL.split("?")[1];
		var tabType = splitURL.split("=")[1];	
	} else
		tabType = "Open";
	
	if (tabType == "Open")
		{
		$(".nav-tabs.filled li").removeClass("current");
		$(".nav-tabs.filled .created").parent("li").addClass("current");
		}
	else
		{
		$(".nav-tabs.filled li").removeClass("current");
		$(".nav-tabs.filled .completed").parent("li").addClass("current");
		}
	}

function countString(str, search){
    var count=0;
	
	if(str){
	 	var index=str.indexOf(search);
		while(index!=-1){
			count++;
			index=str.indexOf(search,index+1);
		}
	}
    return count;
}


function pullDownActionMsg(){
			setTimeout(function () {// <-- Simulate network congestion, remove setTimeout from production!
				loadTaskData("Open");
				loadTaskData("Closed");
				myScroll.refresh();// Remember to refresh when contents are loaded (ie: on ajax completion)
			}, 1000);
}

function setBlockUI(){
	$.blockUI({ 
		message: "<div id='box'><div class='top-left'></div><div class='top-right'></div><div class='inside'><p class='notopgap nobottomgap' align='center'><img src='img/globe16.gif'/></p></div><div class='bottom-left'></div><div class='bottom-right'></div></div>", 
		overlayCSS: { opacity: 0.2}, 
		css: { border: '0px solid'} 
	});
};

function setUnBlockUI(){};

function setUnBlockUIError(){
	$.unblockUI(); 
	
	
	if($(":jqmData(role=page)").hasClass("has-iScroll")){
		var getRefreshID = $(this).find($(".pRefresh")).attr("id");
		var getUpID = $(this).find($(".pUp")).attr("id");
		var getDownID = $(this).find($(".pDown")).attr("id");	
		initScroll(getRefreshID, getUpID, getDownID);
	}

};
	
function buildJSONtoStore(jsonStr){

	var userInfo= $.parseJSON(jsonStr); 
		uxn = $("#UserName_MyAccountForm").val();
		uxp = $("#Password_MyAccountForm").val();	
		
		window.localStorage.setItem("uxn", uxn);
		window.localStorage.setItem("uxp", uxp);
		
	$.each(userInfo.points, function(i, item){
		window.localStorage.setItem("uid", item.id);
		window.localStorage.setItem("username", item.realname);
		window.localStorage.setItem("roomNo", 512);
		window.localStorage.setItem("booking", item.bookingid );
		window.localStorage.setItem("bookingStatus", item.bookingstatus);
		window.localStorage.setItem("checkIn", item.checkin);
		window.localStorage.setItem("checkOut", item.checkout);
		window.localStorage.setItem("email", item.email);
		window.localStorage.setItem("mobile", item.mobile);
	});
	
	$.unblockUI(); 
	//redirectpage("myaccount.html");	 
    redirectpage("index.html");	
	
	//check if page has iscroll
	if($(":jqmData(role=page)").hasClass("has-iScroll")){
		var getRefreshID = $(this).find($(".pRefresh")).attr("id");
		var getUpID = $(this).find($(".pUp")).attr("id");
		var getDownID = $(this).find($(".pDown")).attr("id");	
		initScroll(getRefreshID, getUpID, getDownID);
	}	


}

function getTimeStamp(isFirstParam) {
	var timestamp = new Date().getTime();
	if(isFirstParam)
		timestamp = "?time="+timestamp;
	else
		timestamp = "&time="+timestamp;
	
	return timestamp;
};



function initTaskList() {
	
	$(".nav-tabs.filled span").click(function () {
		$(".nav-tabs.filled li").removeClass("current");
		if (!$(this).parent("li").hasClass("current"))
			$(this).parent("li").addClass("current");
		if ($(this).hasClass("created"))
			loadTaskData("Open");
		else
			loadTaskData("Closed");
	});

	loadTaskData("open")
	
};
function loadTaskData(statusState)
	{
		
	//var liveVersion = getKioskMessageVersion();
	uxn = window.localStorage.getItem("uxn");	
	uxp = window.localStorage.getItem("uxp");
	var liveVersion = getKioskMessageVersion(g_domain, uxn, uxp);
	var getHrefLoc = window.location.href.indexOf("?");
		getHrefLoc = window.location.href.substring(0,getHrefLoc);
		
	if(statusState != undefined)
	statusState = statusState.toLowerCase();
	currentTaskViewState = currentTaskViewState.toLowerCase();
	if(statusState=='open' || statusState=='closed')
		{

			if(statusState!=currentTaskViewState)$("#list-status").empty();
			currentTaskViewState=statusState;
			taskVersion = liveVersion;
			try { 
				//window.history.replaceState('Object', 'Title', '?type='+currentTaskViewState);
				//history.pushState({page: getHrefLoc}, '', getHrefLoc+'?type='+statusState); 
				//console.log( setServletURL + "?type="+currentTaskViewState+getTimeStamp(false) );
				init(setServletURL + "?type="+currentTaskViewState+getTimeStamp(false)+'&uId=' + escape(uxn)  +  '&uIp=' + escape(uxp));
			} 
			catch(e) {
				//console.log("errrr ");	
				//window.location.href=getHrefLoc+'?type='+statusState;
			}

			}
		
	else if (liveVersion != taskVersion)
		{
		taskVersion = liveVersion;
		init(setServletURL + "?type="+currentTaskViewState+getTimeStamp(false));
		}
		
	}

function setTaskID(id) 
	{
		setTID = id;
		return setTID;	
	}				

function redirectpage(url)
	{
		
		$.mobile.changePage(url, true);
	}
	
function loadTaskDetails(pageID) 
	{

		var guestName, roomNumber, taskName, description, status, bookingID, commentsToGuest, eta = "";
		var thisPageObj = $("#"+pageID);
				
		$.getJSON(g_domain+"/jasmine3.0/jsps/frontdesk/phonegap/taskloader.jsp?taskId="+setTID,  function(rtndata) { 
			$.each(rtndata.points, function(i, item){
				guestName = item.guestName;
				roomNumber = item.roomNumber;
				taskName = item.taskName;
				description = item.description;
				status = item.status;
				bookingID = item.bookingID;
				commentsToGuest = item.commentsToGuest;
				eta = item.ETA;	
			});
			
			$(thisPageObj).find("#guest-name .value").html( guestName );
			$(thisPageObj).find("#guest-room .value").html( "Room "+roomNumber );
			$(thisPageObj).find(".task-title.content-title").html( taskName );
			$(thisPageObj).find(".user-comment").html( description );
			$(thisPageObj).find(".status-con .status").html( status );
			$(thisPageObj).find("#add-info .value").html( commentsToGuest );
			$(thisPageObj).find("#task-info .value").html( eta );
			
			return true;
			
		});
		
		
	};