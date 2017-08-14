/// <reference path="shader.ts" />


class Mesh{
    vertices:Vector3[]
    faces:number[]
    uvs:Vector2[]
    shader:Shader

    getPackage(i:number):Package{
		return new Package(this.vertices[i], this.uvs[i])
	}
	
	static quad():Mesh {
		var quad = new Mesh();
		quad.vertices = [new Vector3(-1,1,0),new Vector3(1,1,0),new Vector3(1,-1,0),new Vector3(-1,-1,0)];
		quad.faces = [0, 1, 2, 2, 3, 0];
		quad.uvs = [new Vector2(0,0),new Vector2(1,0),new Vector2(1,1),new Vector2(0,1) ];
		quad.shader = new LitShader(new Color(255, 0, 0));
		return quad;
	}

    static cube():Mesh {
		var cube = new Mesh();
		var f = 0.5;
		cube.vertices = [
			new Vector3(-f,f,f),
			new Vector3(f,f,f),
			new Vector3(f,f,-f),
			new Vector3(-f,f,-f),

			new Vector3(-f,-f,f),
			new Vector3(f,-f,f),
			new Vector3(f,-f,-f),
			new Vector3(-f,-f,-f),
        ];
		cube.faces = [ 
			0,1,2, 3,0,2,

			7,3,6, 6,3,2,
			6,2,5, 5,2,1,
			1,0,4, 1,4,5,
			0,3,4, 4,3,7,

			4,7,6, 4,6,5 
        ];
		cube.uvs = [ 
			new Vector2(0,0),
			new Vector2(1,0),
			new Vector2(1,1),
			new Vector2(0,1),

			new Vector2(0,1),
			new Vector2(1,1),
			new Vector2(1,0),
			new Vector2(0,0), 
        ];
		cube.shader = new LitShader(new Color(255,0,0));
		return cube;
	}

	applyTransformation(v:Vector3):Mesh  {
		for (var i = 0; i < this.vertices.length; i++) {
			this.vertices[i].add(v)
		}
		return this;
	}
}