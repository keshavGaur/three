$(document).ready(function(){
    initializeFormSubmitOnEnter ($('#login-form'), doSignin);
});

function doSignin () {
    if($.trim($('#emailId').val()) == "" || $.trim($('#password').val()) == "")
        alert('All fields are mandatory');
    else
        callAjaxPost(location.origin+"/ajax/doLogin", {"emailId" : $.trim($('#emailId').val()), "password" : $.trim($('#password').val())}, doLoginCallback);
}
function doLoginCallback(data){
    if(data.status == "fail")
        alert(data.data);
    else
        location.href= "home";
}