/*
* Search Engine Box
* Author: Zevo
* Use Like: searchbox(form)
*/

;(function() {
    var enginesJSON = {};

    window.searchbox = function (form) {
        form.onsubmit = function (event) {
            event.preventDefault();

            var data = getData({
                type: form.getAttribute('data-type'),
                engine: form.getAttribute('data-engine'),
            });

            // data is null, not find
            if (!data) {
                throw new Error('Can not find that engine!');
                return;
            }

            // Replace {keyword}
            data.url = encodeURI(data.url.replace(/\{keyword\}/g, form['word'].value));

            if (data.params) {
                for (i in data.params) {
                    data.params[i] = data.params[i].replace(/\{keyword\}/g, form['word'].value)
                }
            }

            openURL(data);

            return false;
        }

        getJSON('engines.json', function(json){
            enginesJSON = eval('(' + json + ')');
        }, function(){
            throw new Error('Get file "engines.json" occurre error!');
        });

        return {}
    }

    /*
    * Get JSON
    */
    function getJSON(url, success, error){
        var xhr = new window.XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.send();
        xhr.onreadystatechange = function() {
            switch (xhr.readyState) {
                case 4:
                    switch (xhr.status) {
                        case 200:
                            success(xhr.responseText);
                            break;

                        default:
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

    function getData(argument){
        //
        if (!argument.engine) {
            throw new Error('"engine" argument is not allow to null!');
        }
        if (!argument.type) {
            return enginesJSON[argument.engine];
        }
        return enginesJSON[argument.engine][argument.type];
    }
}())

