
var rawFoodId;
$(".addRawFoodFrm").submit(function(e){
    e.preventDefault();
    var data = $(this).serialize();
    var val = $("input[type=submit]").val();
    if(val.trim() == "Edit")
        callAjax(location.origin+"/ajax/doEditRawFood",{data:data,rawFoodId:rawFoodId}, doEditRawFoodCallback);
    else
        callAjax(location.origin+"/ajax/doAddRawFood",{data:data}, doAddRawFoodCallback);
});

$(".editRawFood").click(function(){
    var item = $(this).closest("tr");
    var formData = {};
    var data = item.find("td").each(function(index,el){
        if(index == 0){
            rawFoodId = $(el).html();
        }
        else{
            var fieldValue = $(el).html();
            var fieldId = $(el).attr("id");
            if(fieldId != "undefined")
                formData[fieldId] = fieldValue;
        }
    });
    fillForm(formData);
});

function fillForm(formData){
    $(".addRawFoodFrm").find("input").each(function(index,el){
        if($(el).attr("type")== "submit"){
            $(el).val("Edit");
        }
        else
            $(el).val(formData[$(el).attr("name")]);
    });
}

function doAddRawFoodCallback(data){
    if(data.status == "success"){
        location.reload();
        $(".alert-success").show();
    }
    else{
        alert(data.data);
    }
}

function doEditRawFoodCallback(data){
    if(data.status == "success"){
        location.reload();
    }
    else{
        alert(data.data);
    }
}

function deleteRawFood(rawFoodId){
    callAjax(location.origin+"/ajax/doDeleteRawFood",{rawFoodId:rawFoodId}, doRawFoodDeleteCallback);
}

function doRawFoodDeleteCallback(data){
    if(data.status == "success"){
        alert("Raw Food deleted successfully");
        location.reload();
    }
    else{
        alert(data.data);
    }
}