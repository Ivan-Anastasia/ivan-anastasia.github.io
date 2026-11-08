import {envelopeFrame,paintEnvelope} from './envelope-motion-v36.js';
import {doorDuration,doorMotion} from './door-motion-v34.js?v=hinges-v34';

export const sequenceStates=Object.freeze(['LOADING','DOORS_CLOSED','DOORS_OPENING','ENVELOPE_READY','ENVELOPE_OPENING','INVITATION_READY']);
const transitions={LOADING:['DOORS_CLOSED','ENVELOPE_READY','INVITATION_READY'],DOORS_CLOSED:['DOORS_OPENING','ENVELOPE_READY'],DOORS_OPENING:['ENVELOPE_READY'],ENVELOPE_READY:['ENVELOPE_OPENING','INVITATION_READY'],ENVELOPE_OPENING:['INVITATION_READY']};
export function createInvitation({intro,content,reduced,lock,unlock,enabled=true,loadVisual}){
 const openButton=intro.querySelector('#open-envelope'),doorButton=intro.querySelector('#open-doors'),doorPrompt=intro.querySelector('#door-prompt'),stage=intro.querySelector('.envelope-stage'),doors=intro.querySelector('.door-scene'),leaves=[...intro.querySelectorAll('.door-leaf')];
 const parts={art:intro.querySelector('.envelope-art'),shadow:intro.querySelector('.envelope-shadow'),seal:intro.querySelector('.env-seal'),front:intro.querySelector('.env-flap-front'),back:intro.querySelector('.env-flap-back'),card:intro.querySelector('.env-card'),rest:intro.querySelector('.env-photo-rest'),mechanism:intro.querySelector('.env-mechanism')};
 let state='LOADING',generation=0,frame=null,animations=[],held=false,visual=null,visualPromise=null,preparation=null,disposed=false,envelopeLoading=null,mainPrepared=false,dismissing=false,resetClock=null,cancelWait=null,doorsRequested=false;
 const suspended=new Set();
 function setState(next,reset=false){if(!reset&&!transitions[state]?.includes(next))return false;state=next;intro.dataset.introState=next;intro.setAttribute('aria-busy',String(next==='LOADING'||next==='DOORS_OPENING'||next==='ENVELOPE_OPENING'));openButton.disabled=next!=='ENVELOPE_READY';return true;}
 function stop(){generation++;cancelPreparation();if(frame!==null){cancelAnimationFrame(frame);frame=null;}cancelWait?.();cancelWait=null;resetClock=null;for(const a of animations)a.cancel();animations=[];suspended.clear();}
 function visibilityChanged(){resetClock?.();if(document.hidden){for(const a of animations)if(a.playState!=='finished'&&a.playState!=='idle'){suspended.add(a);a.pause();}}else{for(const a of suspended)if(a.playState==='paused')a.play();suspended.clear();}}
 function restoreEnvelope(){visual?.reset();paintEnvelope(parts,envelopeFrame(0));parts.back.setAttribute('display','none');intro.querySelector('#intro-title').style.opacity='';for(const n of intro.querySelectorAll('.intro-tagline,.intro-hint,#open-envelope'))n.style.opacity='';}
 function prepareMain(){if(mainPrepared||disposed)return;mainPrepared=true;document.body.classList.add('main-prepared');document.dispatchEvent(new CustomEvent('invitation-preparing'));content.style.contentVisibility='visible';}
 function loadEnvelope(){if(envelopeLoading)return envelopeLoading;const sources=new Set();for(const node of intro.querySelectorAll('[data-envelope-src]')){const source=node.getAttribute('data-envelope-src');if(!source)continue;sources.add(source);if(node.classList?.contains('env-card-frame'))node.addEventListener('error',()=>intro.querySelector('.env-card-fallback')?.setAttribute('visibility','visible'),{once:true});if(node.tagName.toLowerCase()==='img')node.src=source;else node.setAttribute('href',source);node.removeAttribute('data-envelope-src');}const decoding=Promise.allSettled([...sources].map(source=>{const image=new Image();image.src=source;return typeof image.decode==='function'?image.decode():new Promise(resolve=>{image.onload=resolve;image.onerror=resolve;});}));return envelopeLoading=Promise.race([decoding,new Promise(resolve=>setTimeout(resolve,4500))]);}
 function cancelPreparation(){preparation?.abort();preparation=null;visualPromise=null;}
 function ensureVisual(){
  if(visual||visualPromise)return visualPromise;
  if(disposed||reduced.matches||navigator.connection?.saveData||navigator.hardwareConcurrency<=4||navigator.deviceMemory<=4)return;
  const task=preparation=new AbortController();
  visualPromise=Promise.resolve().then(()=>loadVisual?loadVisual(stage,{signal:task.signal}):import('/lib/3d-v17/envelope-v42.js?v=quality-v49').then(m=>task.signal.aborted?null:m.createEnvelope(stage,{signal:task.signal}))).then(v=>{
   if(disposed||task.signal.aborted){v?.dispose();return null;}
   preparation=null;return visual=v;
  }).catch(()=>null);
  return visualPromise;
 }
 function ready(keepDoors=false){
  if(disposed)return;const fromDoors=['LOADING','DOORS_CLOSED','DOORS_OPENING'].includes(state);
  loadEnvelope();prepareMain();if(!setState('ENVELOPE_READY'))return;
  doorButton.disabled=true;doors.hidden=!keepDoors;intro.classList.remove('doors-moving');if(keepDoors)intro.classList.add('doors-open');
  openButton.textContent='Открыть приглашение →';
  const focusAtStart=document.activeElement,wantsFocus=fromDoors||intro.contains(focusAtStart);
  const focusAction=()=>{if(wantsFocus&&(document.activeElement===focusAtStart||document.activeElement===document.body))openButton.focus({preventScroll:true});};
  if(!keepDoors&&!reduced.matches&&typeof openButton.animate==='function'){
   const token=generation;openButton.disabled=true;
   const options={easing:'cubic-bezier(.45,0,.55,1)',fill:'backwards'};
   // The action follows the doors immediately, with a short, gentle fade.
   animate(openButton,[{opacity:0},{opacity:1}],{...options,duration:220,delay:0}).then(()=>{
    if(disposed||token!==generation||state!=='ENVELOPE_READY')return;
    openButton.disabled=false;focusAction();
   });
  }else focusAction();
  ensureVisual();
 }
 function finish(){if(disposed)return;prepareMain();if(state==='INVITATION_READY')return;intro.style.opacity='0';stop();setState('INVITATION_READY',true);intro.classList.add('finished');document.body.classList.remove('intro-active');content.inert=false;if(held){unlock();held=false;}document.querySelector('.couple-names')?.focus({preventScroll:true});document.dispatchEvent(new CustomEvent('invitation-opened'));}
 function skip(){if(disposed||dismissing||state==='INVITATION_READY')return;if(['LOADING','DOORS_CLOSED','DOORS_OPENING'].includes(state)){stop();ready();return;}stop();dismissing=true;openButton.disabled=true;const token=generation;
  // Present the guest's acknowledgement before revealing the substantial chapter.
  frame=requestAnimationFrame(()=>{frame=requestAnimationFrame(()=>{frame=null;if(token!==generation||disposed)return;dismissing=false;finish();});});
 }
 function animate(node,keyframes,options){if(typeof node.animate!=='function')return Promise.resolve();const animation=node.animate(keyframes,options);animations.push(animation);if(document.hidden){suspended.add(animation);animation.pause();}return animation.finished.catch(()=>{});}
 async function revealDoors(token){
  const master=new Image();
  const delivery=new Promise(resolve=>{master.onload=()=>resolve(true);master.onerror=()=>resolve(false);master.src=matchMedia('(max-width:600px)').matches?'/assets/gatefold-doors-mobile-v25.webp':'/assets/gatefold-doors-v25.webp';if(master.complete)resolve(master.naturalWidth>0);});
  const loaded=await Promise.race([delivery,new Promise(resolve=>setTimeout(()=>resolve(false),12000))]);
  // A decode() rejection is not a network failure. On load, the same native
  // pixels can still be painted by the CSS faces in browsers that reject it.
  if(loaded&&typeof master.decode==='function')try{await Promise.race([master.decode(),new Promise(resolve=>setTimeout(resolve,1200))]);}catch{}
  if(token!==generation)return;
  if(!loaded)intro.classList.add('doors-unavailable');
  await loadEnvelope();if(token!==generation||disposed)return;setState('DOORS_CLOSED');ensureVisual();
  if(doorsRequested)openDoors();
 }
 async function openDoors(){
  if(disposed||dismissing||!['LOADING','DOORS_CLOSED'].includes(state))return;
  doorsRequested=true;doorButton.disabled=true;doorPrompt.textContent=state==='LOADING'?'Готовим ваше приглашение…':'Открываем двери…';
  if(state==='LOADING')return;
  const token=generation;setState('DOORS_OPENING');
  if(reduced.matches||typeof intro.animate!=='function'){await animate(doors,[{opacity:1},{opacity:0}],{duration:220,fill:'forwards'});if(token===generation)ready();return;}
  intro.classList.add('doors-moving');
  const lights=[...intro.querySelectorAll('.door-light')],shadows=[...intro.querySelectorAll('.door-cast-shadow')],movements=[];
  leaves.forEach((leaf,index)=>{
   const motion=doorMotion(index),options={duration:doorDuration,easing:'linear',fill:'both'};
   movements.push(animate(leaf,motion.leaf,options),animate(lights[index],motion.light,options),animate(shadows[index],motion.shadow,options));
  });
  movements.push(animate(intro.querySelector('.door-occlusion'),[{opacity:.08},{opacity:0}],{duration:doorDuration,easing:'ease-out',fill:'forwards'}));
  // Reveal gently for 480 ms near the end of the swing; keep it fully visible
  // for the final 100 ms so ready() can enable it without another wait.
  // No forwards fill: the later envelope animation controls its opacity.
  animate(openButton,[{opacity:0,offset:0},{opacity:0,offset:(doorDuration-580)/doorDuration,easing:'cubic-bezier(.45,0,.55,1)'},{opacity:1,offset:(doorDuration-100)/doorDuration},{opacity:1,offset:1}],{duration:doorDuration,easing:'linear',fill:'backwards'});
  await Promise.all(movements);if(token===generation)ready(true);
 }
 function reset(){if(disposed)return;stop();doorsRequested=false;doorButton.disabled=false;doorPrompt.textContent='Нажмите, чтобы открыть';intro.querySelector('.door-book').style.transform='';dismissing=false;restoreEnvelope();intro.style.opacity='';intro.className='intro';doors.hidden=false;doors.dataset.doorRenderer='css-solid-v38';leaves.forEach(n=>n.style.transform='');setState('LOADING',true);content.inert=true;document.body.classList.add('intro-active');scrollTo({top:0,behavior:'instant'});if(!held){lock();held=true;}intro.tabIndex=-1;intro.focus({preventScroll:true});if(!enabled){finish();return;}revealDoors(generation);}
 async function open(){
  if(disposed||dismissing||state!=='ENVELOPE_READY'||openButton.disabled)return;setState('ENVELOPE_OPENING');openButton.textContent='Письмо открывается…';prepareMain();const token=generation;
  const active=visual;if(!active)cancelPreparation();
  intro.classList.add('opening');
  if(reduced.matches){document.body.classList.remove('intro-active');await animate(intro,[{opacity:1},{opacity:0}],{duration:220,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'});if(token===generation)finish();return;}
  const captions=[...intro.querySelectorAll('.intro-tagline,.intro-hint,#open-envelope')],title=intro.querySelector('#intro-title');let elapsed=0,last;
  resetClock=()=>{last=undefined;};
  function tick(now){if(token!==generation)return;if(document.hidden)last=undefined;else{if(last!==undefined)elapsed+=now-last;last=now;}const progress=Math.min(1,elapsed/6200),motion=envelopeFrame(progress);if(!active?.paint(progress))paintEnvelope(parts,motion);title.style.opacity=motion.titleOpacity;captions.forEach(n=>n.style.opacity=motion.captionOpacity);if(motion.reveal)document.body.classList.remove('intro-active');intro.style.opacity=motion.opacity;if(progress<1)frame=requestAnimationFrame(tick);else{frame=null;finish();}}
  frame=requestAnimationFrame(tick);
 }
 function keyboard(event){if(event.key==='Escape'){event.preventDefault();skip();}if(event.key==='Tab'){const buttons=[...intro.querySelectorAll('button:not(:disabled)')].filter(n=>getComputedStyle(n).visibility!=='hidden'),first=buttons[0],last=buttons.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}}}
 // Decode the real hero element under the intro instead of waiting for its reveal.
 const photo=content.querySelector?.('.hero-photo img');
 if(typeof photo?.decode==='function')photo.decode().catch(()=>{});
 openButton.addEventListener('click',open);doorButton.addEventListener('click',openDoors);intro.addEventListener('keydown',keyboard);document.addEventListener('visibilitychange',visibilityChanged);addEventListener('pageshow',visibilityChanged);reset();
 return {get state(){return state;},skip,open,openDoors,replay(){reset();},dispose(){if(disposed)return;disposed=true;stop();intro.style.opacity='0';intro.classList.add('finished');setState('INVITATION_READY',true);document.body.classList.remove('intro-active');content.inert=false;if(held){unlock();held=false;}openButton.removeEventListener('click',open);doorButton.removeEventListener('click',openDoors);intro.removeEventListener('keydown',keyboard);document.removeEventListener('visibilitychange',visibilityChanged);removeEventListener('pageshow',visibilityChanged);visual?.dispose();}};
}

