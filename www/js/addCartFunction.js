var defaultItemsConfig = {
    itemUnitPrice :".price-holder",
    itemThumb :".img-con .thumb",
    itemCode : ".item_code",
    itemAddTrigger : ".add-to-cart",
    itemTotalAmount : ".cart-total-price",
    itemTotalQty : ".cart-item-count",
    itemRowCss :".menu-item",
    itemName: ".item-name",
	itemValue: ".item-value",
	itemDescContainer :".prod-desc",
    itemExtraContainer : ".extra-container",
    itemCookiePath : "/frontdesk",
    itemCookieTitle : "menu_item",
    formExtraBtn : ".extra-button",
    formExtraContainer : ".option-container",
    formModalId : "#myModal",
    formModalBody : ".modal-body",
    formMessage1 : "Please select your preference",
	langAlias : "/en/"
}

var cookieDef = {
    item : "menu_item"
};
	
var menuItemArrObj = $.cookie("menu_item") != undefined ? $.parseJSON( $.cookie("menu_item") ) : {"menu_item":[]};
var addCartFunction = function(obj)
{
	//sumOfCookieItems(menuItemArrObj.menu_item, obj);
	sumOfCookieItems(storeMenuItemArrObj.menu_item, obj);
	
	$(obj.itemRowCss).find(obj.itemAddTrigger).each(function(){

		$(this).click(function(){
			var parents = $(this).parents(obj.itemRowCss);

            if(parents.find(obj.itemExtraContainer).length > 0) {
                var cloneObj = parents.find( obj.itemExtraContainer ).clone(true);
                $(obj.formModalId).modal("show");
                $(obj.formModalBody).html( cloneObj.removeClass("hidden") );
            } else {
                createMenuItem(parents, null, null);
                sumOfCookieItems(storeMenuItemArrObj.menu_item, obj); //sumTotal(); //sumOfCookieItems(menuItemArrObj.menu_item, obj); 
				//sumTotal();
            }

		});
	});

    $(obj.formExtraBtn).click(function() {
        var hasError = false;
        var btnID = $(this).attr("id");
        var itemID = btnID.replace("btn","item");
        var itemObj = $("#"+itemID);
        var parentExtraObj = $(this).parents(obj.itemExtraContainer);
        var params = {};
        var strParams = new Array;
        var extraInfoDetails = "";
        $(parentExtraObj).find(obj.formExtraContainer).each(function() {

            $(this).find("input:checked,input:text,input[type=number],input[type=tel],input[type=email],input:hidden,input:password,input:submit,select option:selected,textarea").each(function() {
                
                ArrayName = this.name || this.id || this.parentNode.name || this.parentNode.id || this.parentNode.parentNode.name || this.parentNode.parentNode.id;
                thisParam = params[ArrayName];

                if(this.value == "" && this.parentNode.type.toLowerCase() == "select-one" ) {
                    hasError = true;
				} else {
					if(thisParam == null) {
						thisParam = new Array(1);
						thisParam[0] = this.value;
						strParams.push(this.value);
						OldArrayName = ArrayName;
                	}

                	hasError = false;
				}
            });

            return this;
        });

        if(hasError) {
            alert(obj.formMessage1);
        } else {
            extraInfoDetails += strParams;
            var parents = itemObj;
            createMenuItem(parents, parentExtraObj, extraInfoDetails);
            sumOfCookieItems(storeMenuItemArrObj.menu_item, obj);  //sumOfCookieItems(menuItemArrObj.menu_item, obj); 
			//sumTotal();
            $(obj.formModalId).modal('hide');
        }
    });

	function createMenuItem(getParentObj, getParentExtraObj, extraInfo) {

	    var getItemName = getParentObj.find(obj.itemName).html();
        var getItemCode = getParentObj.find(obj.itemCode).val();
            if(extraInfo != null)
            getItemName += ", "+extraInfo;

        var countItem = 0;
        var getItemTotal = increase(parseInt(countItem));
        var itemImage = getParentObj.find(obj.itemThumb).attr("src").replace(obj.langAlias, "/");
        var unitPrice = getParentObj.find(obj.itemUnitPrice).val();
        try {

            //var jsonItem = [];
            //menuItemArrObj[getItemName] = jsonItem;
            //menuItemArrObj[getItemName].push({ "itemName": getItemName, "itemCode": getItemCode, "value": getItemTotal, "price": unitPrice });

            var itemNo = storeMenuItemArrObj.menu_item.length; //menuItemArrObj.menu_item.length;

            if( itemNo > 0) {
                var isNewItem = true;
                $.each(storeMenuItemArrObj.menu_item, function(i, item) { //$.each(menuItemArrObj.menu_item, function(i, item) {
                   var thisObj = storeMenuItemArrObj.menu_item[i]; //menuItemArrObj.menu_item[i];

                   if(getItemName == thisObj.itemName ) {
					   storeMenuItemArrObj.menu_item[i] = { "itemName": thisObj.itemName, "itemCode": thisObj.itemCode, "value": increase(parseInt(thisObj.value)) , "thumb": thisObj.thumb, "price": thisObj.price };
                       //menuItemArrObj.menu_item[i] = { "itemName": thisObj.itemName, "itemCode": thisObj.itemCode, "value": increase(parseInt(thisObj.value)) , "thumb": thisObj.thumb, "price": thisObj.price };
                       isNewItem = false;
                   }
                }); //end each

                if(isNewItem) storeMenuItemArrObj.menu_item[itemNo] = { "itemName": getItemName, "itemCode": getItemCode, "value": getItemTotal, "thumb": itemImage, "price": unitPrice }; 
							//menuItemArrObj.menu_item[itemNo] = { "itemName": getItemName, "itemCode": getItemCode, "value": getItemTotal, "thumb": itemImage, "price": unitPrice };
                isNewItem = false;
            } else {
                storeMenuItemArrObj.menu_item[0] = { "itemName": getItemName, "itemCode": getItemCode, "value": getItemTotal, "thumb": itemImage, "price": unitPrice };
				//menuItemArrObj.menu_item[0] = { "itemName": getItemName, "itemCode": getItemCode, "value": getItemTotal, "thumb": itemImage, "price": unitPrice };
            }


        } catch(e) { console.log(e);}
        cookieMenuItem( obj.itemCookieTitle, storeMenuItemArrObj, obj.itemCookiePath, true);
		window.localStorage.setItem("menu_item",JSON.stringify(storeMenuItemArrObj));
		//cookieMenuItem( obj.itemCookieTitle, menuItemArrObj, obj.itemCookiePath, true);
        if(getParentExtraObj != null) $(getParentExtraObj).addClass("hidden");
        if(!$('.message.item-added').is(':visible')) $(".message.item-added").fadeIn("fast").delay(3000).fadeOut("slow");

	}
}

