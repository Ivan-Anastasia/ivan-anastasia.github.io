export const doorDuration=3800;
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>x*x*x*(x*(x*6-15)+10);

export function doorAngle(t,index){
 const local=clamp((t-index*.032)/(1-index*.032));
 return(index?1:-1)*105*smooth(clamp((local-.035)/.965));
}

export function doorMetrics(width,height){
 return{book:Math.min(height<600&&width>600?620:760,width,height*2/3),depth:Math.max(28,Math.min(42,width*.05)),focal:Math.max(1100,Math.min(2000,width*1.4))};
}

export function doorMotion(index){
 const leaf=[],light=[],shadow=[];
 for(let i=0;i<=40;i++){
  const t=i/40,angle=doorAngle(t,index),radians=Math.abs(angle)*Math.PI/180;
  leaf.push({offset:t,transform:`translateZ(calc(var(--door-depth)*-1)) rotateY(${angle}deg) translateZ(var(--door-depth))`});
  light.push({offset:t,opacity:(1-Math.cos(radians))*.045});
  shadow.push({offset:t,transform:`translateZ(-24px) scaleX(${Math.max(.025,Math.cos(radians))})`,opacity:Math.max(0,Math.sin(radians)*.14*(1-t))});
 }
 return{leaf,light,shadow};
}
