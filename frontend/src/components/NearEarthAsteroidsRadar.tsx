
import { useEffect, useState } from "react";

type Asteroid = {
  id: string;
  name: string;
  diameterMin: number;
  diameterMax: number;
  approachDate: string;
  missDistanceKm: number;
  velocityKmh: number;
  hazardous: boolean;
  nasaUrl: string;
};

function formatDistance(km: number) {
  if (km >= 1_000_000) {
    return `${(km / 1_000_000).toFixed(2)} million km`;
  }
  return `${Math.round(km).toLocaleString()} km`;
}

export default function NearEarthAsteroidsRadar() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hazardousOnly, setHazardousOnly] = useState(false);

  async function loadAsteroids() {
    setLoading(true);
    setError("");

    try {
      const today = new Date();
      const end = new Date(today);
      end.setUTCDate(end.getUTCDate() + 3);

      const toDate = (date: Date) => date.toISOString().slice(0, 10);

     

const NASA_API_KEY = "UjTlq3ob75RcPowYViaxwiASRj4wCLBuiOvanOJI";

const url =
  `https://api.nasa.gov/neo/rest/v1/feed` +
  `?start_date=${toDate(today)}` +
  `&end_date=${toDate(end)}` +
  `&api_key=${NASA_API_KEY}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          response.status === 429
            ? "NASA API rate limit reached. Thodi der baad retry karo."
            : `NASA API error (${response.status}).`
        );
      }

      const result = await response.json();
      const allObjects = Object.values(
        result.near_earth_objects ?? {}
      ).flat() as any[];

      const mapped: Asteroid[] = allObjects.map((item) => {
        const approach = item.close_approach_data?.[0];

        return {
          id: item.id,
          name: item.name,
          diameterMin: item.estimated_diameter?.kilometers?.estimated_diameter_min ?? 0,
          diameterMax: item.estimated_diameter?.kilometers?.estimated_diameter_max ?? 0,
          approachDate: approach?.close_approach_date ?? "Unknown",
          missDistanceKm: Number(approach?.miss_distance?.kilometers ?? 0),
          velocityKmh: Number(approach?.relative_velocity?.kilometers_per_hour ?? 0),
          hazardous: Boolean(item.is_potentially_hazardous_asteroid),
          nasaUrl: item.nasa_jpl_url ?? "https://cneos.jpl.nasa.gov/",
        };
      });

      mapped.sort((a, b) => a.missDistanceKm - b.missDistanceKm);
      setAsteroids(mapped);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Asteroid data load nahi ho paya. Internet check karo."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAsteroids();
  }, []);

  const visibleAsteroids = hazardousOnly
    ? asteroids.filter((asteroid) => asteroid.hazardous)
    : asteroids;

  return (
    <section
      id="asteroid-radar"
      style={{
        background: "#080c18",
        color: "#f4f7ff",
        padding: "44px 24px",
        borderRadius: "20px",
        margin: "28px 0",
      }}
    >
      <p style={{ color: "#00e5ff", letterSpacing: "3px", fontSize: "12px" }}>
        NEAR-EARTH OBJECT MONITOR
      </p>

      <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", margin: "12px 0" }}>
        Asteroid Radar
      </h2>

      <p style={{ color: "#aab7d0", lineHeight: 1.7, maxWidth: "680px" }}>
        Track asteroids expected to make a close approach to Earth in the
        coming days using NASA's Near-Earth Object data.
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          margin: "24px 0",
        }}
      >
        <span
          style={{
            padding: "10px 14px",
            border: "1px solid #29344b",
            borderRadius: "10px",
            background: "#111827",
          }}
        >
          Objects found: {asteroids.length}
        </span>

        <button
          onClick={() => setHazardousOnly((current) => !current)}
          style={{
            padding: "11px 15px",
            border: "1px solid #35415c",
            borderRadius: "10px",
            background: hazardousOnly ? "#713b2c" : "#111827",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {hazardousOnly ? "Show all asteroids" : "Potentially hazardous only"}
        </button>

        <button
          onClick={loadAsteroids}
          disabled={loading}
          style={{
            padding: "11px 15px",
            border: "1px solid #35415c",
            borderRadius: "10px",
            background: "#17233b",
            color: "#fff",
            cursor: loading ? "wait" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Loading..." : "Refresh data"}
        </button>
      </div>

      {loading && <p>Loading near-Earth asteroid data...</p>}

      {error && (
        <div role="alert" style={{ color: "#ffb8a5", margin: "20px 0" }}>
          {error}
        </div>
      )}

      {!loading && !error && visibleAsteroids.length === 0 && (
        <p style={{ color: "#aab7d0" }}>
          {hazardousOnly
            ? "Selected date range mein koi potentially hazardous object return nahi hua."
            : "Selected date range mein koi object return nahi hua."}
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 270px), 1fr))",
          gap: "18px",
        }}
      >
        {visibleAsteroids.map((asteroid) => (
          <article
            key={asteroid.id}
            style={{
              padding: "20px",
              border: "1px solid #29344b",
              borderRadius: "16px",
              background: "#111827",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "10px",
              }}
            >
              <span style={{ color: "#00e5ff", fontSize: "12px" }}>
                NEO ID: {asteroid.id}
              </span>

              <span
                style={{
                  fontSize: "11px",
                  padding: "5px 8px",
                  borderRadius: "6px",
                  background: asteroid.hazardous ? "#552923" : "#193b34",
                  color: asteroid.hazardous ? "#ffb8a5" : "#9ef0c5",
                }}
              >
                {asteroid.hazardous ? "Potentially hazardous" : "Not classified hazardous"}
              </span>
            </div>

            <h3 style={{ fontSize: "20px", margin: "16px 0" }}>
              {asteroid.name}
            </h3>

            <div style={{ display: "grid", gap: "13px" }}>
              <div>
                <p style={{ color: "#8191ad", fontSize: "12px" }}>
                  CLOSE APPROACH DATE
                </p>
                <strong>{asteroid.approachDate}</strong>
              </div>

              <div>
                <p style={{ color: "#8191ad", fontSize: "12px" }}>
                  DISTANCE FROM EARTH
                </p>
                <strong>{formatDistance(asteroid.missDistanceKm)}</strong>
              </div>

              <div>
                <p style={{ color: "#8191ad", fontSize: "12px" }}>
                  ESTIMATED DIAMETER
                </p>
                <strong>
                  {asteroid.diameterMin.toFixed(3)}–{asteroid.diameterMax.toFixed(3)} km
                </strong>
              </div>

              <div>
                <p style={{ color: "#8191ad", fontSize: "12px" }}>
                  RELATIVE VELOCITY
                </p>
                <strong>
                  {asteroid.velocityKmh.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })} km/h
                </strong>
              </div>
            </div>

            <a
              href={asteroid.nasaUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                color: "#00e5ff",
                marginTop: "20px",
                fontSize: "13px",
              }}
            >
              View NASA/JPL details ↗
            </a>
          </article>
        ))}
      </div>

      <p style={{ color: "#71809b", fontSize: "12px", marginTop: "24px" }}>
        Data: NASA/JPL NeoWs. “Potentially hazardous” is an official
        classification, not a prediction that an asteroid will hit Earth.
        This panel checks a four-day UTC window starting today.
      </p>
    </section>
  );
}
