class EdgeWalker{
    counter:number
    posMap:number[]
    incMap:number[]

    constructor(from:number, to:number, fromtos:FromTo[]){
        this.counter = from
        var diff = to - from
        this.posMap = new Array(fromtos.length)
        this.incMap = new Array(fromtos.length)

        for(var i = 0; i < fromtos.length; i++){
            var fromTo = fromtos[i]
            this.posMap[i] = fromTo.from
            if(diff == 0){
                this.incMap[i] = 1
            }else{
                this.incMap[i] = (fromTo.to - fromTo.from) / diff
            }
            
        }
    }

    step(steps:number){
        this.counter += steps
        for(var i = 0; i < this.posMap.length; i++){
            this.posMap[i] += this.incMap[i] * steps
        }
    }
}

class FromTo{
    from:number
    to:number

    constructor(from:number, to:number){
        this.from = from
        this.to = to
    }
}