function increase(val)
    {
        return val += 1;
    }

function multiplyValue(param1,param2)
    {
        return param1 * param2;
    }

function cookieMenuItem(title, value, urlPath, isJson)
    {
        if(isJson) $.cookie.json = true;
		
        $.cookie(title, value, { path: urlPath } );
    }

function deleteMenuItem(arrObj, obj, parentObj, name) {
    //deleteMenuItem(menuItemArrObj, Items, "French toasts");
    $.each(arrObj.menu_item, function(i, item){
        if(arrObj.menu_item[i].itemName.toLowerCase() == name.toLowerCase()) {
            //delete arrObj.menu_item[i];
            arrObj.menu_item.splice(i, 1);
            //if(menuItemArrObj.menu_item.length > 0) {
			if(storeMenuItemArrObj.menu_item.length > 0) {	
                cookieMenuItem( obj.itemCookieTitle, arrObj, obj.itemCookiePath, true);
                sumOfCookieItems(arrObj.menu_item, obj);
                parentObj.addClass("disabled");
                parentObj.find(obj.itemDescContainer).remove();
                $("<p>Item has been removed.</p>").insertAfter( parentObj.find(obj.itemName) ) ;
            } else {

            }

            return false;
        }
    });
	
	window.localStorage.setItem("menu_item",JSON.stringify(storeMenuItemArrObj));
}

function updateMenuItem(arrObj, obj, name, noOfItem) {
	
    $.each(arrObj.menu_item, function(i, item){
        if(arrObj.menu_item[i].itemName.toLowerCase() == name.toLowerCase()) {
            //delete arrObj.menu_item[i];
            arrObj.menu_item[i].value = noOfItem; 
            cookieMenuItem( obj.itemCookieTitle, arrObj, obj.itemCookiePath, true);
            sumOfCookieItems(arrObj.menu_item, obj);
            return false;
        }
    });
	
	window.localStorage.setItem("menu_item",JSON.stringify(arrObj));
}

