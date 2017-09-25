/*jslint browser:true */
var message = document.getElementById("message");
var messages = document.getElementById("messages");
var formid = document.getElementById("formid");
var textarea = document.getElementById("textarea");

function getResponse(query) {
    $.ajax({
        dataType: "jsonp",
        type: "GET",
        url: "https://api.susi.ai/susi/chat.json?timezoneOffset=-300&q=" + query,
        error: function(xhr,textStatus,errorThrown) {
            var newP = document.createElement("p");
            var newDiv = messages.childNodes[messages.childElementCount];
            loading(false);
            newDiv.setAttribute("class", "susinewmessage");
            var myTextNode = document.createTextNode("Sorry! request could not be made.");
            newP.appendChild(myTextNode);
            newDiv.appendChild(newP);
            messages.appendChild(newDiv);        
        },
        success: function (data) {
            var recQuery = data["answers"][0]["data"][0]["query"];
            if (query !== recQuery) {
                return getResponse(query);
            }
            var link = data["answers"][0]["data"][0]["link"];
            var image1 = data["answers"][0]["data"][0]["answer"];
            var image2 = data["answers"][0]["data"][0]["webformatURL"];
            var image3 = data["answers"][0]["data"][0]["image"];
            var answer = data["answers"][0]["data"][0]["answer"];
            console.log(image1);
            console.log(image2);
    		console.log(image3);
            try {
            if (image2.startsWith("https"))
            {
                var image=image2;
                answer="";
            }
            } catch(err)
            {}
            try{
            
            if (image3.startsWith("https"))
            {
            	var image=image3;
        	}
            }
            catch(err)
            {}
            try {
            if (image1.startsWith("https"))
            {
                var image=image1;
                answer="";	
            }
            }
            catch(err)
            {}
            loading(false);
        	console.log(image);
            var newDiv = messages.childNodes[messages.childElementCount];
            var newP = document.createElement("p");
            newP.appendChild(document.createTextNode(answer));
            newDiv.appendChild(newP);
            if (link) {
                var newA = document.createElement("a");
                newA.appendChild(document.createTextNode(link));
                newA.setAttribute("href", link);
                newA.setAttribute("target", "_blank");
                newDiv.appendChild(document.createElement("br"));
                newDiv.appendChild(newA);
            }
            if (image) {
                var newImg = document.createElement("img");
                newDiv.appendChild(document.createElement("br"));
                newImg.setAttribute("src", image);
                newImg.setAttribute("class", "susi-img");
                newDiv.appendChild(newImg);
            }   
            newDiv.setAttribute("class", "susinewmessage");
            messages.appendChild(newDiv);
            messages.scrollTop = messages.scrollHeight;
        }
    });
}

function loading(condition=true){
    if(condition == true){
        var newDiv = document.createElement('div');
        var newImg = document.createElement('img');
        newImg.setAttribute("src","loading.gif");
        newImg.setAttribute("style","height:10px;width:auto");
        newDiv.appendChild(newImg);
        newDiv.setAttribute("class","susinewmessage");
        messages.appendChild(newDiv);
        messages.scrollTop = messages.scrollHeight;
    }
    else{
        messages.childNodes[messages.childElementCount].innerHTML = "";
    }
}

function submitForm() {
    var text = textarea.value;
    text = text.trim();
    if (text === "") {
        return console.log("Empty Query!");
    }
    var newP = document.createElement("p");
    var newDiv = document.createElement("div");
    newDiv.setAttribute("class", "mynewmessage");
    var myTextNode = document.createTextNode(text);
    newP.appendChild(myTextNode);
    newDiv.appendChild(newP);
    messages.appendChild(newDiv);
    textarea.value = "";
    loading();
    if(window.navigator.onLine)
        getResponse(text);
    else {
        loading(false);
        var newP = document.createElement("p");
        var newDiv =  messages.childNodes[messages.childElementCount];
        newDiv.setAttribute("class", "susinewmessage");
        var myTextNode = document.createTextNode("Not connected to Internet!");
        newP.appendChild(myTextNode);
        newDiv.appendChild(newP);
        messages.appendChild(newDiv);
    }
    messages.scrollTop = messages.scrollHeight;
}

textarea.onkeyup = function (e) {
    if (e.which === 13 && !e.shiftKey) {
        e.preventDefault();
        submitForm();
    }
};

formid.addEventListener("submit", function (e) {
    e.preventDefault();
    submitForm();
});