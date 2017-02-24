$(document).ready(function(){
	progress.onHidden(function(){
		ajaxCallback(JSON.parse(ajaxResultData), ajaxStatus);
	});
});


function initializeFormSubmitOnEnter(form, callback) {
	$.each(form, function(i,e){
	   $(e).keypress(function(e){
	        if(e.keyCode == 13)
	        	callback();
	   });
	});
}

function toTitleCase(str) {
    return str.replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
    });
}

function validateFormForAllFields (form) {
	var elements = $('#' + form).find(":input");
	
	for (var i = 0 ; i < elements.length; i++) {
		var element = elements[i];
		if ($(element).val() == "") {
			return false;
		}
	}
	return true;
}

var ajaxCallback;
var ajaxResultData;
var ajaxStatus;
function callAjax(url, param, callback, resultType, async) {
	ajaxCallback = callback;
	progress.showPleaseWait();
	if(async == undefined)
		async = true;
	$.ajax({
	    url: url,
	    async: async,
	    dataType: resultType,
	    data: param,
	    success:  function(data, status){
	    	ajaxResultData = data;
    		ajaxStatus = status;
	    	progress.hidePleaseWait();
		}
	}).fail(function(){
		progress.hidePleaseWait();
		alert("encoutering server problem. try after some time");
	});
}
function callAjaxWithoutProgress(url, param, callback, resultType, async) {

	ajaxCallback = callback;
	if(async == undefined)
		async = true;
	$.ajax({
		url: url,
		async: async,
		dataType: resultType,
		data: param,
		success:  function(data, status){
			ajaxResultData = data;
			ajaxStatus = status;
			ajaxCallback(JSON.parse(ajaxResultData), ajaxStatus);
		}
	}).fail(function(){

		alert("encoutering server problem. try after some time");
	});
}
function callAjaxPost (url, param, callback, resultType, async) {

	ajaxCallback = callback;
	progress.showPleaseWait();
	if(async == undefined)
		async = true;
	$.ajax({
		type: "POST",
	    url: url,
	    async: async,
	    dataType: resultType,
	    data: param,
	    success:  function(data, status){
	    	ajaxResultData = data;
    		ajaxStatus = status;
    		progress.hidePleaseWait();
		},
	}).fail(function(){
		progress.hidePleaseWait();
		alert("encoutering server problem. try after some time");
	});
}

function processAjaxUpload (url, param, callback) {
	ajaxCallback = callback;
	progress.showPleaseWait();
	$.ajax({
		type: "POST",
	    url: url,
	    data: param,
	    cache: false,
        contentType: false,
        processData: false,
	    success:  function(data, status){
	    	ajaxResultData = data;
    		ajaxStatus = status;
    		progress.hidePleaseWait();
		}
	}).fail(function(){
		progress.hidePleaseWait();
		alert("encoutering server problem. try after some time");
	});
}

function logout() {
	callAjaxPost(location.origin+"/ajax/doLogout",{}, logoutCallBack);
}

function logoutCallBack(data, status) {
	window.location.href = location.origin;
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(find, replace, str) {
	return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

var progress;
progress = progress || (function () {
    var pleaseWaitDiv = $('<div class="modal fade" id="pleaseWaitDialog" data-backdrop="static" data-keyboard="false"><div class="modal-dialog"><div class="modal-content"><div class="modal-body"><div class="progress progress-striped active"><div class="progress-bar"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"><span class="sr-only">45% Complete</span></div></div></div></div></div></div>');
    return {
        showPleaseWait: function() {
            pleaseWaitDiv.modal();
        },
        hidePleaseWait: function () {
            pleaseWaitDiv.modal('hide');
        },
        onHidden:function (callback) {
        	pleaseWaitDiv.on('hidden.bs.modal', function(e){
        		callback ();
        	})
        }
    };
})();

function getDate(date){
	var date = new Date(date);
	var month = "";
	switch (date.getMonth()){
		case 0:
			month = "Jan"; break;
		case 1:
			month = "Feb"; break;
		case 2:
			month = "Mar"; break;
		case 3:
			month = "Apr"; break;
		case 4:
			month = "May"; break;
		case 5:
			month = "Jun"; break;
		case 6:
			month = "Jul"; break;
		case 7:
			month = "Aug"; break;
		case 8:
			month = "Sep"; break;
		case 9:
			month = "Oct"; break;
		case 10:
			month = "Nov"; break;
		case 11:
			month = "Dec"; break;
	}
	return(month+" "+date.getDate()+","+date.getFullYear());
}
