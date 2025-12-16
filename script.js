// Kleine Interaktionen: Menü, Formular-Feedback, Datum
document.addEventListener('DOMContentLoaded', function(){
  // Jahr im Footer
  const year = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = year;

  // Mobile Navigation Toggle
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  if(navToggle && navList){
    navToggle.addEventListener('click', function(){
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      if(expanded){
        navList.hidden = true;
      } else {
        navList.hidden = false;
      }
    });
  }

  // Leichte 'Wink'-Animation der SVG beim Laden
  const logoImg = document.querySelector('.logo-img');
  if(logoImg){
    logoImg.classList.add('wave');
    setTimeout(()=> logoImg.classList.remove('wave'), 1200);
  }
});

// Formular: keine echte Übertragung, nur Bestätigung
function submitForm(e){
  e.preventDefault();
  const name = document.getElementById('name').value.trim() || 'Freund';
  alert(`Danke, ${name}! Maxi LingLing hat deine Nachricht erhalten ❤️`);
  e.target.reset?.();
}
