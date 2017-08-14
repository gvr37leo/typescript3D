/// <reference path="color.ts" />


class Graphics{
    private ctxt:CanvasRenderingContext2D
    private imageData:ImageData

    constructor(ctxt:CanvasRenderingContext2D){
        this.ctxt = ctxt
        this.imageData = ctxt.getImageData(0,0,ctxt.canvas.width,ctxt.canvas.height)
    }

    getPixel(x:number, y:number):Color{
        var i = this.getPixelPos(x,y)

        var r = this.imageData.data[i]
        var g = this.imageData.data[i + 1]
        var b = this.imageData.data[i + 2]
        var a = this.imageData.data[i + 3]

        return new Color(r,g,b,a)
    }

    putPixel(x:number, y:number,color:Color){
        var i = this.getPixelPos(x,y)

        this.imageData.data[i] = color.r
        this.imageData.data[i + 1] = color.g
        this.imageData.data[i + 2] = color.b
        this.imageData.data[i + 3] = color.a
    }

    refresh(){
        this.ctxt.clearRect(0,0,this.ctxt.canvas.width,this.ctxt.canvas.height)
        this.imageData = this.ctxt.getImageData(0, 0, this.ctxt.canvas.width, this.ctxt.canvas.height)
    }

    show(){
        this.ctxt.putImageData(this.imageData, 0, 0)
    }
    
    private getPixelPos(x:number, y:number):number{
        return (x + this.imageData.width * y) * 4
    }
}