/* v2.4 UI and hooks: independent of the existing typing loop. */
function wallet24(){return save.expansion24;}
function renderWallet24(){$$('[data-points]').forEach(e=>e.textContent=fmt(wallet24().points));$$('[data-card-total]').forEach(e=>e.textContent=GAME_DATA.cards.length);$$('[data-ur-count]').forEach(e=>e.textContent=GAME_DATA.cards.filter(c=>c.ultra).length);}
function awardTimePoints(m,old){
 if(game.pointsAwarded24)return;
 const award=calculateTimePoints(game,m,old),w=wallet24();game.pointsAwarded24=award;
 w.points=Math.min(1e9,w.points+award.total);w.earned+=award.total;w.rewardCharges=Math.min(10,w.rewardCharges+award.charges);
}
const finish23=finish;
finish=function(retired=false){const already=game?.finished;finish23(retired);if(already||!game)return;renderWallet24();const a=game.pointsAwarded24;
 $('#pointReport').innerHTML=`<div><span class="eyebrow">TIME POINTS</span><h3>時空ポイント <b>＋${fmt(a.total)} pt</b></h3><p>所持 ${fmt(wallet24().points)} pt ／ 通常召喚は${fmt(CHRONICLE24.summonCost)} pt</p></div><details><summary>ポイントの内訳</summary>${a.rows.map(([n,p])=>`<p>${n}<b>＋${p} pt</b></p>`).join('')||'<p>敵を倒して記憶を取り戻そう。</p>'}<p>ボス撃破1体につき、カードバトルの勝利報酬枠＋1（最大10）。途中終了でも獲得した分は残ります。</p></details>`;
};
const screen23=showScreen;
showScreen=function(id){screen23(id);renderWallet24();};
function mergeImported24(imported,had24){
 for(const [id,count] of Object.entries(save.cards))imported.cards[id]=Math.max(count,imported.cards[id]||0);
 for(const [era,record] of Object.entries(save.records)){imported.records[era]??={};for(const [k,v] of Object.entries(record))imported.records[era][k]=Math.max(v,imported.records[era][k]||0);}
 if(!had24)imported.expansion24=structuredClone(wallet24());
 return imported;
}
$('#importFile').onchange=async ev=>{const file=ev.target.files[0];if(!file)return;try{
 if(file.size>1e6)throw Error('ファイルが大きすぎます。');const raw=JSON.parse(await file.text()),incoming=validSave(raw);
 openDialog('<h2>記録を引き継ぎますか？</h2><p class="guide-text">人物カードは現在とバックアップの多い方の枚数を残し、自己ベストも良い方を残します。v2.3以前の記録では、現在のポイントを保ちます。v2.4のバックアップではポイント・召喚・対戦記録をその保存時点に戻します。</p><div class="modal-actions"><button id="confirmImport" class="primary">引き継ぐ</button><button id="cancelImport" class="ghost">やめる</button></div>');
 $('#confirmImport').onclick=()=>{save=mergeImported24(incoming,!!raw.expansion24);recoverBattle24();persist();renderMute();renderWallet24();audioSys.musicLevel=.30*save.settings.musicVolume/100;audioSys.applyMute();closeDialog();renderCatalog();$('#saveStatus').textContent='カードと自己ベストを保って記録を引き継ぎました。';};$('#cancelImport').onclick=closeDialog;
 }catch(e){$('#saveStatus').textContent='読み込めませんでした。'+e.message;}ev.target.value='';};
