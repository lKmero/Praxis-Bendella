
// Header scroll
const header = document.getElementById('header');
if(header) window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>30),{passive:true});

// Hamburger
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
if(hamburger&&mobileNav){
  hamburger.addEventListener('click',()=>{
    const open = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open',open);
    hamburger.setAttribute('aria-expanded',open);
    document.body.style.overflow = open?'hidden':'';
  });
  mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded','false');
    document.body.style.overflow='';
  }));
}

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const expanded = btn.getAttribute('aria-expanded')==='true';
    document.querySelectorAll('.faq-question').forEach(b=>{
      b.setAttribute('aria-expanded','false');
      b.nextElementSibling.classList.remove('open');
    });
    if(!expanded){ btn.setAttribute('aria-expanded','true'); btn.nextElementSibling.classList.add('open'); }
  });
});

// Accordion (Über mich)
document.querySelectorAll('.accordion-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const expanded = btn.getAttribute('aria-expanded')==='true';
    btn.setAttribute('aria-expanded', expanded?'false':'true');
    btn.nextElementSibling.classList.toggle('open',!expanded);
  });
});

// Leistungen Tabs
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const target = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById('tab-'+target);
    if(panel) panel.classList.add('active');
  });
});

// Scroll reveal
const ro = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
},{threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));

// Calendar (Termin)
(function(){
  const daysEl = document.getElementById('cal-days');
  const monthEl = document.getElementById('cal-month');
  const prevBtn = document.getElementById('cal-prev');
  const nextBtn = document.getElementById('cal-next');
  if(!daysEl) return;
  let cur = new Date(); cur.setDate(1);
  const months=['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
  function render(){
    const y=cur.getFullYear(), m=cur.getMonth();
    monthEl.textContent=months[m]+' '+y;
    const first=new Date(y,m,1).getDay();
    const days=new Date(y,m+1,0).getDate();
    const today=new Date();
    daysEl.innerHTML='';
    const offset=(first+6)%7;
    for(let i=0;i<offset;i++){const d=document.createElement('div');d.className='cal-day empty';daysEl.appendChild(d);}
    for(let d=1;d<=days;d++){
      const el=document.createElement('button');
      el.className='cal-day';el.textContent=d;
      const date=new Date(y,m,d);
      const dow=date.getDay();
      if(date<today&&!(date.toDateString()===today.toDateString())) el.classList.add('past');
      if(dow===0||dow===6) el.classList.add('weekend');
      if(date.toDateString()===today.toDateString()) el.classList.add('today');
      if(!el.classList.contains('past')&&!el.classList.contains('weekend')){
        el.addEventListener('click',()=>{
          daysEl.querySelectorAll('.cal-day').forEach(x=>x.classList.remove('selected'));
          el.classList.add('selected');
          const slots=document.querySelector('.time-slots');
          if(slots) slots.style.display='block';
        });
      }
      daysEl.appendChild(el);
    }
  }
  prevBtn.addEventListener('click',()=>{cur.setMonth(cur.getMonth()-1);render();});
  nextBtn.addEventListener('click',()=>{cur.setMonth(cur.getMonth()+1);render();});
  document.querySelectorAll('.slot').forEach(s=>s.addEventListener('click',()=>{
    document.querySelectorAll('.slot').forEach(x=>x.classList.remove('selected'));
    s.classList.add('selected');
    const info=document.querySelector('.form-selection-info');
    if(info){info.textContent='Gewählter Termin: '+s.dataset.time;info.classList.add('visible');}
  }));
  render();
})();

// Kontakt / Termin Formular
document.querySelectorAll('form[data-form]').forEach(form=>{
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    let valid=true;
    form.querySelectorAll('[required]').forEach(field=>{
      const g=field.closest('.form-group');
      if(!field.value.trim()){if(g)g.classList.add('has-error');valid=false;}
      else{if(g)g.classList.remove('has-error');}
    });
    if(!valid) return;
    const btn=form.querySelector('.form-submit');
    btn.disabled=true;btn.textContent='Wird gesendet…';
    try{
      const res=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
      if(res.ok){
        form.style.display='none';
        const s=form.closest('.booking-form-box')||form.closest('.kontakt-form');
        const ss=s&&s.querySelector('.success-state');
        if(ss)ss.classList.add('visible');
      } else { btn.disabled=false;btn.textContent='Erneut versuchen'; }
    } catch(err){ btn.disabled=false;btn.textContent='Erneut versuchen'; }
  });
});

// Selbstzahler sub-options
const ktCbs = document.querySelectorAll('input[name="kostentraeger"]');
const selfBox = document.getElementById('selbstzahler-optionen');
if(ktCbs.length&&selfBox){
  function toggleSelf(){
    const checked=[...ktCbs].filter(c=>c.checked).map(c=>c.value);
    selfBox.style.display=checked.includes('selbstzahler')?'block':'none';
  }
  ktCbs.forEach(c=>c.addEventListener('change',toggleSelf));
  toggleSelf();
}

lucide.createIcons();
