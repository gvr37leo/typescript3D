/// <reference path="graphics.ts" />


class ImageX{
    gfx:Graphics

    constructor(imageData:ImageData){
        var canvas = document.createElement('canvas');
        var ctxt = canvas.getContext('2d');
        this.gfx = new Graphics(ctxt)
        this.gfx.imageData = imageData
    }

    getPixel(x,y):Color{
        return this.gfx.getPixel(x,y)
    }

    getPixelPercentile(x,y){
        var xp = Math.round(x * (this.gfx.imageData.width - 1))
        var yp = Math.round(y * (this.gfx.imageData.height - 1))
        return this.gfx.getPixel(xp, yp)
    }

    putPixel(x,y,r,g,b,a){
        this.gfx.putPixel(x,y,r,g,b,a)
    }


    static fromSize(x:number, y:number){
        return new ImageX(new ImageData(x,y))
    }

    static fromImage(htmlimage:HTMLImageElement):ImageX{
        var image = new ImageX(null)
        image.gfx.ctxt.canvas.width = htmlimage.width
        image.gfx.ctxt.canvas.height = htmlimage.height
        image.gfx.ctxt.drawImage(htmlimage,0,0)
        image.gfx.load()
        return image
    }

    static fromPath(path:string,callback:(image:ImageX) => void){
        var image = new Image()
        image.src = path

        image.onload = (ev) => {
            callback(ImageX.fromImage(image))
        }
    }

    getHTMLImage():HTMLImageElement{
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = this.gfx.imageData.width;
        canvas.height = this.gfx.imageData.height;
        ctx.putImageData(this.gfx.imageData, 0, 0);

        var image = new Image();
        image.src = canvas.toDataURL();
        return image;
    }
}
