'use strict';
const $=s=>document.querySelector(s),C=Sprint;
let mode='time',duration=30,wordCount=25,punctuation=false,numbers=false,custom='Build something useful, one small step at a time.';
let target='',typed='',attempts=0,mistakes=0,start=null,elapsed=0,finished=false,bests={};
try{const data=JSON.parse(localStorage.getItem('typesprint.best.v1')||'{}');for(const key of ['30','60'])if(Number.isFinite(data[key])&&data[key]>=0)bests[key]=data[key];}catch{}
const input=$('#input'),passage=$('#passage');
function reset(focus=false){
 start=null;elapsed=0;finished=false;typed='';attempts=mistakes=0;input.value='';input.disabled=false;
 target=mode==='zen'?'':mode==='custom'?custom:mode==='quote'?C.quotes[Math.floor(Math.random()*C.quotes.length)]:C.generate(mode==='words'?wordCount:1000,punctuation,numbers);
 $('#results').hidden=true;$('#typing-zone').hidden=false;$('#hint').hidden=false;$('#hint').textContent='Start typing to begin. Accuracy first, speed follows.';
 $('#finish').hidden=mode!=='zen';$('#finish').disabled=true;$('#state-label').textContent=mode==='zen'?'FREE WRITING':'ENGLISH / PRACTICE';
 $('#progress').style.width='0%';render();stats();if(focus)input.focus();
}
function controls(){
 document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
 const generated=mode==='time'||mode==='words';$('#toggles').hidden=!generated;$('#presets').replaceChildren();$('#mode-note').hidden=generated;
 $('#mode-note').textContent=mode==='zen'?'Write freely. Finish whenever you are ready.':mode==='custom'?'Your words, your practice.':'Complete an original practice passage.';
 $('#edit').hidden=mode!=='custom';
 $('#punctuation').setAttribute('aria-pressed',String(punctuation));$('#numbers').setAttribute('aria-pressed',String(numbers));
 if(generated)for(const value of mode==='time'?[15,30,60,120]:[10,25,50,100]){
 const b=document.createElement('button');b.textContent=value+(mode==='time'?'s':'');b.setAttribute('aria-pressed',String(value===(mode==='time'?duration:wordCount)));
 b.onclick=()=>{if(mode==='time')duration=value;else wordCount=value;controls();reset(true);};$('#presets').append(b);
 }
}
function render(){
 const display=mode==='zen'?typed+' ':target;const frag=document.createDocumentFragment();
 for(let i=0;i<display.length;i++){const span=document.createElement('span');span.textContent=display[i];if(i<typed.length)span.className=typed[i]===target[i]?'correct':'wrong';if(i===typed.length)span.classList.add('caret');frag.append(span);}
 passage.replaceChildren(frag);const caret=passage.querySelector('.caret');if(caret)$('#typing-zone').scrollTop=Math.max(0,caret.offsetTop-46);
}
function stats(){
 const m=C.metrics(target,typed,attempts,mistakes,elapsed);
 $('#clock').textContent=(mode==='time'?Math.max(0,Math.ceil(duration-elapsed)):Math.floor(elapsed))+'s';$('#live-wpm').textContent=Math.round(m.wpm)+' wpm';
 $('#progress').style.width=(mode==='time'?Math.min(100,elapsed/duration*100):mode==='zen'?0:typed.length/target.length*100)+'%';
 return m;
}
function tick(){if(start!==null&&!finished){elapsed=(performance.now()-start)/1000;if(mode==='time'&&elapsed>=duration){elapsed=duration;end();}else stats();}}
function end(){
 if(finished||start===null)return;finished=true;input.disabled=true;const m=stats();
 $('#typing-zone').hidden=true;$('#hint').hidden=true;$('#results').hidden=false;$('#finish').hidden=true;$('#state-label').textContent='NICE WORK / TAKE A BREATH';
 $('#result-wpm').textContent=m.wpm.toFixed(1);$('#accuracy').textContent=mode==='zen'?'—':m.accuracy.toFixed(1)+'%';$('#raw').textContent=m.raw.toFixed(1);
 $('#details').textContent=Math.round(elapsed)+' seconds · '+m.correct+' correct characters · '+mistakes+' mistyped keys';
 const eligible=mode==='time'&&[30,60].includes(duration)&&!punctuation&&!numbers;
 if(eligible){bests[duration]=Math.max(bests[duration]||0,m.wpm);try{localStorage.setItem('typesprint.best.v1',JSON.stringify(bests));}catch{$('#notice').textContent='Browser storage is unavailable. Your score is shown but may not be saved.';}}
 $('#best').textContent=eligible?'Personal best · '+bests[duration].toFixed(1)+' wpm':mode==='zen'?'Free writing measures speed; accuracy is not scored.':'Practice mode · Personal best is not recorded.';
 $('#restart').focus();
}
input.addEventListener('paste',e=>e.preventDefault());input.addEventListener('drop',e=>e.preventDefault());
input.addEventListener('beforeinput',e=>{if(e.inputType.startsWith('insert')&&(e.inputType!=='insertText'||(e.data&&/[^\x20-\x7e]/.test(e.data))))e.preventDefault();});
input.addEventListener('input',()=>{
 tick();if(finished)return;
 let next=input.value;if(/[^\x20-\x7e]/.test(next)){input.value=typed;return;}
 if(next.length<typed.length){typed=typed.slice(0,next.length);input.value=typed;if(mode==='zen')target=typed;render();stats();return;}
 if(!next.startsWith(typed)){input.value=typed;return;}
 const extra=next.slice(typed.length);if(!extra)return;
 if(start===null)start=performance.now();
 for(const c of extra){if(mode==='zen')target+=c;attempts++;if(c!==target[typed.length])mistakes++;typed+=c;if(mode!=='zen'&&typed.length>=target.length)break;}
 input.value=typed;elapsed=(performance.now()-start)/1000;$('#finish').disabled=false;$('#hint').textContent='Keep going. Backspace fixes text; accuracy remembers mistakes.';render();stats();
 if((mode!=='zen'&&typed.length>=target.length)||typed.length>=20000)end();
});
input.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))e.preventDefault();});
input.addEventListener('select',()=>{if(input.selectionStart!==input.value.length||input.selectionEnd!==input.value.length)input.setSelectionRange(input.value.length,input.value.length);});
$('#modes').onclick=e=>{const b=e.target.closest('[data-mode]');if(!b)return;mode=b.dataset.mode;controls();reset(true);};
$('#punctuation').onclick=()=>{punctuation=!punctuation;controls();reset(true);};
$('#numbers').onclick=()=>{numbers=!numbers;controls();reset(true);};
$('#restart').onclick=()=>reset(true);$('#finish').onclick=()=>{tick();end();};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#custom-dialog').open){e.preventDefault();reset(true);}});
$('#edit').onclick=()=>{reset();$('#custom-text').value=custom;$('#custom-error').textContent='';count();$('#custom-dialog').showModal();$('#custom-text').focus();};
function count(){$('#count').textContent=$('#custom-text').value.length.toLocaleString()+' / 4,000';}
$('#custom-text').oninput=()=>{count();$('#custom-error').textContent='';};
for(const id of ['close','cancel'])$('#'+id).onclick=()=>$('#custom-dialog').close();
$('#custom-form').onsubmit=e=>{e.preventDefault();try{custom=C.normalize($('#custom-text').value);$('#custom-dialog').close();reset(true);}catch(err){$('#custom-error').textContent=err.message;}};
document.addEventListener('visibilitychange',tick);setInterval(tick,100);controls();reset();

