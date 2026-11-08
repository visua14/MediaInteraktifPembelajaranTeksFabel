/* ====== PENGATURAN ====== */
// Tempel kode video YouTube di sini (contoh: "dQw4w9WgXcQ"). Kosongkan untuk menampilkan pesan petunjuk.
const VIDEO_ID = "DO133B2ICPs";

const PAGES = [
  ["home","🏠 Beranda"],["tujuan","🎯 Tujuan"],["materi","📚 Materi"],
  ["contoh","🐭 Contoh"],["video","🎬 Video"],["game","🎮 Game"],["kuis","✏️ Kuis"],["hasil","🏆 Hasil"]
];
const QUIZ = [
  {q:"Tokoh utama dalam teks fabel biasanya adalah ….",o:["Manusia","Hewan","Raja","Peri"],a:1,e:"Tokoh utama fabel adalah hewan yang berperilaku seperti manusia."},
  {q:"Bagian fabel yang berisi pengenalan tokoh, tempat, dan waktu disebut ….",o:["Komplikasi","Resolusi","Orientasi","Koda"],a:2,e:"Orientasi memperkenalkan tokoh, latar tempat, dan waktu."},
  {q:"Munculnya masalah atau konflik dalam fabel terdapat pada bagian ….",o:["Orientasi","Komplikasi","Resolusi","Koda"],a:1,e:"Konflik atau masalah muncul pada komplikasi."},
  {q:"Pesan moral yang ingin disampaikan penulis fabel disebut ….",o:["Latar","Alur","Amanat","Judul"],a:2,e:"Pesan moral dalam cerita disebut amanat."},
  {q:"Dalam fabel, watak Kancil digambarkan ….",o:["Serakah","Malas","Cerdik","Sombong"],a:2,e:"Kancil dikenal sebagai tokoh yang cerdik."},
  {q:"Kalimat yang memakai tanda petik untuk menirukan ucapan tokoh disebut kalimat ….",o:["Tidak langsung","Langsung","Tanya","Perintah"],a:1,e:"Kalimat langsung memakai tanda petik untuk ucapan tokoh."},
  {q:"Kata “akhirnya”, “kemudian”, dan “suatu hari” termasuk kata ….",o:["Sambung waktu","Benda","Seru","Bilangan"],a:0,e:"Kata-kata itu menunjukkan urutan waktu sehingga disebut kata sambung waktu."},
  {q:"Berikut ini yang merupakan ciri fabel adalah ….",o:["Berisi kejadian nyata","Tokoh hewan bisa berbicara","Tidak ada pesan moral","Ditulis dengan puisi"],a:1,e:"Hewan yang bisa berbicara seperti manusia adalah ciri utama fabel."}
];

/* ====== NAVIGASI ====== */
const $ = s => document.querySelector(s);
const nav = $("#nav");
PAGES.forEach(([id,label])=>{
  const b=document.createElement("button"); b.textContent=label; b.dataset.go=id; nav.appendChild(b);
});
const colors=["mint","sky","pink","coral","mint","sky"];
PAGES.slice(1,7).forEach(([id,label],i)=>{
  const b=document.createElement("button"); b.className="btn "+colors[i]; b.textContent=label; b.dataset.go=id;
  $("#menuHome").appendChild(b);
});
document.addEventListener("click",e=>{
  const t=e.target.closest("[data-go]"); if(t) go(t.dataset.go);
});
function go(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.toggle("on",p.id===id));
  nav.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.dataset.go===id));
  const on=nav.querySelector(".on"); if(on) on.scrollIntoView({inline:"center",block:"nearest"});
  $("#prog").style.width=(PAGES.findIndex(p=>p[0]===id)/(PAGES.length-1)*100)+"%";
  if(id==="video") renderVideo();
  if(id==="kuis" && !quiz.running) startQuiz();
  if(id==="hasil") renderResult();
  window.scrollTo({top:0});
}

/* ====== TAB MATERI ====== */
["Pengertian","Struktur","Unsur","Kebahasaan"].forEach((n,i)=>{
  const b=document.createElement("button"); b.className="btn "+["sky","mint","pink","coral"][i]; b.textContent=n;
  b.onclick=()=>{
    document.querySelectorAll(".tab").forEach((t,j)=>t.classList.toggle("on",i===j));
  };
  $("#tabs").appendChild(b);
});

/* ====== VIDEO ====== */
function renderVideo(){
  $("#videoBox").innerHTML = VIDEO_ID
    ? `<iframe src="https://www.youtube.com/embed/${VIDEO_ID}" title="Video pembelajaran teks fabel" allowfullscreen></iframe>`
    : `<div><span class="big-emoji">📺</span><b>Video belum dipasang.</b><br>Buka index.html, cari <code>VIDEO_ID</code>, lalu isi dengan kode video YouTube pilihanmu.</div>`;
}

