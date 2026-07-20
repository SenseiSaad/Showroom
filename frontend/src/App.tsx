import { useMemo, useState } from 'react';
import { submitContactMessage } from './api';

type Page = 'home' | 'projects' | 'logs' | 'experience' | 'contact';

const projects = [
  {
    title: 'Operator Console',
    category: 'Platform Design',
    summary: 'A control room for deployment health, incidents, and client-ready status reporting.',
    stack: ['React', 'Django', 'PostgreSQL'],
    impact: 'Reduced status-update prep time from hours to minutes.',
  },
  {
    title: 'Portfolio System',
    category: 'Personal Brand',
    summary: 'A fast portfolio with project pages, experience tracking, and admin-backed contact messages.',
    stack: ['Vite', 'TypeScript', 'Django Admin'],
    impact: 'Created a single source of truth for leads and collaboration requests.',
  },
  {
    title: 'Delivery Tracker',
    category: 'Internal Tools',
    summary: 'A logging surface for ship dates, blockers, and release notes across active workstreams.',
    stack: ['REST API', 'Responsive UI', 'Forms'],
    impact: 'Gave stakeholders a clean timeline without asking for follow-up messages.',
  },
];

const logs = [
  {
    date: '2026-07-20',
    title: 'Portfolio refresh launched',
    note: 'Replaced the legacy vehicle marketplace with a portfolio layout centered on projects and experience.',
  },
  {
    date: '2026-07-18',
    title: 'Message persistence wired',
    note: 'Contact form submissions now save into Django and appear in admin for review.',
  },
  {
    date: '2026-07-16',
    title: 'Projects page system shaped',
    note: 'Designed content blocks for work samples, outcomes, and stack details.',
  },
];

const experience = [
  {
    role: 'Backend and Cloud DevOps Engineer',
    period: '2024 - Present',
    details: 'Builds Django services, deployment workflows, and client-facing systems with a bias for simple operations.',
  },
  {
    role: 'Full Stack Engineer',
    period: '2022 - 2024',
    details: 'Shipped internal tools, admin dashboards, and operational pages that kept teams aligned.',
  },
  {
    role: 'Automation Builder',
    period: '2020 - 2022',
    details: 'Focused on workflow automation, API integration, and reliable delivery pipelines.',
  },
];

const defaultContact = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [contactForm, setContactForm] = useState(defaultContact);
  const [status, setStatus] = useState('');
  const heroStats = useMemo(
    () => [
      { value: '03', label: 'featured projects' },
      { value: '10+', label: 'years of combined delivery thinking' },
      { value: '01', label: 'admin-backed message queue' },
    ],
    [],
  );

  const onSubmitMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    await submitContactMessage(contactForm);
    setContactForm(defaultContact);
    setStatus('Message saved in Django admin.');
    setPage('home');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand" onClick={() => setPage('home')} role="button" tabIndex={0}>SaadOps</div>
        <nav>
          <button onClick={() => setPage('home')}>Home</button>
          <button onClick={() => setPage('projects')}>Projects</button>
          <button onClick={() => setPage('logs')}>Logs</button>
          <button onClick={() => setPage('experience')}>Work Experience</button>
          <button onClick={() => setPage('contact')}>Contact</button>
        </nav>
      </header>

      {status ? <div className="status-banner">{status}</div> : null}

      {page === 'home' && (
        <section className="hero panel">
          <div className="hero-copy">
            <p className="eyebrow">Portfolio frontend connected to Django</p>
            <h1>Projects, logs, work experience, and contact messages in one clean workspace.</h1>
            <p>This frontend replaces the old vehicle demo with a portfolio layout that feels like a real personal site. Messages submitted here are stored in Django and visible in admin.</p>
            <div className="hero-actions">
              <button onClick={() => setPage('projects')} className="primary">View Projects</button>
              <button onClick={() => setPage('contact')} className="secondary">Send a Message</button>
            </div>
          </div>
          <aside className="stats-card">
            {heroStats.map((stat) => (
              <div key={stat.label} className="stat-row">
                <span>{stat.value}</span>
                <small>{stat.label}</small>
              </div>
            ))}
          </aside>
        </section>
      )}

      {page === 'projects' && (
        <section className="panel stack">
          <div className="section-heading">
            <p className="eyebrow">Selected work</p>
            <h2>Proper project highlights.</h2>
            <p>Each card summarizes the problem, stack, and outcome instead of just listing features.</p>
          </div>
          <div className="project-grid">
            {projects.map((project) => (
              <article key={project.title} className="project-card">
                <div className="project-card-top">
                  <span>{project.category}</span>
                  <button className="ghost-link" onClick={() => setPage('logs')}>Open logs</button>
                </div>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <ul>
                  {project.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <strong>{project.impact}</strong>
              </article>
            ))}
          </div>
        </section>
      )}

      {page === 'logs' && (
        <section className="panel stack">
          <div className="section-heading">
            <p className="eyebrow">Live log</p>
            <h2>Open a new page for work notes.</h2>
            <p>Use this as a fresh page for updates, release notes, or progress logging while keeping the UI simple.</p>
          </div>
          <div className="log-list">
            {logs.map((entry) => (
              <article key={entry.title} className="log-card">
                <time>{entry.date}</time>
                <h3>{entry.title}</h3>
                <p>{entry.note}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {page === 'experience' && (
        <section className="panel stack">
          <div className="section-heading">
            <p className="eyebrow">Work history</p>
            <h2>Experience with delivery context.</h2>
            <p>A tighter overview of roles, date ranges, and what each phase contributed.</p>
          </div>
          <div className="timeline">
            {experience.map((item) => (
              <article key={item.role} className="timeline-item">
                <div className="timeline-year">{item.period}</div>
                <div>
                  <h3>{item.role}</h3>
                  <p>{item.details}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {page === 'contact' && (
        <section className="panel contact-panel">
          <div className="section-heading">
            <p className="eyebrow">Contact</p>
            <h2>Send a message that is saved in admin.</h2>
            <p>The form posts directly to Django so messages can be reviewed from the admin panel.</p>
          </div>
          <form className="contact-form" onSubmit={onSubmitMessage}>
            <div className="grid-2">
              <input
                placeholder="Your name"
                value={contactForm.name}
                onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
              />
              <input
                placeholder="Your email"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <input
              placeholder="Subject"
              value={contactForm.subject}
              onChange={(e) => setContactForm((prev) => ({ ...prev, subject: e.target.value }))}
            />
            <textarea
              placeholder="Message"
              rows={6}
              value={contactForm.message}
              onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
            />
            <button className="primary" type="submit">Save Message</button>
          </form>
        </section>
      )}
    </div>
  );
}