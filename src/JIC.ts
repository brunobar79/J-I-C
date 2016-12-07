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

export class jic {
    /**
     * Receives an Image Object (can be JPG OR PNG) and returns a new Image Object compressed
     * @param {HTMLImageElement} source_img_obj The source Image Object
     * @param {Integer} quality The output quality of Image Object
     * @param {String} output format. Possible values are jpg and png
     * @return {HTMLImageElement} result_image_obj The compressed Image Object
     */
    public static compress(source_img_obj: HTMLImageElement, quality: number, output_format: string): HTMLImageElement {
        let mime_type: string = "image/jpeg";
        if (typeof output_format !== "undefined" && output_format === "png") {
            mime_type = "image/png";
        }

        let cvs: HTMLCanvasElement = document.createElement("canvas");
        cvs.width = source_img_obj.naturalWidth;
        cvs.height = source_img_obj.naturalHeight;
        cvs.getContext("2d").drawImage(source_img_obj, 0, 0);
        const newImageData: string = cvs.toDataURL(mime_type, quality / 100);
        let result_image_obj: HTMLImageElement = new Image();
        result_image_obj.src = newImageData;
        return result_image_obj;
    }

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
    public static upload (compressed_img_obj: HTMLImageElement, upload_url: string, file_input_name: string, filename: string, successCallback?: Function, errorCallback?: Function, duringCallback?: Function, customHeaders?: any): void {
        //ADD sendAsBinary compatibilty to older browsers
        if ((XMLHttpRequest as any).prototype.sendAsBinary === undefined) {
            (XMLHttpRequest as any).prototype.sendAsBinary = function (stringToBinary: string) {
                const bytes = Array.prototype.map.call(stringToBinary, (c: string): number => {
                    return c.charCodeAt(0) & 0xff;
                });
                this.send(new Uint8Array(bytes).buffer);
            };
        }

        let type = "image/jpeg";
        if (filename.substr(-4).toLowerCase() === ".png") {
            type = "image/png";
        }

        let data = compressed_img_obj.src.replace("data:" + type + ";base64,", "");

        let xhr = new XMLHttpRequest();
        const boundary = "someboundary";

        xhr.open("POST", upload_url, true);
        xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);

        // Set custom request headers if customHeaders parameter is provided
        if (customHeaders && typeof customHeaders === "object") {
            for (let headerKey of customHeaders) {
                xhr.setRequestHeader(headerKey, customHeaders[headerKey]);
            }
        }

        // If a duringCallback function is set as a parameter, call that to notify about the upload progress
        if (duringCallback && duringCallback instanceof Function) {
            xhr.upload.onprogress = (evt: ProgressEvent): void => {
                if (evt.lengthComputable) {
                    duringCallback((evt.loaded / evt.total) * 100);
                }
            };
        }

        (xhr as any).sendAsBinary(`
            --${boundary}
            Content-Disposition: form-data; name="${file_input_name}"; filename="${filename}"
            Content-Type: ${type}

            ${atob(data)}
            --${boundary}--
        `);

        xhr.onreadystatechange = function(): void {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    successCallback(this.responseText);
                } else if (this.status >= 400) {
                    if (errorCallback && errorCallback instanceof Function) {
                        errorCallback(this.responseText);
                    }
                }
            }
        };
    }
}