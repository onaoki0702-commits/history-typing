/* v2.4 additions. Existing eras, questions, illustrations and card stats stay untouched. */
const CHRONICLE24={version:'2.8',summonCost:300,urCost:5000,rates:[40,32,21,6.5,0,.5],battleWinPoints:5,maxRewardCharges:10,futureTypeMatchups:null};
function safe24Int(n,max=1e9){return Number.isSafeInteger(n)&&n>=0?Math.min(n,max):0;}
function extend24Save(out,source={}){
 const x=source.expansion24||{};
 out.expansion24={...x,schema:1,points:safe24Int(x.points),earned:safe24Int(x.earned),spent:safe24Int(x.spent),summons:safe24Int(x.summons),urSummons:safe24Int(x.urSummons),gachaCards:{},wins:safe24Int(x.wins),losses:safe24Int(x.losses),draws:safe24Int(x.draws),rewardCharges:safe24Int(x.rewardCharges,10),pendingBattle:!!x.pendingBattle,lastSummon:null};
 for(const c of GAME_DATA.cards){let n=safe24Int(x.gachaCards?.[c.id]);if(n)out.expansion24.gachaCards[c.id]=n;}
 if(x.lastSummon&&GAME_DATA.cards.some(c=>c.id===x.lastSummon.id))out.expansion24.lastSummon={id:x.lastSummon.id,mode:x.lastSummon.mode==='ur'?'ur':'normal'};
 return extendSupport28(extendTeamSave27(extend26Save(out,source),source),source);
}
function calculateTimePoints(g,m,old={}){
 const effort=Math.min(1,g.kills/12),b=g.bosses;
 const rows=[['忘却軍を撃破',g.kills],['通常ROUNDを突破',g.normalClears*15],['ボス撃破・連続防衛',60*b+15*b*(b-1)/2],['歴史問題に自力で正解',g.bossCorrect*15],['正確な入力',Math.round(20*effort*Math.max(0,(m.accuracy-60)/40))],['COMBOをつなぐ',Math.round(Math.min(10,g.maxCombo/4)*effort)],['一区切りまで防衛',g.normalClears?10:0],['ボス撃破記録を更新',b>(old.bosses||0)?10:0]];
 return {rows:rows.filter(r=>r[1]>0),total:Math.floor(rows.reduce((s,r)=>s+r[1],0)),charges:Math.min(10,b)};
}
const STANCES24={attack:{name:'強攻',note:'攻撃＋2／守り−1',attack:2,defense:-1},guard:{name:'守備',note:'守り＋3／政治力で攻撃',attack:0,defense:3},rally:{name:'鼓舞',note:'HP＋4／各カード1回',attack:0,defense:0}};
const CARD_SKILLS24={}; // Expanded in checkpoint 5; no type matchups in v2.4.
function battleProfile24(c){return {hp:30+c.rarity*2+(c.ultra?4:0),attack:round26(Math.max(c.stats[0],c.stats[1])*factor26(c)),defense:round26(Math.ceil((c.stats[2]+c.stats[3])/4)*factor26(c)),rarity:Math.floor(c.rarity/2),skill:CARD_SKILLS24[c.id]||null};}
function combatNumbers24(c,die,stance,round){const p=battleProfile24(c),s=STANCES24[stance],stat=stance==='guard'?baseStat26(c,2):stance==='rally'?baseStat26(c,3):p.attack;return {stat,die,rare:p.rarity,stance:s.attack,pressure:Math.max(0,round-8),attack:stat+die+p.rarity+s.attack+Math.max(0,round-8),defense:round26(Math.max(0,p.defense+s.defense)),heal:stance==='rally'?4:0,skillAttack:0,skillDefense:0,skillHeal:0,active:false};}
function resolveClash24(a,b,da,db,sa,sb,round){const x=applySkill24(a,combatNumbers24(a,da,sa,round)),y=applySkill24(b,combatNumbers24(b,db,sb,round));return {player:x,cpu:y,toCPU:round26(Math.max(1,x.attack-y.defense-y.skillDefense)),toPlayer:round26(Math.max(1,y.attack-x.defense-x.skillDefense))};}

GAME_DATA.release='2.6.1 PRISM & KIRA';
// Five stars is a single UR tier. IDs, owned counts and original illustrations stay intact.
for(const c of GAME_DATA.cards)if(c.rarity===5)c.ultra=true;
