/* v2.6.1 visuals only; no stats, rewards or timers for gameplay. */
function urLayers261(c){return c.ultra?'<span class="ur-frame261" aria-hidden="true"></span><span class="ur-aura261" aria-hidden="true"></span><span class="ur-constellation261" aria-hidden="true">✧<i>✦</i><b>✧</b></span>':'';}

function foilDelay261(c){return -(Array.from(c.id).reduce((n,s)=>n+s.charCodeAt(0),0)%80)/10;}
