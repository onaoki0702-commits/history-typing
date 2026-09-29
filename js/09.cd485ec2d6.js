/* v2.6 awakening + v2.6.1 fixed shard credits. Never reprice earned fragments. */
const AWAKENING26={schema:1,maxCopies:4,bonuses:[0,.02,.04,.06],shards:{1:1,2:1,3:2,4:3,5:5},convertMax:true};
function shardsFor26(c){return c.ultra?5:AWAKENING26.shards[c.rarity]||1;}
function acquired26(raw,id){const n=raw?.[id];return safe24Int(n,999999999)||(n===true||Array.isArray(raw)&&raw.includes(id)?1:0);}
function legacyShardValue261(id){const rarity=LEGACY_RARITY261[id]||1;return AWAKENING26.shards[rarity]||1;}
function shardCredit261(p,id){return Number.isSafeInteger(p?.creditedFragments)&&p.creditedFragments>=0?p.creditedFragments:safe24Int(p?.converted)*legacyShardValue261(id);}
function progressFrom26(acquired,previous={}){const n=safe24Int(acquired),level=Math.min(3,Math.max(0,n-1));return {...previous,acquired:n,level,kira:n>=4,converted:safe24Int(previous.converted)};}
function extend26Save(out,source={}){
 const old=source.awakening26?.schema===1?source.awakening26:{},a={...old,schema:1,fragments:safe24Int(old.fragments),progress:{}};
 for(const c of GAME_DATA.cards){const prev=old.progress?.[c.id]||{},n=Math.max(acquired26(source.cards,c.id),acquired26(out.cards,c.id),safe24Int(prev.acquired));if(!n)continue;
  const p=progressFrom26(n,prev),excess=Math.max(0,n-4);p.converted=Math.min(excess,p.converted);p.creditedFragments=shardCredit261(p,c.id);
  if(AWAKENING26.convertMax){const value=old.valuationVersion===2?shardsFor26(c):legacyShardValue261(c.id),added=Math.max(0,excess-p.converted)*value;a.fragments+=added;p.creditedFragments+=added;p.converted=excess;}
  a.progress[c.id]=p;out.cards[c.id]=Math.min(4,n);
 }
 a.valuationVersion=2;out.awakening26=a;return out;
}
function progress26(c,state=save){const p=state.awakening26?.progress?.[c.id];return p||progressFrom26(acquired26(state.cards,c.id));}
function acquireCard26(c,state=save){
 const before=progress26(c,state),p=progressFrom26(before.acquired+1,before),shards=AWAKENING26.convertMax&&p.acquired>4?shardsFor26(c):0;
 p.creditedFragments=shardCredit261(before,c.id);if(shards){p.converted++;p.creditedFragments+=shards;state.awakening26.fragments+=shards;}
 state.awakening26.progress[c.id]=p;state.cards[c.id]=Math.min(4,p.acquired);
 return {id:c.id,acquired:p.acquired,level:p.level,kira:p.kira,shards,kind:p.acquired===1?'new':p.acquired===4?'kira':p.acquired>4?'fragments':'awake',bonus:AWAKENING26.bonuses[p.level]};
}
function creditedFragments26(a){return GAME_DATA.cards.reduce((sum,c)=>sum+shardCredit261(a?.progress?.[c.id],c.id),0);}
function mergeAwakening26(current,incoming){
 const a=current.awakening26,b=incoming.awakening26,progress={};
 for(const c of GAME_DATA.cards){const x=progress26(c,current),y=progress26(c,incoming),n=Math.max(x.acquired,y.acquired);if(n)progress[c.id]=progressFrom26(n,{...x,...y,converted:Math.max(x.converted,y.converted),creditedFragments:Math.max(shardCredit261(x,c.id),shardCredit261(y,c.id))});}
 // Merge the conversion ledger, rather than adding two snapshots of the same shards.
 const extra=Math.max(0,a.fragments-creditedFragments26(a),b.fragments-creditedFragments26(b));
 incoming.awakening26={...a,...b,schema:1,valuationVersion:2,progress,fragments:Math.max(a.fragments,b.fragments,extra+creditedFragments26({progress}))};
 return extend26Save(incoming,incoming);
}
function level26(c){return Number.isInteger(c.awakeningLevel26)?Math.max(0,Math.min(3,c.awakeningLevel26)):progress26(c).level;}
function round26(n){return Math.round((n+Number.EPSILON)*100)/100;}
function factor26(c){return 1+AWAKENING26.bonuses[level26(c)];}
function baseStat26(c,i){return round26(c.stats[i]*factor26(c));}
function battleCard26(c,level=level26(c)){return {...c,awakeningLevel26:level};}
function label26(c){return ['通常','覚醒Ⅰ','覚醒Ⅱ','キラMAX'][level26(c)];}
function awakeningBadge26(c){if(c.awakeningLevel26===undefined&&!progress26(c).acquired)return '';const l=level26(c);return `<span class="awake-badge26 level-${l}">${l===3?'✧ KIRA / MAX':l?'覚醒'+['','Ⅰ','Ⅱ'][l]+' · '+(l+1)+'/4':'1 / 4'}</span>`;}
function awakeningDetail26(c){const p=progress26(c),l=level26(c);return `<div class="awake-detail26"><b>${label26(c)}　${l===3?'✧ MAX':['○○○','●○○','●●○'][l]||''}</b><p>${l===3?'育てた記憶が、特別な輝きに。':'あと'+(3-l)+'枚でキラMAX！'}<br>基本能力 ＋${Math.round(AWAKENING26.bonuses[l]*100)}% ／ 特殊能力・★は変わりません</p><small>累計獲得 ${fmt(p.acquired)}枚${l===3?' ／ 次から時空のかけら ×'+shardsFor26(c):''}</small></div>`;}
function kiraLayers26(c){return level26(c)===3?'<span class="kira-foil26" aria-hidden="true"></span><span class="kira-lens261" aria-hidden="true"></span><span class="kira-glints26" aria-hidden="true">✧<i>✦</i><b>✧</b></span>':'';}
