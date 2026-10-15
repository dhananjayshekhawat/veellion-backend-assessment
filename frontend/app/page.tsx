import Link from "next/link";

const modules = [
  {
    number: "01",
    title: "Task Dashboard",
    description:
      "Manage your workload, track completion, and filter tasks by status.",
    href: "/tasks",
    icon: "✓",
    accent: "blue",
    tags: ["Task Management", "Status Tracking"],
    action: "Open dashboard",
  },
  {
    number: "02",
    title: "Activity Feed",
    description:
      "Explore recorded events and quickly find activity using search.",
    href: "/activity",
    icon: "↗",
    accent: "purple",
    tags: ["Event History", "Search"],
    action: "View activity",
  },
  {
    number: "03",
    title: "Reports",
    description:
      "Get a clear overview of task totals, status distribution, and recent activity.",
    href: "/reports",
    icon: "▥",
    accent: "green",
    tags: ["Task Analytics", "Summary"],
    action: "Explore reports",
  },
];

export default function HomePage() {
  return (
    <main className="home-page">
      <header className="home-topbar">
        
<Link href="/" className="brand">
  <img
    src="/logo.png"
    alt="VeeLion logo"
    className="brand-logo"
  />
  <span>VeeLion</span>
</Link>


        <span className="topbar-label">
          FRONTEND ASSESSMENT
        </span>
      </header>

      <section className="home-hero">
        <div className="eyebrow">
          <span className="status-dot" />
          WORKSPACE OVERVIEW
        </div>

        <h1>
          Everything you need,
          <br />
          <span>in one workspace.</span>
        </h1>

        <p className="hero-description">
          A unified space to manage tasks, review activity, and understand
          progress at a glance.
        </p>

        <div className="hero-meta">
          <span><span className="meta-check">✓</span> Task management</span>
          <span><span className="meta-check">✓</span> Activity tracking</span>
          <span><span className="meta-check">✓</span> Reports & insights</span>
        </div>
      </section>

      <section className="module-section">
        <div className="section-heading">
          <div>
            <p className="section-kicker">YOUR WORKSPACE</p>
            <h2>Explore modules</h2>
          </div>
          <span className="module-count">03 MODULES</span>
        </div>

        <div className="module-grid">
          {modules.map((module) => (
            <Link
              href={module.href}
              key={module.href}
              className={`module-card accent-${module.accent}`}
            >
              <div className="module-card-top">
                <span className="module-icon">{module.icon}</span>
                <span className="module-number">{module.number}</span>
              </div>

              <h3>{module.title}</h3>
              <p className="module-description">{module.description}</p>

              <div className="module-tags">
                {module.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <div className="module-action">
                {module.action}
                <span aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="home-footer">
        <span>VEELION · FRONTEND ASSESSMENT</span>
        <span>Built for clarity and productivity.</span>
      </footer>
    </main>
  );
}