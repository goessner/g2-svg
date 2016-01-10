/**
 * @fileoverview g2.svg.js
 * @author Stefan Goessner (c) 2015/16
 * @license MIT License
 */
/* jshint -W014 */


g2.Svg = {
   create: function() { var o = Object.create(this.prototype); o.constructor.apply(o,arguments); return o; },
   prototype: {
      constructor: function(ctx) {
         this.ctx = ctx;
         this.content = {
            svg: "",        // main section
            head: "",       // defs section
            body: "",       // visible section
            open: "body"
         };
         this.outerTransform = false;
         this.openGroups = [];
         this.path = false;
         this.useReg = [];  // registry of used g2 objects ...
      },
      get width() { return "innerHTML" in this.ctx 
                         ? this.ctx.getAttribute("data-width") 
                         : this.ctx.width; 
      },
      get height() { return "innerHTML" in this.ctx
                          ? this.ctx.getAttribute("data-height") 
                          : this.ctx.height;
      },
      get str()  { return this.content[this.content.open]; },
      set str(s) { this.content[this.content.open] = s; },
      toString: function() {
         var out = this.content.svg;
         if (this.content.head)
            out += '<defs>\n' + this.content.head + '</defs>\n';
         out += this.content.body + '</svg>\n';
         return out;
      },
      applyStyle: function(args,state,local) {
         for (var m in args) {
            var val = args[m];
            if (typeof val === "string" && val[0] === "@")
               val = state.getAttr(val.substr(1));
            if (!local) state.setAttr(m, val);
            if (g2.State.svg.set[m])
               g2.State.svg.set[m].call(this,val,state);
         }
      }
   }
};

g2.ifc.svg = function(ctx) {
   return Object.getPrototypeOf(ctx) === g2.Svg.prototype
       || "innerHTML" in ctx
       || typeof ctx === "object" && "height" in ctx && "width" in ctx;
}
g2.proxy.svg = function(ctx) { return Object.getPrototypeOf(ctx) === g2.Svg.prototype ? ctx : g2.Svg.create(ctx); }

g2.prototype.exe.svg = {
   beg: function(self) {
      if (g2.exeStack++ === 0) {   // outermost g2 object.
         var state = self.getState(),
             t = state.trf0;
         this.content.open = "svg";
         this.str = `<svg width="${this.width}" height="${this.height}" fill="transparent" stroke="black"`;
         this.str += ` font-family="${state.getAttr('fof')}" font-style="${state.getAttr('fos')}" font-size="${state.getAttr('foz')}" font-weight="${state.getAttr('fow')}">\n`;
         this.content.open = "body";
         // chrome and edge don't support transform property on outermost <svg> element. So add outer <g> element.
         if (state.cartesian) {
            this.str += `<g transform="matrix(${t.scl},0,0,${-t.scl},${t.x},${this.height-t.y})">\n`;
            this.outerTransform = true;          
         }
         else if (t.x !== 0 || t.y !== 0 || t.scl !== 1 ) {
            this.str += `><g transform="matrix(${t.scl},0,0,${t.scl},${t.x},${t.y})">\n`;
            this.outerTransform = true;          
         }
         state.stack = [{}];
      }
      else {                          // 'used' g2 object
         this.content.open = "head";  // .. so write it to the defs section.
         this.str += `<g id="${'$'+this.useReg.length}">\n`;
         this.openGroups.push("group");
      }
   },
   end: function(self) {
      if (--g2.exeStack === 0) {
         while (this.openGroups.pop())
            this.str += '</g>\n';
         if (this.outerTransform)
            this.str +='</g>\n';
         // write svg string ...
         if ("innerHTML" in this.ctx )
            this.ctx.innerHTML = this.toString();
         else
            this.ctx.svg = this.toString();
      }
      else {                       // 'used' g2 object
         while (this.openGroups.pop() !== "group") // close all defined groups ...
            this.str += '</g>\n';
         this.str += '</g>\n';
         this.content.open = "body";
      }
   }
};

/**
 * svg interface
 */

g2.prototype.p.svg = function p_svg() {
   this.path = "";
};

g2.prototype.m.svg = function m_svg(x,y) {
   this.path += `M${x},${y}`;
};

g2.prototype.l.svg = function l_svg(x,y) {
   this.path += `L${x},${y}`;
};

g2.prototype.q.svg = function q_svg(x1,y1,x,y) {
   this.path += `Q${x1},${y1},${x},${y}`;
};

g2.prototype.c.svg = function c_svg(x1,y1,x2,y2,x,y) {
   this.path += `C${x1},${y1},${x2},${y2},${x},${y}`;
};

g2.prototype.a.svg = function a_svg(x0,y0,r,w1,w2,ccw) {
   var x = x0 + r*Math.cos(w2), y = y0 + r*Math.sin(w2),
       dw = ccw ? w1 - w2 : w2 - w1;
   this.path += `A${r},${r},0,${Math.abs(dw)>Math.PI?1:0},${ccw?0:1},${x},${y}`;
};

