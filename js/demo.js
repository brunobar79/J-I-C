$(function () {

    //Console logging (html)
    if (!window.console) console = {};
    var console_out = document.getElementById('console_out');
    console.log = function (message) {
        console_out.innerHTML += message + '<br />';
        console_out.scrollTop = console_out.scrollHeight;
    }


    //Slider init
    $("#slider-range-min").slider({
        range: "min",
        value: 30,
        min: 1,
        max: 100,
        slide: function (event, ui) {
            $("#jpeg_encode_quality").val(ui.value);
        }
    });
    $("#jpeg_encode_quality").val($("#slider-range-min").slider("value"));

    /** DRAG AND DROP STUFF WITH FILE API **/
    var holder = document.getElementById('holder');

    holder.ondragover = function () {
        this.className = 'is_hover';
        return false;
    };
    holder.ondragend = function () {
        this.className = '';
        return false;
    };
    holder.ondrop = function (e) {
        this.className = '';
        e.preventDefault();

        document.getElementById("holder_helper").removeChild(document.getElementById("holder_helper_title"));

        var file = e.dataTransfer.files[0],
            reader = new FileReader();
        reader.onload = function (event) {
            //console.log(event.target);
            i = document.getElementById("source_image");
            i.src = event.target.result;
            i.style.width = "320px";
            i.style.height = "300px";
            console.log("Image loaded");



        };
        //console.log(file);
        console.log("Filename:" + file.fileName);
        console.log("Filesize:" + (parseInt(file.fileSize) / 1024) + " Kb");
        console.log("Type:" + file.type);
        reader.readAsDataURL(file);

        return false;
    };

    var encodeButton = document.getElementById('jpeg_encode_button');
    var encodeQuality = document.getElementById('jpeg_encode_quality');

    //HANDLE COMPRESS BUTTON
    encodeButton.addEventListener('click', function (e) {

        console.log("process start...");
        var time_start = new Date().getTime();

        var source_image = document.getElementById('source_image');
        var result_image = document.getElementById('result_image');
        if (source_image.src == "") {
            alert("You must load an image first!");
            return false;
        }

        var cvs = document.createElement('canvas');
        cvs.width = source_image.naturalWidth;
        cvs.height = source_image.naturalHeight;
        var ctx = cvs.getContext("2d").drawImage(source_image, 0, 0);
        var quality = parseFloat(encodeQuality.value / 100);
        console.log("Quality >>" + quality);
        var newImageData = cvs.toDataURL("image/jpeg", quality);
        result_image.style.width = "300px";
        result_image.style.height = "300px";
        result_image.src = newImageData;
        console.log("process finished...");
        var duration = new Date().getTime() - time_start;
        console.log('Processed in: ' + duration + 'ms');


    }, false);


    //HANDLE UPLOAD BUTTON
    var uploadButton = document.getElementById("jpeg_upload_button");
    uploadButton.addEventListener('click', function (e) {
        var result_image = document.getElementById('result_image');
        if (result_image.src == "") {
            alert("You must load an image and compress it first!");
            return false;
        }
        var cvs = document.createElement('canvas');
        cvs.width = result_image.naturalWidth;
        cvs.height = result_image.naturalHeight;
        var ctx = cvs.getContext("2d").drawImage(result_image, 0, 0);
        postCanvasToURL('upload.php', 'file', 'new.jpg', cvs, 'image/jpeg');
    }, false);

    /*** END OF DRAG & DROP STUFF WITH FILE API **/

});



/** BINARY FILE UPLOAD VIA XHR **/
if (XMLHttpRequest.prototype.sendAsBinary === undefined) {
    XMLHttpRequest.prototype.sendAsBinary = function (string) {
        var bytes = Array.prototype.map.call(string, function (c) {
            return c.charCodeAt(0) & 0xff;
        });
        this.send(new Uint8Array(bytes).buffer);
    };
}

function postCanvasToURL(url, name, fn, canvas, type) {
    var data = canvas.toDataURL(type);
    data = data.replace('data:' + type + ';base64,', '');

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    var boundary = 'ohaiimaboundary';
    xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
    xhr.sendAsBinary(['--' + boundary, 'Content-Disposition: form-data; name="' + name + '"; filename="' + fn + '"', 'Content-Type: ' + type, '', atob(data), '--' + boundary + '--'].join('\r\n'));

    xhr.onreadystatechange = function () {
        if (this.readyState != 4) {
            console.log("error uploading image...");
        } else {
            console.log(xhr.responseText);
        }
    };
}

