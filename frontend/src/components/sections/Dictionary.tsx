
import { useMemo, useState } from "react";

type SpaceTerm = {
  term: string;
  category: string;
  simple: string;
  scientific: string;
};

const terms: SpaceTerm[] = [
  {
    term: "Black Hole",
    category: "Cosmos",
    simple: "Space ka aisa region jahan gravity itni powerful hoti hai ki light bhi escape nahi kar sakti.",
    scientific: "A region of spacetime whose gravitational field prevents escape from within its event horizon.",
  },
  {
    term: "Nebula",
    category: "Cosmos",
    simple: "Gas aur dust ka ek bahut bada cloud, jahan naye stars ban sakte hain.",
    scientific: "An interstellar cloud of gas and dust associated with star formation or stellar evolution.",
  },
  {
    term: "Exoplanet",
    category: "Planets",
    simple: "Aisa planet jo hamare Sun ke bajay kisi doosre star ke around ghoomta hai.",
    scientific: "A planet orbiting a star outside our Solar System.",
  },
  {
    term: "Light-year",
    category: "Cosmos",
    simple: "Woh distance jo light ek saal mein travel karti hai.",
    scientific: "A unit of distance equal to the distance light travels in vacuum in one Julian year, about 9.46 trillion kilometres.",
  },
  {
    term: "Orbit",
    category: "Orbital Mechanics",
    simple: "Jab koi object gravity ki wajah se kisi doosre object ke around travel karta hai, uska path orbit kehlata hai.",
    scientific: "The trajectory of an object under the influence of gravitational forces, commonly described by orbital elements.",
  },
  {
    term: "Escape Velocity",
    category: "Orbital Mechanics",
    simple: "Kisi planet ki gravity se bina aur propulsion ke nikalne ke liye required minimum speed.",
    scientific: "The minimum initial speed needed for an object to escape a body's gravitational field without further propulsion, neglecting other bodies and drag.",
  },
  {
    term: "Red Giant",
    category: "Stars",
    simple: "Star ke life ke ek stage mein woh expand hokar kaafi bada aur relatively cool ho jata hai.",
    scientific: "A luminous, expanded late evolutionary stage of a star after substantial core hydrogen depletion.",
  },
  {
    term: "Supernova",
    category: "Stars",
    simple: "Kuch stars ke life ke end par hone wala extremely energetic explosion.",
    scientific: "A stellar explosion that produces a sudden, enormous increase in luminosity and ejects stellar material.",
  },
  {
    term: "Asteroid",
    category: "Solar System",
    simple: "Space mein Sun ke around ghoomne wala rocky ya metallic body.",
    scientific: "A small Solar System body composed primarily of rock or metal, orbiting the Sun.",
  },
  {
    term: "Comet",
    category: "Solar System",
    simple: "Ice, dust aur rock se bana object jo Sun ke paas aane par glowing coma aur tail bana sakta hai.",
    scientific: "An icy small body that can release gas and dust when solar heating causes its volatile materials to sublimate.",
  },
  {
    term: "Redshift",
    category: "Cosmos",
    simple: "Jab light ki wavelength longer ho jati hai, use redshift kehte hain.",
    scientific: "An increase in observed wavelength caused by relative motion, cosmic expansion, or gravitational effects.",
  },
  {
    term: "Event Horizon",
    category: "Cosmos",
    simple: "Black hole ki boundary jiske andar se light bhi bahar nahi aa sakti.",
    scientific: "The boundary of a black hole beyond which no future-directed signal can reach a distant observer.",
  },
  {
    term: "Solar Wind",
    category: "Solar System",
    simple: "Sun se continuously nikalne wale charged particles ka flow.",
    scientific: "A stream of charged particles, mainly electrons and protons, flowing outward from the solar corona.",
  },
  {
    term: "Rover",
    category: "Exploration",
    simple: "Ek robotic vehicle jo kisi doosre planet ya moon ki surface explore karta hai.",
    scientific: "A mobile robotic spacecraft designed to traverse and investigate the surface of a planetary body.",
  },
  {
    term: "Spectroscopy",
    category: "Astronomy",
    simple: "Light ko study karke scientists stars aur galaxies ke baare mein information nikalte hain.",
    scientific: "The analysis of electromagnetic radiation as a function of wavelength or frequency to infer physical properties of matter.",
  },
  {
    term: "Orbital Velocity",
    category: "Orbital Mechanics",
    simple: "Kisi orbit mein rehne ke liye object ki orbital path ke along required velocity.",
    scientific: "The velocity of an orbiting body determined by its orbital trajectory and the gravitational field of the central body.",
  },
];

