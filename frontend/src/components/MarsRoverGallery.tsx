
import { useEffect, useState } from "react";

type MarsPhoto = {
  nasaId: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
};

type Rover = "Perseverance" | "Curiosity";

export default function MarsRoverGallery() {
  const [rover, setRover] = useState<Rover>("Perseverance");
  const [photos, setPhotos] = useState<MarsPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPhotos() {
      setLoading(true);
      setError("");
      setPhotos([]);

      try {
        const query = encodeURIComponent(`${rover} Mars rover`);
        const url =
          `https://images-api.nasa.gov/search?q=${query}&media_type=image&page_size=12`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("NASA image service unavailable");
        }

        const result = await response.json();

        const items = result.collection?.items ?? [];

        const validPhotos: MarsPhoto[] = items
          .map((item: any) => {
            const info = item.data?.[0];
            const image = item.links?.find(
              (link: any) => link.rel === "preview"
            )?.href;

            if (!info || !image) return null;

            return {
              nasaId: info.nasa_id,
              title: info.title ?? "Mars rover photograph",
              date: info.date_created ?? "",
              description: info.description ?? "",
              imageUrl: image,
            };
          })
          .filter((photo: MarsPhoto | null): photo is MarsPhoto => photo !== null);

        if (active) {
          setPhotos(validPhotos);
          if (validPhotos.length === 0) {
            setError("Is rover ke liye abhi photos nahi milin.");
          }
        }
      } catch {
        if (active) {
          setError(
            "NASA se photos load nahi ho paayin. Internet connection check karke dobara try karo."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPhotos();

    return () => {
      active = false;
    };
  }, [rover]);

  return (
    <section
      id="mars-gallery"
      style={{
        background: "#080c18",
        color: "#f4f7ff",
        padding: "48px 24px",
        borderRadius: "20px",
        margin: "28px 0",
      }}
    >
      <p
        style={{
          color: "#ff805d",
          letterSpacing: "3px",
          fontSize: "12px",
          fontWeight: 700,
        }}
      >
        RED PLANET EXPLORER
      </p>

      <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", margin: "12px 0" }}>
        Mars Rover Gallery
      </h2>

      <p style={{ color: "#aab7d0", lineHeight: 1.7, maxWidth: "650px" }}>
        Explore images from NASA's Mars missions and discover the landscapes
        of the Red Planet.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          margin: "24px 0",
        }}
      >
        {(["Perseverance", "Curiosity"] as Rover[]).map((name) => (
          <button
            key={name}
            onClick={() => setRover(name)}
            style={{
              padding: "11px 18px",
              borderRadius: "999px",
              border: "1px solid #35415c",
              background: rover === name ? "#ff805d" : "#111a2d",
              color: "#ffffff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {name}
          </button>
        ))}
      </div>

      {loading && <p>Loading Mars images from NASA...</p>}

      {error && (
        <div role="alert" style={{ color: "#ffb8a5", padding: "16px 0" }}>
          {error}
          <button
            onClick={() => setRover((current) => current)}
            style={{
              display: "block",
              marginTop: "12px",
              padding: "9px 14px",
              background: "#18243b",
              color: "white",
              border: "1px solid #35415c",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && photos.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
            gap: "20px",
            marginTop: "28px",
          }}
        >
          {photos.map((photo) => (
            <article
              key={photo.nasaId}
              style={{
                overflow: "hidden",
                borderRadius: "15px",
                border: "1px solid #29344b",
                background: "#111827",
              }}
            >
              <a
                href={`https://images.nasa.gov/details/${photo.nasaId}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "210px",
                    objectFit: "cover",
                    display: "block",
                    background: "#080c18",
                  }}
                />
              </a>

              <div style={{ padding: "16px" }}>
                <h3 style={{ fontSize: "16px", lineHeight: 1.5, margin: "0 0 10px" }}>
                  {photo.title}
                </h3>

                <p style={{ color: "#ff9c80", fontSize: "12px" }}>
                  {rover} · NASA Image Library
                </p>

                <p style={{ color: "#aab7d0", fontSize: "13px" }}>
                  Photo date:{" "}
                  {photo.date
                    ? new Date(photo.date).toLocaleDateString()
                    : "Not available"}
                </p>

                <p
                  style={{
                    color: "#aab7d0",
                    fontSize: "13px",
                    lineHeight: 1.6,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {photo.description || "No description available."}
                </p>

                <a
                  href={`https://images.nasa.gov/details/${photo.nasaId}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#ff9c80", fontSize: "13px" }}
                >
                  View NASA image details ↗
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

      <p style={{ color: "#71809b", fontSize: "12px", marginTop: "24px" }}>
        Images and metadata are retrieved from NASA's Image and Video Library.
        Search results may include mission-related imagery, not only photographs
        taken by the selected rover.
      </p>
    </section>
  );
}
