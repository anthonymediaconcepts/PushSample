/********************************* V a r i a b l e s ***********************************/

	//defaultLatLng=new Array(51.5081289,-0.128005);	
var defaultLatLng = new google.maps.LatLng(32.54681317351514, 53.7890625);
var def_Lat = 32.54681317351514;
var def_Lng = 53.7890625;

var zoomLvl = new Array(2, 4, 5, 6, 7, 8, 14);

var mapOptions = { 
	lat: def_Lat, 
	lng: def_Lng, 
	zoom: zoomLvl[0],
	center: new google.maps.LatLng(def_Lat, def_Lng),
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	useCustomInfoWindow : true,
	propID: 0,
	docID: 0,
	mapMode: 1,
	mapData: "",
	showAllIconsOnLoad : true,
	hidePropLink : false,
	getBookinInfo: false,
	markerHotel: "Hotel",
	markerOtherHotel: "Other Hotels",
	defaultType:"Others",
	mapID : "map_canvas",
	wmapDDLForm : "#wmapDDLForm",
	wmap_filter_container : "#wmap_filter_container",
	wmap_go : "#wmap_go",
	wmap_reset : "#wmap_reset",
	wmap_tools : "#panel-map-tools",
	wmap_brand : "#wmap_brand",
	catLabelHotel:"Hotel",
	catLabelOther:"Other Hotels",
	infoWindowHeadingTag: "h3",
	infoWindowHeadingClass: "",
	infoWindowPropLinkText : "Go to property",
	infoWindowSetOption: {},
	infoWindowDisplayAddres : true,
	currentBrand: "",
	markerDirections : true,
	autoScrollDirections : false,
	enableDirection : false,
	getDirectionLinkText : "Get Directions"
};
		
var dafaultIcon="../../img/googlemap/markers/icons_hotel.png";
var defaultShadow="../../img/googlemap/sun-shadow.png";
var searchIcon="../../img/googlemap/markers/icons_magnifyingglass.png";


var contentHead = '<div id="content">';
var contentFooter = '</div>';	
	
var markerData= new Array();
var regionData = new Array();
	regionData.push(new Array("Asia", 11.2843989, 111.0937311, 3)); 
	regionData.push(new Array("Europe", 54.235963635, -4.547918185, 5)); 
	
var directionDisplay;
var directionsService = new google.maps.DirectionsService();
	
var cloudLayer, weatherLayer, ib, wme, weatherInfoWindow, wEvent;

var hasWeather = false;
var enableCloud = true;
var enableScroll = false;
var isOptimized = false;
var addInfoString = "";

var myOptions = {
  center: defaultLatLng,  
  zoom: zoomLvl[2],
  minZoom: 2,
  optimized: isOptimized,
  scrollwheel: enableScroll,
  mapTypeId: google.maps.MapTypeId.ROADMAP
}; //map defaultOptions

var renderOptions = {
	suppressMarkers: true
	//suppressInfoWindows: true
}; //renderOptions for direction(s) 
		
var infoOptions = {
	disableAutoPan: false,
	alignBottom: true,
	maxWidth: 225,
	pixelOffset: new google.maps.Size(-85, -45),
	zIndex: null,
	boxStyle: { 
	  background: "#FFFFFF",
	  border:"1px #999999 solid",
	  width: "225px"
	 },
	closeBoxMargin: "8px 8px",
	closeBoxURL: "../../img/googlemap/infowindow_corners/grey_close.png",
	infoBoxClearance: new google.maps.Size(0,50),
	isHidden: false,
	pane: "floatPane",
	enableEventPropagation: false
};

var infowindow = new google.maps.InfoWindow({
	maxWidth: 225,
	backgroundClassName: 'anthony',
	backgroundColor: '#000000' 
});	

var weatherInfoOptions = {
	disableAutoPan: false,
	alignBottom: true,
	maxWidth: 225,
	pixelOffset: new google.maps.Size(-85, -45),
	zIndex: null,
	boxStyle: { 
	  background: "#FFFFFF",
	  border:"1px #999999 solid",
	  width: "225px"
	 },
	closeBoxMargin: "8px 8px",
	closeBoxURL: "../../img/googlemap/infowindow_corners/grey_close.png",
	infoBoxClearance: new google.maps.Size(0,50),
	isHidden: false,
	pane: "floatPane",
	enableEventPropagation: false
};
				
