
import { useEffect, useState } from "react";

type ApodData = {
  title: string;
  date: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: string;
  copyright?: string;
};

export default function Apod() {
  const [data, setData] = useState<ApodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApod() {
      try {
        const response = await fetch(
          "UjTlq3ob75RcPowYViaxwiASRj4wCLBuiOvanOJI"
        );

        if (!response.ok) {
          throw new Error("NASA data abhi load nahi ho raha.");
        }

        const result: ApodData = await response.json();
        setData(result);
      } catch {
        setError("Space image load nahi hui. Thodi der baad try karo.");
      } finally {
        setLoading(false);
      }
    }

    loadApod();
  }, []);

  return (
    <section
      id="apod"
      style={{
        background: "#070913",
        color: "#f4f7ff",
        padding: "40px 24px",
        borderRadius: "20px",
        margin: "28px 0",
      }}
    >
      <p style={{ color: "#00E5FF", letterSpacing: "3px", fontSize: "12px" }}>
        NASA DAILY DISCOVERY
      </p>

      <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", margin: "12px 0" }}>
        Astronomy Picture of the Day
      </h2>

      <p style={{ color: "#aab7d0", marginBottom: "24px" }}>
        Every day, discover something extraordinary in our universe.
      </p>

      {loading && <p>Loading today's cosmic discovery...</p>}

      {error && <p style={{ color: "#ffb8a5" }}>{error}</p>}

      {data && (
        <div>
          <h3 style={{ fontSize: "24px", marginBottom: "8px" }}>
            {data.title}
          </h3>

          <p style={{ color: "#aab7d0", marginBottom: "18px" }}>
            {data.date}
            {data.copyright ? ` • © ${data.copyright}` : ""}
          </p>

          {data.media_type === "image" ? (
            <a href={data.hdurl || data.url} target="_blank" rel="noreferrer">
              <img
                src={data.url}
                alt={data.title}
                style={{
                  width: "100%",
                  maxHeight: "560px",
                  objectFit: "contain",
                  background: "#111d32",
                  borderRadius: "14px",
                  display: "block",
                }}
              />
            </a>
          ) : (
            <p style={{ color: "#aab7d0" }}>
              Today's discovery is a video.{" "}
              <a
                href={data.url}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#00E5FF" }}
              >
                Watch it here ↗
              </a>
            </p>
          )}

          <p style={{ color: "#c2cde0", lineHeight: 1.8, marginTop: "20px" }}>
            {data.explanation}
          </p>
        </div>
      )}
    </section>
  );
}
