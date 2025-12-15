import { useState, useEffect } from "react";

// 🌐 Public path (CRA + GitHub Pages safe)
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

export default function VijayaHomeFoods() {
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
    let win = null;
    try {
      win = window.open("", "Invoice", "width=800,height=600");
    } catch (e) {
      win = null;
    }

    if (!win || win.closed) {
      alert("Invoice popup was blocked. Please allow popups and try again.");
      return;
    }

    const html = `
      <html>
        <head>
          <title>Invoice - Vijaya Home Foods</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { margin-bottom: 4px; }
            hr { margin: 12px 0; }
          </style>
        </head>
        <body>
          <h2>Vijaya Home Foods</h2>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <hr />
          ${cart.map(i => `<p>${i.name} (${i.weight}) - ₹${i.price}</p>`).join("")}
          <hr />
          <h3>Total: ₹${total}</h3>
        </body>
      </html>
    `;

    win.document.open();
    win.document.write(html);
    win.document.close();

    // Delay print to avoid null blur errors in Chrome
    setTimeout(() => {
      try {
        win.focus();
        win.print();
      } catch (e) {
        console.warn("Print skipped due to browser restrictions");
      }
    }, 300);
  };

  const placeOrderWhatsApp = () => {
    const msg = cart.map(i => `${i.name} ${i.weight} - ₹${i.price}`).join("\n");
    const encodedMsg = encodeURIComponent(`Order from Vijaya Home Foods
${msg}
Total ₹${total}`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`, "_blank");
    generateInvoicePDF();
    setCart([]);
  };

  const renderItem = (item) => (
    <div key={item.id} className={`bg-white p-4 rounded shadow ${outOfStock[item.id] ? "opacity-50" : ""}`}>
      <h4 className="font-semibold">{item.name}</h4>
      {isAdmin && (
        <button onClick={() => toggleStock(item.id)} className="text-xs underline">
          {outOfStock[item.id] ? "Mark In Stock" : "Mark Out of Stock"}
        </button>
      )}
      <select
        className="w-full border p-1 my-2"
        value={selectedWeights[item.id] || "250g"}
        onChange={(e) => setSelectedWeights({ ...selectedWeights, [item.id]: e.target.value })}
      >
        {WEIGHTS.map(w => <option key={w}>{w}</option>)}
      </select>
      <p>₹{priceFor(item)}</p>
      <button
        disabled={outOfStock[item.id]}
        onClick={() => addToCart(item)}
        className="bg-orange-600 disabled:bg-gray-400 text-white w-full py-2 rounded"
      >
        Add to Cart
      </button>
    </div>
  );

  return (
    <div className="p-4 pb-24">
      <header className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Vijaya Home Foods</h1>
        <button onClick={() => setShowAdmin(!showAdmin)} className="text-sm underline">Admin</button>
      </header>

      {showAdmin && !isAdmin && (
        <input type="password" placeholder="Admin PIN" className="border p-1 mb-2"
          onKeyDown={e => e.key === "Enter" && e.target.value === ADMIN_PIN && setIsAdmin(true)} />
      )}

      <h2 className="font-semibold mt-3">Pickles</h2>
      <div className="grid grid-cols-2 gap-3">{PICKLES.map(renderItem)}</div>

      <h2 className="font-semibold mt-4">Podulu</h2>
      <div className="grid grid-cols-2 gap-3">{PODULU.map(renderItem)}</div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-3 shadow">
          <p>Total ₹{total}</p>
          <button onClick={placeOrderWhatsApp} className="bg-green-600 text-white w-full py-2 mt-2 rounded">Order on WhatsApp & Download Invoice</button>
        </div>
      )}
    </div>
  );
}
