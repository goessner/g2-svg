var fs = require('fs'),                          
    g2 = require('../dist/g2svg.js'),             // load standalone 'g2+svg' file.
    ctx = {width:200,height:100},                 // provide context with viewport size.
    g = g2().style({ls:"green",fs:"orange",lw:3}) // create g2 object and add style.
        .rec(40,30,120,40)                        // add rectangle.
        .exe(ctx);                                // render as svg.

fs.writeFile("./rec.svg", ctx.svg, function(err) { if(err) return console.log(err); });
