
import { useEffect, useState } from "react";

type ISSData = {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  timestamp: number;
};

export default function IssTracker() {
  const [data, setData] = useState<ISSData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchISS() {
      try {
        const response = await fetch(
          "https://api.wheretheiss.at/v1/satellites/25544"
        );

        if (!response.ok) {
          throw new Error("ISS data is temporarily unavailable.");
        }

        const result: ISSData = await response.json();

        if (active) {
          setData(result);
          setError("");
          setLoading(false);
        }
      } catch {
        if (active) {
          setError("Live data nahi mil raha. Thodi der baad try karo.");
          setLoading(false);
        }
      }
    }

    fetchISS();
    const interval = window.setInterval(fetchISS, 5000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <section
      id="iss-tracker"
      style={{
        background: "#0D1224",
        color: "#f4f7ff",
        padding: "32px",
        borderRadius: "20px",
        margin: "24px 0",
        border: "1px solid #263452",
      }}
    >
      <p style={{ color: "#00E5FF", letterSpacing: "3px" }}>
        LIVE ORBITAL TELEMETRY
      </p>

      <h2 style={{ fontSize: "28px", margin: "12px 0" }}>
        International Space Station
      </h2>

      <p style={{ color: "#aab7d0" }}>
        Tracking the ISS as it travels around Earth.
      </p>

      {loading && <p>Loading live ISS telemetry...</p>}

      {error && <p role="alert">{error}</p>}

      {data && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "14px",
              marginTop: "24px",
            }}
          >
            <div>
              <p>LATITUDE</p>
              <h3>{data.latitude.toFixed(4)}°</h3>
            </div>

            <div>
              <p>LONGITUDE</p>
              <h3>{data.longitude.toFixed(4)}°</h3>
            </div>

            <div>
              <p>ALTITUDE</p>
              <h3>{data.altitude.toFixed(2)} km</h3>
            </div>

            <div>
              <p>VELOCITY</p>
              <h3>{data.velocity.toFixed(2)} km/h</h3>
            </div>
          </div>

          <p style={{ color: "#8fa0bd", marginTop: "22px" }}>
            Last updated:{" "}
            {new Date(data.timestamp * 1000).toLocaleTimeString()}
          </p>
        </>
      )}
    </section>
  );
}
