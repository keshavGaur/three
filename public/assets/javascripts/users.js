
function deleteUser(userId){
    callAjaxPost(location.origin+"/ajax/doDeleteUser",{userId:userId}, doDeleteUserCallback);
}
function doDeleteUserCallback(data){
    if(data.status == "success"){
        location.reload();
    }
    else{
        alert(data.data);
    }
}
