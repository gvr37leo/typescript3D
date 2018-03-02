/// <reference path="../image.ts" />


class TexturedShader implements IFragmentShader<Vertex>{

    texture:ImageX

    constructor(image:ImageX){
        this.texture = image
    }

    exec(v: Vertex, normal: Vector3): Color {
        var color = this.texture.getPixelPercentile(v.uv.x,v.uv.y)
        return color
    }
 
}

class LitShader implements IFragmentShader<Vertex>{
    lightDirection:Vector3 = new Vector3(1,-1,1).normalize()
    ambientBrightness = 50
    constructor(){

    }

    exec(v: Vertex, normal: Vector3):Color{
        var alignment = Math.max(-this.lightDirection.dot(v.normal), 0)
        var brightness = Math.round(alignment * 255)
        brightness = Math.min(255,this.ambientBrightness + brightness)
        return new Color(brightness,brightness,brightness,255)
    }
}

class LitAndTextured implements IFragmentShader<Vertex> {

    litShader:LitShader
    texturedShader:TexturedShader

    constructor(image:ImageX){
        this.litShader = new LitShader()
        this.texturedShader = new TexturedShader(image)
    }

    exec(v: Vertex, normal: Vector3): Color {
        var litcolor = this.litShader.exec(v,normal)
        var textureColor = this.texturedShader.exec(v,normal)
        return litcolor.mul(textureColor)
    }
}

class VertexShaderDef implements IVertexShader<Vertex>{

    constructor(){

    }

    exec(vertex: Vertex): Vertex {
        return vertex
    }
}