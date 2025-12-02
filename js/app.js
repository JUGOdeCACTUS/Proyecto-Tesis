// Simple client-side login + UI rendering for the mockup (admin/admin)
(function(){
  // --- Auth helpers ---
  function isAuthenticated(){
    return sessionStorage.getItem('pms_auth') === '1';
  }
  function requireAuth(){
    if(!isAuthenticated() && !location.pathname.endsWith('login.html')){
      location.href = 'login.html';
    }
  }
  function logout(){
    sessionStorage.removeItem('pms_auth');
    location.href = 'login.html';
  }

  // Attach to window for forms
  window.onLogin = function(ev){
    ev.preventDefault();
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value.trim();
    if(u==='admin' && p==='admin'){
      sessionStorage.setItem('pms_auth','1');
      location.href = 'dashboard.html';
    } else {
      alert('Credenciales incorrectas. Usa admin / admin para demo.');
    }
    return false;
  }

  // If on dashboard, require auth then render calendar
  if(location.pathname.endsWith('dashboard.html')){
    requireAuth();
    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn) logoutBtn.addEventListener('click', logout);
    renderTimeline();
  }

  // If on index/login page, nothing else
  if(location.pathname.endsWith('/index.html') || location.pathname.endsWith('/')){
    // noop
  }

  // --- Data (sample) ---
  const rooms = [
    { id: 'r1', name:'Habitación 101 - Matrimonial', price:59 },
    { id: 'r2', name:'Habitación 102 - Doble', price:79 },
    { id: 'r3', name:'Habitación 103 - Suite', price:129 },
    { id: 'r4', name:'Habitación 201 - Matrimonial', price:59 },
    { id: 'r5', name:'Habitación 202 - Doble', price:69 },
    { id: 'r6', name:'Habitación 203 - Suite', price:149 },
    { id: 'r7', name:'Hab. 301 - Individual', price:45 },
    { id: 'r8', name:'Hab. 302 - Matrimonial', price:59 },
    { id: 'r9', name:'Hab. 303 - Familiar', price:159 },
    { id: 'r10', name:'Hab. 304 - Doble', price:69 },
    { id: 'r11', name:'Hab. 401 - Suite Premium', price:199 },
    { id: 'r12', name:'Hab. 402 - Doble', price:79 },
    { id: 'r13', name:'Hab. 403 - Matrimonial', price:59 },
    { id: 'r14', name:'Hab. 404 - Individual', price:45 }
  ];

  // sample reservations: roomId, start (1-30), days, guest, channel, status
  const reservations = [
    {id:'res1',room:'r1',start:3,days:4,guest:'Sharon',channel:'Airbnb',status:'confirmed'},
    {id:'res2',room:'r2',start:2,days:6,guest:'Abril',channel:'Booking',status:'confirmed'},
    {id:'res3',room:'r3',start:5,days:3,guest:'Christoph',channel:'Airbnb',status:'confirmed'},
    {id:'res4',room:'r3',start:10,days:2,guest:'Nolan',channel:'Expedia',status:'pending'},
    {id:'res5',room:'r4',start:2,days:2,guest:'Jad',channel:'Directo',status:'confirmed'},
    {id:'res6',room:'r4',start:5,days:3,guest:'Bill',channel:'Booking',status:'confirmed'},
    {id:'res7',room:'r5',start:3,days:4,guest:'Michael',channel:'Airbnb',status:'confirmed'},
    {id:'res8',room:'r7',start:2,days:3,guest:'Sam',channel:'Expedia',status:'pending'},
    {id:'res9',room:'r8',start:2,days:4,guest:'Abril',channel:'Booking',status:'confirmed'},
    {id:'res10',room:'r9',start:5,days:4,guest:'Christoph',channel:'Airbnb',status:'confirmed'},
    {id:'res11',room:'r9',start:10,days:2,guest:'Nolan',channel:'Expedia',status:'pending'},
    {id:'res12',room:'r11',start:3,days:3,guest:'Dinh Khoi',channel:'Directo',status:'confirmed'},
    {id:'res13',room:'r12',start:2,days:4,guest:'Abril',channel:'Booking',status:'confirmed'},
    {id:'res14',room:'r13',start:5,days:4,guest:'Mason',channel:'Airbnb',status:'confirmed'},
    {id:'res15',room:'r14',start:2,days:2,guest:'Jad',channel:'Booking',status:'confirmed'},
    {id:'res16',room:'r14',start:5,days:3,guest:'Bill',channel:'Booking',status:'confirmed'}
  ];

  // --- Render functions ---
  function renderTimeline(){
    const header = document.getElementById('timelineHeader');
    const wrapper = document.getElementById('timelineWrapper');
    const grid = document.getElementById('timelineGrid');

    // build header: left (rooms label) + days
    header.innerHTML = '';
    const leftLabel = document.createElement('div');
    leftLabel.style.width='240px';
    leftLabel.style.padding='8px 14px';
    leftLabel.innerHTML = '<strong>Habitaciones</strong>';
    header.appendChild(leftLabel);

    const dates = document.createElement('div');
    dates.className='dates';
    for(let d=1; d<=30; d++){
      const dc = document.createElement('div');
      dc.className='day-cell'+(d===new Date().getDate()? ' today':'');
      dc.innerHTML = '<span class="day">'+d+'</span><span class="num muted">'+ ['Dom','Lun','Mar','Mie','Jue','Vie','Sab'][(d%7)] +'</span>';
      dates.appendChild(dc);
    }
    header.appendChild(dates);

    // build grid: first column rooms, then day cells for each room
    grid.innerHTML = '';
    rooms.forEach((r, idx)=>{
      // room cell
      const roomCell = document.createElement('div');
      roomCell.className='room-cell';
      roomCell.innerHTML = '<div class="room-name">'+r.name+'</div><div class="price">$'+r.price+'</div>';
      grid.appendChild(roomCell);
      // day cells
      for(let d=1; d<=30; d++){
        const daybg = document.createElement('div');
        daybg.className='day-bg';
        daybg.dataset.room = r.id;
        daybg.dataset.day = d;
        grid.appendChild(daybg);
      }
    });

    // place reservation bars (absolute inside wrapper)
    // compute left offset of grid container relative to wrapper
    const gridRect = grid.getBoundingClientRect();
    // We'll use CSS grid placement: determine row and column index in the grid
    reservations.forEach(res=>{
      // find room index
      const roomIndex = rooms.findIndex(rr=>rr.id===res.room);
      if(roomIndex<0) return;
      // create bar element
      const bar = document.createElement('div');
      bar.className = 'res-bar ' + (res.status==='confirmed' ? 'res-blue':'res-orange');
      bar.innerHTML = '<div class="res-title">'+escapeHtml(res.guest)+'</div><div class="res-meta">'+res.channel+'</div>';
      bar.dataset.id = res.id;
      // compute style using grid: we will append into grid and set grid-row/grid-column
      // grid has structure: columns = 1 (rooms) + 30 days
      const row = roomIndex + 1;
      const colStart = res.start + 1; // because first column is rooms
      const colEnd = colStart + res.days;
      // position using CSS grid placement on a wrapper element overlay
      bar.style.gridRow = String(row);
      bar.style.gridColumn = `${colStart} / ${colEnd}`;
      // add click to open modal
      bar.addEventListener('click', ()=> openModal(res));
      grid.appendChild(bar);
    });

    // apply overlay grid layout for bars: create element that spans same grid
    // For better z-order, wrap bars container absolute
    // Make bars behave via CSS by setting .timeline-grid > .res-bar { align-self:center; height:44px }
  }

  // modal helpers
  window.openModal = function(res){
    const modal = document.getElementById('modal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    title.textContent = 'Reserva — ' + res.guest;
    body.innerHTML = '<p><strong>Habitación:</strong> '+ rooms.find(r=>r.id===res.room).name +'</p>' +
                     '<p><strong>Check-in:</strong> Día ' + res.start + '</p>' +
                     '<p><strong>Noches:</strong> ' + res.days + '</p>' +
                     '<p><strong>Canal:</strong> ' + res.channel + '</p>' +
                     '<p><strong>Estado:</strong> ' + res.status + '</p>';
    modal.classList.remove('hidden');
  }
  window.closeModal = function(){ document.getElementById('modal').classList.add('hidden'); }

  // small helper
  function escapeHtml(s){ return (s+'').replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

  // expose logout globally
  window.logout = logout;

})();