g2.prototype.z.svg = function z_svg(x1,y1,x2,y2,x,y) {
   this.path += 'Z';
};

g2.prototype.stroke.svg = function stroke_svg(d) {
   if (d) this.path = d;
   if (this.path)
      this.str += `<path d="${this.path}" fill="transparent"/>\n`;
   this.path = false;
};

g2.prototype.fill.svg = function fill_svg(d) {
   if (d) this.path = d;
   if (this.path)
      this.str += `<path d="${this.path}" stroke="none"/>\n`;
   this.path = false;
};
g2.prototype.drw.svg = function drw_svg(d) {
   if (d) this.path = d;
   if (this.path)
      this.str += `<path d="${this.path}"/>\n`;
   this.path = false;
};
g2.prototype.txt.svg = function txt_svg(self,s,x,y,w,args) {
   var state = self.state;
   this.str += '<text stroke="none"';
   if (args)
      this.applyStyle(args,state,true);  // apply style for text element only (local = true)!
   if (!(args && "foc" in args) && state.getAttr("foc") !== state.getAttr("fill"))
      this.str += ` fill="${state.getAttr("foc")}"`;
   if (state.getAttr("tval"))
      g2.State.svg.set.tval.call(this,state.getAttr("tval"));
   if (state.cartesian || w) {
      var sw = (w?Math.sin(w):0), cw = (w?Math.cos(w):1);
      // compensate cartesian transform to prevent vertically mirrored text about horizontal axis.
      this.str += state.cartesian
                ? ` transform="matrix(${cw},${sw},${sw},${-cw},${x||0},${y||0})"`
                : ` transform="matrix(${cw},${sw},${-sw},${cw},${x||0},${y||0})"`
   }
   else
      this.str += ` x="${x}" y="${y}"`;
   this.str += `>${s}</text>\n`
};

g2.prototype.img.svg = function img_svg(self,img,x,y,b,h) {
   b = b || img.width;
   h = h || img.height;
   this.str += `<image xlink:href="${img.src}" width="${b}" height="${h}"`;
   this.str += self.state.cartesian
             ? ` transform="matrix(1,0,0,-1,${x},${y+h})"`
             : ` x="${x}" y="${y}"`
   this.str += `></image>\n`;
};

g2.prototype.lin.svg = function lin_svg(x1,y1,x2,y2) {
   this.str += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>\n`;
};

g2.prototype.rec.svg = function rec_svg(x,y,b,h) {
   this.str += `<rect x="${x}" y="${y}" width="${b}" height="${h}"/>\n`;
};

g2.prototype.cir.svg = function cir_svg(x,y,r) {
   this.str += `<circle cx="${x}" cy="${y}" r="${r}"/>\n`;
};

g2.prototype.arc.svg = function arc_svg(x,y,r,w,dw) {
   this.str += `<path d="M${x+Math.cos(w)*r},${y+Math.sin(w)*r} A${r},${r},0,${+(Math.abs(dw)>Math.PI)},
                         ${+(Math.sign(dw)>0)},${x+Math.cos(w+dw)*r},${y+Math.sin(w+dw)*r}"/>\n`;
};

g2.prototype.ply.svg = function ply_svg(parr,mode,itr) {
   var p, i = 0, split = mode === "split", pstr = '';
   itr = itr || g2.prototype.ply.itr;
   p = itr(parr,i++);
   if (!p.done) {      // draw polygon ..
      pstr += `M${p.x},${p.y}`;
      while (!(p = itr(parr,i++)).done)
         pstr += (split ? (i%2) ? 'M' : 'L' : ' ') + p.x + ',' + p.y;
      if (mode && !split)  // closed then ..
         pstr += 'Z';
   }
   this.str += `<path d="${pstr}"/>\n`;
};

g2.prototype.beg.svg = function beg_svg(self,args) {
   var state = self.state;
   state.save();
   this.openGroups.push("beg");
   this.str += '<g';
   if (args) {
      if ("x" in args || "y" in args || "w" in args || "scl" in args) {
         state.trf = args;
         g2.State.svg.set.trf.call(this,args,state);
      }
      else if ("matrix" in args)
         this.str += ' transform="matrix(' + args.matrix + ')"';
      this.applyStyle(args,state);
   }
   this.str += '>\n';
};

g2.prototype.end.svg = function end_svg(self,begidx) {
   while (this.openGroups.pop() !== "beg")
      this.str += '</g>\n';
   this.str += '</g>\n';
   self.state.restore();
};

g2.prototype.clr.svg = function clr_svg() {
   this.content.head = this.content.body = "";
};

