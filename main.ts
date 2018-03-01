/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="graphics.ts" />
/// <reference path="shaders/defaultShader.ts" />
/// <reference path="objfiles/bunny.ts" />
/// <reference path="objfiles/cube.ts" />
/// <reference path="pipeline.ts" />
/// <reference path="mesh2.ts" />





var crret = createCanvas(500,500)
var canvas = crret.canvas
var ctxt = crret.ctxt

var gfx = new Graphics(ctxt)
var xrot = 0
var yrot = 0
var rotspeed = 3
var trans = new Vector3(0,0,2)
// var aabb = Mesh.parseOBJFile(bunny).findAABB()

ImageX.fromPath('images/barrel.jpg',(imageX) => {
    var pipeline = new Pipeline(gfx)

    loop((dt) => {
        console.log(dt)
        dt /= 1000
        if(keys[87]){
            xrot += dt * rotspeed
        }
        if(keys[83]){
            xrot -= dt * rotspeed
        }
        if(keys[65]){
            yrot += dt * rotspeed
        }
        if(keys[68]){
            yrot -= dt * rotspeed
        }
        var mesh = Mesh.parseOBJFile(cubefile)
        // var mesh = Mesh.quad()
        var aabb = mesh.findAABB()
        mesh.fragmentShader = new LitShader()
        mesh.vertexShader = new VertexShaderDef()
        
        mesh.rotate(new Vector3(0,1,0),yrot)
        mesh.rotate(new Vector3(1,0,0),xrot)
        mesh.translate(aabb.center.c().scale(-1).add(new Vector3(0,0,aabb.radius * 2)))
        




        gfx.clear()
        pipeline.draw([mesh])
        gfx.send()
        
    })
})





