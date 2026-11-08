import {initMusic} from '/lib/music.js?v=music-entry-v83';
import {initYandexEmbed} from '/lib/yandex-embed.js?v=footer-v67';
import {decodeDecoration} from '/lib/decoration.js?v=bounded-v44';
import {initPearlTrails} from '/lib/pearl-trail.js?v=pearl-story-21';
import {createInvitation} from '/lib/invitation-sequence-v25.js?v=photo-preload-v81';
import {wedding,names} from '/src/config/wedding.js?v=music-v80';
import {countdown} from '/src/lib/date.js';
const $=id=>document.getElementById(id);
initYandexEmbed($('rsvp-yandex-form'));
document.addEventListener('invitation-preparing',()=>document.documentElement.style.setProperty('--paper',`url("${wedding.images.paper}")`),{once:true});
// Fit the actual Cyrillic glyphs, rather than estimating by character count.
const namesHeading=document.querySelector('.couple-names');
if(namesHeading){
 const measurement=document.createElement('canvas').getContext('2d');let previousWidth=-1,fitFrame=null;
 function fitNames(){fitFrame=null;if(document.body.classList.contains('intro-active')&&document.getElementById('site-content')?.style.contentVisibility!=='visible')return;const width=namesHeading.clientWidth;if(width<1||!measurement)return;const portrait=namesHeading.closest('.hero-portrait');if(portrait?.clientWidth>0)portrait.style.setProperty('--hero-unit',`${portrait.clientWidth/100}px`);const lines=[...namesHeading.querySelectorAll('.name-line')];let widest=1;for(const line of lines){const style=getComputedStyle(line);measurement.font=`400 100px ${style.fontFamily}`;widest=Math.max(widest,measurement.measureText(line.textContent.toLocaleUpperCase('ru-RU')).width);}const size=Math.min(108,parseFloat(getComputedStyle(namesHeading).fontSize),100*Math.max(1,width-12)/widest);for(const line of lines)line.style.fontSize=`${size}px`;}
 function scheduleNames(){if(fitFrame===null)fitFrame=requestAnimationFrame(fitNames);}
 document.fonts.ready.then(scheduleNames);
 document.addEventListener('invitation-preparing',scheduleNames);
 document.addEventListener('invitation-opened',scheduleNames);
 if(typeof ResizeObserver!=='undefined'){const observer=new ResizeObserver(()=>{if(document.body.classList.contains('intro-active')&&document.getElementById('site-content')?.style.contentVisibility!=='visible')return;const width=namesHeading.clientWidth;if(Math.abs(width-previousWidth)<1)return;previousWidth=width;scheduleNames();});observer.observe(namesHeading);}else addEventListener('resize',scheduleNames);
 scheduleNames();
}
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
// Decode on both cold and cached loads; do not expose a half-painted blend group.
const stationery=document.querySelector('.channel-stationery');
if(stationery)decodeDecoration(stationery,stationery.closest('.channel-composition'),{loading:'stationery-loading',unavailable:'stationery-unavailable'});
const botanicalPaper=document.querySelector('.botanical-paper');
if(botanicalPaper){
 const paper=new Image();paper.fetchPriority='low';paper.src='/assets/botanical-letter-paper-v48.webp';
 decodeDecoration(paper,botanicalPaper,{loading:'botanical-paper-loading',unavailable:'botanical-paper-unavailable'});
}
initPearlTrails();
let toastTimer;function toast(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),4500);}
let locks=0;const lock=()=>{locks++;document.body.classList.add('locked');};const unlock=()=>{locks=Math.max(0,locks-1);if(!locks)document.body.classList.remove('locked');};
function closeDialog(dialog){if(dialog.popover==='auto'){if(dialog.matches(':popover-open'))dialog.hidePopover();}else if(dialog.open)dialog.close();}
for(const dialog of document.querySelectorAll('dialog')){
  // Native top-layer dialogs are siblings of the page, outside its layout tree.
  document.body.append(dialog);
  dialog.addEventListener('close',unlock);
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDialog(dialog);}});
}
function openDialog(id){const d=$(id);if(!d)return;if(d.popover==='auto'){if(!d.matches(':popover-open'))d.showPopover();}else if(!d.open){d.showModal();lock();}}
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeDialog($(b.dataset.close))));
if($('intro')){
 const intro=$('intro'),content=$('site-content');
 // Register before createInvitation: it may open immediately with intro disabled.
 initMusic({audio:$('background-music'),button:$('music-toggle'),startButton:$('open-doors'),events:document,notify:toast});
 document.addEventListener('invitation-opened',()=>{const button=$('music-toggle');if(button)document.body.append(button);});
 const invitation=createInvitation({intro,content,reduced,lock,unlock,enabled:wedding.intro.enabled});
 let observer;try{if(typeof IntersectionObserver!=='function')throw new Error('No observer');observer=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');observer.unobserve(x.target);}}),{threshold:.08});if(!reduced.matches)document.body.classList.add('motion-ready');}catch{observer={observe(node){node.classList.add('visible');}};}
 document.querySelectorAll('.reveal:not(.timeline-list li)').forEach(node=>observer.observe(node));
 const pearlScenes=Array.from(document.querySelectorAll('.thread-reveal')).map(element=>({element,current:0,target:0,events:Array.from(element.parentElement.querySelectorAll('.timeline-list li'))}));
 const pearlDecor=Array.from(document.querySelectorAll('.letter-pearl-arc,.pearl-hearts'));let pearlFrame=null;
 function animatePearls(){pearlFrame=null;let moving=false;for(const scene of pearlScenes){if(reduced.matches){scene.current=scene.target=1;scene.element.style.clipPath='none';scene.element.style.opacity='1';scene.events.forEach(item=>item.classList.add('visible'));continue;}const difference=scene.target-scene.current;scene.current=Math.abs(difference)<.001?scene.target:scene.current+difference*.105;scene.element.style.clipPath=`inset(0 0 ${(1-scene.current)*100}% 0)`;scene.element.style.opacity=String(Math.min(1,scene.current*8));for(const item of scene.events){const progress=parseFloat(item.style.getPropertyValue('--y'))/100;if(scene.current>=progress-.08)item.classList.add('visible');}if(Math.abs(difference)>=.001)moving=true;}if(moving)pearlFrame=requestAnimationFrame(animatePearls);}
 function updatePearls(){const opened=!document.body.classList.contains('intro-active');for(const scene of pearlScenes){if(reduced.matches){scene.target=1;continue;}if(!opened)continue;const rect=scene.element.getBoundingClientRect();const progress=Math.max(0,Math.min(1,(innerHeight*.92-rect.top)/Math.max(1,rect.height)+.09));scene.target=Math.max(scene.target,progress);}for(const element of pearlDecor){if(reduced.matches){element.style.setProperty('--pearl-drift','0px');continue;}const rect=element.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight)continue;const drift=Math.max(-4,Math.min(4,(innerHeight/2-rect.top-rect.height/2)*.012));element.style.setProperty('--pearl-drift',`${drift.toFixed(2)}px`);}if(pearlFrame===null)pearlFrame=requestAnimationFrame(animatePearls);}
 let pearlUpdateQueued=false;function queuePearls(){if(pearlUpdateQueued)return;pearlUpdateQueued=true;requestAnimationFrame(()=>{pearlUpdateQueued=false;updatePearls();});}
 addEventListener('scroll',queuePearls,{passive:true});addEventListener('resize',queuePearls);document.addEventListener('invitation-opened',queuePearls);
 reduced.addEventListener('change',()=>{document.body.classList.toggle('motion-ready',!reduced.matches);if(pearlFrame!==null){cancelAnimationFrame(pearlFrame);pearlFrame=null;}updatePearls();});updatePearls();
 function tick(){const c=countdown(wedding.date);if(!c)return;document.querySelectorAll('[data-count]').forEach(el=>el.textContent=String(c[el.dataset.count]).padStart(2,'0'));if(c.complete){$('countdown-note').textContent='Наш свадебный день наступил. Спасибо, что вы с нами!';}}
 tick();if(wedding.date)setInterval(()=>{if(!document.hidden)tick();},1000);
 $('download-date')?.addEventListener('click',()=>{const d=new Date(wedding.date);if(Number.isNaN(d.getTime()))return;const iso=x=>x.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');const esc=x=>String(x||'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');const text=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Pearl and Paper//Wedding//RU','BEGIN:VEVENT',`UID:${iso(d)}-wedding@pearl-paper`,`DTSTAMP:${iso(new Date())}`,`DTSTART:${iso(d)}`,`SUMMARY:${esc('Свадьба — '+names())}`,`LOCATION:${esc(wedding.venue.address||wedding.venue.name)}`,'END:VEVENT','END:VCALENDAR'].join('\r\n');download(new Blob([text],{type:'text/calendar;charset=utf-8'}),'wedding.ics');});
 document.querySelectorAll('.swatch').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.swatch.active').forEach(x=>(x.classList.remove('active'),x.setAttribute('aria-pressed','false')));b.classList.add('active');b.setAttribute('aria-pressed','true');toast(b.dataset.color);}));
 let galleryIndex=0;function galleryUpdate(){const list=wedding.gallery;const item=list[galleryIndex]||{src:wedding.images.fashion,title:'Примеры образов',description:''};$('gallery-image').src=item.src;$('gallery-caption').textContent=item.title;$('gallery-description').textContent=item.description;$('gallery-counter').textContent=`${galleryIndex+1} / ${Math.max(1,list.length)}`;$('gallery-prev').disabled=list.length<2;$('gallery-next').disabled=list.length<2;}
 $('gallery-prev').addEventListener('click',()=>{galleryIndex=(galleryIndex-1+wedding.gallery.length)%wedding.gallery.length;galleryUpdate();});
 $('gallery-next').addEventListener('click',()=>{galleryIndex=(galleryIndex+1)%wedding.gallery.length;galleryUpdate();});
 $('gallery').addEventListener('keydown',e=>{if(e.key==='ArrowLeft'&&!$('gallery-prev').disabled)$('gallery-prev').click();if(e.key==='ArrowRight'&&!$('gallery-next').disabled)$('gallery-next').click();});
 $('share')?.addEventListener('click',share);
}
async function share(){if(document.body.dataset.preview==='true'){toast('Ссылка для гостей появится после публикации приглашения');return;}const url=location.origin+'/';if(navigator.share){try{await navigator.share({title:wedding.seo.title,text:'Для вас есть особенное письмо…',url});return;}catch(e){if(e.name==='AbortError')return;}}try{await navigator.clipboard.writeText(url);toast('Ссылка на приглашение скопирована');}catch{const input=document.createElement('textarea');input.value=url;input.style.position='fixed';input.style.opacity='0';document.body.append(input);input.select();const ok=document.execCommand('copy');input.remove();toast(ok?'Ссылка скопирована':'Скопируйте адрес приглашения из адресной строки');}}
function download(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
if($('admin-form'))$('admin-form').addEventListener('submit',async event=>{event.preventDefault();const key=$('admin-key').value;const button=event.target.querySelector('button');button.disabled=true;$('admin-error').textContent='';try{const response=await fetch('/api/admin/export',{headers:{Authorization:'Bearer '+key},cache:'no-store'});if(!response.ok){const data=await response.json();throw new Error(data.error||'Не удалось скачать ответы.');}download(await response.blob(),'wedding-rsvp.csv');$('admin-key').value='';}catch(error){$('admin-error').textContent=error.message;}finally{button.disabled=false;}});






