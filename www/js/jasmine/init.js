	/********************************* F U N C T I O N S ***********************************/
	var map;
	var markersArray = [];
	var	markerGroups = {};
	var	markerTypes = {};
		
	var returnMyLocal = "";
	var hasInit = false;
	var geocoder;
		geocoder = new google.maps.Geocoder();
		
	function getFormattedAddress(latlong, obj) {
        var isObjElement = false;
        try {
            if( 'jquery' in obj) isObjElement =true;
        } catch(e) { }

		var formatted_address="";
		geocoder.geocode({'latLng': latlong}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				
				if (results[1]) {
					formatted_address = results[1].formatted_address;
					if(isObjElement)$(obj).val( formatted_address );
					else mylocation = formatted_address;
				}
			} 
		}); 
	}
	
	function fullScreenMode(controlDiv, map) {
		
        // Set CSS styles for the DIV containing the control
        // Setting padding to 5 px will offset the control
        // from the edge of the map
        controlDiv.style.padding = '5px';

        // Set CSS for the control border
        var controlUI = document.createElement('div');	
        controlUI.style.backgroundColor = 'white';
        controlUI.style.borderStyle = 'solid';
        controlUI.style.borderWidth = '1px';
        controlUI.style.cursor = 'pointer';
		controlUI.style.color = '#000000';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to set the map to Home';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior
        var controlText = document.createElement('div');
        controlText.style.fontFamily = 'Arial,sans-serif';
        controlText.style.fontSize = '12px';
        controlText.style.paddingLeft = '7px';
        controlText.style.paddingRight = '7px';
		controlText.style.paddingTop = '2px';
		controlText.style.paddingBottom = '1px';
        controlText.innerHTML = '<b>Toggle FullScreen</b>';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to
		//ilast_click_time = new Date().getTime();
        google.maps.event.addDomListener(controlUI, 'click', function(e) {
			
			//iclick_time = e['timeStamp'];
			//if (click_time && (iclick_time - ilast_click_time) < 200) {
			//e.stopImmediatePropagation();
			//	e.preventDefault();
			//	return false;
			//} else {
				$("#map_canvas").toggleClass("custom");
				$("body, html").toggleClass("fullscreen");
				$('#container').removeAttr("style");
				hasInit = false;
				//initialize();
				$(window).scrollTop($("#map_canvas").offset().top);
				google.maps.event.trigger(map, 'resize');
				
				if(  $("body").hasClass("fullscreen") ) {
					
					iScroller.destroy();
					iScroller = null;	
					
				} else {
					
					initScroll($(uiActivepage).find($(".pRefresh")).attr("id"), $(uiActivepage).find($(".pUp")).attr("id"),  $(uiActivepage).find($(".pDown")).attr("id"));
					
				}
				
				

			//}
			//ilast_click_time = iclick_time;
        }, true);

     }
	 
	function initDirectionDisplay() {
		
		try {		
			directionsDisplay = new google.maps.DirectionsRenderer(renderOptions);
			directionsDisplay.setMap(map);
			if($("#directions_placeholder").length > 0)
				directionsDisplay.setPanel(document.getElementById('directions_placeholder'));
			else
				directionsDisplay.setPanel(document.getElementById('directions-panel'));
			
			google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
				setTimeout('initScroll($(uiActivepage).find($(".pRefresh")).attr("id"), $(uiActivepage).find($(".pUp")).attr("id"),  $(uiActivepage).find($(".pDown")).attr("id"))',200);
			});
	
		} catch(e) {}
	}
	
	function preventFormSubmitOnEnter(obj) {
		$(obj).keydown(function(event){
			if(event.keyCode == 13) {
				event.preventDefault();
				return false;
			}
		});	
	}  
	function initializeMap() {
		
		var DEBUG = true;
		var defaultBounds = new google.maps.LatLngBounds(
							new google.maps.LatLng(landing_center_lat, landing_center_lng));
							
		//myOptions found in googlemap-util.js
		if($("#map_canvas").length > 0) {
		
			map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
			
			if(enableFullScreen){
				var fullScreenControlDiv = document.createElement('div');
				var fullScreenControl = new fullScreenMode(fullScreenControlDiv, map);
			
					fullScreenControlDiv.index = 1;
					map.controls[google.maps.ControlPosition.TOP_RIGHT].push(fullScreenControlDiv);
					google.maps.event.trigger(map, 'resize');	
			}
			
			initDirectionDisplay();
			
			try {
				
				if($("#search_address").length > 0) {
					var input = document.getElementById('search_address');
					var searchBox = new google.maps.places.SearchBox(input);
					var thisMarkers = [];
					
					google.maps.event.addListener(searchBox, 'places_changed', function() {
						
						try { ib.close("closeclick");} catch(e){};
						
						var places = searchBox.getPlaces();
						
						for (var i = 0, searchMarker; searchMarker = thisMarkers[i]; i++) {
							searchMarker.setMap(null);
						}
						
						thisMarkers = [];
						var bounds = new google.maps.LatLngBounds();
						$.each(places, function(i, place){	
						//for (var i = 0, place; place = places[i]; i++) {
							var image = new google.maps.MarkerImage(
								place.icon, new google.maps.Size(71, 71),
								new google.maps.Point(0, 0), 
								new google.maps.Point(17, 34),
								new google.maps.Size(25, 25));
							
							var searchMarker = new google.maps.Marker({
							  map: map,
							  icon: image,
							  title: place.name,
							  position: place.geometry.location
							});
							
							google.maps.event.addListener(searchMarker, 'click', function() {
								try { ib.close("closeclick");} catch(e){};
								getDirection( propPID, searchMarker.getPosition() ); 
								map.setCenter( searchMarker.getPosition() );
							});
							
							thisMarkers.push(searchMarker);
							bounds.extend(place.geometry.location);
						//}
						});
						
						map.fitBounds(bounds);
					});
						
					google.maps.event.addListener(map, 'bounds_changed', function() {
						var bounds = map.getBounds();
						searchBox.setBounds(bounds);
					});	
				}
			} catch(e) {}
			
			$.getJSON(g_domain+"/application/components_jsp/google_markers_JSON.jsp?pid="+propPID+"&landing="+landing+"&docid="+docid, function(data){
				
				
				mapData = data;
				markerGroups[mapOptions.markerHotel]=new Array();
				markerGroups[mapOptions.markerOtherHotel]=new Array();
				getMarkerTypes(mapData, markerGroups);
				
				$.each(data.points, function(i, item){
					
					var location = new google.maps.LatLng(item.lat,item.lng);
					/*var image = new google.maps.MarkerImage(item.icon,
								new google.maps.Size(32, 32), // This marker is 20 pixels wide by 32 pixels tall.					
								new google.maps.Point(0,0), // The origin for this image is 0,0.					
								new google.maps.Point(0, 32)); // The anchor for this image is the base of the flagpole at 0,32.*/
					
					var image = new google.maps.MarkerImage(g_domain+item.icon, 
								new google.maps.Size(32, 32), 
								new google.maps.Point(0, 0), 
								new google.maps.Point(15, 32));
					//var image = new google.maps.MarkerImage(item.icon, null, null, null, new google.maps.Size(32,32));
								
					var shadow = new google.maps.MarkerImage(defaultShadow,
								new google.maps.Size(59, 32), // The shadow image is larger in the horizontal dimension
								new google.maps.Point(0,0), // while the position and offset are the same as for the main image.
								new google.maps.Point(15, 32));
					var marker = new google.maps.Marker({
						position: location,
						shadow: shadow,
						icon: image,
						title: item.title
					});
					
					marker.id=item.id;
					marker.uri=item.uri;
					marker.region=item.region;
					marker.city=item.city;
					marker.openingdate=item.opendate;
					marker.category=item.type;
					marker.proplink=item.proplink;
					marker.brandname=item.brandname;
					marker.markertypetranslation=item.markertypetranslation;
					
					
					try { 
						markerGroups[item.type].push(marker);			
						markerData.push(new Array(item.id, item.type, item.title, item.city, item.proplink, item.region));
					} catch(e) {}
					
					var contentString = contentHead + '<h3 class="firstHeading">'+item.title+'</h3>';
							
					if(item.type == "Hotel") {
						
						firstMarkerToShow = marker;
						//firstMarkerString = contentString;
					
						marker.setMap(map);
						if(getAddInfo) {
							addInfoString = "<div><span>£155.50</span><input type=\"button\" value=\"book now\" /></div>"; //to do getPropBookInfo()
							contentString += '<div id="bodyContent"><p>'+hotelSummary[item.id]+'<a href="'+item.uri+'">'+ gotoPropText +'</a></p>'+addInfoString+'</div>';
						} else
							contentString += '<div id="bodyContent"><p>'+hotelSummary[item.id]+'<a href="'+item.uri+'">'+ gotoPropText +'</a></p></div>';
					} else {
						if(PROPERTY)
							contentString += '<div id="bodyContent"><p>'+markerSummary[item.id]+'<a href=\"#directions\"><span>'+driveDirectText+'</span></a></p></div>';
						else
							contentString += '<div id="bodyContent"><p>'+markerSummary[item.id]+'</p></div>';
					}
					
					contentString += contentFooter;
					
					//firstMarkerToShow = marker;
					firstMarkerString = contentString;
					
					google.maps.event.addListener(marker, 'click', function() {
						if(PROPERTY) {
							getDirection( propPID, marker.id);
							$('#prop-directions-content').hide();
							$('#prop-local-attractions').hide();
							$('#prop-directions-message').show();
						}
						try { ib.close("closeclick");} catch(e){};
						//infoOptions.pixelOffset = new google.maps.Size(-90, -35);
						infoOptions.boxClass = "infoBox hotel";
						infoOptions.content = contentString;
							ib = new InfoBox(infoOptions);
							ib.setPosition(location);
							ib.open(map, marker);
						
						map.setCenter( location );
						
					});
					
				}); //end $.each
				
				if(PROPERTY) {
					initializeAttractions($('#prop-local-attractions'));
					map.setZoom(zoomLvl[6]);
					map.setCenter( firstMarkerToShow.getPosition() );
					customInfoWindow(zoomLvl[6], firstMarkerToShow.getPosition(), firstMarkerToShow.getTitle(), firstMarkerString, firstMarkerToShow);
					
				} else {
					try {
						if(landing != "yes") {							
							if($("#googleDDLForm").length <= 0)
								$(generateSelector()).insertBefore('#map_canvas');
								
								var getParams = parseURLParam();
								for(var i=0; i<=getParams.length; i++) {
									var tempParam = getParams[i][0];
									if(tempParam =="region"){
										$("#googleDDLForm #region > select option[value="+getParams[i][1]+"]").attr('selected', true).trigger("change");
										closeCustomInfo();updateMap();
										return false;
									} 
								}
						} else if(isFrontDesk) {
							map.setZoom(zoomLvl[6]);	
							
							map.setCenter( firstMarkerToShow.getPosition() );							
							renderOptions.suppressMarkers = false;
							initDirectionDisplay();
							
							locateConf.enableDummyLatLong = false;
							locateConf.setFormObj = $(".form-google-map-directions ul");
										
								try {
									
                                    if("find" == mapsearch)
                                        findLocation(false);
                                    else if("directions" == mapsearch) {
										getLocation();
										preventFormSubmitOnEnter($("form.form-google-map-directions"));
                                        var location1Obj = $("#location1").length > 0 ? $("#location1") : "";
						
										//firstMarkerToShow.getPosition()
										//getFormattedAddress(mylocation, location1Obj);

                                        $(".loc-search").each(function() {
                                            var input = document.getElementById( $(this).attr("id") );
                                            var searchBox = new google.maps.places.SearchBox(input, {
                                                bounds: defaultBounds
                                            });
                                        });
										
                                    } else if("tracks" == mapsearch) {
                                        var bikeLayer = new google.maps.BicyclingLayer();
                                            bikeLayer.setMap(map);
                                            map.setZoom(14);
                                    } else if("attractions" == mapsearch)
                                        initializeAttractions($('.google-map-block'));
		

								} catch(e) {}
							
						}
					} catch(e) { }
				}
			});
			if(DEBUG) console.log("google map init");
		} //check if canvas exist
	} // end initialize();
	
	/********************************* I N I T - O N L O A D ***********************************/
	
	$(function() {
		initializeMap();
		
		if($(".prop-list-block").length > 0) overrideDefaultLinks();
	}); //on load
	
	
	