/* ====== KUIS ====== */
let quiz={running:false,i:0,score:0,answers:[],done:false};
function startQuiz(){ quiz={running:true,i:0,score:0,answers:[],done:false}; renderQ(); }
function renderQ(){
  const d=QUIZ[quiz.i];
  $("#quizBox").innerHTML=`<div class="card s">
    <span class="pill">Soal ${quiz.i+1} dari ${QUIZ.length}</span>
    <h3>${d.q}</h3>
    <div class="opts">${d.o.map((t,k)=>`<button class="opt" data-k="${k}">${"ABCD"[k]}. ${t}</button>`).join("")}</div>
    <div class="fb" id="fb" aria-live="polite">Pilih jawabanmu, ya! 🤔</div>
    <button class="btn mint" id="next" disabled>${quiz.i===QUIZ.length-1?"Lihat Hasil 🏆":"Soal Berikutnya ➡"}</button>
  </div>`;
  document.querySelectorAll(".opt").forEach(b=>b.onclick=()=>answer(+b.dataset.k));
  $("#next").onclick=()=>{
    if(quiz.i<QUIZ.length-1){quiz.i++;renderQ();}
    else{quiz.done=true;quiz.running=false;go("hasil");}
  };
}
function answer(k){
  const d=QUIZ[quiz.i], ok=k===d.a;
  quiz.answers[quiz.i]=k; if(ok) quiz.score++;
  document.querySelectorAll(".opt").forEach((b,j)=>{
    b.disabled=true;
    if(j===d.a) b.classList.add("right");
    else if(j===k) b.classList.add("wrong");
  });
  $("#fb").innerHTML=(ok?"🎉 <b>Hebat, benar!</b> ":"😅 <b>Belum tepat.</b> ")+d.e;
  $("#next").disabled=false;
}

/* ====== HASIL ====== */
function renderResult(){
  const box=$("#resultBox");
  if(!quiz.done){
    box.innerHTML=`<div class="card y score"><span class="big-emoji">🐢</span><p style="margin:0 auto 1rem">Kamu belum mengerjakan kuis. Yuk, kerjakan dulu!</p><button class="btn coral" data-go="kuis">Kerjakan Kuis ✏️</button></div>`;
    return;
  }
  const n=Math.round(quiz.score/QUIZ.length*100);
  const [star,msg,cls]= n>=85?["⭐⭐⭐","Luar biasa! Kamu jagoan fabel! 🦁","m"]
                      : n>=60?["⭐⭐","Bagus! Sedikit lagi kamu mahir. 🦊","y"]
                      :       ["⭐","Jangan menyerah, baca materinya lagi lalu coba ulang. 🐢","c"];
  const wrong=QUIZ.map((d,i)=>({d,i})).filter(x=>quiz.answers[x.i]!==x.d.a);
  box.innerHTML=`<div class="card ${cls} score">
      <div class="stars" aria-hidden="true">${star}</div>
      <div class="num">${n}</div>
      <p style="margin:0 auto 1rem"><b>${quiz.score} benar dari ${QUIZ.length} soal.</b><br>${msg}</p>
    </div>
    <div class="card"><h3>${wrong.length?"Yuk, cek lagi soal ini":"Semua jawabanmu benar! 🎉"}</h3>
    ${wrong.map(({d,i})=>`<div class="rev"><b>Soal ${i+1}:</b> ${d.q}<br>Jawabanmu: ${"ABCD"[quiz.answers[i]]}. ${d.o[quiz.answers[i]]}<br>Jawaban benar: <b>${"ABCD"[d.a]}. ${d.o[d.a]}</b><br><i>${d.e}</i></div>`).join("")}</div>
    <div class="row"><button class="btn sky" data-go="materi">📚 Belajar Lagi</button><button class="btn coral" id="retry">🔁 Ulangi Kuis</button><button class="btn mint" data-go="home">🏠 Beranda</button></div>`;
  $("#retry").onclick=()=>{startQuiz();go("kuis");};
}
/* ====== GAME ====== */
const PAIRS=[["🐭 Kancil","Cerdik"],["🐊 Buaya","Serakah"],["🐢 Kura-kura","Sabar"],["🦁 Singa","Berkuasa"],["🐜 Semut","Rajin"],["🦚 Merak","Sombong"]];
const STORY=[
  ["Orientasi","Di tepi hutan, Semut yang rajin sedang mengumpulkan makanan untuk musim hujan."],
  ["Komplikasi","Belalang yang malas hanya bermain dan menertawakan Semut. Saat hujan turun, Belalang kelaparan."],
  ["Resolusi","Semut merasa kasihan, lalu berbagi makanan dengan Belalang."],
  ["Koda","Amanat: rajinlah bekerja dan jangan menunda pekerjaan."]];
const HINT=["Mulai dari pengenalan tokoh dan tempat.","Sekarang cari bagian munculnya masalah.","Sekarang cari bagian penyelesaian masalah.","Terakhir, cari bagian pesan moral."];
const shuffle=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]);

