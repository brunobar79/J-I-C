# J I C 
**J I C** is a Javascript Image Compressor using HTML5 Canvas & File API that allows you to compress your jpeg & png images before uploading to the server (100% client-side and no extra libraries requried!)

Could you imagine how much bandwidth we can save if Google, Twitter and r Facebook implement this image compression before we upload those 5MB photos? This approach will make the internet faster!!

You can check the working demo here : http://makeitsolutions.com/labs/jic/

## How it works

To compress the image, first it converts an image object to canvas and then compress it with the canvas method **toDataURL(mimetype, quality)**

Then to upload the image object it uses the XMLHTTPRequest method sendAsBinary and sends the data url of the compressed image to the server and that's all!! Easy huh? 


## Example

**J I C** has only 3 methods: isSupported, compress & upload. Check it out:

```javascript

//========= Step 1 - Check for browser support ===========

if(!jic.isSupported()){
  // canvas.toDataURL is not supported
  // fallback...
  return;
}

//========= Step 2 - Client Side Compression ===========

//Images Objects
var source = document.getElementById("source_img"),
    target_img = document.getElementById("target_img");

//(NOTE: see the examples/js/demo.js file to understand how this object could be a local image 
//from your filesystem using the File API)

//An Integer from 0 to 100
var quality =  80;  

//This function returns an Image Object 
target_img.src = jic.compress(source_image,quality).src;  


//======= Step 3 - Upload compressed image to server =========

//Here we set the params like endpoint, var name (server side) and filename
//**additional_data** param is optional
var server_endpoint = 'upload.php',
	server_var_name = 'file',
	filename = "new.jpg",
	additional_data = {
	  description : 'new.jpg file description'
	};

//This is the callback that will be triggered once the upload is completed
var callback = function(response){ console.log(response); }

//Here goes the magic
jic.upload(target_img, server_endpoint, server_var_name, filename, additional_data, callback);


```

Enjoy!
