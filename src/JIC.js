/*!
 * JIC JavaScript Library v2.0.2
 * https://github.com/brunobar79/J-I-C/
 *
 * Copyright 2016, Bruno Barbieri
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Date: Tue Jul 11 13:13:03 2016 -0400
 */


/**
 * Create the jic object.
 * @constructor
 */

var jic = {
    /**
     * Receives an Image Object (can be JPG, PNG, or WEBP) and returns a new Image Object compressed
     * @param {Image} source_img_obj The source Image Object
     * @param {Integer} quality The output quality of Image Object
     * @param {String} output format. Possible values are jpg, png, and webp
     * @return {Image} result_image_obj The compressed Image Object
     */

    compress: function (source_img_obj, quality, output_format) {

        var mime_type;
        if (output_format === "png") {
            mime_type = "image/png";
        } else if (output_format === "webp") {
            mime_type = "image/webp";
        } else {
            mime_type = "image/jpeg";
        }

        var cvs = document.createElement('canvas');
        cvs.width = source_img_obj.naturalWidth;
        cvs.height = source_img_obj.naturalHeight;
        var ctx = cvs.getContext("2d").drawImage(source_img_obj, 0, 0);
        var newImageData = cvs.toDataURL(mime_type, quality / 100);
        var result_image_obj = new Image();
        result_image_obj.src = newImageData;
        return result_image_obj;
    },

    /**
     * Receives an Image Object and upload it to the server via ajax
     * @param {Image} compressed_img_obj The Compressed Image Object
     * @param {String} The server side url to send the POST request
     * @param {String} file_input_name The name of the input that the server will receive with the file
     * @param {String} filename The name of the file that will be sent to the server
     * @param {function} successCallback The callback to trigger when the upload is successful.
     * @param {function} (OPTIONAL) errorCallback The callback to trigger when the upload failed.
     * @param {function} (OPTIONAL) duringCallback The callback called to be notified about the image's upload progress.
     * @param {Object} (OPTIONAL) customHeaders An object representing key-value  properties to inject to the request header.
     */

    upload: function (compressed_img_obj, upload_url, file_input_name, filename, successCallback, errorCallback, duringCallback, customHeaders) {

        // ADD polyfill for sendAsBinary, since it is a non-standard, deprecated function
        if (XMLHttpRequest.prototype.sendAsBinary === undefined) {
            XMLHttpRequest.prototype.sendAsBinary = function (string) {
                var bytes = Array.prototype.map.call(string, function (c) {
                    return c.charCodeAt(0) & 0xff;
                });

                // send ArrayBufferView to suppress Chrome warning message
                this.send(new Uint8Array(bytes));
            };
        }

        var type;
        if (filename.substr(-4).toLowerCase() === ".png") {
            type = "image/png";
        } else if (filename.substr(-5).toLowerCase() === ".webp") {
            type = "image/webp";
        } else {
            type = "image/jpeg";
        }

        var data = compressed_img_obj.src;
        data = data.replace('data:' + type + ';base64,', '');

        var xhr = new XMLHttpRequest();
        xhr.open('POST', upload_url, true);
        var boundary = 'someboundary';

        xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);

        // Set custom request headers if customHeaders parameter is provided
        if (customHeaders && typeof customHeaders === "object") {
            for (var headerKey in customHeaders) {
                xhr.setRequestHeader(headerKey, customHeaders[headerKey]);
            }
        }

        // If a duringCallback function is set as a parameter, call that to notify about the upload progress
        if (duringCallback && duringCallback instanceof Function) {
            xhr.upload.onprogress = function (evt) {
                if (evt.lengthComputable) {
                    duringCallback((evt.loaded / evt.total) * 100);
                }
            };
        }

        xhr.sendAsBinary(['--' + boundary, 'Content-Disposition: form-data; name="' + file_input_name + '"; filename="' + filename + '"', 'Content-Type: ' + type, '', atob(data), '--' + boundary + '--'].join('\r\n'));

        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    successCallback(this.responseText);
                } else if (this.status >= 400) {
                    if (errorCallback && errorCallback instanceof Function) {
                        errorCallback(this.responseText);
                    }
                }
            }
        };


    }
};