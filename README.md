# J I C 
**J I C** is a Javascript Image Compressor using HTML5 Canvas & File API that allows you to compress your jpeg & png images before uploading to the server (100% client-side and no extra libraries requried!)

Could you imagine how much bandwidth we can save if Google, Twitter and r Facebook implement this image compression before we upload those 5MB photos? This approach will make the internet faster!!

You can check the working demo here : http://makeitsolutions.com/labs/jic/

## Requirements or Dependencies

- NONE

## Install via NPM

```sh
npm install j-i-c
```

## Install via Bower

```sh
bower install JIC
```


## How it works

To compress the image, first it converts an image object to canvas and then compress it with the canvas method **toDataURL(mimetype, quality)**

Then to upload the image object it uses the XMLHTTPRequest method sendAsBinary and sends the data url of the compressed image to the server and that's all!! Easy huh? 


## Example

**J I C** has only 2 methods: compress & upload. Check it out:

```javascript

//========= Step 1 - Client Side Compression ===========

//Images Objects
var source_img = document.getElementById("source_img"),
    target_img = document.getElementById("target_img");

//(NOTE: see the examples/js/demo.js file to understand how this object could be a local image 
//from your filesystem using the File API)

//An Integer from 0 to 100
var quality =  80,
// output file format (jpg || png)
output_format = 'jpg', 
//This function returns an Image Object 
target_img.src = jic.compress(source_img,quality,output_format).src;  


//======= Step 2 - Upload compressed image to server =========

//Here we set the params like endpoint, var name (server side) and filename
var server_endpoint = 'upload.php',
	server_var_name = 'file',
	filename = "new.jpg";

//This is the callback that will be triggered once the upload is completed
var callback = function(response){ console.log(response); }

//Here goes the magic
jic.upload(target_img, server_endpoint, server_var_name, filename, callback);

//=======  Optional parameters example: errorCallback, duringCallback and customHeaders ======= 
// This function gets called on an error response of the server - status code of >= 400.
var errorCallback = function () {
	// Handle upload failure
};

// This function gets called while the file is uploading. Returns the percent completeness of the image being uploaded
var duringCallback = function (progressPercent) {
	//progressPercent can be used to show a progress bar
};

// Custom Request Headers, nifty for things like Basic Authorization

var customHeaders = { 'Authorization': 'Basic someBase64EncodedHash=====' };

jic.upload(target_img, server_endpoint, server_var_name, filename, successCallback, errorCallback, duringCallback, customHeaders);


```


Collaborators
-------

- [@JustinBeaudry](https://github.com/JustinBeaudry)  - Added MIT License

- [@davidfq](https://github.com/davidfq) - Updated readme

- [@alastairparagas](https://github.com/alastairparagas) - Added errorCallback, progressCallback and customHeaders parameters
 

License
-------

This code is released under the [MIT License
license](http://opensource.org/licenses/MIT)

Copyright (c) 2012 Bruno Barbieri

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

Enjoy!
