/// <reference path="mesh.ts" />
/// <reference path="graphics.ts" />
/// <reference path="camera.ts" />
/// <reference path="utils.d.ts" />
var sz = new Vector2(400,400)

var camera = new Camera()
var gfx = new Graphics(createCanvas(sz.x,sz.y).ctxt)







loop((time) => {
    console.log(time)
    var mesh = Mesh.quad()
    mesh.applyTransformation(new Vector3(0,0,5))
    gfx.refresh()
    camera.draw(mesh, gfx)
    gfx.show()
})