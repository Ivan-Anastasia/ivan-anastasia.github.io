// Try on entry; browsers that block audible autoplay get a synchronous retry
// in the first real click/key gesture, before any opening animation awaits.
export function initMusic({audio,button,startButton,events,notify=()=>{}}){
  if(!audio||!button)return;
  audio.preload='auto';
  audio.loop=true;
  audio.volume=.35;
  let pending=false,generation=0,automatic=true;
  function removeGestures(){events.removeEventListener('click',firstInteraction,true);events.removeEventListener('keydown',firstInteraction,true);}
  function firstInteraction(event){
    if(!automatic||event?.target===button||button.contains?.(event?.target))return;
    if(event?.type==='keydown'&&(event.repeat||!['Enter',' '].includes(event.key)))return;
    automatic=false;removeGestures();
    if(audio.paused)void play();
  }
  function reveal(){button.hidden=false;button.disabled=false;}
  function sync(){
    const playing=!audio.paused;
    button.setAttribute('aria-pressed',String(playing));
    button.setAttribute('aria-busy',String(pending));
    button.title=(playing||pending)?'Выключить музыку':'Включить музыку';
  }
  async function play(){
    const token=++generation;
    pending=true;sync();
    try{if(audio.error)audio.load();await audio.play();}
    catch(error){
      if(token===generation&&error.name!=='NotAllowedError'&&error.name!=='AbortError')notify('Не удалось включить музыку. Нажмите кнопку звука, чтобы попробовать ещё раз.');
    }finally{if(token===generation){pending=false;sync();}}
  }
  button.addEventListener('click',()=>{
    automatic=false;removeGestures();
    if(pending||!audio.paused){generation++;pending=false;audio.pause();sync();}
    else void play();
  });
  startButton?.addEventListener('click',firstInteraction,{once:true});
  events.addEventListener('click',firstInteraction,true);
  events.addEventListener('keydown',firstInteraction,true);
  events.addEventListener('invitation-opened',reveal);
  audio.addEventListener('playing',()=>{automatic=false;removeGestures();sync();});
  audio.addEventListener('pause',sync);
  audio.addEventListener('error',()=>{
    generation++;pending=false;audio.pause();sync();
    notify('Не удалось загрузить музыку. Нажмите кнопку звука, чтобы попробовать ещё раз.');
  });
  reveal();void play();
}
