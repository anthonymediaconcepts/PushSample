/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		  
        app.receivedEvent('deviceready');
		navigator.splashscreen.show();
		
		setTimeout(function() {
        	navigator.splashscreen.hide();
    	}, 2000);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var pushNotification;
        pushNotification = window.plugins.pushNotification;
        
        
        pushNotification.register(
        tokenHandler,
        errorHandler, {
            "badge":"true",
            "sound":"true",
            "alert":"true",
            "ecb":"onNotificationAPN"
        });
        
        
        function successHandler (result) {
            alert('result = ' + result);
        }
        
        function errorHandler (error) {
            alert('error = ' + error);
        }
        
        function tokenHandler (result) {
            // Your iOS push server needs to know the token before it can push to this device
            // here is where you might want to send it the token for later use.
            alert('device token = ' + result);
        }
        
        function onNotificationAPN (event) {
            if ( event.alert )
            {
                navigator.notification.alert(event.alert);
            }

            if ( event.sound )
            {
                var snd = new Media(event.sound);
                snd.play();
            }

            if ( event.badge )
            {
                pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
            }
        }
        
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        //console.log('Received Event: ' + id);
    }
};
