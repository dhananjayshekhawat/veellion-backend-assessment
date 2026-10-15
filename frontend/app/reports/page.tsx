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

  return (
    <main className="stack">
      <nav aria-label="Breadcrumb">
        <Link href="/" className="button">
          Back to Home
        </Link>
      </nav>

      <header className="card" style={{ padding: "1.25rem" }}>
        <h1 style={{ marginTop: 0 }}>Reports</h1>
        <p style={{ color: "var(--muted)", marginBottom: 0 }}>
          Overview of tasks and recent activity.
        </p>
      </header>

      {loading && (
        <section className="card" aria-live="polite" style={{ padding: "1rem" }}>
          Loading reports...
        </section>
      )}

      {!loading && error && (
        <section className="card" role="alert" style={{ padding: "1rem" }}>
          <p>{error}</p>
          <button className="button" type="button" onClick={() => void fetchReport()}>
            Retry
          </button>
        </section>
      )}

      {!loading && !error && report && (
        <>
          <section
            className="grid"
            aria-label="Report summary"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1rem",
            }}
          >
            <article className="card" style={{ padding: "1.25rem" }}>
              <p style={{ color: "var(--muted)", marginTop: 0 }}>Total Tasks</p>
              <h2>{report.total}</h2>
            </article>

            <article className="card" style={{ padding: "1.25rem" }}>
              <p style={{ color: "var(--muted)", marginTop: 0 }}>To Do</p>
              <h2>{report.byStatus.todo}</h2>
            </article>

            <article className="card" style={{ padding: "1.25rem" }}>
              <p style={{ color: "var(--muted)", marginTop: 0 }}>In Progress</p>
              <h2>{report.byStatus["in-progress"]}</h2>
            </article>

            <article className="card" style={{ padding: "1.25rem" }}>
              <p style={{ color: "var(--muted)", marginTop: 0 }}>Done</p>
              <h2>{report.byStatus.done}</h2>
            </article>

            <article className="card" style={{ padding: "1.25rem" }}>
              <p style={{ color: "var(--muted)", marginTop: 0 }}>
                Recent Activity
              </p>
              <h2>{report.recentActivityCount}</h2>
            </article>
          </section>
        </>
      )}
    </main>
  );
}