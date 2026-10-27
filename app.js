import { removeBackground } from 'https://esm.sh/@imgly/background-removal@1.7.0';
import JSZip from 'https://esm.sh/jszip@3.10.1';
const $ = id => document.getElementById(id);
const camera=$('camera'),library=$('library'),process=$('process'),downloadAll=$('downloadAll'),status=$('status'),photos=$('photos'),results=$('results'),sigma=$('sigma');
let selected=[], outputs=[], busy=false;
sigma.addEventListener('input',()=>{$('strength').textContent=sigma.value;});
function setStatus(message){status.textContent=message;}
function choose(e){selected=Array.from(e.target.files||[]).filter(f=>f.type.startsWith('image/'));outputs=[];photos.replaceChildren();results.hidden=true;process.disabled=!selected.length;downloadAll.disabled=true;setStatus(`${selected.length} photo(s) selected. Tap Blur selected photos.`);}
camera.addEventListener('change',choose);library.addEventListener('change',choose);
function loadImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src;});}
async function blobToImage(blob){const url=URL.createObjectURL(blob);try{return await loadImage(url);}finally{URL.revokeObjectURL(url);}}
function canvasBlob(canvas){return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Could not encode JPEG')),'image/jpeg',0.93));}
async function blurPhoto(file, strength){
 const original=await blobToImage(file); const cutoutBlob=await removeBackground(file,{output:{format:'image/png',quality:1}});
 const cutout=await blobToImage(cutoutBlob);
 // Limit processing resolution for iPhone memory while retaining useful listing quality.
 const scale=Math.min(1,2400/Math.max(original.naturalWidth,original.naturalHeight));
 const w=Math.max(1,Math.round(original.naturalWidth*scale)),h=Math.max(1,Math.round(original.naturalHeight*scale));
 const source=document.createElement('canvas');source.width=w;source.height=h;const s=source.getContext('2d');s.drawImage(original,0,0,w,h);
 const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');
 ctx.filter=`blur(${Number(strength)}px)`;const pad=Math.ceil(Number(strength)*3);
 // Expand source past canvas edges to avoid dark/transparent blur borders.
 ctx.drawImage(source,-pad,-pad,w+2*pad,h+2*pad);ctx.filter='none';
 ctx.drawImage(cutout,0,0,w,h);
 return canvasBlob(canvas);
}
function safeName(file,i){const stem=file.name.replace(/\.[^.]+$/,'').replace(/[^a-z0-9_-]/gi,'_').slice(0,65)||`photo_${i+1}`;return `${String(i+1).padStart(2,'0')}_${stem}_blur.jpg`;}
function addResult(blob,name){const url=URL.createObjectURL(blob),wrap=document.createElement('div');wrap.className='photo';const img=document.createElement('img');img.src=url;img.alt='Edited vehicle photo';const line=document.createElement('div');line.className='line';const span=document.createElement('span');span.className='name';span.textContent=name;const button=document.createElement('button');button.textContent='Save / Share';button.addEventListener('click',async()=>{const f=new File([blob],name,{type:'image/jpeg'});if(navigator.canShare?.({files:[f]})){try{await navigator.share({files:[f],title:name});return;}catch(e){if(e.name==='AbortError')return;}}const a=document.createElement('a');a.href=url;a.download=name;a.click();});line.append(span,button);wrap.append(img,line);photos.append(wrap);results.hidden=false;}
process.addEventListener('click',async()=>{if(busy||!selected.length)return;busy=true;process.disabled=true;downloadAll.disabled=true;outputs=[];photos.replaceChildren();results.hidden=true;let failed=0;const strength=Number(sigma.value);
 for(let i=0;i<selected.length;i++){const file=selected[i];setStatus(`Processing ${i+1} of ${selected.length}: ${file.name}\nFirst run may download the AI model. Keep this page open.`);try{const blob=await blurPhoto(file,strength),name=safeName(file,i);outputs.push({blob,name});addResult(blob,name);}catch(e){failed++;setStatus(`Could not process ${file.name}: ${e.message}`);await new Promise(r=>setTimeout(r,400));}}
 busy=false;process.disabled=false;downloadAll.disabled=!outputs.length;setStatus(`Finished: ${outputs.length} successful, ${failed} failed. Review each image before using it.`);
});
downloadAll.addEventListener('click',async()=>{if(!outputs.length)return;downloadAll.disabled=true;setStatus('Creating ZIP file…');try{const zip=new JSZip();for(const x of outputs)zip.file(x.name,x.blob);const blob=await zip.generateAsync({type:'blob'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='motion-auto-blurred-photos.zip';a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);setStatus(`ZIP prepared with ${outputs.length} photos. On iPhone, open the downloaded ZIP in Files.`);}catch(e){setStatus(`ZIP error: ${e.message}`);}finally{downloadAll.disabled=false;}});
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
