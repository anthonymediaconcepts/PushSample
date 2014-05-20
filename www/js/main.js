/* <![CDATA[ */ 
var checkInDate;
var checkOutDate;
var noOfNightsHolder;
var noOfNights = 1;
var searchHotel = '#SelectHotel_CheckAvailabilityForm';
var propertyfield = '#resbox-form-body';
var formIsOpen = true;

// carousel variables/settings
var e_carousel=0;
var c2 = 0;
var timer="";
var FADE_SPEED = 1500;
var TRANSITION_SPEED =5000;  //18000;
var imageSource ="";
// URL Settings
var locationURL = location.href;
var locationPath = location.pathname;

var highCelsiusValue = new Array();
var lowCelsiusValue = new Array();
var highFahrenheitValue = new Array();
var lowFahrenheitValue = new Array();
var tempTemperature;

var setupDone=false;

//Error Message for Max 28 Days
var showErrorMinChar = "Minimum of 3 characters is allowed."; 
var showErrorMaxDays = "We are unable to process your request online as it exceeds 28 days.";
var insertErrorMessage = "<div class=\"message error\"><p>"+showErrorMaxDays+"</p></div>";

function getTimeStamp(isFirstParam) {
	var timestamp = new Date().getTime();
	if(isFirstParam)
		timestamp = "?time="+timestamp;
	else
		timestamp = "&time="+timestamp;
	
	return timestamp;
};

function showSpinner() {
	var loaderHTML = "<div id=\"loader-bg\"><div id=\"spinner\"><img title=\"Please Wait..\" alt=\"Please Wait...\" src=\"/application/css/img/loader-small.gif\"><span id=\"text\">Please Wait</span></div></div>";
	$.blockUI({
		message: loaderHTML, 
		css: {
			cursor: 'normal',
			border: 'none',
			textAlign: 'left',
			left: (( $("#container").width() - (500) ) /2)   + 'px',
			width: ((500)/$("#container").width())*100 + "%"
		},
		overlayCSS: {
			opacity: 0.2,
			left:'0',
			top:'0'
		},
		onBlock: function() { 
			if(is_touch_device()){
				$(".blockOverlay").css({
					"left":"0",
					"top":"0",
					"width": $("#container").width() + 'px',
					"height":$(document).height() + 'px'
				});
			}
		}
	});
}

function initializeWeather(){
	for(var count=2;count<=6;count++){
		var countstr = String(count);
		tempTemperature = document.getElementById("high" + countstr).innerHTML;	  
		highCelsiusValue.push(tempTemperature);	
		highFahrenheitValue.push(Math.round((212-32)/100 * tempTemperature + 32));
		tempTemperature = document.getElementById("low" + countstr).innerHTML;
		lowCelsiusValue.push(tempTemperature);
		lowFahrenheitValue.push(Math.round((212-32)/100 * tempTemperature + 32));
	}
}

function toggleWeather(toggleText) {
	 if($("#day-others").hasClass("expanded-content")){
		 $("#day-others").removeClass("expanded-content").slideUp("normal");
		 $("#seeFiveDayForecast").html(toggleText);		 	 
	 } else {
		 $("#day-others").addClass("expanded-content").slideDown("normal");
		 $("#seeFiveDayForecast").html(toggleText);
	 }
}

function fahrenheit(){
	try {
		//document.getElementById("temperature_matrix").innerHTML="<a href='javascript:celsius();'><sup>o</sup>C</a> or <sup>o</sup>F"	
		$("#temperature-type").html("<a href='javascript:celsius();'><sup>o</sup>C</a> <span id='or'> or </span><span class='temp-metric selected'><sup>o</sup>F</span></a>");
		for(var count=2;count<=6;count++){
			var countstr = String(count);
			$("#high"+countstr).html(highFahrenheitValue[count-2]);//document.getElementById("high"+countstr).innerHTML = highFahrenheitValue[count-2];
			$("#low"+countstr).html(lowFahrenheitValue[count-2]);//document.getElementById("low"+countstr).innerHTML = lowFahrenheitValue[count-2];
			$(".temp-high > .temp-unit, .temp-low > .temp-unit").html("<sup>o</sup>F");	
		}
	} catch(e){}
}