var gotoPropText = "Go to property"; //jasmineTranslate("Navigation/Go to property");
var driveDirectText = "See driving directions"; //jasmineTranslate("Navigation/See driving directions");	
		
/********************************* F U N C T I O N S ***********************************/
	
function getMarkerTypes(data, arrObj) {
	$.each(data.points, function(i, item){
		var some = [];
		arrObj[item.type] = some;
	});
}

function resetMap() {
		closeCustomInfo();
		
		for(var j=0; j < markerTypes.length; j++) {
			var thisMarkerType = markerTypes[j];
			hideGroup(thisMarkerType);
		}
		
		map.setZoom(zoomLvl[0]);
		map.setCenter( defaultLatLng );
		
		if($('#googleDDLForm').length > 0) {
			$('#googleRegionDDL option').eq(0).attr("selected",true)
			$('#googleCityDDL').attr('disabled',true).find('option').eq(0).attr('selected',true)
			$('#googlePropDDL').attr('disabled',true).find('option').eq(0).attr('selected',true)
			$('#googleAttDDL').attr('disabled',true).find('option').eq(0).attr('selected',true)
			try { 
			$("#full_top").show();	
			$("#asia_top, #uk_top").hide();
			} catch(e){}
		}
		
	}
	
function toggleWeather() {
	
	if(!hasWeather) {
		//FAHRENHEIT, CELSIUS
		weatherLayer = new google.maps.weather.WeatherLayer({
			suppressInfoWindows: true,
			temperatureUnits: google.maps.weather.TemperatureUnit.CELSIUS
		});
		weatherInfoWindow = new google.maps.InfoWindow();
		wEvent = google.maps.event.addListener(weatherLayer, 'click', function(wme) {
			
			try { ib.close("closeclick");} catch(e){};
			
			weatherInfoOptions.pixelOffset = new google.maps.Size(-145, -20);
			weatherInfoOptions.boxClass = "infoBox weather";
			weatherInfoOptions.content = wme.infoWindowHtml;
				ib = new InfoBox(weatherInfoOptions);
				ib.setPosition(wme.latLng);
				ib.open(map);
		});
		weatherLayer.setMap(map);
		if(enableCloud) {
			cloudLayer = new google.maps.weather.CloudLayer();
			cloudLayer.setMap(map);		
		}
		hasWeather = true;
		if(map.getZoom() > 12) map.setZoom(12);
	} else {
		try { ib.close("closeclick");} catch(e){};
		weatherLayer.setMap(null);
		if(enableCloud) cloudLayer.setMap(null);
		hasWeather = false;
	}		
} //end toggleWeather()

function closeCustomInfo(){
	try { ib.close("closeclick");} catch(e){};
	infowindow.close(); 
} // end closeCustomInfo()


function updateMap() {
	if($('#googleRegionDDL')[0].selectedIndex > 0) {
		if($('#googleAttDDL')[0].selectedIndex > 0) {
			centerOnMarker( $("#googleAttDDL").val(), 'attraction' );
		} else if($('#googlePropDDL')[0].selectedIndex > 0) {
			centerOnMarker( $("#googlePropDDL").val(), 'property' );
		}
		else if($('#googleCityDDL')[0].selectedIndex > 0) {
			centerOnMarker( $("#googleCityDDL").val(), 'city' );
		}
		else {
			centerOnMarker( $("#googleRegionDDL").val(), 'region' );
		}
	}

}
function toggleGroup(type) {
	for(var i = 0; i < markerGroups[type].length; i++) {
		var marker = markerGroups[type][i];
		if(marker.visible) {
			marker.setVisible(true);
		}
		else {
			marker.setVisible(false);
		}
	}
} //end toggleGroup

