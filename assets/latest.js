/* City Talks — Το τελευταίο άρθρο ως κάρτα-περιεχόμενο μετά το hero (πάντα ορατή· «Νέο» + chips μόνο όταν ≤freshDays). Data από data/articles.json */
(function(){
  function ready(fn){document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn);}
  function fitHero(){
    var h=document.querySelector('.hero-bub'); if(!h) return;
    if(window.innerWidth<=900){ h.style.minHeight=''; return; }
    h.style.minHeight='0px';
    var absTop=h.getBoundingClientRect().top+window.scrollY;
    h.style.minHeight=Math.max(520,(window.innerHeight-absTop))+'px';
  }
  ready(function(){
    fitHero(); window.addEventListener('resize',fitHero);
    fetch('data/articles.json').then(function(r){return r.json();}).then(function(cfg){
      var arts=(cfg.articles||[]).slice().sort(function(a,b){return new Date(b.date)-new Date(a.date);});
      if(!arts.length) return;
      var latest=arts[0];
      var ageDays=(Date.now()-new Date(latest.date+'T00:00:00'))/864e5;
      var fresh=(ageDays>=0 && ageDays<=(cfg.freshDays||21));   // «Νέο» μόνο αν όντως πρόσφατο

      /* — «ΝΕΟ» chip στις κάρτες που ταιριάζουν στον τίτλο (μόνο όταν είναι φρέσκο) — */
      if(fresh){
        var norm=function(s){return (s||'').toLowerCase().replace(/\s+/g,' ').trim();};
        var key=norm(latest.matchText||latest.title);
        document.querySelectorAll('main a, main h3, main h4').forEach(function(el){
          if(el.querySelector('img'))return;
          if(norm(el.textContent).indexOf(key)!==0)return;
          if(el.querySelector('.new-chip'))return;
          var inner=el.querySelector('a,h3,h4');            // προτίμησε το βαθύτερο στοιχείο-τίτλο
          if(inner&&norm(inner.textContent).indexOf(key)===0)return;
          var c=document.createElement('span'); c.className='new-chip'; c.textContent='Νεο';
          var blk=el.firstElementChild;                      // βάλε το chip δίπλα στον τίτλο, πριν από meta blocks
          if(blk){ el.insertBefore(c,blk); el.insertBefore(document.createTextNode(' '),c); }
          else { el.appendChild(document.createTextNode(' ')); el.appendChild(c); }
        });
      }

      /* — Το τελευταίο άρθρο ως ΠΕΡΙΕΧΟΜΕΝΟ: κάρτα με κουμπί «Διάβασέ το», πάντα ορατή, αμέσως μετά το hero — */
      var hero=document.querySelector('.hero'); if(!hero) return;
      if(document.querySelector('.new-lead')) return;                 // μην μπει 2 φορές
      var img=latest.image||'public/featured/poleodomia.jpg';
      var kick=fresh
        ? '<span class="nl-dot" aria-hidden="true"></span> Νέο άρθρο · '+latest.category
        : 'Τελευταίο άρθρο · '+latest.category;
      var sec=document.createElement('section');
      sec.className='new-lead'; sec.setAttribute('aria-label',fresh?'Νέο άρθρο':'Τελευταίο άρθρο');
      sec.innerHTML='<div class="wrap"><a class="ncard" href="'+latest.url+'">'
        +'<figure class="ncard-fig"><img src="'+img+'" alt="'+latest.title+'" loading="lazy"/></figure>'
        +'<div class="ncard-body">'
          +'<span class="kicker ncard-kick">'+kick+'</span>'
          +'<h2 class="ncard-title">'+latest.title+'</h2>'
          +(latest.excerpt?'<p class="ncard-ex">'+latest.excerpt+'</p>':'')
          +'<div class="ncard-foot"><span class="ncard-auth">'+latest.author+'</span>'
          +'<span class="btn btn--accent ncard-btn">Διάβασέ το <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></div>'
        +'</div></a></div>';
      hero.insertAdjacentElement('afterend',sec);
    }).catch(function(){});
  });
})();
