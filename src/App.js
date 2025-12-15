import { useState, useEffect } from "react";

// 🔐 Admin PIN
const ADMIN_PIN = "845921";

// 📲 WhatsApp number
const WHATSAPP_NUMBER = "919030124218";

// ---------------- DATA ----------------
const WEIGHTS = ["100g", "250g", "500g", "1kg"];
const WEIGHT_IN_GRAMS = { "100g": 100, "250g": 250, "500g": 500, "1kg": 1000 };

// 🥭 PICKLES
const PICKLES = [
  { id: "avakaya", name: "Avakaya", basePrice: 150, baseWeight: "250g" },
  { id: "gongura", name: "Gongura", basePrice: 175, baseWeight: "250g" },
  { id: "lemon", name: "Lemon Pickle", basePrice: 175, baseWeight: "250g" },
  { id: "tomato", name: "Tomato Pickle", basePrice: 150, baseWeight: "250g" },
  { id: "magaya", name: "Magaya", basePrice: 200, baseWeight: "250g" },
  { id: "sweet-avakaya", name: "Sweet Avakaya", basePrice: 175, baseWeight: "250g" },
  { id: "allam-avakaya", name: "Allam Avakaya", basePrice: 175, baseWeight: "250g" },
  { id: "allam-pachadi", name: "Allam Pachhadi", basePrice: 125, baseWeight: "250g" },
  { id: "uppu-chintakaya", name: "Uppu Chintakaya", basePrice: 125, baseWeight: "250g" },
  { id: "uppu-gongura", name: "Uppu Gongura", basePrice: 125, baseWeight: "250g" },
  { id: "pandu-mirchi", name: "Pandu Mirchi", basePrice: 150, baseWeight: "250g" },
  { id: "karivepaku-pickle", name: "Karivepaku Pickle", basePrice: 175, baseWeight: "250g" },
  { id: "pudeena-pickle", name: "Pudeena Pickle", basePrice: 175, baseWeight: "250g" },
  { id: "kothimeera-pickle", name: "Kothimeera Pickle", basePrice: 175, baseWeight: "250g" },
  { id: "chinta-green", name: "Chinta Kaya (Green Chilli)", basePrice: 175, baseWeight: "250g" },
  { id: "chinta-dry", name: "Chinta Kaya (Dry Chilli)", basePrice: 175, baseWeight: "250g" },
  { id: "usirikaya", name: "Usirikaya", basePrice: 175, baseWeight: "250g" },
  { id: "usiri-avakaya", name: "Usiri Avakaya", basePrice: 175, baseWeight: "250g" },
  { id: "kakarakaya-pickle", name: "Kakarakaya Pickle", basePrice: 175, baseWeight: "250g" }
];

// 🌶️ PODULU / KARAMS
const PODULU = [
  { id: "kakarakaya-karam", name: "Kakarakaya Karam", basePrice: 200, baseWeight: "250g" },
  { id: "aviseginjala", name: "Aviseginjala Karam", basePrice: 200, baseWeight: "250g" },
  { id: "ulava", name: "Ulava Karam", basePrice: 200, baseWeight: "250g" },
  { id: "nuvvula", name: "Nuvvula Karam", basePrice: 175, baseWeight: "250g" },
  { id: "munagaku", name: "Munagaku Karam", basePrice: 200, baseWeight: "250g" },
  { id: "karivepaku-karam", name: "Karivepaku Karam", basePrice: 200, baseWeight: "250g" },
  { id: "pudeena-karam", name: "Pudeena Karam", basePrice: 175, baseWeight: "250g" },
  { id: "kobbari", name: "Kobbari Karam", basePrice: 175, baseWeight: "250g" },
  { id: "kandi-podi", name: "Kandi Podi", basePrice: 175, baseWeight: "250g" },
  { id: "pappula", name: "Pappula Podi", basePrice: 200, baseWeight: "250g" },
  { id: "idly-karam", name: "Idly Karam", basePrice: 175, baseWeight: "250g" },
  { id: "palli", name: "Palli Karam", basePrice: 175, baseWeight: "250g" },
  { id: "putnala", name: "Putnala Podi", basePrice: 200, baseWeight: "250g" },
  { id: "dhaniya", name: "Andhra Special Dhaniya Masala", basePrice: 175, baseWeight: "250g" }
];

