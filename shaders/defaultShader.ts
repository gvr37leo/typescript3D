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
    
    constructor(){

    }

    exec(v: Vertex, normal: Vector3):Color{
        var alignment = Math.max(-this.lightDirection.dot(normal), 0)
        var brightness = Math.round(alignment * 255)
        return new Color(brightness,brightness,brightness,255)
    }
}

class VertexShaderDef implements IVertexShader<Vertex>{

    constructor(){

    }

    exec(vertex: Vertex): Vertex {
        return vertex
    }
}