g2.prototype.grid.svg = function grid_svg(self,color,size) {
   var state = self.state, trf = state.getAttr("trf"),  // no ctx required ...
       b = this.width, h = this.height, trf0 = state.trf0, s = trf0.scl,
       sz = size || g2.prototype.grid.getSize(state,trf ? s : 1),
       xoff = trf.x ? trf.x%sz-sz : 0, yoff = trf.y ? trf.y%sz-sz : 0;

   this.str += `<path stroke="${color||'#ccc'}" stroke-width="1"`;
   this.str += state.cartesian ? ` transform="matrix(${1/s},0,0,${-1/s},${-trf0.x/s+0.5},${(h-trf0.y)/s-0.5})"`
                               : ` transform="matrix(${1/s},0,0,${1/s},${-trf0.x/s+0.5},${-trf0.y/s+0.5})"`;
   this.str += ' d="'; 
   for (var x=xoff,nx=b+1; x<nx; x+=sz) this.str += `M${x},0L${x},${h}`;
   for (var y=yoff,ny=h+1; y<ny; y+=sz) this.str += `M0,${y}L${b},${y}`;
   this.str += '"/>\n';
};

g2.prototype.use.svg = function use_svg(self,g,args) {
   var state = self.state, idx = this.useReg.indexOf(g);

   if (idx < 0) {             // referenced g2 object 'g' not in 'use registry' ..
      self.exe(this,g);
      idx = this.useReg.push(g) - 1;
   }
   state.save();
   this.str += `<use xlink:href="${'#$'+idx}"`;
   if (args) {
      if ("x" in args || "y" in args || "w" in args || "scl" in args) {
         state.trf = args;
         g2.State.svg.set.trf.call(this,args);
      }
      else if ("matrix" in args)
         this.str += ' transform="matrix(' + args.matrix + ')"';
      this.applyStyle(args,state);
   }
   this.str += '/>\n';
   state.restore();
};

g2.prototype.style.svg = function style_svg(self,args) {
   var state = self.state, val;
   this.openGroups.push("style");  // open 'style' labeled group ...
   this.str += '<g';
   this.applyStyle(args,state);
   this.str += '>\n';
};

g2.State.svg = {
   get: {},
   set: {
      "fs": function(val) { this.str += ` fill="${val}"`; },
      "ls": function(val) { this.str += ` stroke="${val}"`; },
      "lw": function(val,state) { this.str += ` stroke-width="${val/(state.getAttr('lwnosc') ? state.currentScale : 1)}"`; },
      "lc": function(val) {  this.str += ` stroke-linecap="${val}"`; },
      "lj": function(val) { this.str += ` stroke-linejoin="${val}"`; },
      "lo": function(val) { this.str += ` stroke-dashoffset="${val}"`; },  // TODO make lw dependent
      "ld": function(val,state) {
               var scl = state.getAttr("lwnosc") ? state.currentScale : 1;
               if (!val.length)
                   this.str += ' stroke-dasharray="none"';
               else if (scl !== 1) {
                  var lw = this.lineWidth*scl, ld = [];
                  for (var i=0,n=val.length; i<n; i++) ld.push(val[i]/lw);
                     this.str += ` stroke-dasharray="${''+ld}"`;
               }
               else
                   this.str += ` stroke-dasharray="${''+val}"`;
            },
      "ml": function(val) { this.str += ` stroke-miterlimit="${val}"`; },
      // use simple css drop-shadow instead of svg filters.
      // s. https://developer.mozilla.org/de/docs/Web/SVG/Element/feGaussianBlur
      // s. https://developer.mozilla.org/de/docs/Web/CSS/box-shadow
      // s. http://thenewcode.com/598/boxshadow-property-vs-dropshadow-filter-a-complete-comparison
      "sh": function(val,state) {
               this.str += ` style="filter:drop-shadow(${val[0]||5}px ${val[1]||5}px ${val[2]||5}px ${val[3]||'rgba(0,0,0,0.5)'})"`;
             },
      "foc": function(val) { this.str += ` fill="${val}"`; },
      "fos": function(val) { this.str += ` font-style="${val}"`; },
      "fow": function(val) { this.str += ` font-weight="${val}"`; },
      "foz": function(val) { this.str += ` font-size="${val}"`; },
      "fof": function(val) { this.str += ` font-family="${val}"`; },
      "thal": function(val) {
                 var filter = {"center":"middle","right":"end"};
                 this.str += ` text-anchor="${filter[val]||val}"`;
              },
      "tval": function(val) { 
                 var filter = {"top":"hanging","bottom":"auto"};
                 this.str += ` dominant-baseline="${filter[val]||val}"`;
              },
      "trf": function(t) {
                var scl = t.scl || 1,
                    sw = scl*(t.w?Math.sin(t.w):0), cw = scl*(t.w?Math.cos(t.w):1);
                this.str += ` transform="matrix(${cw},${sw},${-sw},${cw},${t.x||0},${t.y||0})"`;
             }
   }
}
