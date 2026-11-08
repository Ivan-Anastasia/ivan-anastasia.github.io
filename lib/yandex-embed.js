// Visual workaround for the current Yandex footer; the form itself stays intact.
// Its 13px footer wraps two links into one or two 18px lines under a 16px logo.
export function footerHeight(width,linksWidth=420.36){return width-24<linksWidth?76:58;}
export function messageHeight(event,frame){
 if(event.source!==frame.contentWindow||!['https://forms.yandex.ru','https://cloud.yandex.ru'].includes(event.origin))return null;
 let data=event.data;
 if(typeof data==='string'){try{data=JSON.parse(data);}catch{return null;}}
 if(!data||typeof data!=='object')return null;
 const height=data['iframe-height'];
 return typeof height==='number'&&Number.isFinite(height)&&height>=120&&height<=50000?height:null;
}
export function initYandexEmbed(frame){
 if(!frame)return;
 const viewport=frame.closest('.yandex-rsvp-viewport');
 if(!viewport)return;
 let height=null;
 function update(){
  if(height===null||frame.clientWidth<1)return;
  const fullHeight=height+'px';
  if(frame.style.height!==fullHeight)frame.style.height=fullHeight;
  const scale=frame.getBoundingClientRect().height/height;
  const width=frame.getBoundingClientRect().width/scale;
  const crop=footerHeight(width),visible=(height-crop)*scale;
  if(visible<44||!Number.isFinite(visible))return;
  const cut=`inset(0 0 ${crop}px 0)`,visibleHeight=visible+'px';
  if(frame.style.clipPath!==cut)frame.style.clipPath=cut;
  if(viewport.style.height!==visibleHeight)viewport.style.height=visibleHeight;
 }
 window.addEventListener('message',event=>{const next=messageHeight(event,frame);if(next===null)return;height=next;update();});
 // The official embed may have received the first height before this module loads.
 const initial=Number.parseFloat(frame.style.height);
 if(Number.isFinite(initial)&&initial>=120&&initial<=50000)height=initial;
 update();
 if(typeof ResizeObserver!=='undefined')new ResizeObserver(update).observe(frame);
 else window.addEventListener('resize',update);
}
