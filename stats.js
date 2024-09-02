const data = require("./state.json")


const rx = Object.entries(data).sort((a,b)=>(Object.keys(a[1]).length-Object.keys(b[1]).length))
Object.entries(rx).forEach((e,f)=>{
    const v = e[1][0]
    const runs = e[1][1]
    try{console.log(`${v}\t\t ${Object.keys(runs).length}`)}catch(x){}
})