let m,s;
function startMatch(){
  m={sel:null,done:0,tries:0,ok:new Set(),order:shuffle(PAIRS.map((_,i)=>i))};
  drawMatch("Pilih satu hewan, lalu pilih wataknya. 🐾");
}
function drawMatch(msg){
  const fin=m.done===PAIRS.length;
  $("#gm0").innerHTML=`<h3>🐾 Cocokkan Hewan dan Watak</h3>
  <p>${fin?`🎉 <b>Hebat!</b> Semua pasangan cocok dalam ${m.tries} percobaan.`:msg}</p>
  <div class="mcols">
    <div>${PAIRS.map((p,i)=>`<button class="gcard ${m.ok.has(i)?"ok":m.sel===i?"sel":""}" data-side="L" data-i="${i}">${p[0]}</button>`).join("")}</div>
    <div>${m.order.map(i=>`<button class="gcard ${m.ok.has(i)?"ok":""}" data-side="R" data-i="${i}">${PAIRS[i][1]}</button>`).join("")}</div>
  </div>
  ${fin?`<div class="row"><button class="btn mint" id="again0">Main Lagi 🔁</button></div>`:""}`;
}
$("#gm0").addEventListener("click",e=>{
  if(e.target.id==="again0") return startMatch();
  const b=e.target.closest(".gcard"); if(!b||b.classList.contains("ok")) return;
  const i=+b.dataset.i;
  if(b.dataset.side==="L"){ m.sel=i; drawMatch("Sekarang pilih wataknya."); }
  else if(m.sel===null){ drawMatch("Pilih hewannya dulu, ya. 🐾"); }
  else{
    m.tries++;
    if(m.sel===i){ m.ok.add(i); m.done++; m.sel=null; drawMatch("Benar! 🎉 Lanjut, pilih hewan lain."); }
    else{ m.sel=null; drawMatch("Belum cocok, coba lagi ya. 🤔");
      const w=document.querySelector('#gm0 [data-side="R"][data-i="'+i+'"]'); if(w) w.classList.add("no"); }
  }
});

function startStory(){ s={n:0,order:shuffle(STORY.map((_,i)=>i))}; drawStory(HINT[0]); }
function drawStory(msg){
  const fin=s.n===STORY.length;
  $("#gm1").innerHTML=`<h3>🧩 Susun Cerita: Semut dan Belalang</h3>
  <p>${fin?"🎉 <b>Keren!</b> Ceritamu sudah tersusun benar: orientasi, komplikasi, resolusi, koda.":"Ketuk kalimat sesuai urutan struktur fabel. "+msg}</p>
  <ol class="steps">${STORY.slice(0,s.n).map(x=>`<li><span class="tag">${x[0]}</span><br>${x[1]}</li>`).join("")}</ol>
  <div class="opts">${s.order.filter(i=>i>=s.n).map(i=>`<button class="opt" data-i="${i}">${STORY[i][1]}</button>`).join("")}</div>
  ${fin?`<div class="row"><button class="btn mint" id="again1">Main Lagi 🔁</button></div>`:""}`;
}
$("#gm1").addEventListener("click",e=>{
  if(e.target.id==="again1") return startStory();
  const b=e.target.closest(".opt"); if(!b) return;
  if(+b.dataset.i===s.n){ s.n++; drawStory(HINT[s.n]||""); }
  else drawStory("Belum tepat. "+HINT[s.n]);
});
document.addEventListener("click",e=>{
  const t=e.target.closest("[data-g]"); if(!t) return;
  $("#gm0").hidden=t.dataset.g!=="0"; $("#gm1").hidden=t.dataset.g!=="1";
});
startMatch(); startStory();

/* ====== MUSIK LATAR ====== */
const bgm=$("#bgm"), sBtn=$("#sndBtn");
bgm.loop=true; bgm.volume=0.5;
let wantPlay=false;
function sndUI(on){
  sBtn.classList.toggle("on",on);
  sBtn.setAttribute("aria-pressed",on);
  sBtn.setAttribute("aria-label",on?"Matikan musik latar":"Nyalakan musik latar");
  $("#sndIco").textContent=on?"🔊":"🔇";
  $("#sndTxt").textContent=on?"Musik: Hidup":"Musik: Mati";
}
sBtn.onclick=()=>{
  if(wantPlay){ wantPlay=false; bgm.pause(); sndUI(false); }
  else{
    bgm.play().then(()=>{wantPlay=true;sndUI(true);})
      .catch(()=>{$("#sndTxt").textContent="Musik gagal diputar";});
  }
};
// jeda otomatis saat tab/aplikasi ditinggalkan, lanjut saat kembali
document.addEventListener("visibilitychange",()=>{
  if(document.hidden) bgm.pause();
  else if(wantPlay) bgm.play().catch(()=>{});
});

go("home");