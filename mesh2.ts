/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="vertex.ts" />
/// <reference path="matrix.ts" />


class Mesh implements IMesh<Vertex>{


    faces:Face[] = []
    positions:Vector3[] = []
    uvs:Vector2[] = []
    normals:Vector3[] = []
    fragmentShader:IFragmentShader<Vertex>
    vertexShader:IVertexShader<Vertex>

    constructor(){

    }

    rotate(axes:Vector3,radians:number){
        var rotmatrix = Matrix.rotate(axes,radians)
        for(var v of this.positions){
            rotmatrix.multV(v)
        }
        for(var v of this.normals){
            rotmatrix.multV(v)
        }
    }

    static quad():Mesh{
        var quad = new Mesh();
        quad.positions = [
            new Vector3(-1, 1, 0),
            new Vector3( 1, 1, 0),
            new Vector3( 1,-1, 0),
            new Vector3(-1,-1, 0),
        ]
        quad.uvs = [
            new Vector2(0,0),
            new Vector2(1,0),
            new Vector2(1,1),
            new Vector2(0,1),
        ]
		quad.faces = [
            new Face([new VertexPointer(0,0,0),new VertexPointer(1,1,0),new VertexPointer(2,2,0)]),
            new Face([new VertexPointer(0,0,0),new VertexPointer(2,2,0),new VertexPointer(3,3,0)])
        ];
        return quad
    }

    translate(t:Vector3){
        for(var v of this.positions){
            v.add(t)
        }
    }

    getPositions(): Vector3[] {
        return this.positions
    }

    assembleVertex(vertexPointer: VertexPointer): Vertex {
        return new Vertex(this.positions[vertexPointer.position].c(),this.uvs[vertexPointer.uv].c(),this.normals[vertexPointer.normal].c())
    }

    getFaces(): Face[] {
        return this.faces
    }

    getVertexShader(): IVertexShader<Vertex> {
        return this.vertexShader
    }

    getFragmentShader(): IFragmentShader<Vertex> {
        return this.fragmentShader
    }

    static parseOBJFile(file:string):Mesh{
        var mesh = new Mesh()

        for(var line of file.split('\n')){
            var fragments = line.split(' ')
            switch (fragments[0]) {
                case 'v':
                    mesh.positions.push(new Vector3(parseFloat(fragments[1]),parseFloat(fragments[2]),parseFloat(fragments[3])))
                    break;
                case 'vt':
                    mesh.uvs.push(new Vector2(parseFloat(fragments[1]),parseFloat(fragments[2])))
                    break;
                case 'vn':
                    mesh.normals.push(new Vector3(parseFloat(fragments[1]),parseFloat(fragments[2]),parseFloat(fragments[3])))
                    break;
                case 'f':
                    var vertexPointers:VertexPointer[] = []
                    for(var i = 1; i < fragments.length; i++){
                        var pointers = fragments[i].split('/')
                        vertexPointers.push(new VertexPointer(parseInt(pointers[0]) - 1,parseInt(pointers[1]) - 1,parseInt(pointers[2]) - 1))
                    }
                    var face = new Face(vertexPointers)
                    mesh.faces.push(face)
                    break;
                default:
                    //do nothing
                    break;
            }
        }

        return mesh
    }

    findAABB(){
        function getValue(v:Vector3,i:number){
            return v.vals[i]
        }

        function findAABBHelper(list:Vector3[],callback:(t:Vector3,n:number) => number){
            var best = new Vector3(0,0,0)
            for(var i = 0; i < 3; i++){
                best.vals[i] = getValue(list[findbestIndex(list,(v) => {
                    return callback(v,i)
                })],i)
            }
            return best
        }
        var min = findAABBHelper(this.positions,(v,i) =>  -getValue(v,i))
        var max = findAABBHelper(this.positions,(v,i) =>  getValue(v,i))
        var center = min.c().add(max).scale(0.5)
        return {center, radius:min.to(max).length() / 2}    
    }
}