function showGroup(type) {
	
	var getType = type.toLowerCase();	
	var splitType = getType.split(" ");
	var getSplitValue = splitType[0];
	var getIputClass = "";
	
	for(var i = 0; i < markerGroups[type].length; i++) {
		var marker = markerGroups[type][i];
			marker.setMap(map);
		
		if(!marker.visible) marker.setVisible(true);
	
	}
	
	if(markerGroups[type].length > 0 ) {
		if ($(".map-legends li > input").hasClass(getType.split(" ")[0]) )
			$(".map-legends li > input."+getType.split(" ")[0]).attr("checked", "checked");
	}
		

} //end showGroup

function hideGroup(type) {
	for(var i = 0; i < markerGroups[type].length; i++) {
		var marker = markerGroups[type][i];
			marker.setVisible(false);
	}
} //end hideGroup

function toggleMarkerGroup(type,brand, state) {

	for(var i = 0; i < markerGroups[type].length; i++) {
		
		var marker = markerGroups[type][i];
		
		if(brand == "all") {
	
			if(state == true) {
					marker.setVisible(true);

				} else  {
					marker.setVisible(false);
				}
			
		} else {
			if(marker.brandname == brand) {
				if(state == true) {
					marker.setVisible(true);
				} else  {
					marker.setVisible(false);
				}	
			}
			
		}
	}
} //end hideGroup

function centerOnMarker(markerID, type){

	if( type=='region' ) {
		for(var i=0;i<regionData.length;i++) {
			if( regionData[i][0] == $("#googleRegionDDL").val() ) {				
				try {
					if(regionData[i][0]=="Europe") {
						$("#uk_top").show();	
						$("#asia_top, #full_top").hide();
					} else if(regionData[i][0]=="Asia") {
						$("#asia_top").show();
						$("#uk_top, #full_top").hide();
					}
				} catch(e){}
				
				var getPosition = new google.maps.LatLng(regionData[i][1],regionData[i][2]);
				var getZoom = regionData[i][3];
				map.setZoom(getZoom);
				map.setCenter( getPosition );
				
				break;
			}
				
		}
	} else if( type=='city') {
		
		var cityName = $("#googleCityDDL").val();
		
		for(var i = 0; i < markerGroups["Hotel"].length; i++) {
			if($.trim(cityName) == $.trim(markerGroups["Hotel"][i].city)) {
				map.setZoom(zoomLvl[6]);
				map.setCenter( markerGroups["Hotel"][i].position );
				
				for(var j=0; j < markerTypes.length; j++) {
					var thisMarkerType = markerTypes[j];
					if(thisMarkerType != undefined)
						showGroup(thisMarkerType);
					else
						showGroup("Tourist Spot");
				}
		
				break;
			}
		}
	} else if( type=='attraction') {
		var attID =  markerID;
		if($("#googleAttDDL").length > 0)
			attID = $("#googleAttDDL").val(); 
		
		for(var j=0; j < markerTypes.length; j++) {
			
			var thisMarkerType = markerTypes[j];
			
			for(var i = 0; i < markerGroups[thisMarkerType].length; i++) {
				if($.trim(attID) == $.trim(markerGroups[thisMarkerType][i].id)) {
					
					var thisMarker = markerGroups[thisMarkerType][i];
					var position = markerGroups[thisMarkerType][i].position;
					var title = markerGroups[thisMarkerType][i].getTitle();
					var getSummary = markerSummary[attID];
										
					var contentString = contentHead + '<h3 class="firstHeading">'+title+'</h3>';
						contentString += '<div id="bodyContent"><p>'+getSummary+'</p></div>';
						contentString += contentFooter;
							
					customInfoWindow(zoomLvl[6], position, title, contentString, thisMarker);
					showGroup(thisMarkerType);
					if(PROPERTY) {
						getDirection( firstMarkerToShow.getTitle(), title);	
					}
					break;
				}
			} //end for i
		}// end for j
		
		
	} else if( type=='property' ) {
		
		for(var i=0;i<markerGroups["Hotel"].length;i++) {	
		
			if( markerGroups["Hotel"][i].proplink == markerID || markerGroups["Hotel"][i].title == markerID ) {
				
				var thisMarker = markerGroups["Hotel"][i]; 
				var getPosition = markerGroups["Hotel"][i].getPosition();
				var getID = markerGroups["Hotel"][i].id;
				var getSummary = hotelSummary[getID];
				var getURI = markerGroups["Hotel"][i].uri;
				
				thisMarker.setVisible(true);
				$(".property-guoman").attr("checked",true);
				$(".property-thistle").attr("checked",true);
					
				var contentString = contentHead + '<h3>'+markerGroups["Hotel"][i].getTitle()+'</h3>';
				if(getAddInfo) {
					addInfoString = "<div><span>£155.50</span><input type=\"button\" value=\"book now\" /></div>"; //to do getPropBookInfo()
					contentString += '<div id="bodyContent"><p>'+getSummary+'<a href="'+getURI+'" target=\"_blank\">'+gotoPropText+'</a></p>'+addInfoString+'</div>';
				} else
					contentString +='<div id="bodyContent"><p>'+ getSummary +'<a href="'+ getURI +'" target=\"_blank\">'+gotoPropText+'</a></p></div>';
									
				contentString += contentFooter;
		
				try {
					ib.close("closeclick");
				} catch(e) {};
				
				//infoOptions.pixelOffset = new google.maps.Size(-90, -35);
				infoOptions.boxClass = "infoBox";
				infoOptions.content = contentString;
					ib = new InfoBox(infoOptions);
					ib.open(map, thisMarker);
						
				map.setZoom(zoomLvl[6]);
				map.setCenter( getPosition );
				
				//customInfoWindow(markerGroups["Hotel"][i],markerGroups["Hotel"][i].getTitle(), balloonContent(markerGroups["Hotel"][i]));
				//showGroup("Tourist Spot"); 
				
				markerID = "";
									
				break;
			}
		} //end for
	}
	
	
} //end centerOnMarker()

