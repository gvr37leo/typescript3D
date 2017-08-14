/// <reference path="main.ts" />


abstract class Shader{
    abstract vert(pos:Vector3):Vector3
    
    abstract frag(index:number,pos:Vector3,walker:EdgeWalker,normal:Vector3, gfx:Graphics):Color
}

class LitShader extends Shader{
    
    color:Color

    constructor(color: Color) {
        super()
    }

    vert(pos: Vector3): Vector3 {
        pos.x /= pos.z;
        pos.y /= pos.z;
        pos.x = (pos.x + 1) * (sz.x / 2)
        pos.y = (-pos.y + 1) * (sz.y / 2)
        // 1 -> 0 
        // 0 -> 200
        // -1 -> 400
        // Matrix::toScreenSpace(Vec2i(800,800)).mult(pos);
        return pos;
    }
    
    frag(): Color {
        return new Color(255,0,0)
    }
}