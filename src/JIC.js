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
   * Receives an Image Object (can be JPG OR PNG) and returns a new Image Object compressed
   * @param {Image} sourceImage The source Image Object
   * @param {Integer} quality The output quality of Image Object
   * @param {String} output format. Possible values are jpg and png
   * @param {Object} (OPTIONAL) output size. Can have two properties: width and height. 
   * If one is missing it will get calculated and if both are missing the image will keep the original size.
   * @return {Image} result_image_obj The compressed Image Object
   */
  compress: function (sourceImage, quality, outputFormat, outputSize) {
    var mimeType = 'image/jpeg'
    if (typeof outputFormat !== 'undefined' && outputFormat === 'png') {
      mimeType = 'image/png'
    }

    // Calculate the output width/height if missing when outputSize is provided
    if (outputSize) {
      if (!outputSize.width && outputSize.height) {
        outputSize.width = outputSize.height / sourceImage.naturalHeight * sourceImage.naturalWidth
      } else if (!outputSize.height && outputSize.width) {
        outputSize.height = outputSize.width / sourceImage.naturalWidth * sourceImage.naturalHeight
      } else {
        console.warn('Missing both width and height for the outputSize, falling back to original image width and height.')
      }
    }

    var cvs = document.createElement('canvas')
    cvs.width = outputSize.width || sourceImage.naturalWidth
    cvs.height = outputSize.height || sourceImage.naturalHeight
    cvs.getContext('2d').drawImage(sourceImage, 0, 0, cvs.width, cvs.height)
    var newImageData = cvs.toDataURL(mimeType, quality / 100)
    var resultImage = new Image()
    resultImage.src = newImageData
    return resultImage
  },

  /**
   * Receives an Image Object and upload it to the server via ajax
   * @param {Image} compressed_img_obj The Compressed Image Object
   * @param {String} The server side url to send the POST request
   * @param {String} file_input_name The name of the input that the server will receive with the file
   * @param {String} filename The name of the file that will be sent to the server
   * @param {function} successCallback The callback to trigger when the upload is succesful.
   * @param {function} (OPTIONAL) errorCallback The callback to trigger when the upload failed.
   * @param {function} (OPTIONAL) duringCallback The callback called to be notified about the image's upload progress.
   * @param {Object} (OPTIONAL) customHeaders An object representing key-value  properties to inject to the request header.
   */
  upload: function (compressedImage, uploadUrl, fileInput, fileName, successCallback, errorCallback, duringCallback, customHeaders) {
    // ADD sendAsBinary compatibilty to older browsers
    if (XMLHttpRequest.prototype.sendAsBinary === undefined) {
      XMLHttpRequest.prototype.sendAsBinary = function (string) {
        var bytes = Array.prototype.map.call(string, function (c) {
          return c.charCodeAt(0) & 0xff
        })
        this.send(new Uint8Array(bytes).buffer)
      }
    }

    var type = 'image/jpeg'
    if (fileName.substr(-4).toLowerCase() === '.png') {
      type = 'image/png'
    }

    var data = compressedImage.src
    data = data.replace('data:' + type + ';base64,', '')

    var xhr = new XMLHttpRequest()
    xhr.open('POST', uploadUrl, true)
    var boundary = 'someboundary'

    xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary)

    // Set custom request headers if customHeaders parameter is provided
    if (customHeaders && typeof customHeaders === 'object') {
      for (var headerKey in customHeaders) {
        xhr.setRequestHeader(headerKey, customHeaders[headerKey])
      }
    }

    // If a duringCallback function is set as a parameter, call that to notify about the upload progress
    if (duringCallback && duringCallback instanceof Function) {
      xhr.upload.onprogress = function (evt) {
        if (evt.lengthComputable) {
          duringCallback((evt.loaded / evt.total) * 100)
        }
      }
    }

    xhr.sendAsBinary(['--' + boundary, 'Content-Disposition: form-data; name="' + fileInput + '"; filename="' + fileName + '"', 'Content-Type: ' + type, '', atob(data), '--' + boundary + '--'].join('\r\n'))

    xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          successCallback(this.responseText)
        } else if (this.status >= 400) {
          if (errorCallback && errorCallback instanceof Function) {
            errorCallback(this.responseText)
          }
        }
      }
    }
  }
}

exports.jic = jic