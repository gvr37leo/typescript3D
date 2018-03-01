/// <reference path="graphics.ts" />
/// <reference path="node_modules/utilsx/utils.ts" />


class Pipeline<T extends ISteppable<T>>{
    gfx:Graphics
    // vertexshader:IVertexShader<T>
    // fragmentshader:IFragmentShader<T>
    zbuffer:any[]

    constructor(gfx:Graphics){
        this.gfx = gfx

        this.zbuffer = createNDimArray([this.gfx.getHeight(),this.gfx.getWidth()],(p) => 0)
    }

    draw(meshes:IMesh<T>[]){
        this.setup()

        for(var mesh of meshes){
            var faces = mesh.getFaces()

            for(var i = 0; i < faces.length; i++){
                var face = faces[i]
                
                var v1 = mesh.assembleVertex(face.verticesPointers[0])
                var v2 = mesh.assembleVertex(face.verticesPointers[1])
                var v3 = mesh.assembleVertex(face.verticesPointers[2])

                var normal = v1.getPos().to(v2.getPos()).cross(v1.getPos().to(v3.getPos())).normalize()
                if(normal.dot(new Vector3(0,0,0).to(v1.getPos())) < 0){//maybe replace v1.getpos with variable to prevent functioncalls
                    [v1,v2,v3].forEach((v) => this.screenTransform(v))
                    this.triangle(v1,v2,v3, (v) => {
                        //perspective correction
                        var z = 1 / v.getPos().z
                        v.ignPosMul(z)

                        var x = Math.floor(v.getPos().x)
                        var y = Math.floor(v.getPos().y)

                        if(this.testAndSetZBuffer(x,y,z)){
                            var color = mesh.getFragmentShader().exec(v,normal)
                            this.gfx.putPixel(x,y,color.r,color.g,color.b,color.a)
                        }
                    })
                }
            }
        }
    }

    screenTransform(vertex:T){
        var v = vertex.getPos()
        var zInv = 1 / v.z
        
        vertex.mult(zInv)
        v.z = zInv

		v.x = (v.x + 1) * (this.gfx.getWidth() / 2);
        v.y = (-v.y + 1) * (this.gfx.getHeight() / 2);
    }

    setup(){
        var mx = this.gfx.getWidth()
        var my = this.gfx.getHeight()
        for(var x = 0; x < mx; x++){
            for(var y = 0; y < my; y++){
                this.zbuffer[y][x] = Number.POSITIVE_INFINITY
            }
        }
    }

    testAndSetZBuffer(x,y,z):boolean{
        if(z < this.zbuffer[y][x]){
            this.zbuffer[y][x] = z
            return true
        }else{
            return false
        }
    }

    triangle<T extends ISteppable<T>>(a:T,b:T,c:T,callback:(v:T) => void){
        var vertices = [a,b,c]
        vertices.sort((a,b) => a.getPos().y - b.getPos().y)
        
        var top = vertices[0]
        var middleLeft = vertices[1]
        var bot = vertices[2]

        var ratio = (middleLeft.getPos().y - top.getPos().y) / (bot.getPos().y - top.getPos().y)
        var middleRight = top.copy().setup(bot,1)
        middleRight.step(ratio * (bot.getPos().y - top.getPos().y))

        if (middleLeft.getPos().x > middleRight.getPos().x){
            var temp = middleLeft
            middleLeft = middleRight
            middleRight = temp
        }

        var fromtoer = (topleft:T,topright:T,botleft:T,botright:T) => {
            var leftwalker = topleft.copy().setup(botleft,1)
            var rightwalker = topright.copy().setup(botright,1)
            var distToPixelCenter = (Math.ceil(leftwalker.getPos().y - 0.5) + 0.5) - leftwalker.getPos().y;
            leftwalker.step(distToPixelCenter);
            rightwalker.step(distToPixelCenter);

            while(leftwalker.getPos().y < Math.ceil(botleft.getPos().y - 0.5)){
                var horizontalWalker = leftwalker.copy().setup(rightwalker,0)
                horizontalWalker.step((Math.ceil(horizontalWalker.getPos().x - 0.5) + 0.5) - horizontalWalker.getPos().x);

                while(horizontalWalker.getPos().x < Math.ceil(rightwalker.getPos().x - 0.5)){
                    callback(horizontalWalker)
                    horizontalWalker.step(1)
                }

                leftwalker.step(1)
                rightwalker.step(1)
            }
        }

        fromtoer(top,top,middleLeft,middleRight)
        fromtoer(middleLeft,middleRight,bot,bot)
    }
}

interface IVertexShader<T>{
    exec(v:T):T
}

interface IFragmentShader<T>{
    exec(v:T,normal:Vector3):Color
}

interface IGeometryShader<T>{
    exec():T
}

class Face{
    verticesPointers:VertexPointer[]

    constructor(verticesPointers:VertexPointer[]){
        this.verticesPointers = verticesPointers
    }
}

class VertexPointer{
    position:number
    uv:number
    normal:number

    constructor(position:number,uv:number,normal:number){
        this.position = position
        this.uv = uv
        this.normal = normal
    }
}

interface IMesh<T extends ISteppable<T>>{
    getPositions():Vector3[]
    getFaces():Face[]
    getVertexShader():IVertexShader<T>
    getFragmentShader():IFragmentShader<T>
    assembleVertex(vertexPointer:VertexPointer):T
}

interface ISteppable<T>{
    getPos():Vector3
    copy():T
    setup(to:T,dim:number):T
    step(step:number)
    mult(n:number)
    ignPosMul(n:number)
}