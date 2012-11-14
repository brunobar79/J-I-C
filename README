# J I C 
**J I C** is a Javascript Image Compressor using HTML5 Canvas & File API that allows you to compress your jpeg & png images before uploading to the server (100% client-side and no extra libraries requried!)

Could you imagine how much bandwidth we can save if Google, Twitter and r Facebook implement this image compression before we upload those 5MB photos? This approach will make the internet faster!!

You can check the working demo here : http://makeitsolutions.com/labs/jic/

## EXAMPLES

**J I C** has only 2 methods: compress & upload. Check out this example:

```javascript

//Step 1 - Client Side Compression

var source_image = document.getElementById("source_img");  //an Image Object 

//(NOTE:see the demo to understand how this object could be a local image from your filesystem using the File API)

var quality =  80;  //An Integer from 0 to 100

document.getElementById("source_img").src = jic.compress(source_image,quality).src;  //Returns an Image Object so you can assing it source to any DOM img element.

//Step 2 - Upload compressed image to server

var server_endpoint = 'upload.php',
	server_variable = 'file',
	filename = "new.jpg";



jic.upload(result_image, server_endpoint, server_variable, filename, callback);

```

And that's all!! Easy huh? 
Enjoy!
