// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";

// type ReportsSummary = {
//   total: number;
//   byStatus: {
//     todo: number;
//     "in-progress": number;
//     done: number;
//   };
//   recentActivityCount: number;
// };

// export default function ReportsPage() {
//   const [report, setReport] = useState<ReportsSummary | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   async function fetchReport() {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await fetch("/api/reports/tasks-summary", {
//         cache: "no-store",
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to load reports (${response.status})`);
//       }

//       const data: ReportsSummary = await response.json();
//       setReport(data);
//     } catch (err) {
//       setError(
//         err instanceof Error
//           ? err.message
//           : "Unable to load reports. Please try again.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     void fetchReport();
//   }, []);

//   return (
//     <main className="stack">
//       <nav aria-label="Breadcrumb">
//         <Link href="/" className="button">
//           Back to Home
//         </Link>
//       </nav>

//       <header className="card" style={{ padding: "1.25rem" }}>
//         <h1 style={{ marginTop: 0 }}>Reports</h1>
//         <p style={{ color: "var(--muted)", marginBottom: 0 }}>
//           Overview of tasks and recent activity.
//         </p>
//       </header>

//       {loading && (
//         <section className="card" aria-live="polite" style={{ padding: "1rem" }}>
//           Loading reports...
//         </section>
//       )}

//       {!loading && error && (
//         <section className="card" role="alert" style={{ padding: "1rem" }}>
//           <p>{error}</p>
//           <button className="button" type="button" onClick={() => void fetchReport()}>
//             Retry
//           </button>
//         </section>
//       )}

//       {!loading && !error && report && (
//         <>
//           <section
//             className="grid"
//             aria-label="Report summary"
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
//               gap: "1rem",
//             }}
//           >
//             <article className="card" style={{ padding: "1.25rem" }}>
//               <p style={{ color: "var(--muted)", marginTop: 0 }}>Total Tasks</p>
//               <h2>{report.total}</h2>
//             </article>

//             <article className="card" style={{ padding: "1.25rem" }}>
//               <p style={{ color: "var(--muted)", marginTop: 0 }}>To Do</p>
//               <h2>{report.byStatus.todo}</h2>
//             </article>

//             <article className="card" style={{ padding: "1.25rem" }}>
//               <p style={{ color: "var(--muted)", marginTop: 0 }}>In Progress</p>
//               <h2>{report.byStatus["in-progress"]}</h2>
//             </article>

//             <article className="card" style={{ padding: "1.25rem" }}>
//               <p style={{ color: "var(--muted)", marginTop: 0 }}>Done</p>
//               <h2>{report.byStatus.done}</h2>
//             </article>

//             <article className="card" style={{ padding: "1.25rem" }}>
//               <p style={{ color: "var(--muted)", marginTop: 0 }}>
//                 Recent Activity
//               </p>
//               <h2>{report.recentActivityCount}</h2>
//             </article>
//           </section>
//         </>
//       )}
//     </main>
//   );
// }

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ReportsSummary = {
  total: number;
  byStatus: {
    todo: number;
    "in-progress": number;
    done: number;
  };
  recentActivityCount: number;
};

export default function ReportsPage() {
  const [report, setReport] = useState<ReportsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchReport() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/reports/tasks-summary", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to load reports (${response.status})`);
      }

      const data: ReportsSummary = await response.json();
      setReport(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load reports. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchReport();
  }, []);

  const statuses = [
    {
      label: "To do",
      count: report?.byStatus.todo ?? 0,
      className: "report-todo",
    },
    {
      label: "In progress",
      count: report?.byStatus["in-progress"] ?? 0,
      className: "report-progress",
    },
    {
      label: "Completed",
      count: report?.byStatus.done ?? 0,
      className: "report-done",
    },
  ];

  return (
    <main className="stack reports-page">
      <nav aria-label="Breadcrumb">
        <Link href="/" className="button">
          ← Back to Home
        </Link>
      </nav>

      <header className="card reports-header">
        <div>
          <p className="report-eyebrow">WORKSPACE ANALYTICS</p>
          <h1>Reports & Insights</h1>
          <p className="report-subtitle">
            Understand your workload and track task progress at a glance.
          </p>
        </div>
        <div className="report-header-icon" aria-hidden="true">
          ▥
        </div>
      </header>

      {loading && (
        <section className="card report-message" aria-live="polite">
          Loading your reports...
        </section>
      )}

      {!loading && error && (
        <section className="card report-message" role="alert">
          <h2>Couldn't load reports</h2>
          <p>{error}</p>
          <button
            className="button"
            type="button"
            onClick={() => void fetchReport()}
          >
            Try again
          </button>
        </section>
      )}

      {!loading && !error && report && (
        <>
          <section className="report-metrics" aria-label="Summary metrics">
            <article className="card report-metric metric-blue">
              <span className="metric-label">Total tasks</span>
              <strong className="metric-value">{report.total}</strong>
              <span className="metric-note">All tracked tasks</span>
            </article>

            <article className="card report-metric metric-purple">
              <span className="metric-label">Completed</span>
              <strong className="metric-value">{report.byStatus.done}</strong>
              <span className="metric-note">Tasks marked as done</span>
            </article>

            <article className="card report-metric metric-green">
              <span className="metric-label">Recent activity</span>
              <strong className="metric-value">
                {report.recentActivityCount}
              </strong>
              <span className="metric-note">Recorded activity events</span>
            </article>
          </section>

          <section className="card report-status-panel">
            <div className="report-section-heading">
              <div>
                <h2>Task status breakdown</h2>
                <p>Distribution across your current tasks</p>
              </div>
              <span className="report-total-pill">
                {report.total} total
              </span>
            </div>

            {report.total > 0 ? (
              <div
                className="report-progress-track"
                role="img"
                aria-label={statuses
                  .map(
                    (status) =>
                      `${status.label}: ${status.count} tasks`,
                  )
                  .join(", ")}
              >
                {statuses.map((status) => (
                  <div
                    key={status.className}
                    className={`report-progress-segment ${status.className}`}
                    style={{
                      width: `${(status.count / report.total) * 100}%`,
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className="report-empty-note">
                No tasks to display yet.
              </p>
            )}

            <div className="report-status-list">
              {statuses.map((status) => {
                const percentage =
                  report.total > 0
                    ? Math.round((status.count / report.total) * 100)
                    : 0;

                return (
                  <div className="report-status-row" key={status.className}>
                    <span className="report-status-name">
                      <span
                        className={`report-status-dot ${status.className}`}
                      />
                      {status.label}
                    </span>
                    <span className="report-status-value">
                      {status.count}
                      <span>{percentage}%</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="card report-insight">
            <div className="report-insight-icon" aria-hidden="true">
              ✦
            </div>
            <div>
              <h2>Workspace snapshot</h2>
              <p>
                {report.total === 0
                  ? "Create your first task to start tracking progress."
                  : `${report.byStatus.done} of ${report.total} tasks are completed. ${
                      Math.round(
                        (report.byStatus.done / report.total) * 100,
                      )
                    }% of your tasks are marked as done.`}
              </p>
            </div>
          </section>
        </>
      )}
    </main>
  );
}