function celsius(){
	try {
		//document.getElementById("temperature_matrix").innerHTML="<sup>o</sup>C or <a href='javascript:fahrenheit();'><sup>o</sup>F</a>"
		$("#temperature-type").html("<span class='temp-metric selected'><sup>o</sup>C </span><span id='or'> or </span> <a href='javascript:fahrenheit();'><sup>o</sup>F</a>");
		for(var count=2;count<=6;count++){
			var countstr = String(count);
			$("#high"+countstr).html(highCelsiusValue[count-2]);//document.getElementById("high"+countstr).innerHTML = highCelsiusValue[count-2];//+"<span class=\"temp-unit\"><sup>o</sup>C</span>";
			$("#low"+countstr).html(lowCelsiusValue[count-2]);//document.getElementById("low"+countstr).innerHTML = lowCelsiusValue[count-2];//+"<span class=\"temp-unit\"><sup>o</sup>C</span>";
			$(".temp-high > .temp-unit, .temp-low > .temp-unit").html("<sup>o</sup>C");
		}		
	} catch(e){}
}

function parseURLParam() {
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

function blockClose() {
	try {
		$.unblockUI();
	} catch(e) { console.log("error:"+e);}	
};

//Preload Function
$.fn.preload = function() {
    this.each(function(){
        $('<img/>')[0].src = this;
    });
}

$(window).load(function() {
	setTimeout(function(){ $(".splash.invisible").addClass("fade-out") } , 1000);
});

$(function() {

	$("<div id='info' class='hidden'></div>").insertAfter("#header");
	function loadDemo() {
		// Log timing 
		if (navigator.onLine) {
			$("#info").addClass("hidden");
			return;
		} else {
			$(".non-offline").live("click", function(event){
				event.preventDefault();
				$("#info").removeClass("hidden");
			});
			return;
		}
	}
	
	// add listeners on page load and unload
	window.addEventListener("load", loadDemo, true);
	
	appCacheLog = function() {
		var p = document.createElement("p");
		var message = Array.prototype.join.call(arguments, " ");
		p.innerHTML = message;
		$("#info").empty().append(p);
	}
	
	// log each of the events fired by window.applicationCache
	
	window.addEventListener("online", function(e) {
		appCacheLog("<h1>You're Online</h1><p>The page you're accessing requires to be online.</p>");
		$("#info").addClass("hidden");
	}, true);
	
	window.addEventListener("offline", function(e) {
		appCacheLog("<h1>You're Offline</h1><p>The page you're accessing requires to be online.</p>");
		$(".non-offline").addClass("disabled");
		$(".non-offline").live("click", function(event){
			event.preventDefault();
			$("#info").removeClass("hidden");
		});
	}, true);

	noOfNightsHolder = $('#NoOfNights_CheckAvailabilityForm');
	checkInDate = $('#CheckInDate_CheckAvailabilityForm');
	checkOutDate = $('#CheckOutDate_CheckAvailabilityForm');
	
	//Call Function for Preload Images
	if(!isMobile) $(['/application/css/img/sprite-01.png','/application/css/img/loader-small.gif']).preload();
	//else $(['/application/css/img/loader-small.gif']).preload();
	
	//Show - Hide Function
    var showMoreDetails = "Show more details";
    var hideDetails = "Hide details";

	$(noOfNightsHolder).change(function() {
		updateNumberOfNights($(checkInDate).val(), $(this));
	});
	
	/*$("#reservation-box .btn-success").live("click",function(event){
		event.preventDefault();
		showSpinner();
		$(this).attr("checked","checked");
		$(this).parents("form").submit();
	});*/
	
	//Fix Popup Blocker for IE
	if ( $.browser.msie ) {
		$("a").removeAttr("target");
	}
	
	try {	
		/*if($.cookie('cookiebar') != 'true')*/
			/*setTimeout('$("#cookies-bar").slideDown()',1000);*/
			$('#cookies').show();		

	} catch(e) { }
	
	$('#cookies-menu').click(function() {
		try {
			$("#cookies-slide").slideDown(); 
		} catch(e) {}
	});

	$('#close').click(function() {
		try {
			$('#cookies-slide').slideUp('fast', function() {
				$('#cookies-bar').slideUp();
				$('#cookies').show();
			});
			$.cookie('cookiebar','true');
		} catch(e) {}
	});

	$('#cookies').click(function() {
		try {
			$('#cookies').hide();
			$('#cookies-bar').slideDown('fast'); 
			$('#cookies-slide').slideDown();
		} catch(e) {}
	});
	
	$(".cookie-title").click(function(){
		 if($(this).parent("li").hasClass("up")) {
			$(this).parent("li").removeClass("up");
			$(this).next().slideUp();		
		 } else {
			$(".slider-content").removeClass("current");
			 $(".sliders").removeClass("up");
			 $(this).next().addClass("current");
			 $(this).parent("li").addClass("up");
			 $(this).next().slideToggle();
			 $(this).next().toggleClass("collapse");
			 $(".slider-content:not(.current)").slideUp();    
			 $(".slider-content:not(.current)").removeClass("collapse");
		 }
	});

	//GRAND TOTAL
	
	try {
		$("#social-block .summary a").attr("target","_blank");
	} catch(e) {}

	if($('.esurvey').length>0 && !isMobile) {
		/*$('.esurvey').popupWindow({
		  centerScreen:1,
		  width:515,
		  height:800,
		  location:0 
	
		});*/
		$(".esurvey").live("click", function(event){
			event.preventDefault();
			setBlockUI_CheckAvailabilityForm();
			var iframeClose = "Close";
			$.blockUI({

				message: "<div class=\"popup-survey\"><button class=\"button-close\"><span class=\"icon\">&times;</span>"+iframeClose+"</button><iframe width=\"515\" height=\"700\" src=\"/"+languageAlias+"/group/esurvey.html\" frameborder=\"0\" scrolling=\"no\" class=\"iframe-manager\"></iframe></div>", 
				fadeIn: 500,
				css: {
					cursor: 'normal',
					border: 'none',
					textAlign: 'left',
					position:'absolute',
					left: (( $("#container").width() - (515) ) /2) + 'px',
					top: '4%',
					width: ((515)/$("#container").width())*100 + "%"
				},
				overlayCSS: {
						cursor: 'default',
						left:'0',
						top:'0'
				}
			});
		});
		
		$(".popup-survey").live("click",function(){
			$.unblockUI();
		});
		
		// Escape Key
		$(document).keyup(function(e) { 
			if (e.keyCode == 27) { // esc keycode
					$.unblockUI();
			}
		});
	}
		
	$(".blockMe").click(function(e) {
		e.preventDefault();
		
		var getHref= $(this).attr("href");
		var closeHTML = "<a href=\"javascript:blockClose();\" class=\"close\">&times;</a>";
		
		$(".block-container").load(getHref+ ' .article-content', function(response, status, xhr) {
			if(status.toLowerCase() != "error") {
				$('.block-container').prepend(closeHTML);
				$.blockUI({ 
					message: $('.block-container'),
					css: {
						cursor: 'normal',
						border: 'none',
						textAlign: 'left',
						top: '15%',
						left: ($(window).width() - 700) /2 + 'px',
						width: '700px'
					},
					overlayCSS: {
						cursor: 'default'
					}
				});	
			}
		}); //end .load();
	});
	
	/* Pop-ups */
	if($(".popLink").length >0 && !isMobile) {
	$(".popLink").popupWindow({ centerScreen:1, width:780, height:385, scrollbars:1, location:0 });
	}
	
	/* Pagebanner */
	$("#hero").show();
	$("#hero_jsOff").hide();
	$("#viewFullPic").show();
	$("#gallery-controls h4").css("visibility","visible");

	/* clock */
	$("#prop-time").show();    
	
	/* weather 5 day Forecast */
	$("#seeFiveDayForecast").show();
	$("#temparature-type a").css("visibility","visible");
	$("#temparature-type #or").css("visibility","visible");
	
	try {initializeWeather();celsius();}catch (e) { }
	
	// Box Slider / Swipe Banner (Standard Site/Tablet)
	if($('#home-carousel').length > 0) {		
		var pause = 8000;
		var controlWidth = $(".pager-link").width();
		
		$("#home-pagebanner").flexslider({
			selector: "#home-carousel > li",
			slideshow: true,
			slideshowSpeed: pause,
			animationSpeed: 600,
			animation: "slide",
			animationLoop: true,			
			controlNav: true,
			directionNav: true,
			fuse:true,
			prevText: "Previous",
			nextText: "Next",
			touch:true,
			useCSS:false
		});

	}
		
	// Social Tool Tip
	if($(".tool-tip").length > 0) {
		$(".tool-tip").hover(
			function() {
				$(".tool-tip .tool-tip-content").hide();
				$(this).children(".tool-tip-content").show();
				if($(this).children(".tool-tip-content").children(".g-plus").is(':empty')) {
					$(".tool-tip .tool-tip-content").hide();
				}
			}, function() {
				$(window).click(function(){$(".tool-tip .tool-tip-content").hide();});
				$("#container").click(function(){$(".tool-tip .tool-tip-content").hide();});
			}
		);
	}
	
	if($(".dropdown").length > 0) {
		$(".dropdown a, .dropdown h3").click(function(e) {
			e.preventDefault();
			var $this = $(this),
				$parent = $this.parents(".dropdown"),
				$children = $parent.find("ul");
				console.log($children);
				$parent.toggleClass("active");
				if($parent.hasClass("active")) {
					$children.addClass("show")
				} else {
					$children.removeClass("show");
				}
		});
	}
	
	$(".collapsible").click(function() {
		var $this = $(this), 
			itemList = $this.parents().hasClass("item-list"),
			collapsibleList = $this.parents().hasClass("collapsible-list"),
			icon = $this.find("span.icon-collapsible"), 
			collapsible = $this.next(".collapsible-content"),
			allCollapsibles = $this.parents(".collapsible-list").find(".collapsible");
			allItems = $this.parents(".item-list").find(".collapsible");
			otherCollapsibles = $this.parents(".collapsible-list").find(".collapsible-content");
			otherItems = $this.parents(".item-list").find(".collapsible-content");
		
		// check if single collapsible 
		$(".search").parent().addClass("activated");
		if(!collapsibleList) {
			if(!itemList) {
				if($this.hasClass("expandable")) {
					$this.removeClass("expandable");
					icon.removeClass("collapsed").addClass("expanded").html("[-] collapse");				
					if($(".grand-total-closed").length > 0) collapsible.parents(".reservation-summary").find(".grand-total-closed").addClass("hidden");
				} else {
					$this.addClass("expandable");
					icon.removeClass("expanded").addClass("collapsed").html("[+] expand");	
					
					//if($(".grand-total-closed").length > 0) $(".grand-total-closed").removeClass("hidden");
				}	
				collapsible.slideToggle("normal",function(){
					if($this.hasClass("expandable")) {
						if($(".grand-total-closed").length > 0) collapsible.parents(".reservation-summary").find(".grand-total-closed").removeClass("hidden");
					} else $(".search").parent().removeClass("activated");				
				});
				
				if(isMobile) {
					collapsible.promise().done(function() { 
						scrollUp($this);			
			    	});	
				}
				
			}
		}

		// check if stack of collapsibles
		if(itemList || collapsibleList) {
			if(isMobile) {
				if($this.hasClass("expandable")) {
					allCollapsibles.addClass("expandable");
					allItems.addClass("expandable");
					$this.removeClass("expandable");
					otherCollapsibles.slideUp("normal").addClass("expandable");
					otherItems.slideUp("normal").addClass("expandable");
					collapsible.slideDown("normal").removeClass("expandable");
				} else {
					collapsible.slideUp("normal").addClass("expandable");
					$this.addClass("expandable");
				}
			}
		}
		
	});
	
	try {
    $(".show-hide").live("click", function () {
        if ($(this).hasClass("collapsible")) {
            $(this).removeClass("collapsible");
            $(this).addClass("expandable");
            $(this).html("<i class=\"icon icon-minus\">-</i> " + hideDetails);
        } else {
			$(this).removeClass("expandable");
            $(this).addClass("collapsible").html("<i class=\"icon icon-plus\">+</i> " + showMoreDetails);
        }
        $(this).parent().find(".collapsible-content").slideToggle();
    }); } catch(e){ }
	
	//Narrow Search	
	$(document).click(function(e) {
		if(e.target.className != "search-options"){
		$(".search").next().slideUp("normal",function() {
			$(".search").removeClass("expandable");
			$(".search").parent().removeClass("activated");
		});
		}
	});
	
	$(".search").click(function(){
		//$(this).parent().toggleClass("activated");
	});
	
	$(".search-options").click(function(event){
		event.stopPropagation();
		//return false;
	});
	
	if($(".slideshow").length > 0 && $(".slideshow #imageViewer").length <= 0 ) {
		$(".slideshow ul").hide();
		$(".slideshow").prepend("<div id=\"imageViewer\"></div>");
	}
	
	/* Hooks / Additional Classes */
	if(locationURL.indexOf("weddings_and_parties") > 0){
		$(".corp.pagebanner-block").addClass("wedding-pagebanner-block");
	}
	
	if(locationURL.indexOf("meetings_and_events") > 0 && !(locationURL.indexOf("meetings_and_events/index.html") > 0)) {
		$(".article-container").addClass("meeting-article-container");
	}
	
	if(locationURL.indexOf("/weddings/") > 0){
		$(".left-nav").addClass("wedding-nav");
	}
	
	$(".prop-list-teaser-block .prop-subhead.expandable").click(function(e){
		e.preventDefault();
		if($(this).hasClass("collapsible")) {
			$(this).removeClass("collapsible");
			$(this).parent().find("li:first-child .img-large").addClass("hidden");
			$(this).parent().find("li:first-child .img-small").removeClass("hidden");
			$(this).parent().find(".prop-teaser-right-content").removeClass("expanded");
			$(this).parent().find(".prop-distance").removeClass("expanded");
			$(this).parent().find(".right-content").removeClass("expanded");
			$(this).parent().find(".facilities").addClass("hidden");
			$(this).parent().find(".link-contact-us").addClass("hidden");
		} else {
			$(this).addClass("collapsible");
			$(this).parent().find("li:first-child .img-large").removeClass("hidden");
			$(this).parent().find("li:first-child .img-small").addClass("hidden");
			$(this).parent().find(".prop-teaser-right-content").addClass("expanded");
			$(this).parent().find(".prop-distance").addClass("expanded");
			$(this).parent().find(".right-content").addClass("expanded");
			$(this).parent().find(".facilities").removeClass("hidden");
			$(this).parent().find(".link-contact-us").removeClass("hidden");
		}
	});
	
	//Placeholder FIX 
/*	if(!Modernizr.input.placeholder){
		$('[placeholder]').focus(function() {
		  var input = $(this);
		  if (input.val() == input.attr('placeholder')) {
			input.val('');
			input.removeClass('placeholder');
		  }
		}).blur(function() {
		  var input = $(this);
		  if (input.val() == '' || input.val() == input.attr('placeholder')) {
			input.addClass('placeholder');
			input.val(input.attr('placeholder'));
		  }
		}).blur();
	}
	*/
	//Placeholder for input[type=password] (IE Only)
/*	if ( $.browser.msie && $.browser.version < 10 ) {
		if(isMobile) {
			$('input[type=password], .setMobilePasswordPlaceholder').each(function(){			
				$(this).attr('placeholder',"");
				$(this).attr('value',"");
				$(this).parent().css("position","relative").addClass("parent-placeholder");
				$(this).prev("label").addClass("label-placeholder").removeAttr("title");
	
			});
			
			$('input[type=password], .setMobilePasswordPlaceholder').focusin(function(){		
				$(this).prev("label").removeAttr("style").removeClass("label-placeholder").addClass("hidden");
				$(this).parent().removeClass("parent-placeholder");
			});
			
			$('input[type=password], .setMobilePasswordPlaceholder').focusout(function(){
				if ($(this).val()=="" || $(this).val()==null){
					$(this).parent().css("position","relative").addClass("parent-placeholder");
					$(this).prev("label").addClass("label-placeholder").removeClass("hidden");
				}
			});
			$('input[type=password], .setPasswordPlaceholder').parents('form').submit(function() {
				if ($(this).val()=="" || $(this).val()==null){
					$(this).parent().css("position","relative").addClass("parent-placeholder");
					$(this).prev("label").addClass("label-placeholder").removeClass("hidden");
				}
			});
			
		} else {
			$('.setPasswordPlaceholder').each(function(){			
				$(this).attr('placeholder',"");
				$(this).attr('value',"");
				$(this).parent().css("position","relative").addClass("parent-placeholder");
				$(this).prev("label").addClass("label-placeholder").removeAttr("title");
			});
			
			$('.setPasswordPlaceholder').focusin(function(){		
				$(this).prev("label").removeAttr("style").removeClass("label-placeholder").addClass("hidden");
				$(this).parent().removeAttr("style").removeClass("parent-placeholder");
			});
			
			$('.setPasswordPlaceholder').focusout(function(){
				if ($(this).val()=="" || $(this).val()==null){
					$(this).parent().css("position","relative").addClass("parent-placeholder");
					$(this).prev("label").addClass("label-placeholder").removeClass("hidden");
				}
			});			
		}
	}*/
	// Init jQuery dataTable for MyGuest List
/*	if($(".memberCurrentBookings").length>0) {
		$(".memberCurrentBookings .dataTable").dataTable({ 
			"sPaginationType"	: "full_numbers",
			"bSort"				: false,
			"bFilter"			: false,
			"bLengthChange"		: false,
			"bInfo"				: false,
			"bAutoWidth"		: false,
			"iFullNumbersShowPages": 10,
			"iDisplayLength"	: 5
		});
		$(".paging_full_numbers").eq(0).insertAfter(".memberCurrentBookings");
	}
			
	if($(".memberStayHistory").length>0) {
		$(".memberStayHistory .dataTable").dataTable({ 
			"sPaginationType"	: "full_numbers", 
			"bSort" 			: false, 
			"bFilter" 			: false, 
			"bLengthChange" 	: false, 
			"bInfo"				: false, 
			"bAutoWidth" 		: false, 
			"iDisplayLength" 	: 10
		});
		$(".paging_full_numbers").eq(0).insertAfter(".memberStayHistory");
	}
	if($("#memberMyStayHistory").length>0) {
		$("#memberMyStayHistory .dataTable").dataTable({ 
			"sPaginationType"	: "full_numbers", 
			"bSort" 			: false, 
			"bFilter" 			: false, 
			"bLengthChange" 	: false, 
			"bInfo"				: false, 
			"bAutoWidth" 		: false, 
			"iDisplayLength" 	: 5
		});
	}
	if($("#myGuestListTable").length>0) {
		$("#myGuestListTable .dataTable").dataTable({ 
			"sPaginationType"	: "full_numbers", 
			"bSort" 			: false, 
			"bFilter" 			: false, 
			"bLengthChange" 	: false, 
			"bInfo"				: false, 
			"bAutoWidth" 		: false, 
			"iDisplayLength" 	: 5,
			"oLanguage": {
                "sZeroRecords"	: zGuests
            }
		});
		$(".paging_full_numbers").eq(0).insertAfter("#myGuestListTable .datatable-container");
	}
	if($("#myManagerListContainer").length>0) {
		$("#myManagerListContainer .dataTable").dataTable({ 
			"sPaginationType"	: "full_numbers", 
			"bSort" 			: false, 
			"bFilter" 			: false, 
			"bLengthChange" 	: false, 
			"bInfo"				: false, 
			"bAutoWidth" 		: false, 
			"iDisplayLength" 	: 5,
			"oLanguage": {
                "sZeroRecords"	: zManagers
            }
		});
		$(".paging_full_numbers").eq(1).insertAfter("#myManagerListContainer .guestTableList");
	}	
*/	
	/* Main Navigation */
	var getURL = "";
	$("#main-nav a").each(function(){
		getURL = $(this).attr("href");
		if(locationPath == getURL)
			$(this).parent("li").addClass("current");
	});
	if(locationURL.indexOf("/group/offers/index.html") > 0) {
		$("#main-nav a").parent("li#nav-offers").addClass("current");
	}
	
	/* IF Pagebanner == 1 on Offers */
	var numbThumb = $("#galleria li").size();	
	//if(numbThumb == 1) $("#galleria").parent("#thumbs").addClass("hidden");
	if(locationURL.indexOf("/group/offers/") > 0 && numbThumb == 1) {
		$("#thumbs").addClass("hidden");
		$("#gallery-control").addClass("hidden");
	}
	
	/* If Article Content Image Has Link */
	$(".article-content a:has(img)").addClass("link-no-arrow");
	
	//Clear Errors when Check In / Check Out is CLicked
	checkInDate = $('#CheckInDate_CheckAvailabilityForm');
	checkOutDate = $('#CheckOutDate_CheckAvailabilityForm');

	
	$("#reservation-box, .ui-datepicker-trigger").live("click",function(){
		$("#reservation-box #check-out > .message.error, #reservation-box .dates > .error, .ui-effects-wrapper").slideUp(500,function(){
			$(this).remove();
		});
		
		$(checkOutDate).removeClass("fielderror");
	});
	
	/* Mobile js */
	if(isMobile) {

		$("input[type='number']").each(function(i, el) {
			el.type = "text";
			el.onfocus = function(){this.type="number";};
			el.onblur = function(){this.type="text";};
		});		
		
		if (window.opera) {
			(function() {
				function removePlaceholder(e) {
					var el = e.target;
					if (!el.placeHolderRemoved) {
						el.placeHolderRemoved = true;
						el.value = "";
						el.removeAttribute("data-operaplaceholder");
					}
				}
				window.addEventListener("DOMContentLoaded", function() {
					var inputs = document.getElementsByTagName("input");
					for (var i = 0; i < inputs.length; ++i) {
						var el = inputs[i];
						var ph = el.getAttribute("placeholder");
						if (ph && !el.hasAttribute("value")) {
							el.value = ph;
							el.removeAttribute("placeholder");
							el.setAttribute("data-operaplaceholder", "");
							el.addEventListener("click", removePlaceholder, false);
						}
					}
				}, false);
			})();
		}	
		
		if($("#reservation-box").length > 0)
			$(".nav-booknow a").attr("href","#reservation-box-block").addClass("anchor");
		
		// anchor
		if($(".anchor").length > 0 ) {
			var $target = $('.anchor').attr("href");
				$(".anchor").click(function(){
					var getid = $(this).attr("href"), $target = $(getid);
	
					if($target.is("input")) {
						$target.focus();
						$target.val("");
					}
					if($target.siblings(".expandable")) {
						$target.find(".expandable").eq(0).click();
					}
			
				});
			if($("#reservation-box-block").length < 1){
				$('.anchor[href= "#reservation-box-block"]').parent().addClass("hidden");
			}
			else {
				var getParamArr = new Array();
				var isLocator = false;
					getParamArr = parseURLParam();
					
					try {
						for(var i=0; i<getParamArr.length; i++) {
							var tempParam = getParamArr[i][0];
							if(tempParam =="booking"){
								if("locator" == getParamArr[i][1])
									isLocator = true;
							}
						}
					} catch(e) {}
					
				var bookingURL = "/index.html?booking=yes";	
				if(!isLocator){
					$('.anchor[href= "#reservation-box-block"]').parent().removeClass("hidden");
					if( $("#reservation-box-block").hasClass("hidden"))
						$('.anchor[href= "#reservation-box-block"]').attr("href",bookingURL);
				} 
			}
		}
		
		if($(".toggle").length > 0 ) {
			$(".toggle").click(function (e) {
				var 	$this = $(this),
						icon = $this.find(".icon"),
						target = $this.attr("href"),
						parent = $(target).parent(".toggle-group"),
						allToggleContent = $(parent).find(".toggle-content"),
						toggle = $this.parent().find('.toggle-content');
				if($this.is(':checkbox') || $this.is(':radio')){
					if($this.is(':checked')) {
						toggle.removeClass("hidden");
					}
					else {
						toggle.addClass("hidden");						
					}
				}
				else {
					e.preventDefault();
					if($(target).hasClass("hidden")) {
						if($(icon).hasClass("icon-plus")) {
							$(icon).removeClass("icon-plus").addClass("icon-minus");
						}
						$(icon).html("-");
						if($(parent)) {
							allToggleContent.slideUp("fast").addClass("hidden");
						}
						$(target).slideDown("fast").removeClass("hidden");
						if($this.hasClass("more")) {
							$this.html("Close");
							$this.append(icon);
						}
					} else {
						if($(icon).hasClass("icon-minus")) {
							$(icon).removeClass("icon-minus").addClass("icon-plus");
						}
						$(icon).html("+");
						if($(parent)) {
							allToggleContent.slideUp("fast").addClass("hidden");
						}
						$(target).slideUp("fast").addClass("hidden");
						if($this.hasClass("more")) {
							$this.html("More");
							$this.append(icon);
						}
					};
				}
			})
			
			if($(".spinner").length > 0) {
				
				$(".spinner .spinner-value").each(function() {
					if($(this).val() > 0 && $(".basket").length > 0) {
						$(this).parent(".spinner").parent().addClass("add-to-basket")
					}
				});
				
				$(".spinner .spinner-value").attr("disabled","disabled");
				$(".spin").click(function (e) {
					e.preventDefault();
					var		$this = $(this),
							$parent = $this.parent(".spinner").parent(),
							$spinner = $parent.find(".spinner-value"),
							$basket = $(".basket"), 
							$value = $parent.find(".spinner-value").val();
					val = Number($value) == NaN ? 0 : Number($value);
					if($this.hasClass("add")) {
						$spinner.val(val+1);
					}
					if($this.hasClass("reduce") && $value > 0) {
						$spinner.val(val-1);
					}
					if($basket.length > 0) {
						$parent.removeClass("add-to-basket");
						if($spinner.val() > 0 && $spinner.val() !== 0 && !$parent.hasClass("added")) {
							$parent.addClass("added");
						}
						else if($spinner.val() > 0 && $spinner.val() !== 0) {
							$parent.addClass("updated");
						}
						else {
							$parent.removeClass("addded");
							$parent.removeClass("updated");
						}
					}

				});
			}
		}
		
		$("input[type=tel], input[type=number], input[type=text], input[type=time]").bind('focus', function(event) {
		if($(this).next().hasClass('form-help') &&  $(this).next().not(":visible")) $(this).next().css("display","block");
		}).bind("blur", function(event)
		{	
		if($(this).next().hasClass('form-help') && $(this).next().is(":visible")) $(this).next().css("display","none");
		});
		
		// mobile jump menu
		if($(".jump-menu").length > 0) {
			$(".jump-menu").closest('form').find("input:[type='submit']").addClass("hidden")
			$(".jump-menu").change(function(){
				window.location = $(this).val();
			})
		}

		if($(".switch-menu").length > 0) {
			$(".switch-menu").closest('form').find("input:[type='submit']").addClass("hidden")
			$(".switch-menu").change(function(){
				$this = $(this),
				$target = $($this.val()),
				$allSwitchContent = $this.closest('.switch-block').find('.switch-content'),
				$allSwitchContent.addClass("hidden");
				$target.toggleClass("hidden");
			})
		}

		
		$('.close').live("click",function(){
			try {
				$.unblockUI();
			} catch(e) { }
		});
		
		// swipe banner 
		if ($('#mySwipe .swipe-wrap .slide').length > 1 ) {
			$('#mySwipe .swipe-control').removeClass("hidden");
			var slide = $('#mySwipe .swipe-wrap .slide');
			slide.each(function() {
				var em ="<em>&bull;</em>";
			$(em).appendTo('#position');}
			);
			$('#position em').eq(0).addClass('on');
	
			// indicators/bullets click/touch event
			$('#position em').click(function() {
				mySlide.delay = 0;
				clearTimeout(mySlide.interval);
				var curActive = $('#position em').index(this);
				var curPos = mySlide.getPos();
				if ( curActive !== curPos ) {
					$(this).addClass('on');
					$(this).eq(curPos).removeClass('on');
					mySlide.slide(curActive, 300);
				}
				return false;
			});
			$('.swipe-nav').click(function(e) {
				e.preventDefault();
				if(this.id == "prev") {
					mySlide.prev();	
				}
				else mySlide.next();
			});
		}
		
		if($("article img")) {
			var imgs =  $("article img");
			imgs.each(function() {
				if(imgs.attr("style")||imgs.attr("width")||imgs.attr("height")) {
					imgs.removeAttr("style");imgs.removeAttr("width");imgs.removeAttr("height");
				}
			})
		}
		
	}
	/* Mobile js */
	
	$(".map-legends li").click(function() {
		
		switch ($(this).attr("class"))
		{
		case "property":
		  iconType="Hotel";
		  break;
		case "metro":
		  iconType="City_Marker"; 
		  break; 
		case "resto":
		  iconType="Restaurant";
		  break;
		case "bars":
		  iconType="Bar";
		  break;  
		case "tourist":
		  iconType="Tourist Spot";
		  break;
		case "cafe":
		  iconType="Coffee Shop";
		  break;
		}
		
		toggleMarkerGroup(iconType);
		
	});
	
}); //end onload



function toggleMap(tabObj) {
	$('#prop-directions-content').hide();
	$('#prop-local-attractions').hide();
	$('#map-tools-directions').hide();
	$('#prop-directions-message').hide();
	if(tabObj.innerHTML == "Hotel Information") {
		$('#prop-directions-content').show();
	}
	if(tabObj.innerHTML == "Local Attractions") {
		$('#prop-local-attractions').show();
	}
	if(tabObj.innerHTML == "Driving Directions") {
		$('#prop-directions-message').show();
		$('#map-tools-directions').show();
	}
}

function scrollUp(obj) {
	
	if(obj!=undefined)
		$("html,body").animate({scrollTop:  $(obj).offset().top}, 400);	
		//$("html,body").animate({ scrollTop: 200 }, "normal");
	else
		$("html,body").animate({scrollTop: 0 }, 400);
		//$("html,body").animate({ scrollTop: 200 }, "normal");
}

function goBack() {
	window.history.back();
}

function noPointerEvents() {
	var inputs = $("#container").find("input"), selects = $("#container").find("select"), links = $("#container").find("a");
	if(inputs.attr("disabled") != "disabled" || selects.attr("disabled") != "disabled") {
		inputs.attr("disabled","disabled").addClass("no-pointer-events");
		selects.attr("disabled","disabled").addClass("no-pointer-events");
	}
	links.addClass("no-pointer-events");
}
function noPointerEventsReset() {
	var inputs = $("#container").find("input"), selects = $("#container").find("select"), links = $("#container").find("a");
	if(inputs.hasClass("no-pointer-events") || selects.hasClass("no-pointer-events")) {
		inputs.removeAttr("disabled","disabled").removeClass("no-pointer-events");
		selects.removeAttr("disabled","disabled").removeClass("no-pointer-events");
	}
	links.removeClass("no-pointer-events");
}

function initTabNav(target,tab1,tab2){	
	var tabHTML='<nav id="map-nav">';
	tabHTML+='<ul class="nav nav-tabs">';
	tabHTML+='<li id="tab-list-view" class="active"><a href="javascript:;">'+tab1+'</a></li>';
	tabHTML+='<li id="tab-map-view"><a href="javascript:;">'+tab2+'</a></li>';
	tabHTML+='</ul>';
	tabHTML+='</nav>';
	
	$(".find_hotel_list_asia").hide();
	$(target).after(tabHTML);
	
	$('#map-nav ul > li').each(function(){
		$(this).click(function(){
			$('#map-nav ul > li').toggleClass('active');
			if($(this).attr('id')=='tab-map-view'){
				
				//$('.google-map-block #map_canvas').show();
				//$('#googleDDLForm').show();
				
				$('.google-map-block').removeClass('hidden');
				
				$('#find-hotel').hide();
				$('#findHotel_head').hide();
				$('#main-content-ourhotels').show();
				$(".countryname").show();
				$(".find_hotel_list_asia").show();
				if(!setupDone){
					initialize();
					setupDone=true;
				}
			} else {
				//$('.google-map-block #map_canvas').hide();
				//$('#googleDDLForm').hide();
				
				$('.google-map-block').addClass('hidden');
				
				$('#find-hotel').show();
				$('#findHotel_head').show();
				$('#main-content-ourhotels').hide();
				$(".countryname").hide();
				$(".find_hotel_list_asia").hide();
			}
		});
	});
}


/* ]]> */