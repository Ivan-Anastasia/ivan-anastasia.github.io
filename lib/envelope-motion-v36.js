const clamp=v=>Math.max(0,Math.min(1,v));
const smooth=v=>{const t=clamp(v);return t*t*(3-2*t);};
const phase=(p,a,b)=>smooth((p-a)/(b-a));
export function envelopeFrame(progress){const p=clamp(progress),angle=phase(p,.12,.38)*Math.PI*.96;return {progress:p,flapAngle:angle,flapScale:Math.cos(angle),flapBack:angle>Math.PI/2,cardY:-194*phase(p,.42,.84),cardBend:phase(p,.42,.52),envelopeY:0,sealOpacity:1-phase(p,0,.2),sealY:-5*phase(p,0,.2),titleOpacity:1-phase(p,0,.18),captionOpacity:1-phase(p,.35,.75),opacity:1-phase(p,.95,1),reveal:p>=.95};}
export function paintEnvelope(parts,state){parts.rest.setAttribute('opacity','0');parts.mechanism.setAttribute('opacity','1');parts.art.style.transform='none';const hinge='translate(0 25) scale(1 '+state.flapScale+') translate(0 -25)';parts.front.setAttribute('transform',hinge);parts.back.setAttribute('transform',hinge);parts.front.setAttribute('display',state.flapBack?'none':'inline');parts.back.setAttribute('display',state.flapBack?'inline':'none');parts.seal.setAttribute('opacity',state.sealOpacity);parts.seal.setAttribute('transform','translate(0 '+state.sealY+')');parts.card.setAttribute('opacity','1');parts.card.setAttribute('transform','translate(0 '+state.cardY+')');}



// The part still inside the pocket stays behind its front; the exposed paper bends toward the viewer.
export function letterDepth(x,y,bend=1){const mouth=-42+Math.abs(x)*152/166;return 1.5+bend*Math.max(0,y-mouth)*.22;}


