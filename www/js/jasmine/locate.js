var geolocEnabled = false; 
var findMyLoc = false;
var mylocation;
var locateConf = {
	enableDummyLatLong : false,
	setFormObj : ""
}

$(function() {
	if(navigator.geolocation) {
		$(".find-near-prop").removeClass("hidden");
		geolocEnabled = true; //check and set browsers geolocation support
	}
});

// Check in the browser supports native geolocation and make a call to the geolocation service
function findLocation() {
	if(geolocEnabled) {   		navigator.geolocation.getCurrentPosition(successCallback,errorCallback);
	} else {
		alert("Your browser doesn't support geolocation services");
	}
}

function getLocation(obj) {
	if(geolocEnabled) {
		navigator.geolocation.getCurrentPosition(returnMyLocation);
	} else {
		alert("Your browser doesn't support geolocation services");
	}	
}

function returnMyLocation(position){
	if(locateConf.setFormObj != "") $(locateConf.setFormObj).removeClass("hidden");
	if(locateConf.enableDummyLatLong) {
		var latitude = 51.507914; //London
		var longitude = -0.15029; //London
		//var latitude = 51.512080;
		//var longitude = -0.205742;
	} else {
		var latitude = roundNumber(position.coords.latitude,2);
		var longitude = roundNumber(position.coords.longitude,2);		
	}
	mylocation = new google.maps.LatLng(latitude, longitude);
	return mylocation;
}
/* not required
function sortfunction(a, b){
	return (a - b) //causes an array to be sorted numerically and ascending
}

function sortByDelta(a, b) {
    var x = a[1];
    var y = b[1];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
} */

function roundNumber(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}

function simpleGreatCircle(lat1, long1, lat2, long2) {
	var r=6371 //km (about 3,959 mi)
	var rlat1=lat1 * Math.PI / 180;
	var rlat2=lat2 * Math.PI / 180;
	var rlong1=long1 * Math.PI / 180;
	var rlong2=long2 * Math.PI / 180;
	d = r * Math.acos(Math.sin(rlat1) * Math.sin(rlat2) + Math.cos(rlat1) * Math.cos(rlat2) * 
	Math.cos(rlong2-rlong1));
 	return d;
}


function successCallback(position) {
	
	try {
		var myCurrentBrand = $.cookie("currentBrand"); //cookie value is set from reservationBox.jsp
	} catch(e) {}
	
	if(locateConf.enableDummyLatLong) {
		var latitude = 51.512080;
		var longitude = -0.205742;
	} else {
		var latitude = roundNumber(position.coords.latitude,2);
		var longitude = roundNumber(position.coords.longitude,2);		
	}

	var hotelLat;
	var hotelLong;
	var delta;
	var propID;
	var myDists=new Array();
	var nearest = 5000.000;
	var myPropID;
	var dProp;
	
	//console.log("this is my location:"+latitude+" ,"+longitude);
	//load the nearest brand;
	
	findMyLoc = true;
	
	if(findMyLoc) {
		var end = markerGroups["Hotel"][0].getPosition();
		mylocation = new google.maps.LatLng(latitude, longitude);
		
		var request = {
			origin:mylocation,
			destination:end,
			travelMode: google.maps.DirectionsTravelMode.DRIVING
		};
				
		directionsService.route(request, function(response, status) {
		  if (status == google.maps.DirectionsStatus.OK) {
			  
			  response;
			  
			directionsDisplay.suppressMarkers = false;
			directionsDisplay.setDirections(response);
		  }
		});
		
	} else {
		var uri= "/group/find_a_hotel.html?searchby=location&lat="+latitude+"&long="+longitude;
		window.location.href=uri;	
	}
	
	
}

function errorCallback() {
  alert('There was an Error retrieving your location. Please make sure your Location Services is turned on.');
}