function customInfoWindow(zoom, position, title, content, marker) {
	
	try {
		ib.close("closeclick");
	} catch(e) {};
	
	//infoOptions.pixelOffset = new google.maps.Size(-90, -35);
	infoOptions.boxClass = "infoBox";
	infoOptions.content = content;
		ib = new InfoBox(infoOptions);
		ib.open(map, marker);
					
	map.setZoom(zoom);
	map.setCenter( position );
	
} //end customInfoWindow
	
function getDirection(org,des) {
	
	var start = org; 
	var end = des; 
	
	try {
		for(var i=0;i<markerGroups["Hotel"].length;i++) {	
			if( markerGroups["Hotel"][i].title.toLowerCase() == start.toLowerCase() || markerGroups["Hotel"][i].proplink == start  ) {
				start = markerGroups["Hotel"][i].getPosition();  
				break;
			}
		} 
	} catch(e) {}
	
	try {
		
		for(var j=0; j < markerTypes.length; j++) {
			var thisMarkerType = markerTypes[j];
			for(var i=0;i<markerGroups[thisMarkerType].length;i++) {
				if( markerGroups[thisMarkerType][i].title.toLowerCase() == end.toLowerCase() || markerGroups[thisMarkerType][i].id == end ) {
					end = markerGroups[thisMarkerType][i].getPosition();
					break;
				}		
			} //end for i
		} //end for j
				
		
	} catch(e) {}
	
	var request = {
		origin:start,
		destination:end,
		travelMode: google.maps.DirectionsTravelMode.DRIVING
	};
			
	directionsService.route(request, function(response, status) {
	  if (status == google.maps.DirectionsStatus.OK) {
		directionsDisplay.setDirections(response);
	  }
	});
	$("#directions_placeholder, #directions_panel").show();
	$(window).scrollTop($("#directions_placeholder").offset().top); 
} //end getDirection


