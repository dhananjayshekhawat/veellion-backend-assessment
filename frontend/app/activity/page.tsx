
"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ActivityLog } from "@/types/api";

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Unable to load activity. Please try again.";
}

function formatTimestamp(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchActivity = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/activity", {
        cache: "no-store",
      });

      if (!response.ok) {
        let message = `Request failed with status ${response.status}`;

        try {
          const body = await response.json();
          message = body.error?.message || message;
        } catch {
          // Keep the fallback message if the response is not JSON.
        }

        throw new Error(message);
      }

      const data: unknown = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("The server returned an invalid activity response.");
      }

      setActivities(data as ActivityLog[]);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchActivity();
  }, [fetchActivity]);

  const filteredActivities = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return activities;
    }

    return activities.filter((activity) => {
      const action = activity.action ?? "";
      const info = activity.info ?? "";

      return (
        action.toLowerCase().includes(search) ||
        info.toLowerCase().includes(search)
      );
    });
  }, [activities, query]);

  return (
    <main className="stack">
      <nav aria-label="Breadcrumb">
        <Link href="/" className="button">
          Back to Home
        </Link>
      </nav>

      <header className="card" style={{ padding: "1.25rem" }}>
        <h1 style={{ marginTop: 0 }}>Activity Feed</h1>
        <p style={{ color: "var(--muted)", marginBottom: 0 }}>
          Review recent activity and search through recorded events.
        </p>
      </header>

      <section className="card" style={{ padding: "1rem" }}>
        <label htmlFor="activity-search">Search activity</label>

        <input
          id="activity-search"
          className="input"
          type="search"
          placeholder="Search by action or details..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <p style={{ color: "var(--muted)", marginBottom: 0 }}>
          {loading
            ? "Loading activity..."
            : `${filteredActivities.length} of ${activities.length} activities`}
        </p>
      </section>

      {loading && (
        <section className="card" aria-live="polite" style={{ padding: "1rem" }}>
          <p>Loading activity...</p>
        </section>
      )}

      {!loading && error && (
        <section className="card" role="alert" style={{ padding: "1rem" }}>
          <h2>Unable to load activity</h2>
          <p>{error}</p>
          <button
            type="button"
            className="button"
            onClick={() => void fetchActivity()}
          >
            Try again
          </button>
        </section>
      )}

      {!loading && !error && filteredActivities.length === 0 && (
        <section className="card" style={{ padding: "1rem" }}>
          <h2>No activity found</h2>
          <p style={{ color: "var(--muted)" }}>
            {activities.length === 0
              ? "There are no activity records yet."
              : "Try changing your search terms."}
          </p>
        </section>
      )}

      {!loading && !error && filteredActivities.length > 0 && (
        <section className="card" style={{ padding: "1rem" }}>
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "grid",
              gap: "1rem",
            }}
          >
            {filteredActivities.map((activity) => (
              <li
                key={activity.id}
                style={{
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "1rem",
                }}
              >
                <h3 style={{ margin: "0 0 0.35rem" }}>
                  {activity.action || "Activity"}
                </h3>

                <p style={{ margin: "0 0 0.5rem" }}>
                  {activity.info || "No additional details"}
                </p>

                <time
                  dateTime={activity.when}
                  style={{ color: "var(--muted)", fontSize: "0.875rem" }}
                >
                  {formatTimestamp(activity.when)}
                </time>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
