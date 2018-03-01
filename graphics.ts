/// <reference path="node_modules/vectorx/vector.ts" />


class Graphics{

    ctxt:CanvasRenderingContext2D
    imageData:ImageData

    constructor(ctxt:CanvasRenderingContext2D){
        this.ctxt = ctxt
        this.load()
    }

    clear(){
        this.ctxt.clearRect(0,0,this.getWidth(),this.getHeight())
        this.load()
    }

    load(){
        this.imageData = this.ctxt.getImageData(0,0,this.getWidth(),this.getHeight())
    }

    getWidth(){
        return this.ctxt.canvas.width
    }

    getHeight(){
        return this.ctxt.canvas.height
    }

    send(){
        this.ctxt.putImageData(this.imageData,0,0)
    }

    getPixelV(v:Vector2){
        this.getPixel(v.x,v.y)
    }

    getPixel(x,y){
        var i = this.index(x,y)
        var r = this.imageData.data[i]
        var g = this.imageData.data[i + 1]
        var b = this.imageData.data[i + 2]
        var a = this.imageData.data[i + 3]
        return new Color(r,g,b,a)
    }

    putPixelV(v:Vector2,r,g,b,a){
        this.putPixel(v.x,v.y,r,g,b,a)
    }

    putPixelVC(v:Vector2,c:Color){
        this.putPixel(v.x,v.y,c.r,c.g,c.b,c.a)
    }

    putPixel(x,y,r,g,b,a){
        var i = this.index(x,y)
        this.imageData.data[i] = r
        this.imageData.data[i + 1] = g
        this.imageData.data[i + 2] = b
        this.imageData.data[i + 3] = a
    }

    indexV(v:Vector2){
        this.index(v.x,v.y)
    }

    index(x,y){
        return (y * this.getWidth() + x) * 4
    }
}

class Color{
    r:number
    g:number
    b:number
    a:number

    constructor(r:number,g:number,b:number,a:number){
        this.r = r
        this.g = g
        this.b = b
        this.a = a
    }
}