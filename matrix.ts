/// <reference path="node_modules/vectorx/vector.ts" />

class Matrix{
    
    vals:number[][]

    constructor(){
        this.vals = [
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
        ]
    }

    identity(){

    }

    multM(other:Matrix){
        var result = new Matrix();
		for (var row = 0; row < 4; row++) {
			for (var col = 0; col < 4; col++) {
				var sum = 0;

				for (var k = 0; k < 4; k++) {
					sum += this.vals[row][k] * other.vals[k][col];
				}
				result.vals[row][col] = sum;
			}
		}
		return result;
    }

    multV(other:Vector3){
        var p = new Vector3(0,0,0)
		for (var row = 0; row < 4; row++) {
			for (var k = 0; k < 3; k++) {
				p.set(row,p.get(row) + this.vals[row][k] * other.get(k));
			}
			p.set(row,p.get(row) + this.vals[row][3]);
        }
        other.overwrite(p)
		return this;
    }

    static rotate(u:Vector3, rotation:number){
        var cost = Math.cos(rotation)
        var sint = Math.sin(rotation)
        var icost = 1 - cost

        var matrix = [
            [cost + u.x ** 2 * icost,u.x*u.y*icost-u.z*sint,u.x*u.z*icost+u.y*sint,0],
            [u.y*u.x*icost +  u.z * sint,cost + u.y ** 2 * icost,u.y * u.z * icost - u.x * sint,0],
            [u.z * u.x  * icost - u.y * sint ,u.z * u.y * icost + u.x * sint,cost + u.z ** 2 * icost,0],
            [0,0,0,1]
        ]
        var newmatrix = new Matrix();
        newmatrix.vals = matrix;
        return newmatrix;
    }
}