/**
 * Created with IntelliJ IDEA.
 * User: John Bowen
 * Date: 8/16/12
 * Time: 7:58 PM
 * To change this template use File | Settings | File Templates.
 */


function jasmineAjaxUtil(Type, Parameter, Domain, uId)
    {
    var xmlHttpReq = false;
    var self = this;

    if (window.XMLHttpRequest)  // Mozilla/Safari
        {
        self.xmlHttpReq = new XMLHttpRequest();
        }
    else if (window.ActiveXObject) // IE
        {
        self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
        }
    if (self)
        {
		if (window.ActiveXObject)
			self.xmlHttpReq.open('GET', Domain+'/jasmine/publicUtils?t=' + escape(Type) + '&p=' + escape(Parameter) +  '&uId=' + escape(uId) + timeStamp(false), false);
		else
        	self.xmlHttpReq.open('GET', Domain+'/jasmine/publicUtils?t=' + escape(Type) + '&p=' + escape(Parameter) +  '&uId=' + escape(uId), false);
			
        self.xmlHttpReq.send();
        return(self.xmlHttpReq.responseText);
        }
    else
        {
        return(null);
        }
    }

function jasmineAjaxJSONUtil(Type, Parameter)
    {
    var xmlHttpReq = false;
    var self = this;

    if (window.XMLHttpRequest)  // Mozilla/Safari
        {
        self.xmlHttpReq = new XMLHttpRequest();
        }
    else if (window.ActiveXObject) // IE
        {
        self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
        }
    if (self)
        {
		if (window.ActiveXObject)
			self.xmlHttpReq.open('GET', '/jasmine/publicUtils?t=' + escape(Type) + '&p=' + escape(Parameter) + timeStamp(false), false);
		else	
        	self.xmlHttpReq.open('GET', '/jasmine/publicUtils?t=' + escape(Type) + '&p=' + escape(Parameter), false);
        self.xmlHttpReq.send();
        return(self.xmlHttpReq.responseText);
        }
    else
        {
        return(null);
        }
    }

function ajaxJSONUtil(Url, Type, Param, ParamValue)
    {
    var xmlHttpReq = false;
    var self = this;

    if (window.XMLHttpRequest)  // Mozilla/Safari
        {
        self.xmlHttpReq = new XMLHttpRequest();
        }
    else if (window.ActiveXObject) // IE
        {
        self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
        }
    if (self)
        {
        self.xmlHttpReq.open('GET', Url+'?t=' + escape(Type) + '&'+Param+'=' + escape(ParamValue), false);
        self.xmlHttpReq.send();
		
        return(self.xmlHttpReq.responseText);
        }
    else
        {
        return(null);
        }
    }
	
function getAddressFromPostCode(Url, Type, Param, PostCode)
	{
	var jsonAddress = ajaxJSONUtil(Url, Type, Param, PostCode);
    return(jsonAddress);
	}

function getExchangeRateTableViaAjax()
    {
    var ExchangeRateTable = eval('('+jasmineAjaxJSONUtil('ExchangeRateTable')+')');
    var newdt = new google.visualization.DataTable(ExchangeRateTable);
    return(newdt);
    }



function getExchangeRateViaAjax(currencyFrom, currencyTo)
    {
    var currency;
    if (currencyTo == null)
        currency = currencyFrom;
    else
        currency = currencyFrom + "," + currencyTo;
    return(jasmineAjaxUtil('ExchangeRate', currency));
    }


function timeStamp(isFirstParam) {
	var timestamp = new Date().getTime();
	if(isFirstParam)
		timestamp = "?time="+timestamp;
	else
		timestamp = "&time="+timestamp;
	
	return timestamp;
};

function getKioskMessageVersion()
    {
    return(jasmineAjaxUtil('KioskMessageVersion'));
    }
	
function getKioskUserVersion()
    {
    return(jasmineAjaxUtil('getKioskUserVersion'));
    }	
function getKioskUserLoginVersion()
    {
    return(jasmineAjaxUtil('getKioskUserLoginVersion'));
    }	
	
	
	
	