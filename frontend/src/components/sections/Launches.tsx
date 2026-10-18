
import { useEffect, useState } from "react";

type Launch = {
  id: string;
  name: string;
  net: string;
  status?: { name?: string };
  launch_service_provider?: { name?: string };
  mission?: { name?: string; description?: string };
  rocket?: {
    configuration?: {
      full_name?: string;
      name?: string;
      manufacturer?: { name?: string };
    };
  };
  pad?: {
    name?: string;
    location?: { name?: string };
  };
  image?: string | null;
  info_url?: string | null;
  webcast_live?: boolean;
  url?: string;
};

function getCountdown(date: string, now: number) {
  const difference = new Date(date).getTime() - now;

  if (!Number.isFinite(difference)) return "Time not available";
  if (difference <= 0) return "Launch time reached";

  const days = Math.floor(difference / 86400000);
  const hours = Math.floor((difference % 86400000) / 3600000);
  const minutes = Math.floor((difference % 3600000) / 60000);
  const seconds = Math.floor((difference % 60000) / 1000);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export default function Launches() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadLaunches() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          "https://ll.thespacedevs.com/2.3.0/launches/upcoming/?limit=6&mode=normal&format=json"
        );

        if (!response.ok) {
          throw new Error(
            response.status === 429
              ? "API rate limit reached. Please wait and retry."
              : `Launch API returned error ${response.status}.`
          );
        }

        const result = await response.json();

        if (active) {
          setLaunches(result.results ?? []);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Live launch data unavailable. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadLaunches();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id="missions"
      style={{
        background: "#070913",
        color: "#f4f7ff",
        padding: "44px 24px",
        borderRadius: "20px",
        margin: "28px 0",
      }}
    >
      <p style={{ color: "#00E5FF", letterSpacing: "3px", fontSize: "12px" }}>
        MISSION CONTROL
      </p>

      <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", margin: "12px 0" }}>
        Upcoming Rocket Launches
      </h2>

      <p style={{ color: "#aab7d0", marginBottom: "28px", lineHeight: 1.7 }}>
        Follow upcoming space missions with live schedule information.
      </p>

      {loading && <p>Loading real launch data...</p>}

      {error && (
        <div role="alert" style={{ color: "#ffb8a5", margin: "18px 0" }}>
          {error}
        </div>
      )}

      {!loading && !error && launches.length === 0 && (
        <p>No upcoming launches were returned by the API.</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          gap: "20px",
        }}
      >
        {launches.map((launch) => (
          <article
            key={launch.id}
            style={{
              overflow: "hidden",
              border: "1px solid #263452",
              borderRadius: "16px",
              background: "#0D1224",
            }}
          >
            
<div
  style={{
    width: "100%",
    height: "180px",
    background: "#111d32",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  {launch.image ? (
    <img
      
      src={launch.image}
      alt={launch.name}
      loading="lazy"
     onError={(event) => {
  const container = event.currentTarget.parentElement;
  event.currentTarget.style.display = "none";

  if (container) {
    container.innerHTML =
      '<div style="color:#aab7d0;text-align:center;padding:20px">🚀 Image not available</div>';
  }
}}
      style={{
        width: "100%",
        height: "180px",
        objectFit: "cover",
        display: "block",
      }}
    />
  ) : (
    <span style={{ color: "#8191ad", fontSize: "14px" }}>
      🚀 Image not available
    </span>
  )}
</div>

            <div style={{ padding: "20px" }}>
              <p style={{ color: "#00E5FF", fontSize: "12px" }}>
                {launch.launch_service_provider?.name ?? "Launch provider unavailable"}
              </p>

              <h3 style={{ fontSize: "20px", margin: "12px 0" }}>
                {launch.name}
              </h3>

              <p style={{ color: "#c2cde0", marginBottom: "12px" }}>
                Rocket:{" "}
                {launch.rocket?.configuration?.full_name ??
                  launch.rocket?.configuration?.name ??
                  "Not available"}
              </p>

              <p style={{ color: "#aab7d0", marginBottom: "10px" }}>
                Manufacturer:{" "}
                {launch.rocket?.configuration?.manufacturer?.name ??
                  "Not available"}
              </p>

              <p style={{ color: "#aab7d0", marginBottom: "10px" }}>
                Mission: {launch.mission?.name ?? "Mission details unavailable"}
              </p>

              {launch.mission?.description && (
                <p
                  style={{
                    color: "#aab7d0",
                    fontSize: "13px",
                    lineHeight: 1.6,
                    marginBottom: "12px",
                  }}
                >
                  {launch.mission.description}
                </p>
              )}

              <p style={{ color: "#aab7d0", marginBottom: "10px" }}>
                Launch site:{" "}
                {launch.pad?.name
                  ? `${launch.pad.name}${launch.pad.location?.name ? `, ${launch.pad.location.name}` : ""}`
                  : launch.pad?.location?.name ?? "Not announced"}
              </p>

              <p style={{ marginTop: "16px", fontSize: "13px" }}>
                <strong>Scheduled:</strong>{" "}
                {new Date(launch.net).toLocaleString()}
              </p>

              <div
                style={{
                  marginTop: "16px",
                  padding: "12px",
                  borderRadius: "10px",
                  background: "#111d32",
                }}
              >
                <p style={{ color: "#00E5FF", fontSize: "11px" }}>
                  COUNTDOWN
                </p>
                <strong style={{ fontVariantNumeric: "tabular-nums" }}>
                  {getCountdown(launch.net, now)}
                </strong>
              </div>

              <p style={{ color: "#FFB703", marginTop: "14px", fontSize: "13px" }}>
                Status: {launch.status?.name ?? "Unknown"}
              </p>

              {(launch.url || launch.info_url) && (
                <a
                  href={launch.url || launch.info_url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-block",
                    color: "#00E5FF",
                    marginTop: "12px",
                    fontSize: "13px",
                  }}
                >
                  View launch details ↗
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      <p style={{ color: "#7f8da8", fontSize: "12px", marginTop: "24px" }}>
        Launch times and details may change. Countdown uses the currently
        published schedule and your device clock.
      </p>
    </section>
  );
}
