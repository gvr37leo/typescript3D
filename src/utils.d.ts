/// <reference path="vector.d.ts" />

declare function map(val1:number, start1:number, stop1:number, start2:number, stop2:number):number

declare function inRange(min:number,max:number ,value:number):boolean

declare function min(a:number,b:number):number

declare function max(a:number,b:number):number

declare function clamp(val:number, min:number, max:number):number

declare function rangeContain(a1:number,a2:number,b1:number,b2:number):boolean

declare function create2dArray(v, fill)

declare function getMousePos(canvas:HTMLCanvasElement, evt:Event):Vector2

declare function createCanvas(x:number, y:number)

declare function random(min:number, max:number):number

declare function randomSpread(center:number, spread:number):number

declare function loop(callback:(time:number) => void)

declare function mod(number:number, modulus:number):number

declare function getMoveInput()

declare function getFiles(strings)