/**
 * Created by kaur.jasmeen on 5/26/2016.
 */

var nutrientId;
$(".addNutrientFrm").submit(function(e){
    e.preventDefault();
    var data = $(this).serialize();
    var val = $("input[type=submit]").val();
    if(val.trim() == "Edit")
        callAjax(location.origin+"/ajax/doEditNutrient",{data:data,nutrientId:nutrientId}, doEditNutrientCallback);
    else
        callAjax(location.origin+"/ajax/doAddNutrient",{data:data}, doAddNutrientCallback);
});

$(".editNutrient").click(function(){
    var item = $(this).closest("tr");
    var formData = {};
    var data = item.find("td").each(function(index,el){
        if(index == 0){
            nutrientId = $(el).html();
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
    $(".addNutrientFrm").find("input").each(function(index,el){
        if($(el).attr("type")== "submit"){
            $(el).val("Edit");
        }
        else
            $(el).val(formData[$(el).attr("name")]);
    });
}

function doAddNutrientCallback(data){
    if(data.status == "success"){
        location.reload();
        $(".alert-success").show();
    }
    else{
        alert(data.data);
    }
}

function doEditNutrientCallback(data){
    if(data.status == "success"){
        location.reload();
    }
    else{
        alert(data.data);
    }
}

function deleteNutrient(nutrientId){
    callAjax(location.origin+"/ajax/doDeleteNutrient",{nutrientId:nutrientId}, doNutrientDeleteCallback);
}

function doNutrientDeleteCallback(data){
    if(data.status == "success"){
        alert("Nutrient deleted successfully");
        location.reload();
    }
    else{
        alert(data.data);
    }
}