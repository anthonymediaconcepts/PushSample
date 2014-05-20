/* Original Functions */
/* For use with jQuery 1.4 and above */
var submitConf = {
	dataType: "xml"	
}

function makeRandomStr()
{
	if (/OS 6_/.test(navigator.userAgent) || /OS 5_/.test(navigator.userAgent) ) {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for( var i=0; i < 15; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		
		text = "?ls=" + text;
		
    	return text;
    } else {
		return "";	
	}
}

function myFailCallBack(formName, errorMessage) { 
	var formOffset = $("div#formErrors_" + formName).offset(); 
	$("div#formErrors_" + formName).html(errorMessage).fadeIn("normal"); 
	eval("setUnBlockUIError")();
	$("html,body").animate({ scrollTop: formOffset.top }, "normal");	
}

$.fn.setFocus = function(e)
    {
    if (document.getElementById(e))
        document.getElementById(e).focus();
    return this;
    };
	

var errorSubCtr = 0;

$.fn.ajaxSubmit = function(e)
    {
    /* Change a form's submission type to ajax */
	
	
	
    this.submit(function()
        { 
		
        var params = {};
        var IncCounter = 0;
        var OldArrayName = "";
        var thisParam = "";
        params['call'] = 'ajax';
        var formName = $(this).attr('name');
		var formOffset = $("div#formErrors_" + formName).offset();
		//$("div.formErrors:visible").html("").fadeOut("normal");
		$("div.formErrors").html("").filter("not:hidden").fadeOut("normal");
		
		
		
		//Placeholder FIX 
		try { 
		if(!Modernizr.input.placeholder){
			$("#"+formName).find('[placeholder]').each(function() {
				var input = $(this);
				if (input.val() == input.attr('placeholder')) {
				  input.val('');
				}
			});
		}
		} catch(e) {}
		var strParams = new Array;
        $(this).find("input:checked,input:text,input[type=number],input[type=tel],input[type=email],input:hidden,input:password,input:submit,select option:selected,textarea").each(function()
            {
			
            ArrayName = this.name || this.id || this.parentNode.name || this.parentNode.id || this.parentNode.parentNode.name || this.parentNode.parentNode.id;
            thisParam = params[ArrayName];

            $(this).removeClass("fielderror");
            $("div.error_" + this.name).html("");

            if (thisParam == null)
                {
				
                thisParam = new Array(1);
                thisParam[0] = this.value;
				strParams.push(this.value);
                OldArrayName = ArrayName;
                }
            else
                {
					
					if($(this).attr('type') == 'radio' || $(this).attr('type') == 'checkbox' ) 
					{
						if ($(this).attr('checked') == true || $(this).attr('checked') == 'checked' || $(this).is(':checked') )
						{
							thisParam.length = thisParam.length + 1;
							thisParam[thisParam.length - 1] = this.value;
						}
						
					} else {
						thisParam.length = thisParam.length + 1;
						thisParam[thisParam.length - 1] = this.value;	
					}
                
                }
				
			if($(this).attr('type') == 'radio' || $(this).attr('type') == 'checkbox' ) 
				{
				 
				 if ($(this).attr('checked') == true || $(this).attr('checked') == 'checked' || $(this).is(':checked') )
					{						
					params[ArrayName] = thisParam; 
					}
				else {
					//do nothing	
					}
				}
            else if ($(this).attr('type') == 'submit')
                {
                if ($(this).attr('checked') == true || $(this).attr('checked') == 'checked' || $(this).is(':checked') )
                    {
                    params[ArrayName] = thisParam;
					}	
                }
            else
                params[ArrayName] = thisParam;
            });

        eval("setBlockUI")();
		var ajaxposturl= this.getAttribute("action")+ makeRandomStr();
        $.ajax({
            url: ajaxposturl,
            type: 'POST',
            data: params,
			traditional:true,
            dataType: 'xml', //submitConf.dataType,
            cache: false,
            //timeout: 1000,
            error: function(XMLHttpRequest, textStatus, errorThrown)
                {
					
                //var errMessage="It appears that an unexpected error was encountered when posting the form.<br>The post returned an Exception "+XMLHttpRequest.status+": "+XMLHttpRequest.statusText;
				var errMessage = "Sorry but it appears that an unexpected error was encountered, please refresh the page and try again.<br /><br />If you still encounter the same error, please try again later.";
				if(XMLHttpRequest.statusText == "timeout") 
					errMessage = "Your session has timed out. Click <a href='/' title='refresh'>here</a> to return to homepage.";
					
				if(XMLHttpRequest.status == "12030" || XMLHttpRequest.status == "12031" || XMLHttpRequest.status == "12152") {
						if(errorSubCtr < 2) {
							$("#"+formName).submit(); //resubmit the form to try again
							errorSubCtr++; //console.log("submit count:"+errorSubCtr);	
							
							return false;
						}
						else {
							myFailCallBack(formName, errMessage);							
						}
						
						
				} else {
					myFailCallBack(formName, errMessage);
				}
				
				$.ajax({
					type: "POST",
					url: "/ErrorTracker",
					data:   "textStatus="+encodeURIComponent(textStatus)+
							"&jqXHRStat="+XMLHttpRequest.status+
							"&jqXHRText="+XMLHttpRequest.statusText+
							"&jqXHResponse="+XMLHttpRequest.responseText+
							"&errorThrown="+encodeURIComponent(errorThrown)+
							"&FormName="+encodeURIComponent(formName)+
							"&ajaxposturl="+encodeURIComponent(ajaxposturl)+
							"&Url="+encodeURIComponent(this.url)+
							"&PageUrl="+encodeURIComponent(window.location.href)+
							"&strParams="+encodeURIComponent(strParams)
					,
					async: false
				});//ajax	
				
                },
            success: function(xmldata, textStatus)
                {
                strError = "Please refresh the page and try again.";
                oFocus = null;
                oRedirect = "true";
                oSuccessText = "";
                oResultContainer = "";
                var hasError = false;
				
                $("AjaxResponse", xmldata).each(function()
                    {
                    var AjaxResp = this;
                    $(document).find("input:image,input:radio,input:text,input[type=number],input[type=tel],input[type=email],input:password,select,textarea").each(function()
                        {
                        if (this.name == null)
                            {
                            if (this.parentNode.name > 0 && AjaxResp.getAttribute(this.parentNode.name) != null)
                                {
                                $(this).addClass("fielderror");
                                $("div.error_" + this.name).html(AjaxResp.getAttribute(this.name));
                                hasError=true;
                                }
                            }
                        else if (this.name.length > 0 && AjaxResp.getAttribute(this.name) != null)
                            {						
                            $(this).addClass("fielderror");
                            $("div.error_" + this.name).html(AjaxResp.getAttribute(this.name));
                            hasError=true;
                            }
                        else
                            {
                            $(this).removeClass("fielderror");
                            $("div.error_" + this.name).html("");
                            }
						
						try {		
							if(isMobile && !Modernizr.input.placeholder && ($.browser.msie && $.browser.version < 10)){
								var input = $(this);
								if (input.val() == '' || input.val() == input.attr('placeholder')) {
									input.addClass('placeholder');
									input.val(input.attr('placeholder'));
								}
							}
						} catch(e) {}
                        });

                    $(document).find("input:checkbox").each(function()
                        {
                        if (this.name.length > 0 && AjaxResp.getAttribute(this.name) != null)
                            {
                            $(this).parent().addClass("fielderror");
                            $("div.error_" + this.name).html(AjaxResp.getAttribute(this.name));
                            hasError=true;
                            }
                        else
                            {
                            $(this).parent().removeClass("fielderror");
                            $("div.error_" + this.name).html("");
                            }
                        });
                    strRedirect = this.getAttribute("redirecturl");
                    strError = this.getAttribute("error");
                    oFocus = this.getAttribute("focus");
                    oRedirect = this.getAttribute("Redirect");
                    oSuccessText = this.getAttribute("SuccessText");
					oJSONString = this.getAttribute("JSONString");
                    oResultContainer = this.getAttribute("resultContainer");
                    onewWindowOnSuccess = this.getAttribute("newWindowOnSuccess");
					oCallBackFunction = this.getAttribute("oCallBackFunction"); // Empty if no callback function
					
                    });


                if (strError.length == 0)
                    {
                    try
                        {		
						if(oSuccessText != "")
                        	post_form_submit(true, oSuccessText);
						
						if(	oCallBackFunction != "" && oJSONString != "") eval(oCallBackFunction)(oJSONString);
						
                        }
                    catch(e1)
                        {
                        }
                    if(oRedirect=="true")
                        {
							if(onewWindowOnSuccess=="true")
								{
								window.open(strRedirect);
								eval("setUnBlockUI")();
								}
							else {
								window.location = strRedirect;
								}
						} else {
							
							var isReplace =true;
							if(isReplace) { 
								$(oResultContainer).html(oSuccessText).show(); //oResultContainer = ".recommended-rooms";//set dynamic div name from form field value
								if(oCallBackFunction.length != 0) {
									try { 
									eval(oCallBackFunction)(formName);
									} catch(e) {};
								}
									
							} else {
								$(oResultContainer).hide();
								$("<h1>"+oSuccessText+"</h1>").insertAfter(oResultContainer);
								if(oCallBackFunction.length != 0) {
									try { 
									eval(oCallBackFunction)(formName);
									} catch(e) {};
								}
							}
							
							eval("setUnBlockUI")();
							
						}
						try
							{
								$(document).find("input:submit").each(function() {
									$(this).attr('checked',false);
								});
							}
						catch(e) {
							}
                    }
                else
                    {
                    hasError=true;
					
                    $("div#formErrors_" + formName).html("<ul>" + strError.replace(/(\t)(.+)/g, "<li>$2<\/li>") + "<\/ul>").filter(":hidden").fadeIn("normal");
                    try
                        {
                        if (oFocus) 
							{
								
								var oFocusOffset = $("#" + oFocus).offset();
								var formOffset = $("div#formErrors_" + formName).offset();
								try {
									
									if( $("div#formErrors_" + formName).find("li").length > 1 )
										{
										$("html,body").animate({ scrollTop: formOffset.top }, "normal");
										}
									else 
										{
										
										$("html,body").animate({ scrollTop: oFocusOffset.top }, "normal");	
										}
								} catch(e) { $("html,body").animate({ scrollTop: oFocusOffset.top }, "normal");	 };
							}
                        }
                    catch(e)
                        {
                        };
                    try
                        {
						$(document).find("input:submit").each(function() {
							$(this).attr('checked',false);
						});
                        post_form_submit(false,oSuccessText);
                        }
                    catch(e1)
                        {
                        }

                    }

                if(hasError)
                    eval("setUnBlockUIError")();
                else
                    try { $.unblockUI(); } catch(e) {}
                }, complete:function(jqXHR, textStatus) {
					//code here...
				}
        });


        return false;
        });

    return this;
    };


$.fn.ajaxSubmitAll = function(e)
    {
	
    /* Change a form's submission type to ajax */
    this.submit(function()
        {
        var params = {};
        var IncCounter = 0;
        var OldArrayName = "";
        var thisParam = "";
        params['call'] = 'ajax';

        $(document).find("input:checked,input:text,input[type=number],input[type=tel],input[type=email],input:hidden,input:password,select option:selected,textarea").each(function()
            {
            ArrayName = this.name || this.id || this.parentNode.name || this.parentNode.id || this.parentNode.parentNode.name || this.parentNode.parentNode.id;

            if (ArrayName == OldArrayName)
                {
                // Add to the array
                thisParam.length = thisParam.length + 1;
                thisParam[thisParam.length - 1] = this.value;
                }
            else
                {
                thisParam = new Array(1);
                thisParam[0] = this.value;
                OldArrayName = ArrayName;
                }

            params[ArrayName] = thisParam;
            });

        eval("setBlockUI")();

        //$.post(this.getAttribute("action") + "?call=ajax", params, function(xml)
        $.post(this.getAttribute("action"), params, function(xml, textStatus)
            {
            //alert(textStatus);
            eval(" setUnBlockUI")();
            strError = "Please refresh the page and try again.";
            oFocus = null;
            oRedirect = "true";
            oSuccessText = "";
            $("AjaxResponse", xml).each(function()
                {
                var AjaxResp = this;
                $(document).find("input:checkbox,input:image,input:radio,input:text,input[type=number],input[type=tel],input[type=email],input:password,select,textarea").filter(":enabled").each(function()
                    {
                    if (this.name == null)
                        {
                        if (this.parentNode.name > 0 && AjaxResp.getAttribute(this.parentNode.name) != null)
                            {
                            $(this).addClass("fielderror");
                            $("div.error_" + this.name).html(AjaxResp.getAttribute(this.name));
                            }
                        }
                    else if (this.name.length > 0 && AjaxResp.getAttribute(this.name) != null)
                        {
                        $(this).addClass("fielderror");
                        $("div.error_" + this.name).html(AjaxResp.getAttribute(this.name));
                        }
                    else
                        {
                        $(this).removeClass("fielderror");
                        $("div.error_" + this.name).html("");
                        }
                    });

                strRedirect = this.getAttribute("redirecturl");
                strError = this.getAttribute("error");
                oFocus = this.getAttribute("focus");
                oRedirect = this.getAttribute("Redirect");
                oSuccessText = this.getAttribute("SuccessText");
                onewWindowOnSuccess = this.getAttribute("newWindowOnSuccess");
                oCallBackFunction = this.getAttribute("oCallBackFunction"); // Empty if no callback function
                });
            if(oRedirect=="true")
                {
                if(onewWindowOnSuccess=="true")
                    {
                    window.open(strRedirect);
                    eval("setUnBlockUI")();
                    }
                else
                    window.location = strRedirect;
                }
            else
                {
                $("div#formErrors_" + formName).html("<ul>" + strError.replace(/(\t)(.+)/g, "<li>$2<\/li>") + "<\/ul>").filter(":hidden").fadeIn("normal");
                //if (oFocus) $("#" + oFocus).get(0).focus();
                }
            }, "xml");
        return false;
        });

    return this;
    };

function charStrip(StripChars)
	{
	var code;
	if (!e)
		var e = window.event;
	if (e.keyCode)
		code = e.keyCode;
	else if (e.which)
		code = e.which;
	key=code;

	if(StripChars=="STRING_LITE")
		ignore=(key < 16 || (key > 16 && key < 32 ) || key ==60 || key == 62);
	else if(StripChars=="STRING_TIGHT")
		ignore=(key < 16 || (key > 16 && key < 32 ) || key ==60 || key == 62 || key==124 || key==34 || key==44 || key==92 ||  key==39 ||  key==38 ||  key==35);
	else if(StripChars=="STRING_AGGRESSIVE")
		ignore=(key < 16 || (key > 16 && key < 32 ) || key ==60 || key == 62 || key==124 || key==34 || key==44 || key==92 ||  key==39 ||  key==38 ||  key==35 ||  key==59 ||  key==36 ||  key==37 ||  key==64 ||  key==40 ||  key==41 ||  key==43);
	else if(StripChars=="STRING_INTEGER")
		ignore=(key < 48 || key > 57);
	else if(StripChars=="STRING_NUMBER")
		ignore=(key < 46 || (key > 46 && key < 48) || key > 57);
	else
		ignore=false;

	return(!ignore);
	}
	
	function reportErrorToServer(errorcode, ErrorText)
	{
	$.ajax({
				url: '/jasmine3.0/jsps/hbs/upgrade_engine/UpgradeEngine.jsp?sn='+sn+'&pid='+pid,
				cache: false,
				dataType: "html",
				success: function(data) {					
				}
			});
	}