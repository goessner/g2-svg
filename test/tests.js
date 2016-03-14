
"use strict";
var pi = Math.PI;
var tests = [
{ title: "cartesian",
  src: `var origin = g2().style({lw:3})
              .ply([20,0,0,0,0,20])
              .cir(0,0,3);
g2().cartesian().grid()
    .use(origin)`
},
{ title: "pan",
  src: `var origin = g2().style({lw:3})
              .ply([20,0,0,0,0,20])
              .cir(0,0,3);
g2().pan(25,30).grid()
    .use(origin)`
},
{ title: "zoom",
  src: `var origin = g2().style({lw:3})
              .ply([20,0,0,0,0,20])
              .cir(0,0,3);
g2().zoom(1.5,-35,-40).grid()
    .use(origin)`
},
{ title: "view",
  src: `var origin = g2().style({lw:3})
              .ply([20,0,0,0,0,20])
              .cir(0,0,3);
g2().view(35,45,2).grid()
    .use(origin)`
},
{ title: "del",
  src: `g2()
  .rec(60,30,80,40)
  .del()
  .cir(100,50,35)`
},
{ title: "lin",
  src: `g2()
 .lin(20,30,180,80,
      {ls:"green",lw:3})`
},
{ title: "rec",
  src: `g2()
 .rec(60,30,80,40,
      {ls:"red",lw:3,fs:"#ddd"})`
},
{ title: "cir",
  src: `g2().cir(100,50,35)`
},
{ title: "arc",
  src: `g2()
 .style({ls:"blue",lw:5,fs:"#ddd"})
 .arc( 90,50,35, 1/3*pi, 4/3*pi)
 .arc(120,50,35, 1/3*pi,-2/3*pi)`
},
{ title: "ply",
  src: `g2()
 .style({ls:"red",lw:3,fs:"#ddd"})
 .ply([20,10,60,80,120,30,180,90])`
},
{ title: "ply-2",
  src: `g2()
 .style({ls:"red",lw:3,fs:"#ddd"})
 .ply([[20,10],
       [60,80],
       [120,30],
       [180,90]])`
},
{ title: "ply-3",
  src: `g2()
 .style({ls:"red",lw:3,fs:"#ddd"})
 .ply([{x:20,y:10},
       {x:60,y:80},
       {x:120,y:30},
       {x:180,y:90}])`
},
{ title: "ply-4",
  src: `g2()
 .ply([20,10,60,80,120,30,180,90],
      true,{ls:"red",lw:3,fs:"#ddd"})`
},
{ title: "ply-5",
  src: `g2()
 .style({ls:"red",lw:3,fs:"#ddd"})
 .ply([20,10,60,80,120,30,180,90],
      "split")`
},
{ title: "path",
  src: `g2()
 .p()
   .m(25,25)
   .q(50,0,75,25)
   .a(-pi/2,75,75)
   .c(50,75,50,25,25,25)
   .z()
 .stroke({ls:"#888",lw:8,
          lc:"round",lj:"round"})`
},
{ title: "path-2",
  src: `g2()
 .p()
   .m(25,25)
   .q(50,0,75,25)
   .a(-pi/2,75,75)
   .c(50,75,50,25,25,25)
   .z()
 .fill({fs:"green"})`
},
{ title: "path-3",
  src: `g2()
 .p()
   .m(25,25)
   .q(50,0,75,25)
   .a(-pi/2,75,75)
   .c(50,75,50,25,25,25)
   .z()
 .drw({ls:"#888",fs:"green",lw:8,
       lc:"round",lj:"round"})`
},
{ title: "path-4",
  src: `var d="M100,10L123.5,82.4L61,37.6"
     +"L138,37.6L76.5,82.4Z";
g2()
 .drw(d)`
},
{ title: "path-5",
  src: `var d="M100,10L123.5,82.4L61,37.6"
     +"L138,37.6L76.5,82.4Z";
g2()
 .drw({lw:4,ls:"#080",fs:"#0f0"},d)`
},
{ title: "txt",
  src: `g2().txt("Hello",30,30,0,
         {foc:"red",foz:30})`
},
{ title: "txt-2",
  src: `g2().txt("Hello",100,50,0)
    .txt("Hello",100,50, pi/2)
    .txt("Hello",100,50, pi)
    .txt("Hello",100,50,-pi/2)`
},
{ title: "txt-3",
  src: `g2().grid("#ccc",25)
 .txt("LL",100,25,0,{tval:"bottom"})
 .txt("ML",100,50,0,{tval:"middle"})
 .txt("UL",100,75,0,{tval:"top"})`
},
{ title: "txt-4",
  src: `g2().grid("#ccc",25)
 .style({thal:"center"})
 .txt("LC",100,25,0,{tval:"bottom"})
 .txt("MC",100,50,0,{tval:"middle"})
 .txt("UC",100,75,0,{tval:"top"})`
},
{ title: "txt-5",
  src: `g2().grid("#ccc",25)
 .style({thal:"right"})
 .txt("LR",100,25,0,{tval:"bottom"})
 .txt("MR",100,50,0,{tval:"middle"})
 .txt("UR",100,75,0,{tval:"top"})`
},
{ title: "img",
  src: `g2().img("./img/atom.png",30,30)`
},
{ title: "img-2",
  src: `g2().img("unknown.png",30,30)`
},
{ title: "beg-end",
  src:`g2()
 .beg({x:70,y:30,w:0.2,scl:2,
       ls:"#666",fs:"orange",lw:3,
       lc:"round",lj:"round"})
   .rec(0,0,30,20)
 .end()`
},
{ title: "use",
  src:`var smiley = g2()
              .cir(0,0,5)  
              .arc(0,0,3,0.8,2)
              .style({fs:"snow"})
              .cir(-2,-1,1)
              .cir(2,-1,1);
g2().use(smiley,{x:50,y:50,scl:4,
         lwnosc:true,lw:3,fs:"yellow"})
    .use(smiley,{x:150,y:50,scl:5,
         lwnosc:true,lw:2,fs:"orange"});`
},
{ title: "shadow",
  src:`g2()
 .style({lw:3,ls:"#456",
    fs:"yellow",ld:[8,4,2,4],
    sh:[5,5,5,"rgba(0,0,0,0.7)"]})
 .rec(30,40,50,20)
 .cir(140,50,40)`
},
{ title: "grid",
  src: 'g2().grid()'
}
]

if (typeof module === "object" && module.exports)
   module.exports = tests;
   