function recoverBattle24(){if(wallet24().pendingBattle){wallet24().losses++;wallet24().pendingBattle=false;persist();}}
recoverBattle24();renderWallet24();
let summoning24=false,summonToken24=0;
function summonPool24(tier){return GAME_DATA.cards.filter(c=>tier===6?c.ultra:!c.ultra&&c.rarity===tier);}
function pickSummon24(mode,random=Math.random){let tier=6;if(mode!=='ur'){let r=random()*100;tier=CHRONICLE24.rates.findIndex(w=>(r-=w)<0)+1;if(tier<1)tier=6;}const list=summonPool24(tier);return list[Math.min(list.length-1,Math.floor(random()*list.length))];}
function showSummon24(){showScreen('summon');renderSummon24();}
function renderSummon24(){renderWallet24();$('#normalSummon24').textContent='1枚召喚する　'+fmt(CHRONICLE24.summonCost)+' pt';$('#urSummon24').textContent='URを召喚する　'+fmt(CHRONICLE24.urCost)+' pt';const w=wallet24();$('#normalSummon24').disabled=summoning24||w.points<CHRONICLE24.summonCost;$('#urSummon24').disabled=summoning24||w.points<CHRONICLE24.urCost;
 $('#urGoal24').textContent=w.points>=CHRONICLE24.urCost?'UR確定召喚ができる！':'UR確定まであと '+fmt(CHRONICLE24.urCost-w.points)+' pt';$('#urProgress24').style.width=Math.min(100,w.points/CHRONICLE24.urCost*100)+'%';
 $('#summonRates24').innerHTML=CHRONICLE24.rates.map((r,i)=>`${r>0?`<span>${i===5?'★★★★★ UR':'★'.repeat(i+1)} <b>${r}%</b><small>${summonPool24(i+1).length}枚</small></span>`:''}`).join('');
 $('#lastSummon24').innerHTML=w.lastSummon?`前回の召喚：<b>${esc(GAME_DATA.cards.find(c=>c.id===w.lastSummon.id).name)}</b> ／ 召喚したカードは図鑑に保存済み。`: `${GAME_DATA.eras.length}つの時代編・${GAME_DATA.cards.length}枚のカードが召喚の対象。重複カードも所持枚数に加わります。`;
}
function summon24(mode){if(summoning24)return false;const w=wallet24(),cost=mode==='ur'?CHRONICLE24.urCost:CHRONICLE24.summonCost;if(w.points<cost){renderSummon24();return false;}
 summoning24=true;const c=pickSummon24(mode),fresh=!save.cards[c.id];w.points-=cost;w.spent+=cost;w.summons++;if(mode==='ur')w.urSummons++;w.gachaCards[c.id]=(w.gachaCards[c.id]||0)+1;w.lastSummon={id:c.id,mode};save.cards[c.id]=(save.cards[c.id]||0)+1;persist();renderWallet24();audioSys.start();audioSys.sfx('card');
 const token=++summonToken24;
 openDialog(`<div class="eyebrow">CHRONICLE SUMMON / ${mode==='ur'?'UR確定':'通常召喚'}</div><h2 id="summonHeadline24">時代を越え、記憶よ集え。</h2><div class="ur-announcement242" id="urOmen242" aria-live="polite">${c.ultra?'時空が、共鳴する…':''}</div><div class="flip-container summon-flip24"><div class="summon-rays24">${Array.from({length:c.ultra?48:14},(_,i)=>`<i style="--n:${i};--count:${c.ultra?48:14}"></i>`).join('')}</div><div class="flip-inner"><div class="flip-front"><div class="card-back"><div class="ur-seal242" aria-hidden="true">✦<small>時空の封印</small></div><div class="seal"><span>召</span></div><p>CHRONICLE</p><span>時 空 召 喚</span></div></div><div class="flip-back">${fullCard(c)}</div></div></div><p id="rewardStatus" aria-live="polite">記憶が集まっている…</p><div class="modal-actions"><button id="summonSkip24" class="ghost">演出をスキップ</button><button id="summonDone24" class="primary" hidden>もう一度、召喚へ</button><button id="summonBattle24" class="primary" hidden>このカードでバトルへ</button><button id="summonCatalog24" class="ghost" hidden>図鑑で見る</button></div>`, 'reward-box summon-reward24 '+(c.ultra?'ultra-reward ultra-summon24':c.rarity>=4?'high':''));
 let revealed=false;if(c.ultra)setTimeout(()=>{if(token!==summonToken24||revealed)return;$('#dialogBox').classList.add('ur-awakening242');$('#urOmen242').innerHTML='<b>★★★★★</b><span>伝説の気配</span>';audioSys.sfx('urCharge');},700);const reveal=()=>{if(revealed||token!==summonToken24)return;revealed=true;$('.summon-flip24 .flip-inner')?.classList.add('flipped');$('#dialogBox').classList.add('summon-impact24');if(c.ultra){$('#dialogBox').classList.add('ur-arrival242');$('#urOmen242').innerHTML='<b>UR</b><span>ULTRA RARE — 伝説、降臨。</span>';} audioSys.sfx(c.ultra?'ultra':c.rarity>=4?'rare':'card');$('#summonHeadline24').textContent=c.ultra?'時空を超える、伝説の一枚！':c.rarity>=4?'輝く記憶が、目を覚ます。':'新たな仲間と、次の時代へ。';$('#rewardStatus').innerHTML=`<b class="summon-rarity24">${rarityName(c)}</b><br>${fresh?'NEW！':'重複GET！'} ${esc(c.name)} ／ 所持 ${save.cards[c.id]}枚<br><small>−${fmt(cost)} pt ／ カードは保存済み</small>`;$('#summonSkip24').hidden=true;$('#summonDone24').hidden=false;$('#summonCatalog24').hidden=false;$('#summonBattle24').hidden=false;};
 const exit=(catalog=false)=>{summonToken24++;summoning24=false;closeDialog();renderSummon24();if(catalog){catalogEra=c.era;showCatalog();}};
 $('#summonSkip24').onclick=reveal;$('#summonDone24').onclick=()=>exit();$('#summonCatalog24').onclick=()=>exit(true);$('#summonBattle24').onclick=()=>{exit();selectedCard24=c.id;showBattleSetup24();};
 setTimeout(reveal,matchMedia('(prefers-reduced-motion: reduce)').matches?250:c.ultra?2400:1100);return c.id;
}
$('#summonBtn24').onclick=()=>{audioSys.start();showSummon24()};$('#resultSummon24').onclick=showSummon24;$('#normalSummon24').onclick=()=>summon24('normal');$('#urSummon24').onclick=()=>summon24('ur');$('#summonTyping24').onclick=showSelect;$('#summonHome24').onclick=()=>showScreen('title');
let duel24=null,duelToken24=0,selectedCard24=null,battleFilter24='all';
function duelActive24(){return duel24&&!duel24.ended;}
function showBattleSetup24(){if(duelActive24()){askLeaveDuel24();return;}showScreen('cardSetup');renderBattleSetup24();}
function renderBattleSetup24(){const owned=GAME_DATA.cards.filter(c=>save.cards[c.id]);if(!owned.some(c=>c.id===selectedCard24))selectedCard24=owned[0]?.id||null;
 $('#battleRecord24').textContent=`${wallet24().wins}勝 ${wallet24().losses}敗 ${wallet24().draws}引き分け ／ 勝利報酬の残り ${wallet24().rewardCharges}回`;
 $('#battleTabs24').innerHTML=[{id:'all',name:'すべて'},...GAME_DATA.eras].map(e=>`<button data-battle-tab="${e.id}" class="${battleFilter24===e.id?'active':''}">${e.name}</button>`).join('');$$('[data-battle-tab]').forEach(b=>b.onclick=()=>{battleFilter24=b.dataset.battleTab;renderBattleSetup24()});
 $('#battleCollection24').innerHTML=owned.filter(c=>battleFilter24==='all'||c.era===battleFilter24).map(c=>`<button class="card-slot ${selectedCard24===c.id?'selected24':''}" data-duel-card="${c.id}" aria-pressed="${selectedCard24===c.id}">${miniCard(c)}</button>`).join('')||'<p class="empty24">この時代のカードはまだありません。タイピングでポイントを貯め、時空召喚で手に入れよう。</p>';
 $$('[data-duel-card]').forEach(b=>b.onclick=()=>{selectedCard24=b.dataset.duelCard;renderBattleSetup24()});
 const c=GAME_DATA.cards.find(c=>c.id===selectedCard24);$('#startDuel24').disabled=!c;
 $('#battleSelected24').innerHTML=c?battleSelectedMarkup24(c):'<div class="empty24"><h3>最初の一枚が、君の相棒。</h3><p>タイピングで300 ptを貯めたら、時空召喚で最初の1枚を手に入れよう。</p></div>';
 $('#previewCard24')?.addEventListener('click',()=>showBattleCard24(c));
}
function battleSelectedMarkup24(c){const p=battleProfile24(c);return `<div class="selected-portrait24">${miniCard(c)}</div><div><div class="eyebrow">YOUR PARTNER</div><h3>${c.name}</h3><p>${c.role}</p><div class="battle-statline24"><span>HP <b>${p.hp}</b></span><span>攻撃 <b>${p.attack}</b></span><span>守り <b>${p.defense}</b></span><span>レア加点 <b>＋${p.rarity}</b></span></div><p class="mini-note">攻撃＝武力・知力の高い方<br>守り＝（政治力＋カリスマ）÷4を切り上げ</p><div class="battle-skill-note24">◆ ${c.skill}<p>${c.ability}<br><b>${skillDescription24(c)}</b></p></div><button id="previewCard24" class="small ghost">人物カードを大きく見る</button></div>`;}
function skillDescription24(c){return battleProfile24(c).skill?.text||c.ability;}
function showBattleCard24(c){openDialog(fullCard(c)+`<p class="mini-note">カードバトル：${skillDescription24(c)}</p><button id="closeModal" class="primary">戻る</button>`,'duel-card-dialog24');$('#closeModal').onclick=closeDialog;}
function startDuel24(){if(duelActive24()||!save.cards[selectedCard24])return;const player=GAME_DATA.cards.find(c=>c.id===selectedCard24),pool=GAME_DATA.cards.filter(c=>!c.ultra&&c.rarity<=Math.max(3,player.rarity+1)),ultras=GAME_DATA.cards.filter(c=>c.ultra),cpu=Math.random()<.04?ultras[Math.floor(Math.random()*ultras.length)]:pool[Math.floor(Math.random()*pool.length)];
 duel24={player,cpu,pHP:battleProfile24(player).hp,cHP:battleProfile24(cpu).hp,round:1,pRally:false,cRally:false,busy:false,ended:false,logs:[],last:null};duelToken24++;wallet24().pendingBattle=true;persist();audioSys.start();showScreen('cardDuel');audioSys.set('boss');$('#duelFormula24').innerHTML='';$('#duelSkill24').innerHTML='';renderDuel24();
}
function diceMarkup24(id){const dots=[[5],[1,9],[1,5,9],[1,3,7,9],[1,3,5,7,9],[1,3,4,6,7,9]];return `<div class="dice-space24"><div class="dice24" id="${id}" aria-label="出目未決定">${dots.map((list,i)=>`<div class="dice-face24 face${i+1}">${Array.from({length:9},(_,j)=>`<i class="${list.includes(j+1)?'pip24':''}"></i>`).join('')}</div>`).join('')}</div></div>`;}
function fighterMarkup24(c,hp,side){const max=battleProfile24(c).hp;return `<div class="fighter-name24"><span>${side==='p'?'YOUR CARD':'CPU CARD'}</span><b>${c.name}</b></div><button class="fighter-card24" data-fighter="${side}" aria-label="${c.name}の詳細">${miniCard(c)}</button><div class="duel-hp24"><i style="width:${Math.max(0,hp)/max*100}%"></i></div><div class="duel-hp-number24">HP <b>${Math.max(0,hp)}</b> / ${max}</div><div class="fighter-skill24">◆ ${c.skill}<small>${skillDescription24(c)}</small></div>`;}
function renderDuel24(){const d=duel24;if(!d)return;$('#duelRound24').textContent='TURN '+d.round;$('#playerFighter24').innerHTML=fighterMarkup24(d.player,d.pHP,'p');$('#cpuFighter24').innerHTML=fighterMarkup24(d.cpu,d.cHP,'c');$$('[data-fighter]').forEach(b=>b.onclick=()=>showBattleCard24(b.dataset.fighter==='p'?d.player:d.cpu));
 $('#duelDice24').innerHTML=`<div><small>YOU</small>${diceMarkup24('playerDie24')}</div><div><small>CPU</small>${diceMarkup24('cpuDie24')}</div>`;
 if(d.last){setDie24('playerDie24',d.last.player.die);setDie24('cpuDie24',d.last.cpu.die)}
 $('#duelActions24').innerHTML=Object.entries(STANCES24).map(([id,s])=>`<button class="${id==='attack'?'primary':'ghost'}" data-stance="${id}" ${d.busy||d.ended||(id==='rally'&&d.pRally)?'disabled':''}>${s.name}<small>${id==='rally'&&d.pRally?'使用済み':s.note}</small></button>`).join('');$$('[data-stance]').forEach(b=>b.onclick=()=>rollDuel24(b.dataset.stance));
 $('#duelLog24').innerHTML=d.logs.slice(-5).reverse().map(x=>`<li>${x}</li>`).join('');
 $('#duelMessage24').textContent=d.ended?d.result:d.last?'作戦を選んで、次の一投へ。':'作戦を選ぶと、2つのサイコロが回る。';
 $('#duelFinish24').hidden=!d.ended;$('#duelLeave24').textContent=d.ended?'← カード選択':'対戦を中断';
 if(d.ended)$('#duelFinish24').innerHTML=`<h3>${d.result}</h3><p>${d.reward?`勝利報酬 ＋${d.reward} pt` :d.outcome==='win'?'勝利！ 報酬枠を使い切りました。タイピングのボス撃破で補充できます。':'もう一度、別の作戦で挑もう。'}</p><button class="primary" id="duelAgain24">カードを選んでもう一戦</button><button class="ghost" id="duelTyping24">タイピングでポイントを集める</button>`;
 $('#duelAgain24')?.addEventListener('click',showBattleSetup24);$('#duelTyping24')?.addEventListener('click',showSelect);
}
const DIE_ROTATIONS24={1:[0,0],2:[0,-90],3:[-90,0],4:[90,0],5:[0,90],6:[0,180]};
function setDie24(id,n){const el=$('#'+id),[x,y]=DIE_ROTATIONS24[n];if(!el)return;el.classList.remove('rolling24');el.style.transform=`rotateX(${x}deg) rotateY(${y}deg)`;el.setAttribute('aria-label','サイコロ '+n);}
function rollDuel24(stance){const d=duel24;if(!d||d.ended||d.busy||(stance==='rally'&&d.pRally)||!STANCES24[stance])return;d.busy=true;renderDuel24();const token=duelToken24,da=1+Math.floor(Math.random()*6),db=1+Math.floor(Math.random()*6),cpuStance=!d.cRally&&d.cHP<battleProfile24(d.cpu).hp*.6?'rally':Math.random()<.3?'guard':'attack';
 $('#duelMessage24').textContent='6出ろ！ 記憶の力を、この一投に。';$$('.dice24').forEach(e=>{e.style.transform='';e.classList.add('rolling24')});audioSys.sfx('combo');
 setTimeout(()=>{if(token!==duelToken24||d.ended)return;setDie24('playerDie24',da);setDie24('cpuDie24',db);$('#duelMessage24').textContent=`あなた ${da} ／ CPU ${db} … 能力と合算！`;audioSys.sfx('card');
 setTimeout(()=>{if(token!==duelToken24||d.ended)return;settleDuel24(da,db,stance,cpuStance);},matchMedia('(prefers-reduced-motion: reduce)').matches?80:500);
 },matchMedia('(prefers-reduced-motion: reduce)').matches?150:1150);
}
function settleDuel24(da,db,stance,cpuStance){const d=duel24;if(!d||d.ended)return;const r=resolveClash24(d.player,d.cpu,da,db,stance,cpuStance,d.round);if(stance==='rally')d.pRally=true;if(cpuStance==='rally')d.cRally=true;
 d.pHP=Math.max(0,Math.min(battleProfile24(d.player).hp,d.pHP+r.player.heal)-r.toPlayer);d.cHP=Math.max(0,Math.min(battleProfile24(d.cpu).hp,d.cHP+r.cpu.heal)-r.toCPU);d.last=r;
 d.logs.push(`${r.player.active?'<strong>◆ '+d.player.skill+'！</strong><br>':''}${r.cpu.active?'<strong>CPU ◆ '+d.cpu.skill+'！</strong><br>':''}<b>TURN ${d.round}</b> あなた：${STANCES24[stance].name} ／ CPU：${STANCES24[cpuStance].name}<br>${clashLine24('あなた',r.player,r.cpu,r.toCPU)}<br>${clashLine24('CPU',r.cpu,r.player,r.toPlayer)}`);
 d.busy=false;audioSys.sfx(r.player.active?'critical':'hit');
 if(d.pHP<=0||d.cHP<=0)completeDuel24(d.pHP<=0&&d.cHP<=0?'draw':d.cHP<=0?'win':'loss');else d.round++;
 renderDuel24();$('#playerFighter24').classList.remove('impact24');$('#cpuFighter24').classList.remove('impact24');void $('#cpuFighter24').offsetWidth;$('#playerFighter24').classList.add('impact24');$('#cpuFighter24').classList.add('impact24');
 $('#duelFormula24').innerHTML=`<b>与えたダメージ ${r.toCPU}</b><br>能力${r.player.stat} ＋ 出目${da} ＋ レア${r.player.rare} ＋ 作戦${r.player.stance}${r.player.skillAttack?` ＋ 特技${r.player.skillAttack}`:''}${r.player.pressure?` ＋ 激戦${r.player.pressure}`:''} − 相手の守り${r.cpu.defense}${r.cpu.skillDefense?` − 特技${r.cpu.skillDefense}`:''}<br><small>受けたダメージ ${r.toPlayer} ／ 同時に攻撃</small>`;
 $('#duelSkill24').innerHTML=[r.player.active?`あなた：${d.player.skill}！`:null,r.cpu.active?`CPU：${d.cpu.skill}！`:null].filter(Boolean).join('<br>');
}
function clashLine24(who,x,y,damage){return `${who}：能力${x.stat}＋出目${x.die}＋レア${x.rare}＋作戦${x.stance}${x.skillAttack?`＋特技${x.skillAttack}`:''}${x.pressure?`＋激戦${x.pressure}`:''}−守り${y.defense+y.skillDefense} → <b>${damage}ダメージ</b>${x.heal?` ／ HP＋${x.heal}（最大HPまで）`:''}`;}
function completeDuel24(outcome){const d=duel24;if(!d||d.ended)return;d.ended=true;d.outcome=outcome;d.reward=0;const w=wallet24();w.pendingBattle=false;if(outcome==='win'){w.wins++;if(w.rewardCharges>0){w.rewardCharges--;w.points+=5;w.earned+=5;d.reward=5;}d.result='勝利！ 記憶の力が届いた。';audioSys.sfx('clear')}else if(outcome==='loss'){w.losses++;d.result='惜敗… 次の一投に、希望を。';audioSys.sfx('over')}else{w.draws++;d.result='引き分け！ 互いに見事な一撃。';audioSys.sfx('card')}persist();renderWallet24();audioSys.set('title');}
function askLeaveDuel24(){if(!duelActive24()){showBattleSetup24();return;}openDialog('<h2>対戦を中断しますか？</h2><p class="guide-text">中断・再読み込みは1敗として記録します。カードとポイントは減りません。</p><div class="modal-actions"><button id="resumeDuel24" class="primary">対戦に戻る</button><button id="abandonDuel24" class="ghost">中断してカード選択へ</button></div>');$('#resumeDuel24').onclick=closeDialog;$('#abandonDuel24').onclick=()=>{duelToken24++;completeDuel24('loss');closeDialog();showBattleSetup24()};}
$('#cardBattleBtn24').onclick=()=>{audioSys.start();showBattleSetup24()};$('#setupHome24').onclick=()=>showScreen('title');$('#setupTyping24').onclick=showSelect;$('#setupSummon24').onclick=showSummon24;$('#startDuel24').onclick=startDuel24;$('#duelLeave24').onclick=askLeaveDuel24;
const brand23=$('#brandHome').onclick;$('#brandHome').onclick=()=>{if(currentScreen==='cardDuel'&&duelActive24()){if(!$('#dialog').classList.contains('open'))askLeaveDuel24();return;}brand23()};
