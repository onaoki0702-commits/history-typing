/* Original procedural soundtrack. Eight-bar themes with a second arrangement.
   No recordings, network requests, or externally loaded audio files. */
const MUSIC_TRACKS = {
 title:{name:'時をつなぐ光',bpm:100,voice:'bell',roots:[50,46,53,48,50,46,48,45],minor:true,thirds:[3,4,4,4,3,4,4,4],melody:[
  74,-1,77,81,79,-1,77,74,72,-1,74,77,74,-1,72,-1,
  77,-1,81,84,81,-1,79,77,76,-1,79,81,79,76,72,-1,
  74,77,81,-1,86,-1,84,81,82,-1,81,77,74,-1,77,-1,
  79,81,84,-1,81,79,77,76,73,-1,76,81,74,-1,-1,-1]},
 asuka_nara:{name:'黎明の都、海を渡る風',bpm:112,voice:'flute',roots:[48,53,55,48,57,53,55,48],minor:false,thirds:[4,4,4,4,3,4,4,4],melody:[
 72,-1,74,79,81,-1,79,76,77,-1,81,84,81,79,77,-1,
 79,81,86,-1,84,81,79,-1,76,-1,79,84,79,76,74,-1,
 81,-1,84,88,86,-1,84,81,77,79,81,-1,84,81,79,-1,
 79,81,86,-1,84,79,77,74,76,-1,74,72,67,-1,72,-1]},
 heian:{name:'花の都、風の調べ',bpm:108,voice:'flute',roots:[50,55,50,57,59,55,57,50],minor:false,thirds:[4,4,4,4,3,4,4,4],melody:[
  74,-1,76,78,81,-1,78,76,79,-1,81,83,81,-1,79,-1,
  78,76,74,-1,76,78,81,-1,85,-1,83,81,78,-1,76,-1,
  83,-1,86,90,86,-1,83,81,79,-1,83,86,83,81,79,-1,
  81,83,85,-1,88,85,83,81,78,-1,76,78,74,-1,-1,-1]},
 kamakura:{name:'武士の誓い',bpm:128,voice:'pluck',roots:[50,50,46,48,50,53,48,45],minor:true,melody:[
  74,74,-1,77,81,-1,79,77,74,-1,72,74,77,79,81,-1,
  70,-1,74,77,82,-1,81,77,72,75,79,-1,84,79,75,-1,
  74,77,81,86,84,-1,81,77,77,81,84,-1,89,84,81,-1,
  79,79,84,82,79,77,75,72,73,76,81,79,76,73,74,-1]},
 muromachi:{name:'金と墨の都',bpm:116,voice:'flute',roots:[52,57,55,52,60,57,59,52],minor:true,thirds:[3,3,4,3,4,3,3,3],melody:[
  76,-1,79,81,83,-1,81,79,81,84,-1,88,86,84,81,-1,
  79,-1,83,86,91,-1,86,83,79,78,76,-1,79,81,83,-1,
  84,-1,88,91,88,86,84,-1,81,84,88,-1,86,84,81,-1,
  83,86,90,-1,86,83,81,78,79,-1,78,76,71,-1,76,-1]},
 boss:{name:'忘却を断つ刃',bpm:152,voice:'brass',roots:[50,50,46,45,50,53,46,45],minor:true,melody:[
  74,-1,74,75,74,81,79,77,74,77,81,86,84,81,79,-1,
  82,81,77,74,70,-1,74,77,73,76,81,85,81,79,76,73,
  86,-1,84,81,79,77,74,77,81,84,89,-1,88,84,81,77,
  82,81,77,74,77,81,82,86,85,81,79,76,73,-1,74,-1]}
};
function createAudioSystem(getState,onMute){
 const a={ctx:null,gain:null,musicBus:null,sfxBus:null,trackBus:null,wet:null,noise:null,timer:null,next:0,step:0,track:'title',musicLevel:.21,audition:false,suspendedMusic:false,lastHit:-1,voices:0,
 init(ctx){
  this.ctx=ctx;this.gain=ctx.createGain();this.gain.gain.value=getState().mute?0:.65;
  const comp=ctx.createDynamicsCompressor();comp.threshold.value=-16;comp.knee.value=20;comp.ratio.value=5;comp.attack.value=.004;comp.release.value=.18;
  this.gain.connect(comp);comp.connect(ctx.destination);
  this.musicBus=ctx.createGain();this.musicBus.gain.value=this.musicLevel;this.musicBus.connect(this.gain);
  this.sfxBus=ctx.createGain();this.sfxBus.gain.value=.46;this.sfxBus.connect(this.gain);
  const conv=ctx.createConvolver(),imp=ctx.createBuffer(2,Math.floor(ctx.sampleRate*1.15),ctx.sampleRate);let seed=4321;
  for(let ch=0;ch<2;ch++){const d=imp.getChannelData(ch);for(let i=0;i<d.length;i++){seed=(seed*1664525+1013904223)>>>0;d[i]=(seed/4294967296*2-1)*Math.pow(1-i/d.length,3)*.20;}}
  conv.buffer=imp;this.wet=ctx.createGain();this.wet.gain.value=.19;this.wet.connect(conv);conv.connect(this.gain);
  this.noise=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate);let d=this.noise.getChannelData(0);for(let i=0;i<d.length;i++){seed=(seed*1664525+1013904223)>>>0;d[i]=seed/4294967296*2-1;}
  this.resetTrackBus();
 },
 start(){try{if(!this.ctx)this.init(new(window.AudioContext||window.webkitAudioContext)());if(!this.timer)this.timer=setInterval(()=>this.tick(),40);this.ctx.resume?.().catch(()=>{});}catch(e){}},
 resetTrackBus(){if(!this.ctx)return;const old=this.trackBus,now=this.ctx.currentTime;if(old){old.gain.cancelScheduledValues(now);old.gain.setTargetAtTime(0,now,.025);setTimeout(()=>old.disconnect(),500);}this.trackBus=this.ctx.createGain();this.trackBus.gain.setValueAtTime(0,now);this.trackBus.gain.linearRampToValueAtTime(1,now+.10);this.trackBus.connect(this.musicBus);this.trackBus.connect(this.wet);},
 set(track){if(!MUSIC_TRACKS[track])track='title';if(track===this.track&&this.step)return;this.track=track;this.step=0;this.next=this.ctx?this.ctx.currentTime+.06:0;this.resetTrackBus();},
 applyMute(){if(this.gain){let now=this.ctx.currentTime;this.gain.gain.cancelScheduledValues(now);this.gain.gain.setTargetAtTime(getState().mute?0:.65,now,.015);}this.next=0;},
 toggle(){this.start();onMute(!getState().mute);this.applyMute();},
 hz(n){return 440*Math.pow(2,(n-69)/12);},
 note(midi,time,duration,voice,volume=.2,pan=0,bus=this.trackBus){
  if(!this.ctx||midi<0)return;const ctx=this.ctx,f=this.hz(midi),env=ctx.createGain(),p=ctx.createStereoPanner();p.pan.value=pan;env.connect(p);p.connect(bus);let partials,attack=.007,release=duration;
  if(voice==='flute'){partials=[[1,1,'sine'],[2,.14,'sine'],[3,.035,'sine']];attack=.065;}
  else if(voice==='pad'){partials=[[1,.7,'triangle'],[2,.10,'sine']];attack=.16;}
  else if(voice==='bell'){partials=[[1,.75,'sine'],[2.01,.20,'sine'],[3.98,.10,'sine']];}
  else if(voice==='brass'){partials=[[1,.6,'triangle'],[2,.16,'sine'],[3,.07,'sine']];attack=.024;}
  else if(voice==='bass'){partials=[[1,.85,'sine'],[2,.1,'triangle']];attack=.014;}
  else partials=[[1,.8,'triangle'],[2,.16,'sine'],[3,.08,'sine'],[5,.025,'sine']];
  env.gain.setValueAtTime(.0001,time);env.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),time+attack);
  if(voice==='flute'||voice==='pad'||voice==='brass'){env.gain.setValueAtTime(volume*.72,time+Math.max(attack+.01,duration*.68));env.gain.exponentialRampToValueAtTime(.0001,time+duration+.12);release+=.12;}
  else env.gain.exponentialRampToValueAtTime(.0001,time+duration);
  let count=partials.length;this.voices+=count;
  for(const [ratio,amp,type] of partials){let o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(f*ratio,time);g.gain.value=amp;o.connect(g);g.connect(env);o.start(time);o.stop(time+release+.03);o.onended=()=>{o.disconnect();g.disconnect();this.voices--;if(--count===0){env.disconnect();p.disconnect();}};}
 },
 drum(time,kind,vol=.2,bus=this.trackBus){
  const ctx=this.ctx;if(!ctx)return;let g=ctx.createGain();g.connect(bus);
  if(kind==='taiko'){let o=ctx.createOscillator();o.type='sine';o.frequency.setValueAtTime(145,time);o.frequency.exponentialRampToValueAtTime(48,time+.22);g.gain.setValueAtTime(.0001,time);g.gain.exponentialRampToValueAtTime(vol,time+.005);g.gain.exponentialRampToValueAtTime(.0001,time+.32);o.connect(g);o.start(time);o.stop(time+.35);o.onended=()=>{o.disconnect();g.disconnect();};}
  else {let n=ctx.createBufferSource(),f=ctx.createBiquadFilter();n.buffer=this.noise;f.type=kind==='tick'?'highpass':'bandpass';f.frequency.value=kind==='tick'?6000:1700;f.Q.value=.7;n.connect(f);f.connect(g);let len=kind==='tick'?.045:.12;g.gain.setValueAtTime(Math.max(.0002,vol),time);g.gain.exponentialRampToValueAtTime(.0001,time+len);n.start(time);n.stop(time+len+.01);n.onended=()=>{n.disconnect();f.disconnect();g.disconnect();};}
 },
 scheduleStep(step,t){
  const tr=MUSIC_TRACKS[this.track],beat=60/tr.bpm,unit=beat/2,pos=step%8,bar=Math.floor(step/8)%8,root=tr.roots[bar],second=Math.floor(step/64)%2,lead=tr.melody[step%64];
  if(lead>=0)this.note(lead,t,unit*(tr.melody[(step+1)%64]<0?1.75:.82),tr.voice,this.track==='boss'?.18:.17,.10);
  if(pos===0){this.note(root-12,t,beat*1.6,'bass',.26,0);const third=tr.thirds?.[bar]??([50,48].includes(root)?3:4);for(const [i,n] of [root,root+third,root+7].entries())this.note(n+12,t,beat*3.6,'pad',.045,(i-1)*.45);}
  if(pos===4)this.note(root-5,t,beat*1.5,'bass',.17,0);
  if(this.track==='asuka_nara'||this.track==='heian'||this.track==='muromachi'||this.track==='title'){const arp=[0,7,12,12+(tr.thirds?.[bar]??3),19,12,7,12];if(pos%2===0||second)this.note(root+arp[pos]+12,t,unit*2.4,'pluck',.095,-.35);if(pos===0||pos===4)this.drum(t,'taiko',this.track==='heian'?.07:.09);if(second&&pos%2===1)this.drum(t,'tick',.025);}
  else {this.note(root+[0,7,12,7,0,7,12+([50,48].includes(root)?3:4),7][pos],t,unit*.78,'pluck',.105,-.3);if(pos===0||pos===4||this.track==='boss'&&pos===6)this.drum(t,'taiko',.21);if(pos===2||pos===6)this.drum(t,'snare',.09);if(pos%2===1)this.drum(t,'tick',.045);if(second&&pos===7)this.drum(t+unit*.5,'taiko',.10);}
  if(this.track==='asuka_nara'&&pos===0)this.note(root+24,t,beat*2,'bell',.055,.35);
  if(second&&pos===6)this.note(root+24,t,beat,'bell',.05,.45);
 },
 tick(){if(!this.ctx||this.ctx.state!=='running')return;const state=getState(),now=this.ctx.currentTime,stop=state.mute||(state.paused&&!this.audition)||document.hidden;
  if(stop){if(!this.suspendedMusic){this.musicBus.gain.setTargetAtTime(0,now,.03);this.suspendedMusic=true;}this.next=0;return;}
  if(this.suspendedMusic){this.musicBus.gain.setTargetAtTime(this.musicLevel,now,.05);this.suspendedMusic=false;}
  if(!this.next||this.next<now-.2)this.next=now+.045;
  while(this.next<now+.15){this.scheduleStep(this.step++,this.next);this.next+=30/MUSIC_TRACKS[this.track].bpm;}
 },
 sfx(type,combo=0){if(!this.ctx||getState().mute)return;const now=this.ctx.currentTime;
  if(type==='hit'){if(now-this.lastHit<.025)return;this.lastHit=now;this.note(83+Math.min(12,Math.floor(combo/6)),now,.065,'pluck',.19,0,this.sfxBus);return;}
  const phrases={urCharge:[45,57,64,69,76,81],miss:[45],kill:[74,81,86],combo:[74,78,81,86],damage:[45,40,33],card:[69,74,78,81,86],rare:[62,69,74,78,81,86,90],ultra:[50,62,69,74,78,81,86,90,93,98],critical:[50,62,74,86],clear:[74,78,81,86,90,86],over:[62,60,57,50]};
  for(const [i,n] of (phrases[type]||[74]).entries())this.note(n,now+i*.065,(type==='rare'||type==='ultra')?.65:.21,type==='damage'?'brass':'bell',type==='critical'?.25:.20,0,this.sfxBus);
  if(type==='critical'||type==='damage')this.drum(now,'taiko',.5,this.sfxBus);
 }
 };return a;
}