const styles = {
  page: { padding: 16, paddingBottom: 120, background: "#faf7f2", minHeight: "100vh", fontFamily: "Arial, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  grid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 },
  card: { background: "#fff", padding: 12, borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.15)" },
  faded: { opacity: 0.5 },
  buttonOrange: { background: "#ea580c", color: "#fff", padding: 10, borderRadius: 8, width: "100%", border: "none" },
  buttonGreen: { background: "#16a34a", color: "#fff", padding: 12, borderRadius: 8, width: "100%", border: "none" },
  cart: { position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", padding: 12, boxShadow: "0 -2px 6px rgba(0,0,0,0.2)" }
};

export default function VijayaHomeFoods() {
  const [category, setCategory] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedWeights, setSelectedWeights] = useState({});
  const [cart, setCart] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [outOfStock, setOutOfStock] = useState({});

  useEffect(() => {
    document.title = "Vijaya Home Foods | Traditional Andhra Pickles & Podulu";
    setOutOfStock(JSON.parse(localStorage.getItem("outOfStock") || "{}"));
  }, []);

  const priceFor = (item) => Math.round(
    item.basePrice *
      (WEIGHT_IN_GRAMS[selectedWeights[item.id] || "250g"] /
        WEIGHT_IN_GRAMS[item.baseWeight])
  );

  const addToCart = (item) => {
    if (outOfStock[item.id]) return;
    const weight = selectedWeights[item.id] || "250g";
    const price = priceFor(item);
    setCart([...cart, { ...item, weight, price }]);
  };

  const toggleStock = (id) => {
    const updated = { ...outOfStock, [id]: !outOfStock[id] };
    setOutOfStock(updated);
    localStorage.setItem("outOfStock", JSON.stringify(updated));
  };

  const total = cart.reduce((s, i) => s + i.price, 0);

  const generateInvoicePDF = () => {
    let win = window.open("", "Invoice", "width=800,height=600");
    if (!win) return alert("Please allow popups to download invoice");
    win.document.write(`<h2>Vijaya Home Foods</h2><p>Date: ${new Date().toLocaleString()}</p>`);
    cart.forEach(i => win.document.write(`<p>${i.name} (${i.weight}) - ₹${i.price}</p>`));
    win.document.write(`<h3>Total: ₹${total}</h3>`);
    win.print();
  };

  const placeOrderWhatsApp = () => {
    const msg = cart.map(i => `${i.name} ${i.weight} - ₹${i.price}`).join("\n");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    generateInvoicePDF();
    setCart([]);
  };

  const renderItem = (item) => (
    <div key={item.id} style={{ ...styles.card, ...(outOfStock[item.id] ? styles.faded : {}) }}>
      <strong>{item.name}</strong>
      {isAdmin && (
        <div>
          <button onClick={() => toggleStock(item.id)} style={{ fontSize: 12, marginBottom: 6 }}>
            {outOfStock[item.id] ? "Mark In Stock" : "Mark Out of Stock"}
          </button>
        </div>
      )}
      <select
        style={{ width: "100%", padding: 6, margin: "6px 0" }}
        value={selectedWeights[item.id] || "250g"}
        onChange={(e) => setSelectedWeights({ ...selectedWeights, [item.id]: e.target.value })}
      >
        {WEIGHTS.map(w => <option key={w}>{w}</option>)}
      </select>
      <div>₹{priceFor(item)}</div>
      <button style={styles.buttonOrange} disabled={outOfStock[item.id]} onClick={() => addToCart(item)}>Add to Cart</button>
    </div>
  );

    const filterItems = (items) => items.filter(i => {
    const matchCategory = category === "ALL" || category === i.category;
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2>Vijaya Home Foods</h2>
        <button onClick={() => setShowAdmin(!showAdmin)}>Admin</button>
      </div>

      {showAdmin && !isAdmin && (
        <input
          type="password"
          placeholder="Admin PIN"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value === ADMIN_PIN) {
              setIsAdmin(true);
              e.target.value = "";
            }
          }}
        />
      )}

      {/* Search + Category */}
      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          {["ALL", "PICKLES", "PODULU"].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                padding: "6px 10px",
                background: category === c ? "#ea580c" : "#ddd",
                color: category === c ? "#fff" : "#000",
                borderRadius: 6,
                border: "none",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {(category === "ALL" || category === "PICKLES") && (
        <>
          <h3>Pickles</h3>
          <div style={styles.grid}>
            {filterItems(
              PICKLES.map((p) => ({ ...p, category: "PICKLES" }))
            ).map(renderItem)}
          </div>
        </>
      )}

      {(category === "ALL" || category === "PODULU") && (
        <>
          <h3 style={{ marginTop: 16 }}>Podulu</h3>
          <div style={styles.grid}>
            {filterItems(
              PODULU.map((p) => ({ ...p, category: "PODULU" }))
            ).map(renderItem)}
          </div>
        </>
      )}

      {cart.length > 0 && (
        <div style={styles.cart}>
          <div>Total ₹{total}</div>
          <button style={styles.buttonGreen} onClick={placeOrderWhatsApp}>
            Order on WhatsApp & Download Invoice
          </button>
        </div>
      )}
    </div>
  );
}