function initializeAttractions(obj) {
	var getURL = $(location).attr('href');
	
	if(isFrontDesk) var attraction_content = "<ul class=\"list-attractions frontdesk-list-attractions\">";
	else var attraction_content = "<ul class=\"list-attractions\">";
	
	for(property in markerGroups) {
		
		if(property != "Hotel") {
			//attraction_content += "<ul class=\"list-attraction-content\">";
			var inner_attraction_content="";
			for(var i = 0; i < markerGroups[property].length; i++) {
				inner_attraction_content += "<li class=\"attraction-info\"><a href=\"javascript:;\" onclick=\"closeCustomInfo(); centerOnMarker("+markerGroups[property][i].id+", '"+property+"' ); scrollUp();\" "+
									 "class=\"prop-link\">" + markerGroups[property][i].getTitle() + "</a></li>";	
			}
			
			if(inner_attraction_content != "") {
				attraction_content += "<li class=\"attractions attraction-" + property.replace(/ /, "-").toLowerCase() + "\">"+
								  "<input type=\"checkbox\" value=\"Hide/Show Bars\" onclick=\"closeCustomInfo();toggleGroup('" + property + "')\" checked=\"checked\" class=\"attraction-checkbox hidden\"/>";
								  
				if(isFrontDesk) attraction_content += "<h2 class=\"head attraction-head\">" + property + "</h2><ul class=\"list-attraction-content frontdesk-content frontdesk-directions-list\">";
				else  attraction_content += "<h4 class=\"head attraction-head\">" + property + "</h4><ul class=\"list-attraction-content\">";	
				
				attraction_content += inner_attraction_content;
				attraction_content += "</ul>";
			}
			
			attraction_content += "</li>";
		}
		showGroup(property);
		
	}
	
	attraction_content += "</ul>";
	if($(obj).find(".list-attractions").size() <= 0)
	$(obj).append(attraction_content);
}

function generateSelector() {
	
	var resultString = "";
	var regionString ="" 
	var cityString ="";
	var regionBuffer = "Buffer:";
	var cityBuffer = "Buffer:";
	
	
	for(var i = 0; i < markerData.length; i++) {
		if(markerData[i][5] != "" && regionBuffer.indexOf(markerData[i][5]) <= 0) {
			regionString += "<option value=\"" + markerData[i][5] + "\">" + markerData[i][5] + "</option>";
			regionBuffer += "," + markerData[i][5];
		}
					
		if(markerData[i][3] != "na" && cityBuffer.indexOf(markerData[i][3]) <= 0) {
			cityString += "<option value=\"" + markerData[i][3] + "\">" + markerData[i][3] + "</option>";
			cityBuffer += "," + markerData[i][3];
		}
	}
	
	resultString += "<div class=\"google-dropdown-block content\">"+
					"<h3 class=\"hidden\">Find a Hotel Selection</h3>"+
					"<form class=\"form-inline content\" method=\"get\" action=\"javascript:;\">"+

					"<ol id=\"googleDDLForm\" class=\"google-dropdown-list content\">";
	
	resultString += "<li id=\"region\"><select id=\"googleRegionDDL\" onchange=\"updateCityDDL(this.value);\"><option value=\"0\"> - Select Region - </option>";
	resultString += regionString;
			
	resultString += "</select></li>";
	resultString += "<li id=\"city\"><select id=\"googleCityDDL\" onchange=\"updatePropDDL(this.value);\" disabled=\"disabled\"><option value=\"0\">- Select City -</option>";
	resultString += cityString;
	
	resultString += "</select></li>";
	resultString += "<li id=\"property\"><select id=\"googlePropDDL\" onchange=\"lockPropAtt()\" disabled=\"disabled\"><option value=\"0\">- Select Property -</option></select></li>";
	resultString += "<li id=\"attraction\"><select id=\"googleAttDDL\" onchange=\"lockPropAtt()\" disabled=\"disabled\"><option value=\"0\">- Select Tourist Spot -</option></select></li>";
	resultString += "<li class=\"form-actions\"><ul><li><input type=\"submit\" onclick=\"closeCustomInfo();updateMap();\" value=\"Go\" class=\"btn btn-submit\" /></li>";
	resultString += "<li><input type=\"submit\" onclick=\"resetMap();\" value=\"Reset\" class=\"btn btn-submit\" /></li></ul></li>";
	resultString += "</ol></form></div>";
	
	return resultString;
		
} //end generateSelector

