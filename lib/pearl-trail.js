const trailPoint=(segment,t)=>{
 const a=1-t;return {x:a*a*a*segment.a.x+3*a*a*t*segment.b.x+3*a*t*t*segment.c.x+t*t*t*segment.d.x,y:a*a*a*segment.a.y+3*a*a*t*segment.b.y+3*a*t*t*segment.c.y+t*t*t*segment.d.y};
};
// A single strand on the paper margin. Photographic props are separate objects,
// never endpoints to which differently sized beads are spliced.
export function pearlRoute({width,height}){
 const mobile=width<480,base=mobile?12:18;
 const edge=mobile?9:20,amplitude=mobile?3:9,wavelength=mobile?1100:1500;
 const omega=2*Math.PI/wavelength;
 const x=y=>edge+amplitude*Math.sin(omega*y);
 const dx=y=>amplitude*omega*Math.cos(omega*y);
 const segments=[];const end=height+base;
 // Hermite control points share tangents at every junction.
 for(let y=0;y<end;){const next=Math.min(end,y+wavelength/8),span=next-y;
  segments.push({a:{x:x(y),y},b:{x:x(y)+dx(y)*span/3,y:y+span/3},c:{x:x(next)-dx(next)*span/3,y:next-span/3},d:{x:x(next),y:next},paint:true,startSize:base,endSize:base});y=next;
 }
 return {segments,base};
}
export function pearlStamps(route){
 const beads=[];let index=0,cursor=0;
 const spacing=route.base*.775;
 for(const segment of route.segments){
  const samples=[];let previous=trailPoint(segment,0),distance=0;samples.push({...previous,distance});
  const steps=Math.max(16,Math.ceil((Math.abs(segment.d.y-segment.a.y)+Math.abs(segment.d.x-segment.a.x))/3));
  for(let i=1;i<=steps;i++){const p=trailPoint(segment,i/steps);distance+=Math.hypot(p.x-previous.x,p.y-previous.y);samples.push({...p,distance});previous=p;}
  let k=1;
  while(cursor<distance){while(k<samples.length-1&&samples[k].distance<cursor)k++;const a=samples[k-1],b=samples[k];const f=(cursor-a.distance)/Math.max(.001,b.distance-a.distance);
   if(segment.paint)beads.push({x:a.x+(b.x-a.x)*f,y:a.y+(b.y-a.y)*f,size:route.base*(1+.025*Math.sin(index*2.31)),variant:index%4});
   index++;cursor+=spacing;
  }
  // Carry the necklace's spacing phase across curves, including hidden portions.
  cursor-=distance;
 }
 return beads;
}
export function initPearlTrails(){
 const host=document.getElementById('site-content');if(!host)return;
 const main=host.querySelector('[data-pearl-main]'),intro=document.querySelector('[data-pearl-intro]');if(!main&&!intro)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame=null,revealed=0;
 function paint(svg,layout){if(!svg)return;const route=pearlRoute(layout);svg.setAttribute('viewBox',`0 0 ${layout.width} ${layout.height}`);const prefix=svg.dataset.pearlPrefix;
  const paths=route.segments.map((s,i)=>`${i===0?`M${s.a.x} ${s.a.y}`:''} C${s.b.x} ${s.b.y} ${s.c.x} ${s.c.y} ${s.d.x} ${s.d.y}`).join('');
  svg.querySelector('[data-trail-thread]').innerHTML=`<path d="${paths}"/>`;
  svg.querySelector('[data-trail-beads]').innerHTML=pearlStamps(route).map(b=>`<use href="#${prefix}-bead-${b.variant}" x="${(b.x-b.size/2).toFixed(2)}" y="${(b.y-b.size/2).toFixed(2)}" width="${b.size.toFixed(2)}" height="${b.size.toFixed(2)}"/>`).join('');
 }
 function reveal(){frame=null;if(!main)return;const root=host.getBoundingClientRect();if(reduced.matches)revealed=root.height;else if(!document.body.classList.contains('intro-active'))revealed=Math.max(revealed,innerHeight+100-root.top);main.querySelector('[data-trail-window]').setAttribute('height',Math.min(root.height,Math.max(0,revealed)));}
 function schedule(){if(frame===null)frame=requestAnimationFrame(reveal);}
 function redraw(){const r=host.getBoundingClientRect();if(r.width>0&&r.height>0)paint(main,{width:r.width,height:r.height});if(intro){const r=intro.getBoundingClientRect();if(r.width>0&&r.height>0)paint(intro,{width:r.width,height:r.height,intro:true});}schedule();}
 if(typeof ResizeObserver!=='undefined'){const ro=new ResizeObserver(redraw);ro.observe(host);if(intro)ro.observe(intro);}else addEventListener('resize',redraw);
 addEventListener('scroll',schedule,{passive:true});document.addEventListener('invitation-opened',schedule);reduced.addEventListener('change',schedule);document.fonts.ready.then(redraw);redraw();
}
