var images = []; // Array to hold the image elements
var apikey = "LIVDSRZULELA";
var currentTabName = '';
var lmt = 5;

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
        }
    }
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
    return;
}

function openType(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    currentTabName = tabName;
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
    grab_data(); // Call the grab_data function after setting the currentTabName
}

document.getElementById("defaultOpen").click();

var container = document.getElementById("gifContainer");

function createMediaElement(url, mediaType) {
    var mediaElement;
    if (mediaType === "webm" || mediaType === "mp4") {
        mediaElement = document.createElement("video");
        // mediaElement.setAttribute("controls", false);
        mediaElement.setAttribute("loop", true);
        mediaElement.setAttribute("autoplay", true);
        mediaElement.innerHTML = `<source src="${url}" type="video/webm">`;
    } else {
        mediaElement = document.createElement("img");
        mediaElement.setAttribute("src", url);
    }
    return mediaElement;
}

function tenorCallback_search(responsetext) {
    var response_objects = JSON.parse(responsetext);
    var gifs = response_objects["results"];
    // Clear the container
    container.innerHTML = "";
    // Append the media elements to the container
    for (var i = 0; i < gifs.length; i++) {
        var mediaUrl = gifs[i]["media"][0][currentTabName]["url"];
        var mediaType = /\.webm$/.test(mediaUrl) ? "webm" : /\.mp4$/.test(mediaUrl) ? "mp4" : "image";
        // var mediaType = gifs[i]["media"][0][currentTabName]["dims"].endsWith(".webm") ? "webm" : "image";
        var mediaElement = createMediaElement(mediaUrl, mediaType);
        container.appendChild(mediaElement);
    }
}

function grab_data() {
    var search_term = document.getElementById("input").value;
    var search_url = "https://g.tenor.com/v1/search?q=" + search_term + "&key=" +
        apikey + "&limit=" + lmt;
    httpGetAsync(search_url, tenorCallback_search);
    return;
}

document.getElementById("input").addEventListener("input", function () {
    grab_data();
});
