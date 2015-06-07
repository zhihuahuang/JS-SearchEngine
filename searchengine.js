/*
* Search Engine
* @Author: Zevo
*
* Use like this
* $.submit({
*     keyword: 'china',
*     engine: 'google',
*     type: 'web'
* });
* Or like this:
* $.submit(keyword, engine[, type]);
*/

;(function(){

    if (!JSON) {
        window.JSON = {
            parse: function(str) {
                return eval('('+str+')');
            }
        }
    }

    /*
    * Get JSON
    */
    function getJSON(url, success, error) {
        var xhr = new window.XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.send();
        xhr.onreadystatechange = function() {
            switch (xhr.readyState) {
                case 4:
                    switch (xhr.status) {
                        case 200:
                            if (success) {
                                success(xhr.responseText);
                            }
                            break;

                        default:
                            if(error)
                                error(xhr.status);
                            break;
                    }
                    break;
            }
        }
    }

    /*
    * Submit Requset 
    * Use Like:
    * openURL({
        url: "",
        params: "",
        method: ["GET" | "POST"],
        charset: ""
        target: ["blank"|"self"]
    })
    */

    function openURL(arg) {
        if (!arg.url) {
             throw new Error('"url" argument does not allow to null!');
        }

        if (arguments.length == 1) {
            window.open(arg.url);
            return;
        }

        var form = document.createElement("form");
        form.action = arg.url;
        form.method = arg.method || "GET";
        form.target = "_" + (arg.target || "blank");
        form.acceptCharset = arg.charset || "utf-8";
        
        for (i in arg.params) {
             var input = document.createElement("input");
             input.setAttribute("name", i);
             input.setAttribute("value", arg.params[i]);
             form.appendChild(input);
        }
        
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }

    var engineJSON = {};

    var dataEngine = document.currentScript.getAttribute('data-engine');

    if (!dataEngine) {
        throw new Error('The attribute "data-engine" is null!');
    }
    else {
        var engineURL = dataEngine.split(',');

        for (i in engineURL) {
            getJSON(engineURL[i], function(res) {
                var json = JSON.parse(res);
                for(i in json) {
                    engineJSON[i] = json[i];
                }
            });    
        }
    }

    function getRequset(argument){
        try {
            //
            if (!argument.engine) {
                throw new Error('"engine" argument is not allow to null!');
            }
            if (!argument.type) {
                return engineJSON[argument.engine];
            }
            return engineJSON[argument.engine][argument.type];
        }
        catch(e){
            return null;
        }
    }

    window.SearchEngine = {
        submit: function(keyword, engine, type){
            if(!engineJSON) throw new Error('Please load the engines!');

            if (!keyword) {
                throw new Error('The first argument does not allow null!');
            } else if (typeof keyword !== 'string') {
                throw new Error('The first argument is not string type');
            }

            var input = {};

            if (arguments.length == 1) {
                input = keyword;
            }
            else {
                input.keyword = keyword;
                input.engine = engine;
                input.type = type;
            }

            var requset = getRequset(input);

            // requset is null, not find
            if (!requset) {
                throw new Error('Can not find that engine!');
                return;
            }

            // Replace {keyword}
            requset.url = encodeURI(requset.url.replace(/\{keyword\}/g, input.keyword));

            if (requset.params) {
                for (i in requset.params) {
                    requset.params[i] = requset.params[i].replace(/\{keyword\}/g, input.keyword)
                }
            }

            openURL(requset);

            return this;
        },

        load: function(url) {
            getJSON(url, function(res) {
                var json = JSON.parse(res);
                for(i in json) {
                    engineJSON[i] = json[i];
                }
            });
            return this;
        },

        clear: function() {
            engineJSON = {};
            return this;
        }
    }

}());

