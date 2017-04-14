

var ingredientId;
$(".addIngredientFrm").submit(function(e){
    e.preventDefault();
    var data = $(this).serialize();
    var val = $("input[type=submit]").val();
    if(val.trim() == "Edit")
        callAjax(location.origin+"/ajax/doEditIngredient",{data:data,ingredientId:ingredientId}, doEditIngredientCallback);
    else
        callAjax(location.origin+"/ajax/doAddPrescription",{data:data}, doAddIngredientCallback);
});

$(".editIngred").click(function(){
    var item = $(this).closest("tr");
    var formData = {};
    var data = item.find("td").each(function(index,el){
        if(index == 0){
            ingredientId = $(el).html();
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
    $(".addIngredientFrm").find("input").each(function(index,el){
        if($(el).attr("type")== "submit"){
            $(el).val("Edit");
        }
        else
            $(el).val(formData[$(el).attr("name")]);
    });
}

function doAddIngredientCallback(data){
    if(data.status == "success"){
        location.reload();
        $(".alert-success").show();
    }
    else{
        alert(data.data);
    }
}

function doEditIngredientCallback(data){
    if(data.status == "success"){
        location.reload();
    }
    else{
        alert(data.data);
    }
}

function deleteIngredient(ingredientId){
    callAjax(location.origin+"/ajax/doDeleteIngredient",{ingredientId:ingredientId}, doIngredientDeleteCallback);
}

function doIngredientDeleteCallback(data){
    if(data.status == "success"){
        alert("Ingredient deleted successfully");
        location.reload();
    }
    else{
        alert(data.data);
    }
}