function sumOfCookieItems(arrObj, obj) {
	
	/*
	<li class="item menu-item ala_carte odd" id="item-extra-3">
        <div class="img-con"><img class="thumb" src="/media/en/images/frontdesk/room_services/french_toast.jpg"></div>
        <div class="prod-con">
            <h3 class="item-name">French toasts</h3>
            <div class="prod-desc"><p class="item-price">S$9.50</p>
                <input type="hidden" value="4" class="item_code" />
                <input type="hidden" name="itemName" value="French toasts" class="item_name item-name" />
                <input type="text" name="itemValue" value="3" class="item_value item-value" />
                <span class="icon icon-edit update-item hidden"> </span>
                <span class="icon icon-delete delete-item icon-cancel" /></span>
            </div>
        </div>
        <input type="hidden" value="9.50" class="price-holder" />
    </li>
	*/
	var resultString = "";
    if(arrObj.length > 0) {
        var countTotal = 0;
        var totalPrice = 0.0;
        var itemCount = 0;
        var itemPrice = 0.0;
		
		resultString +='<ul class="item-list form-fields">';
        $.each(arrObj, function(i, item){
			/*
			arrObj[i].itemName;
			arrObj[i].itemCode;
			arrObj[i].thumb;
			arrObj[i].price;
			*/
			
            if(arrObj[i] != null) {
                countTotal += parseInt(arrObj[i].value);
				itemName = arrObj[i].itemName;
				itemThumb = arrObj[i].thumb;
                itemCount = arrObj[i].value;
                itemPrice = arrObj[i].price;
                totalPrice += itemCount * itemPrice;
				
				resultString += '<li class="item menu-item ala_carte odd" id="item-extra-3">'+
								'<div class="img-con"><img class="thumb" src="'+itemThumb+'"></div>'+
								'<div class="prod-con"><h3 class="item-name">'+itemName+'</h3>'+								
								'<div class="prod-desc"><p class="item-price">S$'+totalPrice+'</p>'+
								'<input type="hidden" value="'+itemCount+'" class="item_code" />'+
								'<input type="hidden" name="itemName" value="'+itemName+'" class="item_name item-name" />'+
								'<input type="text" name="itemValue" value="'+itemCount+'" class="item_value item-value" />'+
								'<span class="icon icon-edit update-item hidden"> </span>'+
								'<span class="icon delete-item icon-remove" /></span>'+
								'</div></div>'+
								'<input type="hidden" value="'+totalPrice+'" class="price-holder" /></li>';
            }
        });
		resultString +='</ul>';
		if(isRoomServiceCheckout) $(".checkout.menu-list").html( resultString );
        ($(obj.itemTotalQty).is("input"))?($(obj.itemTotalQty).val(countTotal)):($(obj.itemTotalQty).html(countTotal));
        ($(obj.itemTotalAmount).is("input"))?($(obj.itemTotalAmount).val(totalPrice.toFixed(2))):($(obj.itemTotalAmount).html(totalPrice.toFixed(2)));
		
		initUpdateDeleteCart(".update-item", ".delete-item", storeMenuItemArrObj, defaultItemsConfig);
		
    }


}

function buildMenuAsSelectBox(menuObj, outputObj, appendObj) {
    if(appendObj) {
        var sel = $('<select class="select-nav hidden">').appendTo( outputObj );
    }
    else {
        var sel = $('<select class="select-nav hidden">').prependTo( outputObj );
    }

    $(menuObj).find("a").each(function() {
        sel.append($("<option>").attr('value', $(this).parent("li").attr("id") ).text( $(this).html() ));
    });

    sel.bind("change",function() {
        $("#"+ $(this).val() ).find("a").trigger("click");
    });

}

function ItemUpdateBind(obj, updateBtn) {
    obj.bind('keypress', function (event) { 
        var regex = new RegExp("^[0-9\b]+$"); //allow Aa-Zz 0-9 space, backspace
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
           event.preventDefault();
           return false;
        } else {
            $(this).parents(".prod-desc").find(updateBtn).removeClass("hidden");
        }
    });

};

//initUpdateDeleteCart(".update-item", ".delete-item", defaultItemsConfig);
function initUpdateDeleteCart(updateClass, deleteClass, arrayObj, config) {
	
	
	
	$(updateClass).on("click",function() {
		var getItemName = $(this).parent(".prod-desc").find(config.itemName).val();
		var getItemCount = $(this).parent(".prod-desc").find(config.itemValue).val();		
		updateMenuItem(arrayObj, config, getItemName, getItemCount);
		$(this).addClass("hidden");
	});
	
	$(deleteClass).on("click",function() {
		var getItemName = $(this).parents(".prod-desc").find(config.itemName).val();
		var getParentObj = $(this).parents(config.itemRowCss);
		deleteMenuItem(arrayObj, config, getParentObj, getItemName);
	});
	
	ItemUpdateBind($(config.itemValue), updateClass);
	
}

