/// <reference path="pipeline.ts" />
/// <reference path="edgeWalker.ts" />


class Vertex implements ISteppable<Vertex>{

    edgewalker: EdgeWalker;
    pos:Vector3
    uv:Vector2
    normal:Vector3

    constructor(pos:Vector3, uv:Vector2){
        this.pos = pos
        this.uv = uv
        this.normal = new Vector3(1,1,1)
    }

    mult(n:number){
        this.pos.scale(n)
        this.uv.scale(n)
        this.normal.scale(n)
    }

    ignPosMul(n: number) {
        this.uv.scale(n)
        this.normal.scale(n)
    }

    setup(to: Vertex, dim:number) {
        this.edgewalker = this.initEdgeWalker(to, dim)
        return this
    }

    initEdgeWalker(to: Vertex, dim:number):EdgeWalker{
        var edgewalker = new EdgeWalker(this.pos.vals[dim],to.pos.vals[dim],[
            new FromTo(this.pos.x,to.pos.x),
            new FromTo(this.pos.y,to.pos.y),
            new FromTo(this.pos.z,to.pos.z),
            new FromTo(this.uv.x,to.uv.x),
            new FromTo(this.uv.y,to.uv.y),
            new FromTo(this.normal.x,to.normal.x),
            new FromTo(this.normal.y,to.normal.y),
            new FromTo(this.normal.z,to.normal.z)
        ])
        return edgewalker
    }


    copy(): Vertex {
        var v = new Vertex(this.pos.c() as Vector3,this.uv.c())
        v.normal = this.normal.c() as Vector3
        return v
    }
    
    getPos(): Vector3 {
        return this.pos
    }

    step(step: number) {
        this.edgewalker.step(step)
        this.pos.x = this.edgewalker.posMap[0]
        this.pos.y = this.edgewalker.posMap[1]
        this.pos.z = this.edgewalker.posMap[2]
        this.uv.x = this.edgewalker.posMap[3]
        this.uv.y = this.edgewalker.posMap[4]
        this.normal.x = this.edgewalker.posMap[5]
        this.normal.y = this.edgewalker.posMap[6]
        this.normal.z = this.edgewalker.posMap[7]
    }
}