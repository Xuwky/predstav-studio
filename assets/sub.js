// Shared behaviour for blog and case pages: language, theme, nav, progress, reveal.
(function(){
  const ls = {
    get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } },
    set(k, v){ try { localStorage.setItem(k, v); } catch(e){} }
  };
  const root = document.documentElement;
  root.dataset.theme = ls.get('theme') || 'dark';
  let lang = ls.get('lang') || (navigator.language.startsWith('ru') ? 'ru' : 'en');

  function setLang(l){
    lang = l; root.lang = l; ls.set('lang', l);
    const sw = document.getElementById('lang');
    sw.classList.toggle('en', l === 'en');
    sw.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.set === l));
    const t = document.querySelector('meta[name="title-' + l + '"]');
    if (t) document.title = t.content;
  }
  setLang(lang);
  document.querySelectorAll('#lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.set)));

  document.getElementById('theme').addEventListener('click', () => {
    const t = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = t; ls.set('theme', t);
  });

  const nav = document.querySelector('nav'), bar = document.querySelector('.progress');
  function onScroll(){
    const max = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle('solid', scrollY > 30);
    bar.style.transform = 'scaleX(' + (max > 0 ? scrollY / max : 0) + ')';
  }
  addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold:.1 });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));
})();
