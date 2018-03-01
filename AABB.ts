/// <reference path="node_modules/vectorx/vector.ts" />


class AABB{
    pos:Vector
    size:Vector

    constructor(pos:Vector, size:Vector){
        this.pos = pos
        this.size = size
    }

    static fromMinMax(min:Vector, max:Vector){
        var pos = min
        var size = min.to(max)
        return new AABB(pos,size)
    }

    center(){
        return  this.pos.lerp(this.pos.c().add(this.size), 0.5)
    }

    top():number{
        return 0
    }

    bottom():number{
        return 0
    }

    left():number{
        return 0
    }
}