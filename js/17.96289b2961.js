const motionReduced261=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function entrance261(sides=['player','cpu']){for(const side of sides){const el=$('#'+side+'Fighter24'),card=duel24?.[side];if(!el||!card)continue;el.classList.toggle('ur-enter261',!!card.ultra);el.classList.toggle('kira-enter261',level26(card)===3);if(card.ultra)el.querySelector('.fighter-name24 span').textContent=(side==='player'?'PLAYER':'CPU')+' · '+(duel24?.[side+'Team']?.[side==='player'?duel24.pIndex:duel24.cIndex]?.position||'')+' · UR ARRIVAL';}setTimeout(()=>{$$('.ur-enter261,.kira-enter261').forEach(el=>el.classList.remove('ur-enter261','kira-enter261'));},1600);}
let scanPending261=false;
const observed261=new Set();
const cardObserver261=new IntersectionObserver(entries=>{for(const entry of entries)entry.target.classList.toggle('fx-visible261',entry.isIntersecting&&entry.intersectionRatio>.05);},{threshold:[0,.05,.1]});
function refreshCardFx261(){if(scanPending261)return;scanPending261=true;requestAnimationFrame(()=>{scanPending261=false;for(const el of observed261)if(!el.isConnected){cardObserver261.unobserve(el);observed261.delete(el);}for(const el of $$('.mini-card.ultra:not(.locked),.mini-card.kira26,.full-card.ultra,.full-card.kira26'))if(!observed261.has(el)){observed261.add(el);cardObserver261.observe(el);}});}
function visualHook261(fn){return function(...args){const result=fn.apply(this,args);refreshCardFx261();return result;};}
renderHeroes=visualHook261(renderHeroes);renderCatalog=visualHook261(renderCatalog);renderBattleSetup24=visualHook261(renderBattleSetup24);renderDuel24=visualHook261(renderDuel24);openDialog=visualHook261(openDialog);showScreen=visualHook261(showScreen);
function motionVisibility261(){document.documentElement.classList.toggle('fx-sleep261',document.hidden);}document.addEventListener('visibilitychange',motionVisibility261);motionVisibility261();
renderHeroes();refreshCardFx261();

// Only enlarged cards receive pointer-driven reflection; one layout read per frame.
let lensTarget261=null,lensFrame261=0,lensX261=0,lensY261=0;
document.addEventListener('pointermove',ev=>{const card=ev.target.closest?.('.full-card.kira26');if(!card||motionReduced261())return;lensTarget261=card;lensX261=ev.clientX;lensY261=ev.clientY;if(lensFrame261)return;lensFrame261=requestAnimationFrame(()=>{lensFrame261=0;const c=lensTarget261;if(!c?.isConnected)return;const r=c.getBoundingClientRect();c.style.setProperty('--lens-x',Math.max(0,Math.min(100,(lensX261-r.left)/r.width*100))+'%');c.style.setProperty('--lens-y',Math.max(0,Math.min(100,(lensY261-r.top)/r.height*100))+'%');});},{passive:true});
