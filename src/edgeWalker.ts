interface IEdgeCodeGetter {
	get(EdgeWalkerCode:EdgeWalkerCode):number;
};

class Package implements IEdgeCodeGetter{
    vertex: Vector3
    uv:Vector2

    constructor(vertex:Vector3, uv:Vector2){
        this.vertex = vertex
        this.uv = uv
    }

    lerp(p:Package,weight:number):Package{
        var pack = new Package(new Vector3(0,0,0), new Vector2(0,0));
        pack.vertex = this.vertex.lerp(p.vertex, weight);
        pack.uv = this.uv.lerp(p.uv, weight);
		return pack;
    }

    get(code: EdgeWalkerCode): number {
        switch (code) {
            case EdgeWalkerCode.x:
                return this.vertex.x;
            case EdgeWalkerCode.y:
                return this.vertex.y;
            case EdgeWalkerCode.z:
                return this.vertex.z;
            case EdgeWalkerCode.uvx:
                return this.uv.x;
            case EdgeWalkerCode.uvy:
                return this.uv.y;
        }
    }
}

enum EdgeWalkerCode{x,y,z,uvx,uvy}

class FromTo {
	edgeWalkerCode:EdgeWalkerCode
    from:number
    to:number

	constructor(edgeWalkerCode:EdgeWalkerCode, from:number, to:number){
        this.edgeWalkerCode = edgeWalkerCode
        this.from = from
        this.to = to
	}
}

class EdgeWalker implements IEdgeCodeGetter{
    
    counter:number
    posMap:Map<EdgeWalkerCode,number> = new Map()
    incsMap:Map<EdgeWalkerCode,number> = new Map()

    constructor(from:number, to:number,fromtos:FromTo[]){
        this.counter = from;
        var diff = to - from;
        
        for(var fromTo of fromtos){
			this.posMap[fromTo.edgeWalkerCode] = fromTo.from;
			this.incsMap[fromTo.edgeWalkerCode] = (fromTo.to - fromTo.from) / diff;
		}
    }

    step(steps:number = 1):void{
        this.counter += steps
        for(var pair of this.posMap){
            this.posMap.set(pair[0], pair[1] + this.incsMap.get(pair[0]) * steps) 
        }
    }

    static copyOver(a:IEdgeCodeGetter, b:IEdgeCodeGetter, walker:EdgeWalkerCode, codes:EdgeWalkerCode[]): EdgeWalker {
        var fromtos:FromTo[] = [];
		for(var code of codes){
			fromtos.push(new FromTo(code, a.get(code), b.get(code)));
		}

		return new EdgeWalker(a.get(walker), b.get(walker), fromtos);
    }

    get(code: EdgeWalkerCode): number {
        return this.posMap[code]
    }
}