import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, Camera, Heart, Leaf, Lightbulb, Menu, Recycle, Search, Sparkles, X, Trash2, BookOpen, Upload, Image as ImageIcon, Trophy, Users, Medal, LogIn, LogOut, UserRound } from 'lucide-react';
import { projects, wasteMaterials } from './data.js';
import { supabase, configured } from './supabase.js';

function compressPhoto(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) { reject(new Error('Please select an image file.')); return; }
    if (file.size > 12 * 1024 * 1024) { reject(new Error('Choose an image smaller than 12 MB.')); return; }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read your image.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('This image could not be opened.'));
      img.onload = () => {
        const scale = Math.min(1, 900 / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.66));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function App() {
  const [selected, setSelected] = useState([]);
  const [query, setQuery] = useState('');
  const [view, setView] = useState('all');
  const [activeProject, setActiveProject] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [authBusy, setAuthBusy] = useState(false);
  const [completions, setCompletions] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [dataError, setDataError] = useState('');
  const [saving, setSaving] = useState(false);
  const user = session?.user;
  const activeProfile = { id: user?.id || '', name: user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Guest', emoji: '🌱' };
  const currentCompletions = completions;
  const myPosition = rankings.findIndex(item => item.id === user?.id) + 1;

  useEffect(() => {
    if (!configured) { setAuthLoading(false); return; }
    let alive = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (alive) { setSession(data?.session || null); setAuthLoading(false); if (error) setDataError(error.message); }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (alive) { setSession(newSession); setAuthLoading(false); }
    });
    return () => { alive = false; subscription.unsubscribe(); };
  }, []);

  async function refreshData() {
    if (!user || !configured) return;
    const [{ data: entries, error: entriesError }, { data: board, error: boardError }] = await Promise.all([
      supabase.from('completions').select('id, project_id, count, notes, photo_path, created_at').order('created_at', { ascending: false }),
      supabase.rpc('ecocraft_leaderboard')
    ]);
    if (entriesError || boardError) { setDataError((entriesError || boardError).message); return; }
    const withPhotos = await Promise.all((entries || []).map(async e => {
      let imageUrl = '';
      if (e.photo_path) {
        const { data } = await supabase.storage.from('project-photos').createSignedUrl(e.photo_path, 3600);
        imageUrl = data?.signedUrl || '';
      }
      return { id: e.id, projectId: e.project_id, count: e.count, notes: e.notes, photo: imageUrl, photoPath: e.photo_path, date: e.created_at };
    }));
    setCompletions(withPhotos);
    setRankings((board || []).map(e => ({ id: e.user_id, name: e.display_name, emoji: '🌱', items: Number(e.items_reused) || 0, projects: Number(e.projects_completed) || 0 })));
    setDataError('');
  }
  useEffect(() => {
    if (!user) { setCompletions([]); setRankings([]); return; }
    refreshData();
  }, [user?.id]);

  async function submitAuth(event) {
    event.preventDefault();
    if (!configured) { setAuthMessage('Set your Supabase project URL and publishable key in .env first.'); return; }
    if (authMode === 'signup' && (authName.trim().length < 2 || authName.trim().length > 40)) { setAuthMessage('Enter a display name between 2 and 40 characters.'); return; }
    setAuthBusy(true); setAuthMessage('');
    const email = authEmail.trim().toLowerCase();
    const result = authMode === 'signup'
      ? await supabase.auth.signUp({ email, password: authPassword, options: { data: { display_name: authName.trim() } } })
      : await supabase.auth.signInWithPassword({ email, password: authPassword });
    setAuthBusy(false);
    if (result.error) { setAuthMessage(result.error.message); return; }
    if (authMode === 'signup' && !result.data.session) {
      setAuthMessage('Account created! Check your email to confirm your address, then log in.');
      setAuthMode('login'); setAuthPassword(''); return;
    }
    setAuthOpen(false); setAuthPassword(''); setAuthMessage('');
  }
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) setDataError(error.message);
  }
  function requireLogin() { setAuthMode('login'); setAuthMessage('Sign in to save projects to your personal journal.'); setAuthOpen(true); }
  function jumpToLeaderboard() { document.getElementById('leaderboard')?.scrollIntoView({behavior:'smooth'}); setMenuOpen(false); }
  const [count, setCount] = useState(1);
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState('');
  const [formError, setFormError] = useState('');

  const [saveSuccess, setSaveSuccess] = useState(false);
  const totalItems = currentCompletions.reduce((sum, entry) => sum + (Number(entry.count) || 0), 0);

  function openProject(project) {
    setActiveProject(project); setCount(1); setNotes(''); setPhoto(''); setFormError(''); setSaveSuccess(false);
  }
  async function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setFormError('');
    try { setPhoto(await compressPhoto(file)); }
    catch (error) { setFormError(error.message); }
    event.target.value = '';
  }
  async function saveCompletion(event) {
    event.preventDefault();
    if (!user) { requireLogin(); return; }
    const amount = Number(count);
    if (!Number.isInteger(amount) || amount < 1 || amount > 100) { setFormError('Enter a number of items between 1 and 100.'); return; }
    setSaving(true); setFormError('');
    let photoPath = null;
    if (photo) {
      try {
        const blob = await (await fetch(photo)).blob();
        photoPath = `${user.id}/${crypto.randomUUID()}.jpg`;
        const { error } = await supabase.storage.from('project-photos').upload(photoPath, blob, { contentType: 'image/jpeg' });
        if (error) throw error;
      } catch (error) { setFormError(`Photo upload failed: ${error.message}`); setSaving(false); return; }
    }
    const { error } = await supabase.from('completions').insert({ user_id: user.id, project_id: activeProject.id, count: amount, notes: notes.trim().slice(0, 300), photo_path: photoPath });
    if (error) { if(photoPath) await supabase.storage.from('project-photos').remove([photoPath]); setFormError(error.message); }
    else { setSaveSuccess(true); await refreshData(); }
    setSaving(false);
  }
  async function deleteCompletion(id) {
    if (!user || !window.confirm('Remove this saved project entry?')) return;
    const entry = completions.find(e => e.id === id);
    const { error } = await supabase.from('completions').delete().eq('id', id);
    if (error) { setDataError(error.message); return; }
    if (entry?.photoPath) await supabase.storage.from('project-photos').remove([entry.photoPath]);
    await refreshData();
  }

  const matching = useMemo(() => projects.filter((project) => {
    const matchesWaste = selected.length === 0 || project.requires.some((id) => selected.includes(id));
    const matchesQuery = `${project.title} ${project.description}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesLevel = view === 'all' || project.level.toLowerCase() === view;
    return matchesWaste && matchesQuery && matchesLevel;
  }), [selected, query, view]);

  function toggleWaste(id) {
    setSelected((current) => current.includes(id) ? [] : [id]);
    setQuery('');
    setView('all');
  }

  function jumpToExplore() { document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); }
  function jumpToJournal() { document.getElementById('journal')?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); }
  function jumpToProjects() { document.getElementById(selected.length ? 'projects' : 'explore')?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); }

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="EcoCraft homepage"><span className="brand-mark"><Recycle size={23}/></span><span>eco<span className="brand-accent">craft</span><span className="brand-dot">.</span></span></a>
        <nav className={menuOpen ? 'nav-links nav-open' : 'nav-links'} aria-label="Main navigation">
          <button onClick={jumpToExplore}>Explore waste</button>
          <button onClick={jumpToProjects}>DIY projects</button>
          <button onClick={jumpToJournal}>My creations</button><button onClick={jumpToLeaderboard}>Leaderboard</button><a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
        </nav>
        <div className="header-actions"><button className="header-cta" onClick={jumpToExplore}>Start creating <ArrowRight size={17}/></button>{user ? <button className="account-pill" onClick={signOut} title="Sign out"><UserRound size={17}/> {activeProfile.name} <LogOut size={15}/></button> : <button className="account-pill" onClick={() => {setAuthOpen(true);setAuthMessage('');}}><LogIn size={17}/> Login / Sign up</button>}</div>
        <button className="menu-toggle" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Menu size={23}/></button>
      </header>

      <main id="top">
        <section className="explore-section entry-explore" id="explore">
          <div className="content-width">
            <div className="entry-heading">
              <div className="section-kicker">♻️ ECOCRAFT · CREATIVE REUSE</div>
              <h1>What would you like to <em>upcycle?</em></h1>
              <p>Pick a waste material to discover useful, creative things you can make with it.</p>
            </div>
            <div className="waste-grid" aria-label="Choose a waste material">
              {wasteMaterials.map((material) => <button type="button" key={material.id} className={`waste-card color-${material.color} ${selected.includes(material.id) ? 'is-selected' : ''}`} onClick={() => toggleWaste(material.id)} aria-pressed={selected.includes(material.id)}>
                <span className="select-indicator">{selected.includes(material.id) ? <Check size={15} strokeWidth={3}/> : <ArrowRight size={15}/>}</span>
                <span className="material-emoji" aria-hidden="true">{material.emoji}</span>
                <strong>{material.name}</strong><small>{material.hint}</small>
              </button>)}
            </div>
            {selected.length > 0 && <section className="revealed-projects" id="projects" aria-live="polite">
              <div className="reveal-topline">
                <div>
                  <div className="section-kicker">PROJECT IDEAS</div>
                  <h2>What can you make with {wasteMaterials.find(m => m.id === selected[0])?.name.toLowerCase()}?</h2>
                  <p>Select a product below to see instructions and save your finished creation.</p>
                </div>
                <button className="clear-button change-material" onClick={() => setSelected([])}>Change material <X size={16}/></button>
              </div>
              <div className="filter-row"><div className="search-wrap"><Search size={18}/><input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products…" aria-label="Search products"/></div><div className="filter-buttons" aria-label="Filter by difficulty">{['all','easy','medium'].map((item) => <button className={view === item ? 'active' : ''} key={item} onClick={() => setView(item)}>{item === 'all' ? 'All levels' : item[0].toUpperCase() + item.slice(1)}</button>)}</div></div>
              {matching.length ? <div className="project-grid">{matching.map((project, index) => <article className="project-card" key={project.id}><div className={`project-visual visual-${index % 4}`}><span className="project-emoji" aria-hidden="true">{project.emoji}</span><span className="project-points"><Leaf size={14}/> Make & reuse</span></div><div className="project-content"><div className="project-meta"><span>{project.level}</span><span>⏱ {project.minutes} min</span></div><h3>{project.title}</h3><p>{project.description}</p><div className="project-footer"><div className="materials-used">{project.requires.map((id) => <span title={wasteMaterials.find((m) => m.id === id)?.name} key={id}>{wasteMaterials.find((m) => m.id === id)?.emoji}</span>)}</div><button onClick={() => openProject(project)}>Choose project <ArrowRight size={16}/></button></div></div></article>)}</div> : <div className="empty-state"><span>🔎</span><h3>No matching products</h3><p>Try another search or difficulty level.</p><button className="button button-primary" onClick={() => {setQuery('');setView('all');}}>Reset filters</button></div>}
            </section>}
          </div>
        </section>

        <section className="journal-section" id="journal"><div className="content-width"><div className="section-head"><div><div className="section-kicker">03 / YOUR CREATIONS</div><h2>Made by <em>you</em> 💜</h2><p>Remember every project you brought to life. Sign in to keep your upcycling creations saved in your account.</p></div></div>
          <div className="journal-profile-label">Showing creations for <strong>{activeProfile.name}</strong> {user ? null : <button onClick={requireLogin}>Sign in to save</button>}</div><div className="journal-overview"><div className="journal-summary"><span>🎨</span><strong>{currentCompletions.length}</strong><small>Projects recorded</small></div><div className="journal-summary"><span>♻️</span><strong>{totalItems}</strong><small>Waste items reused (self-reported)</small></div><div className="journal-summary note"><span>💡</span><p>Your creativity makes a difference. Pick an idea above and tap “Save completed project” when you're done.</p></div></div>
          {currentCompletions.length ? <div className="journal-grid">{currentCompletions.map((entry) => { const project = projects.find((p) => p.id === entry.projectId); return <article className="journal-card" key={entry.id}>
            {entry.photo ? <img className="journal-photo" src={entry.photo} alt={`Completed ${project?.title || 'upcycling'} project`}/> : <div className="journal-placeholder">{project?.emoji || '♻️'}</div>}
            <div className="journal-card-body"><small>{new Date(entry.date).toLocaleDateString()} · {entry.count} item{entry.count !== 1 ? 's' : ''} reused</small><h3>{project?.title || 'Upcycling project'}</h3>{entry.notes && <p>{entry.notes}</p>}<button onClick={() => deleteCompletion(entry.id)} aria-label={`Delete ${project?.title || 'project'} entry`}><Trash2 size={15}/> Remove</button></div>
          </article>; })}</div> : <div className="journal-empty"><span>📷</span><h3>Your creative story starts here</h3><p>Finish an upcycling project and save it to see your photos and notes here.</p><button className="button button-primary" onClick={jumpToProjects}>Find something to make <ArrowRight size={16}/></button></div>}
          <p className="storage-note">🔒 Your creations are saved securely to your EcoCraft account. Only you can access your journal and photos.</p>
        </div></section>

        <section className="leaderboard-section" id="leaderboard"><div className="content-width">
          <div className="section-head"><div><div className="section-kicker">04 / COMMUNITY CHALLENGE</div><h2>Reuse more. <em>Rise together.</em> 🏆</h2><p>A friendly leaderboard ranked by the number of waste items recorded in completed projects.</p></div><span className="leaderboard-sticker"><Trophy size={32}/> COMMUNITY CHALLENGE</span></div>
          <div className="leaderboard-layout">
            <div className="leaderboard-panel">
              <div className="board-header"><div><Trophy size={24}/><strong>EcoCraft Leaderboard</strong></div><span>{rankings.length} creator{rankings.length === 1 ? '' : 's'}</span></div>
              {rankings.map((profile, index) => <div className={`leader-row ${profile.id === activeProfile.id ? 'leader-me' : ''}`} key={profile.id}>
                <div className={`leader-rank rank-${index + 1}`}>{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}</div>
                <div className="leader-avatar">{profile.emoji}</div>
                <div className="leader-name"><strong>{profile.name} {profile.id === activeProfile.id && <span className="you-pill">You</span>}</strong><small>{profile.projects} project{profile.projects === 1 ? '' : 's'} completed</small></div>
                <div className="leader-score"><strong>{profile.items}</strong><small>items reused</small></div>
              </div>)}
              <p className="board-footnote">Counts are self-reported, not independently verified. Rankings combine signed-in users across devices.</p>
            </div>
            <aside className="leaderboard-sidebar">
              <div className="profile-card"><span className="profile-icon">{activeProfile.emoji}</span><span className="section-kicker">YOUR ACTIVE PROFILE</span><h3>{activeProfile.name}</h3><div className="profile-stats"><div><strong>#{myPosition}</strong><small>Community rank</small></div><div><strong>{totalItems}</strong><small>Items reused</small></div></div><p>Save a finished project to increase your reuse total. No streaks or points required.</p></div>
              <div className="switch-card"><h3><Users size={19}/> Your account</h3>
                {user ? <><p>Signed in as <strong>{user.email}</strong>. Your completed projects are linked to this account.</p><button className="auth-secondary" onClick={signOut}><LogOut size={16}/> Sign out</button></> : <><p>Create an account or log in to appear on the shared leaderboard.</p><button className="auth-secondary" onClick={requireLogin}><LogIn size={16}/> Sign in / Sign up</button></>}
              </div>
            </aside>
          </div>
        </div></section>

        <section id="how-it-works" className="how-section"><div className="content-width"><div className="section-kicker">05 / THE ECOCRAFT WAY</div><h2>Three steps to a <em>greener</em> you 🌿</h2><div className="how-grid"><div><span>01</span><div>🧺</div><h3>Pick your waste</h3><p>Tell us what reusable materials you've got lying around.</p></div><div><span>02</span><div>💡</div><h3>Get creative</h3><p>Explore simple projects and follow step-by-step instructions.</p></div><div><span>03</span><div>📸</div><h3>Save your creation</h3><p>Keep a personal journal with photos and notes about what you made.</p></div></div></div></section>
      </main>
      <footer><div className="content-width footer-inner"><a className="brand" href="#top"><span className="brand-mark"><Recycle size={20}/></span><span>eco<span className="brand-accent">craft</span><span className="brand-dot">.</span></span></a><span>Made for a less wasteful world 🌎 · College project prototype</span></div></footer>

      {dataError && <div className="data-alert" role="alert">{dataError}<button onClick={() => setDataError('')} aria-label="Dismiss error"><X size={15}/></button></div>}
      {authOpen && <div className="modal-backdrop auth-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setAuthOpen(false); }}>
        <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
          <button className="modal-close" aria-label="Close" onClick={() => setAuthOpen(false)}><X size={20}/></button>
          <div className="auth-logo">♻️</div><span className="section-kicker">WELCOME TO ECOCRAFT</span>
          <h2 id="auth-title">{authMode === 'login' ? 'Welcome back!' : 'Join the EcoCraft community'}</h2>
          <p>Save your creations, share your impact, and access your journal on any device.</p>
          <div className="auth-tabs"><button className={authMode === 'login' ? 'active' : ''} onClick={() => {setAuthMode('login');setAuthMessage('');}}>Log in</button><button className={authMode === 'signup' ? 'active' : ''} onClick={() => {setAuthMode('signup');setAuthMessage('');}}>Sign up</button></div>
          <form onSubmit={submitAuth} className="auth-form">
            {authMode === 'signup' && <><label htmlFor="auth-name">Display name</label><input id="auth-name" maxLength="40" minLength="2" required autoComplete="nickname" placeholder="What should we call you?" value={authName} onChange={e => setAuthName(e.target.value)}/></>}
            <label htmlFor="auth-email">Email address</label><input id="auth-email" type="email" autoComplete="email" required placeholder="you@example.com" value={authEmail} onChange={e => setAuthEmail(e.target.value)}/>
            <label htmlFor="auth-password">Password</label><input id="auth-password" type="password" minLength="6" required autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'} placeholder="At least 6 characters" value={authPassword} onChange={e => setAuthPassword(e.target.value)}/>
            {authMessage && <p className="auth-notice" role="status">{authMessage}</p>}
            {!configured && <p className="auth-notice">Supabase isn’t connected yet. Follow README.md to configure it.</p>}
            <button type="submit" className="button button-primary" disabled={authBusy || !configured}>{authBusy ? 'Please wait…' : authMode === 'login' ? 'Log in' : 'Create account'} <ArrowRight size={17}/></button>
          </form>
        </section>
      </div>}
      {activeProject && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if(event.target === event.currentTarget) setActiveProject(null); }}><section role="dialog" aria-modal="true" aria-labelledby="modal-title" className="project-modal"><button className="modal-close" onClick={() => setActiveProject(null)} aria-label="Close project details"><X size={21}/></button><div className="modal-emoji">{activeProject.emoji}</div><div className="section-kicker">DIY PROJECT · {activeProject.level.toUpperCase()}</div><h2 id="modal-title">{activeProject.title}</h2><p>{activeProject.description}</p><div className="modal-tags"><span>⏱ {activeProject.minutes} min</span><span>♻️ Waste reuse project</span></div><h3>Waste you'll reuse</h3><div className="modal-materials">{activeProject.requires.map((id) => <span key={id}>{wasteMaterials.find((m) => m.id === id)?.emoji} {wasteMaterials.find((m) => m.id === id)?.name}</span>)}</div><h3>How to make it</h3><ol>{activeProject.steps.map((step, index) => <li key={index}>{step}</li>)}</ol><p className="safety-note">⚠️ Use care with scissors, sharp edges, glue, and tools. Get adult supervision when needed.</p><div className="completion-form"><div className="section-kicker">SAVE YOUR WORK</div><h3>Made it? Add to your journal 📸</h3><p>Recording for <strong>{activeProfile.name}</strong>. Photos are optional, and your journal is saved to your account.</p>
      {saveSuccess ? <div className="success-box" role="status"><Check size={20}/> Saved to My Creations! <button type="button" onClick={() => {setActiveProject(null);jumpToJournal();}}>View journal →</button></div> :
      <form onSubmit={saveCompletion}>
        <label className="form-label" htmlFor="item-count">How many waste items did you reuse?</label>
        <input id="item-count" type="number" min="1" max="100" required value={count} onChange={(e) => setCount(e.target.value)}/>
        <label className="form-label" htmlFor="completion-notes">Your notes (optional)</label>
        <textarea id="completion-notes" maxLength="300" rows="3" placeholder="What did you make? What would you change next time?" value={notes} onChange={(e) => setNotes(e.target.value)}/>
        <label className="photo-upload" htmlFor="completion-photo"><Upload size={20}/> {photo ? 'Change your photo' : 'Add a photo (optional)'}</label>
        <input id="completion-photo" className="visually-hidden" type="file" accept="image/*" onChange={handlePhotoChange}/>
        {photo && <div className="preview-wrap"><img src={photo} alt="Preview of your finished creation"/><button type="button" onClick={() => setPhoto('')}>Remove photo</button></div>}
        {formError && <p className="form-error" role="alert">{formError}</p>}
        <button className="button button-primary modal-done" type="submit" disabled={saving}>{saving ? "Saving…" : <><Check size={17}/> Save completed project</>}</button>
      </form>}
    </div></section></div>}
    </div>
  );
}
