// play() must run in the opening click itself: waiting for the animation
// would lose transient user activation on mobile browsers.
export function initMusic({audio,button,startButton,events,notify=()=>{}}){
  if(!audio||!button)return;
  audio.preload='none';
  audio.loop=true;
  audio.volume=.35;
  let pending=false,generation=0;
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
    if(pending||!audio.paused){generation++;pending=false;audio.pause();sync();}
    else void play();
  });
  startButton?.addEventListener('click',()=>{reveal();void play();},{once:true});
  events.addEventListener('invitation-opened',reveal);
  audio.addEventListener('playing',sync);
  audio.addEventListener('pause',sync);
  audio.addEventListener('error',()=>{
    generation++;pending=false;audio.pause();sync();
    notify('Не удалось загрузить музыку. Нажмите кнопку звука, чтобы попробовать ещё раз.');
  });
  sync();
}
