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
	sumOfCookieItems(menuItemArrObj.menu_item, obj);
	$(obj.itemRowCss).find(obj.itemAddTrigger).each(function(){

		$(this).click(function(){

			var parents = $(this).parents(obj.itemRowCss);

            if(parents.find(obj.itemExtraContainer).length > 0) {
                var cloneObj = parents.find( obj.itemExtraContainer ).clone(true);
                $(obj.formModalId).modal("show");
                $(obj.formModalBody).html( cloneObj.removeClass("hidden") );
            } else {
                createMenuItem(parents, null, null);
                sumOfCookieItems(menuItemArrObj.menu_item, obj); //sumTotal();
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
            sumOfCookieItems(menuItemArrObj.menu_item, obj); //sumTotal();
            $(obj.formModalId).modal('hide');
        }
    });

	function createMenuItem(getParentObj, getParentExtraObj, extraInfo) {

	    //console.log("id:"+ getParentObj.attr("id") + ", "+ getParentObj.find(".item-name").html());

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

            var itemNo = menuItemArrObj.menu_item.length;

            if( itemNo > 0) {
                var isNewItem = true;
                $.each(menuItemArrObj.menu_item, function(i, item) {
                   var thisObj = menuItemArrObj.menu_item[i];

                   if(getItemName == thisObj.itemName ) {
                       menuItemArrObj.menu_item[i] = { "itemName": thisObj.itemName, "itemCode": thisObj.itemCode, "value": increase(parseInt(thisObj.value)) , "thumb": thisObj.thumb, "price": thisObj.price };
                       isNewItem = false;
                   }
                }); //end each

                if(isNewItem) menuItemArrObj.menu_item[itemNo] = { "itemName": getItemName, "itemCode": getItemCode, "value": getItemTotal, "thumb": itemImage, "price": unitPrice };
                isNewItem = false;
            } else {
                menuItemArrObj.menu_item[0] = { "itemName": getItemName, "itemCode": getItemCode, "value": getItemTotal, "thumb": itemImage, "price": unitPrice };
            }


        } catch(e) { console.log(e);}
        cookieMenuItem( obj.itemCookieTitle, menuItemArrObj, obj.itemCookiePath, true);
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
            if(menuItemArrObj.menu_item.length > 0) {
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
}

function ItemUpdateBind(obj, updateBtn) {
    obj.bind('keypress', function (event) {
        var regex = new RegExp("^[0-9\b]+$"); //allow Aa-Zz 0-9 space, backspace
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
           event.preventDefault();
           return false;
        } else {
            $(this).siblings(updateBtn).removeClass("hidden");
        }
    });

};

function sumOfCookieItems(arrObj, obj) {
    if(arrObj.length > 0) {
        var countTotal = 0;
        var totalPrice = 0.0;
        var itemCount = 0;
        var itemPrice = 0.0;
        $.each(arrObj, function(i, item){
            if(arrObj[i] != null) {
                countTotal += parseInt(arrObj[i].value);
                itemCount = arrObj[i].value;
                itemPrice = arrObj[i].price;
                totalPrice += itemCount * itemPrice;
            }
        });

        ($(obj.itemTotalQty).is("input"))?($(obj.itemTotalQty).val(countTotal)):($(obj.itemTotalQty).html(countTotal));
        ($(obj.itemTotalAmount).is("input"))?($(obj.itemTotalAmount).val(totalPrice.toFixed(2))):($(obj.itemTotalAmount).html(totalPrice.toFixed(2)));

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

//initUpdateDeleteCart(".update-item", ".delete-item", defaultItemsConfig);
function initUpdateDeleteCart(updateClass, deleteClass, arrayObj, config) {
	$(updateClass).on("click",function() {
		var getItemName = $(this).siblings(config.itemName).attr("value");
		var getItemCount = $(this).siblings(config.itemValue).attr("value");
		updateMenuItem(arrayObj, config, getItemName, getItemCount);
		$(this).addClass("hidden");
	});
	
	$(deleteClass).on("click",function() {
		var getItemName = $(this).siblings(config.itemName).attr("value");
		var getParentObj = $(this).parents(config.itemRowCss);
		deleteMenuItem(arrayObj, config, getParentObj, getItemName);
	});
	
	ItemUpdateBind($(config.itemValue), updateClass);
}
