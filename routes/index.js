var changeCase = require('change-case');
var pages;
var db;

exports.pages = function (_pages){
    pages = _pages;
}

exports.db =function(_db){
    db = _db;
}

exports.route = function(req,res){
    var url =req.params.page;
    var suburl = req.params.subpage;
    if(url == undefined && req.params.ajaxCmd == undefined){
        url = "login";
    }
    else{
        if(suburl){
            url = url + "/" + suburl;
        }
    }
    var page = pages.get(url);
    var ajaxCmd = pages.get(req.params.ajaxCmd);
    if(page && ajaxCmd == undefined){
        page.execute(db,req,res,function(data){
            if(!data.status ||data.status == "success")
                res.render(suburl ? suburl : url, {page:suburl ? suburl : url, title:changeCase.titleCase(suburl ? suburl : url), data:data});
            else
                res.render('notFound', {page:suburl ? suburl : url, title:changeCase.titleCase("404 Not Found")});
        });
    }else if(ajaxCmd){
        ajaxCmd.execute(db, req, res, function(data){
            res.send(JSON.stringify(data));
        });
    }
    else
        res.render("notFound",{page:suburl ? suburl : url,title:changeCase.titleCase("404 Not Found")});
}