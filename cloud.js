/* Sincronización con cuenta de Google (Firebase Auth + Firestore). Solo se activa si hay configuración. */
(function () {
  const cfg = window.INTERVALO_FIREBASE, V = '10.12.2', B = 'https://www.gstatic.com/firebasejs/' + V + '/';
  const C = window.Cloud = { enabled: !!cfg, user: null, state: 'off', last: 0, onchange() {} };
  if (!cfg) return;
  let auth, db, fb, timer = 0, busy = false;
  const set = (s) => { C.state = s; C.onchange(); };
  async function load() {
    if (fb) return fb;
    const [a, au, fs] = await Promise.all([import(B + 'firebase-app.js'), import(B + 'firebase-auth.js'), import(B + 'firebase-firestore.js')]);
    const app = a.initializeApp(cfg); auth = au.getAuth(app); db = fs.getFirestore(app);
    fb = { au, fs }; return fb;
  }
  const ref = () => fb.fs.doc(db, 'users', C.user.uid);
  async function sync() {
    if (!C.user || busy || !navigator.onLine) return; busy = true; set('sync');
    try {
      const snap = await fb.fs.getDoc(ref());
      if (snap.exists() && snap.data().json) window.IntervaloApp.merge(snap.data().json);
      await fb.fs.setDoc(ref(), { json: window.IntervaloApp.dump(), updated: Date.now() });
      C.last = Date.now(); set('ok');
    } catch (e) { set(e && e.code === 'permission-denied' ? 'denied' : 'err'); }
    busy = false;
  }
  C.push = () => { if (!C.user) return; clearTimeout(timer); timer = setTimeout(sync, 4000); };
  C.sync = sync;
  C.signIn = async () => {
    try {
      await load(); set('sync');
      const p = new fb.au.GoogleAuthProvider();
      try { await fb.au.signInWithPopup(auth, p); } catch (e) { if (e && /popup|cancel/.test(e.code || '') && !/closed-by-user|cancelled/.test(e.code)) await fb.au.signInWithRedirect(auth, p); else throw e; }
    } catch (e) { set('err'); }
  };
  C.signOut = async () => { if (auth) await fb.au.signOut(auth); };
  (async () => {
    try {
      await load();
      fb.au.onAuthStateChanged(auth, u => { C.user = u ? { uid: u.uid, email: u.email, name: u.displayName } : null; if (u) sync(); else set('off'); });
    } catch { set('err'); }
  })();
  window.addEventListener('online', () => C.user && sync());
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && C.user) sync(); });
})();
