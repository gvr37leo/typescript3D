declare abstract class Vector<V extends Vector<V>>{
    dimensions:number;

    static construct()

    add(v:V):V
    sub(v:V):V
    scale(s:number):V
    normalize():V
    dist(v:V):number
    length():number
    lerp(v:V,weight:number):V
    project(v:V):V
    dot(v:V):number
    c():V
    equals(v:V):boolean
    overwrite(v:V):V
    //iterate
    loop()
    toArray()
    get(i:number):number
}

declare class Vector2 extends Vector<Vector2>{
    x:number
    y:number
    constructor(x:number,y:number)
    draw(ctxt:CanvasRenderingContext2D)
    
}

declare class Vector3 extends Vector<Vector3>{
    x:number
    y:number
    z:number
    constructor(x:number,y:number,z:number)
    cross(v:Vector3):Vector3
}