function updateCityDDL(regionName) {
	if(document.getElementById('googleCityDDL')) $('#googleCityDDL').remove();
	var citySelector = "<select id=\"googleCityDDL\" onchange=\"updatePropDDL(this.value);\"><option value=\"0\">- Select City -</option>";
	var cityBuffer = "Buffer:";
	for(var i = 0; i < markerData.length; i++) {
		if((markerData[i][5] == regionName || regionName == 0) && cityBuffer.indexOf(markerData[i][3]) <= 0 && markerData[i][3] != "na") {
			citySelector += "<option value=\"" + markerData[i][3] + "\">" + markerData[i][3] + "</option>";
			cityBuffer += "," + markerData[i][3];
		} 
	}
	citySelector += "</select>";
	$(citySelector).appendTo('li#city');
	updatePropDDL("0");
	if($('#googleRegionDDL')[0].selectedIndex == 0) $('#googleCityDDL').attr("disabled", true);
} //end updateCityDDL

function updatePropDDL(cityName) {
	if(document.getElementById('googlePropDDL')) {
		$('#googlePropDDL').remove();
		tempPropArray = [];
	}
	if(document.getElementById('googleAttDDL')) {
		$('#googleAttDDL').remove();
	}
	$(generatePropertySelector(cityName)).appendTo('li#property');
	
	$(generateAttDDL()).appendTo('li#attraction');
	if($('#googleCityDDL')[0].selectedIndex <= 0) {
		$('#googlePropDDL').attr("disabled", true);
		$('#googleAttDDL').attr("disabled", true);
	}
	
	$("#googleAttDDL").each(function() {
		var selectedValue = $(this).val();
		
		$(this).html($("option", $(this)).sort(function(a, b) {
			return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
		}));
		
		$(this).val(selectedValue);
});
} //end updateCityDDL

function generatePropertySelector(cityName) {
	var propSelector = "<select id=\"googlePropDDL\" onchange=\"lockPropAtt();\"><option value=\"0\">- Select Property -</option>";
	for(var i = 0; i < markerData.length; i++) {
		if(markerData[i][3] == cityName) {
			propSelector += "<option value=\"" + markerData[i][4] + "\">" + markerData[i][2] + "</option>";
			tempPropArray.push(markerData[i][4]);
		}
	}
	propSelector += "</select>";
	return propSelector;
} //end generatePropertySelector

function generateAttDDL() {
	var attBuffer = "Buffer:";
	var attSelector = "<select id=\"googleAttDDL\" onchange=\"lockPropAtt();\"><option value=\"0\">- Select Tourist Spot -</option>";
	for(var i = 0; i < tempPropArray.length; i++) {
		for(var j = 0; j < markerData.length; j++) {
			if(markerData[j][4].indexOf(tempPropArray[i]) >= 0 && attBuffer.indexOf(markerData[j][0]) < 0 && markerData[j][1] != "Hotel") {
				attSelector += "<option value=\"" + markerData[j][0] + "\">" + markerData[j][2] + "</option>";
				attBuffer += "," + markerData[j][0];
			}
		}
	}
	attSelector += "</select>";	
	return attSelector;
} //end generateAttDDL

function sortAttDDL() {

    // Loop for each select element on the page.
    
}

function lockPropAtt(obj) {
	if($('#googlePropDDL')[0].selectedIndex > 0) $('#googleAttDDL').attr("disabled", true);
	else $('#googlePropDDL').attr("disabled", true);
	if($('#googlePropDDL')[0].selectedIndex <= 0 && $('#googleAttDDL')[0].selectedIndex <= 0) {
		$('#googlePropDDL').attr("disabled", false);
		$('#googleAttDDL').attr("disabled", false);
	}
}

function overrideDefaultLinks() {
	if($(".state-wrap").size() > 0) {
		$(".find_hotel_propname a").each(function () {
			$(this).before('<a href="javascript:closeCustomInfo();centerOnMarker(\'' + $(this).text() + '\',\'property\');scrollUp();" class=\"icon\">icon</a>');
		});	
	}
}

function linkJSOnDemand(jsURL) {
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = jsURL;
	head.appendChild(script);
}


$(function() {
	try { 

		$(".toggle-weather").click(function() {
			toggleWeather();
		});
		
	} catch(e) {}	
});