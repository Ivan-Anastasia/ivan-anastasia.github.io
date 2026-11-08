// Keep paper and live copy together until decoded, or reveal an opaque fallback.
// Settling once prevents a late bitmap from replacing the fallback mid-read.
export function decodeDecoration(image,scene,{loading,unavailable,timeout=3500,frame=requestAnimationFrame}){
 scene.classList.add(loading);
 return new Promise(resolve=>{
  let settled=false;
  const finish=failed=>{
   if(settled)return;settled=true;clearTimeout(timer);
   if(failed)scene.classList.add(unavailable);
   frame(()=>frame(()=>scene.classList.remove(loading)));
   resolve();
  };
  const timer=setTimeout(()=>finish(true),timeout);
  Promise.resolve().then(()=>image.decode()).then(()=>finish(false),()=>finish(true));
 });
}
