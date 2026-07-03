/* City Talks — "Νέο άρθρο" banner + badges (static, data-driven from data/articles.json) */
(function(){
  function ready(fn){document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn);}
  ready(function(){
    fetch('data/articles.json').then(function(r){return r.json();}).then(function(cfg){
      var arts=(cfg.articles||[]).slice().sort(function(a,b){return new Date(b.date)-new Date(a.date);});
      if(!arts.length) return;
      var latest=arts[0];
      var ageDays=(Date.now()-new Date(latest.date+'T00:00:00'))/864e5;
      if(ageDays<0||ageDays>(cfg.freshDays||21)) return;      // τίποτα φρέσκο → σιωπή

      /* — «ΝΕΟ» chip στις κάρτες που ταιριάζουν στον τίτλο — */
      var norm=function(s){return (s||'').toLowerCase().replace(/\s+/g,' ').trim();};
      var key=norm(latest.matchText||latest.title);
      document.querySelectorAll('main a, main h3, main h4').forEach(function(el){
        if(el.querySelector('img'))return;
        if(norm(el.textContent).indexOf(key)!==0)return;
        if(el.querySelector('.new-chip')||el.closest('.latest-banner'))return;
        var inner=el.querySelector('a,h3,h4');            // προτίμησε το βαθύτερο στοιχείο-τίτλο
        if(inner&&norm(inner.textContent).indexOf(key)===0)return;
        var c=document.createElement('span'); c.className='new-chip'; c.textContent='Νεο';
        var blk=el.firstElementChild;                      // βάλε το chip δίπλα στον τίτλο, πριν από meta blocks
        if(blk){ el.insertBefore(c,blk); el.insertBefore(document.createTextNode(' '),c); }
        else { el.appendChild(document.createTextNode(' ')); el.appendChild(c); }
      });

      /* — banner κάτω από το sticky nav (αν δεν έχει κλείσει για αυτό το slug) — */
      try{ if(localStorage.getItem('ct_seen_'+latest.slug)==='1') return; }catch(e){}
      var nav=document.querySelector('.mainnav'); if(!nav) return;
      var b=document.createElement('div');
      b.className='latest-banner'; b.setAttribute('role','region'); b.setAttribute('aria-label','Νέο άρθρο');
      b.innerHTML='<div class="wrap lb-in">'
        +'<span class="lb-dot" aria-hidden="true"></span>'
        +'<span class="lb-k">Νέο άρθρο · '+latest.category+'</span>'
        +'<a class="lb-t" href="'+latest.url+'">'+latest.title+'</a>'
        +'<span class="lb-a">'+latest.author+'</span>'
        +'<a class="lb-go" href="'+latest.url+'">Διάβασέ το <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>'
        +'<button class="lb-x" aria-label="Κλείσιμο ειδοποίησης">&times;</button>'
        +'</div>';
      nav.insertAdjacentElement('afterend',b);
      b.querySelector('.lb-x').addEventListener('click',function(){
        try{localStorage.setItem('ct_seen_'+latest.slug,'1');}catch(e){}
        b.style.height=b.offsetHeight+'px'; requestAnimationFrame(function(){ b.classList.add('lb-out'); });
        setTimeout(function(){b.remove();},350);
      });
    }).catch(function(){});
  });
})();
