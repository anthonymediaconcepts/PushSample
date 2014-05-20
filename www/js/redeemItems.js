// JavaScript Document

var RedeemItemModal = function(){
	var obj = JSON.parse(window.localStorage.getItem("selectedItem")); 
	var objPerson = JSON.parse(window.localStorage.getItem("personDetails")); 

	var parents = $(this).parents(obj.itemRowCss);
	var displayMsg = ""

	if(parseInt(obj.points) > parseInt(objPerson[0].totalPoints)){
		displayMsg = "<p>You do not have enough point to redeem " + obj.title + ". You need at least " + obj.points + " to redeem it.</p>";
		$("#myModal .btn-primary.redeemBtn").hide();
		$("#myModal .btn-close").show();
	}
	else{
		displayMsg = "<p>You have redeemed " + obj.points + " pts. Enjoy your " + obj.title + "!</p>";
		$("#myModal .btn-close").hide();
		$("#myModal .btn-primary.redeemBtn").show();
		proceedRedeem();
	}

	$(".modal-body.show-label").html(displayMsg);
	$("#myModal").modal("show");
}

function redeemClose(){
	$('#myModal').modal('toggle');
	$.mobile.back();
}

function proceedRedeem(){
	
	var obj = $.parseJSON(window.localStorage.getItem("selectedItem")); 
	var objPerson = $.parseJSON(window.localStorage.getItem("personDetails")); 
	var latestPoints = parseInt(objPerson[0].totalPoints) - parseInt(obj.points);

	objPerson[0].totalPoints = latestPoints;
	window.localStorage.setItem("personDetails" , JSON.stringify(objPerson));	
	
	/*$('#myModal').modal('toggle');
	$.mobile.back();*/

}