const categories = [
  "All",
  "Cosmos",
  "Planets",
  "Stars",
  "Solar System",
  "Orbital Mechanics",
  "Exploration",
  "Astronomy",
];

export default function Dictionary() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [mode, setMode] = useState<"kid" | "astronomer">("kid");

  const filteredTerms = useMemo(() => {
    const query = search.trim().toLowerCase();

    return terms.filter((item) => {
      const matchesCategory =
        category === "All" || item.category === category;

      const matchesSearch =
        !query ||
        item.term.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.simple.toLowerCase().includes(query) ||
        item.scientific.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return (
    <section
      id="dictionary"
      style={{
        background: "#080c18",
        color: "#f4f7ff",
        padding: "44px 24px",
        borderRadius: "20px",
        margin: "28px 0",
      }}
    >
      <p style={{ color: "#b69cff", letterSpacing: "3px", fontSize: "12px" }}>
        KNOW THE UNIVERSE
      </p>

      <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", margin: "12px 0" }}>
        Space Dictionary
      </h2>

      <p style={{ color: "#aab7d0", lineHeight: 1.7, maxWidth: "650px" }}>
        Explore astronomy and space science terms, from beginner concepts
        to scientific definitions.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          margin: "24px 0",
        }}
      >
        <button
          onClick={() => setMode("kid")}
          style={{
            padding: "11px 17px",
            borderRadius: "10px",
            border: "1px solid #35415c",
            background: mode === "kid" ? "#6b4db4" : "#111827",
            color: "white",
            cursor: "pointer",
          }}
        >
          🌱 Kid Mode
        </button>

        <button
          onClick={() => setMode("astronomer")}
          style={{
            padding: "11px 17px",
            borderRadius: "10px",
            border: "1px solid #35415c",
            background: mode === "astronomer" ? "#6b4db4" : "#111827",
            color: "white",
            cursor: "pointer",
          }}
        >
          🔭 Astronomer Mode
        </button>
      </div>

      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search black hole, orbit, nebula..."
        aria-label="Search space terms"
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "15px 16px",
          border: "1px solid #35415c",
          borderRadius: "12px",
          background: "#111827",
          color: "white",
          fontSize: "15px",
          outline: "none",
          marginBottom: "16px",
        }}
      />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "26px",
        }}
      >
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            style={{
              padding: "8px 12px",
              border: "1px solid #35415c",
              borderRadius: "999px",
              background: category === item ? "#293651" : "transparent",
              color: category === item ? "#ffffff" : "#aab7d0",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            {item}
          </button>
        ))}
      </div>

      <p style={{ color: "#8191ad", fontSize: "13px", marginBottom: "18px" }}>
        {filteredTerms.length} terms found ·{" "}
        {mode === "kid" ? "Simple explanations" : "Scientific definitions"}
      </p>

      {filteredTerms.length === 0 ? (
        <div
          style={{
            padding: "24px",
            border: "1px solid #29344b",
            borderRadius: "14px",
            color: "#aab7d0",
          }}
        >
          No terms found. Try another search or select “All”.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
            gap: "16px",
          }}
        >
          {filteredTerms.map((item) => (
            <article
              key={item.term}
              style={{
                padding: "20px",
                border: "1px solid #29344b",
                borderRadius: "15px",
                background: "#111827",
              }}
            >
              <p
                style={{
                  color: "#b69cff",
                  fontSize: "11px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                {item.category}
              </p>

              <h3 style={{ fontSize: "20px", margin: "10px 0" }}>
                {item.term}
              </h3>

              <p style={{ color: "#c1cce0", fontSize: "14px", lineHeight: 1.8 }}>
                {mode === "kid" ? item.simple : item.scientific}
              </p>
            </article>
          ))}
        </div>
      )}

      <p style={{ color: "#71809b", fontSize: "12px", marginTop: "24px" }}>
        Educational glossary · Switch modes to change the explanation level.
      </p>
    </section>
  );
}
