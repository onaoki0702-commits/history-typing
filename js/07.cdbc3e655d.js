/* Game effects inspired by each EXISTING card's description, not historical measurements.
   Types/matchups are deliberately not implemented. Add future data separately. */
function skill24(id,trigger,attack=0,defense=0,heal=0){const labels={high:'出目4〜6',six:'出目5〜6',low:'出目1〜3'},effects=[attack?`攻撃＋${attack}`:'',defense?`守り＋${defense}`:'',heal?`HP＋${heal}（最大HPまで）`:''].filter(Boolean);CARD_SKILLS24[id]={trigger,attack,defense,heal,text:labels[trigger]+'で '+effects.join('・')+'。',futureType:null};}
skill24('michinaga','high',2,0,2);
skill24('murasaki','low',3);
skill24('seishonagon','low',3);
skill24('yorimichi','high',0,0,4);
skill24('kiyomori','high',2,0,2);
skill24('yoshitsune','six',4);
skill24('kanmu','high',0,3);
skill24('yoritomo','high',2,2);
skill24('masako','high',1,0,4);
skill24('tokimune','high',0,4);
skill24('yoshitoki','high',1,3);
skill24('khubilai','high',2,2);
skill24('yoshinaka','six',4);
skill24('goshirakawa','low',3);
skill24('benkei','high',0,2); // Legendary depiction explicitly labelled on the original card.
skill24('genghis','high',4);
skill24('suenaga','high',3);
skill24('godaigo','high',2,0,3);
skill24('yoshisada','six',4);
skill24('takauji','high',2,2);
skill24('masashige','low',0,4);
skill24('takauji_muromachi','high',2,2);
skill24('yoshimitsu','high',2,0,3);
skill24('yoshimasa','high',0,3,1);
skill24('tomiko','high',0,0,4);
skill24('sesshu','low',3);
skill24('zeami','high',2,0,3);
skill24('yoshiaki','high',0,3);
skill24('nobunaga_young','six',4);
skill24('mitsuhide_young','low',2,2);
function applySkill24(c,n){const s=CARD_SKILLS24[c.id];if(!s)return n;n.active=s.trigger==='high'?n.die>=4:s.trigger==='six'?n.die>=5:n.die<=3;if(n.active){n.skillAttack=s.attack;n.skillDefense=s.defense;n.skillHeal=s.heal;n.attack+=s.attack;n.heal+=s.heal;}return n;}

// v2.5: traits inspired by the cards; futureType stays reserved.
skill24('shotoku','low',0,2,2);
skill24('umako','high',1,2);
skill24('shotoku_ur','high',2,2,3);
skill24('emishi','high',0,3);
skill24('iruka','high',2,1);
skill24('gyoki','low',0,0,4);
skill24('ganjin','low',0,3,2);
skill24('dokyo','high',1,1,2);
skill24('daibutsu','high',0,4,1);
skill24('suiko','high',0,2,3);
skill24('imoko','six',3);
skill24('yangdi','high',2,2);
skill24('kamatari','low',2,1);
skill24('nakanooe','six',4);
skill24('tenji','high',1,3);
skill24('tenmu','high',2,2);
