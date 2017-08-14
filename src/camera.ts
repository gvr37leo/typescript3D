/// <reference path="mesh.ts" />
/// <reference path="edgeWalker.ts" />
/// <reference path="vector.d.ts" />
/// <reference path="graphics.ts" />

class Camera{
	constructor(){

	}

	draw(mesh:Mesh, gfx:Graphics){
		var wscoords = mesh.vertices.map((v) => {
			return v.c()
		});
		for (var i = 0; i < mesh.vertices.length; i++) {
			mesh.shader.vert(mesh.vertices[i]);
		}

		for (var i = 0; i < mesh.faces.length; i += 3) {
			var v1 = wscoords[mesh.faces[i]];
			var v2 = wscoords[mesh.faces[i + 1]];
			var v3 = wscoords[mesh.faces[i + 2]];
			var normal = v2.sub(v1).cross(v3.sub(v1)).normalize();
			if (normal.dot(v1.sub(new Vector3(0, 0, 0))) < 0) {
				this.triangle(mesh, mesh.faces[i], mesh.faces[i + 1], mesh.faces[i + 2], gfx, (pos:Vector3, walker:EdgeWalker) => {
					var c = mesh.shader.frag(i, pos, walker, normal, gfx);
					gfx.putPixel(pos.x, pos.y, c);
				});
			}
		}
	}

    triangle(mesh:Mesh, a:number, b:number, c:number, gfx:Graphics, locationGiver: (pos:Vector3, walker:EdgeWalker) => void) {
        var vs:Package[] = [mesh.getPackage(a),mesh.getPackage(b),mesh.getPackage(c) ];
        vs.sort((a,b) => a.uv.y > b.vertex.y ? 1 : -1)
        var top = vs[0]
        var middle = vs[1]
        var bot = vs[2]

		var ratio = (middle.vertex.y - top.vertex.y) / (bot.vertex.y - top.vertex.y);
	    var middleRight = top.lerp(bot, ratio);
		if (middle.vertex.x > middleRight.vertex.x){
			var temp = middle
			middle = middleRight
			middleRight = temp
		}

		var fromTo = function(topLeft:Package, topRight:Package, bottomLeft:Package, bottomRight:Package) {
			var leftWalker = EdgeWalker.copyOver(topLeft, bottomLeft, EdgeWalkerCode.y, [EdgeWalkerCode.x, EdgeWalkerCode.z, EdgeWalkerCode.uvx, EdgeWalkerCode.uvy]);
			var rightWalker = EdgeWalker.copyOver(topRight, bottomRight, EdgeWalkerCode.y, [EdgeWalkerCode.x, EdgeWalkerCode.z, EdgeWalkerCode.uvx, EdgeWalkerCode.uvy]);
			
			var distToPixelCenter = (Math.ceil(leftWalker.counter - 0.5) + 0.5) - leftWalker.counter;
			leftWalker.step(distToPixelCenter);
			rightWalker.step(distToPixelCenter);

			//float roofPixelCoverage = ceil(topLeft.get(EdgeWalkerCode::y)) - topLeft.get(EdgeWalkerCode::y);
			//float basePixelCoverage = bottomLeft.get(EdgeWalkerCode::y) - floor(bottomLeft.get(EdgeWalkerCode::y));
			
			while (leftWalker.counter < Math.ceil(bottomLeft.vertex.y - 0.5)) {
				var horizontalWalker = EdgeWalker.copyOver(leftWalker, rightWalker, EdgeWalkerCode.x, [EdgeWalkerCode.z, EdgeWalkerCode.uvx, EdgeWalkerCode.uvy]);
				horizontalWalker.step((Math.ceil(horizontalWalker.counter - 0.5) + 0.5) - horizontalWalker.counter);
				
				while (horizontalWalker.counter < Math.ceil(rightWalker.get(EdgeWalkerCode.x) - 0.5)) {
					locationGiver(new Vector3(Math.floor(horizontalWalker.counter), Math.floor(leftWalker.counter),0), horizontalWalker);
					horizontalWalker.step();
				}
				leftWalker.step();
				rightWalker.step();
			}
		};

		fromTo(top,top,middle,middleRight);//upper triangle/flatbot
		fromTo(middle, middleRight,bot,bot);//lower triangle/flattop
	}
}