import { useState, useEffect } from "react";

// 🌐 Public path (CRA + GitHub Pages safe)
const PUBLIC = "";

// 🔐 Admin PIN
const ADMIN_PIN = "845921";

// 📲 WhatsApp number
const WHATSAPP_NUMBER = "919030124218";

// ---------------- DATA ----------------
const WEIGHTS = ["100g", "250g", "500g", "1kg"];
const WEIGHT_IN_GRAMS = { "100g": 100, "250g": 250, "500g": 500, "1kg": 1000 };

const PICKLES = [
  { id: "avakaya", name: "Avakaya", image: PUBLIC + "/images/avakaya.jpg", basePrice: 250, baseWeight: "250g" },
  { id: "gongura", name: "Gongura", image: PUBLIC + "/images/gongura.jpg", basePrice: 250, baseWeight: "250g" },
];

const PODULU = [
  { id: "kandi", name: "Kandi Podi", image: PUBLIC + "/images/kandi.jpg", basePrice: 180, baseWeight: "200g" },
];

const MASALALU = [
  { id: "sambar", name: "Sambar Powder", image: PUBLIC + "/images/sambar.jpg", basePrice: 180, baseWeight: "200g" },
];

// ---------------- COMPONENT ----------------
export default function VijayaHomeFoods() {

  const [selectedWeights, setSelectedWeights] = useState({});
  const [cart, setCart] = useState([]);

  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [dailySales, setDailySales] = useState({});
  const [monthlySales, setMonthlySales] = useState({});

  useEffect(() => {
    document.title = "Vijaya Home Foods | Traditional Andhra Pickles, Podulu & Masalalu";
    setDailySales(JSON.parse(localStorage.getItem("dailySales") || "{}"));
    setMonthlySales(JSON.parse(localStorage.getItem("monthlySales") || "{}"));
  }, []);

  const priceFor = (item) => Math.round(
    item.basePrice *
      (WEIGHT_IN_GRAMS[selectedWeights[item.id] || "100g"] /
        WEIGHT_IN_GRAMS[item.baseWeight])
  );

  const addToCart = (item) => {
    const weight = selectedWeights[item.id] || "100g";
    const price = priceFor(item);
    setCart([...cart, { ...item, weight, price }]);
  };

  const total = cart.reduce((s, i) => s + i.price, 0);

  const placeOrderWhatsApp = () => {
    const lines = cart.map(i => `${i.name} ${i.weight} - ₹${i.price}`).join("\n");
    const text = `Order from Vijaya Home Foods%0A${lines}%0ATotal ₹${total}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");

    const today = new Date().toISOString().slice(0, 10);
    const month = today.slice(0, 7);

    const updatedDaily = { ...dailySales, [today]: (dailySales[today] || 0) + total };
    const updatedMonthly = { ...monthlySales, [month]: (monthlySales[month] || 0) + total };

    localStorage.setItem("dailySales", JSON.stringify(updatedDaily));
    localStorage.setItem("monthlySales", JSON.stringify(updatedMonthly));

    setDailySales(updatedDaily);
    setMonthlySales(updatedMonthly);
    setCart([]);
  };

  const renderItem = (item) => (
    <div key={item.id} className="bg-white p-4 rounded-xl shadow">
      <img
        src={item.image}
        onError={(e) => (e.target.src = PUBLIC + "/images/placeholder.jpg")}
        className="h-40 w-full object-cover rounded"
        alt={item.name}
      />
      <h4 className="font-semibold mt-2">{item.name}</h4>

      <select
        className="w-full border p-2 my-2"
        value={selectedWeights[item.id] || "100g"}
        onChange={(e) =>
          setSelectedWeights({ ...selectedWeights, [item.id]: e.target.value })
        }
      >
        {WEIGHTS.map((w) => (
          <option key={w}>{w}</option>
        ))}
      </select>

      <p>₹{priceFor(item)}</p>
      <button
        onClick={() => addToCart(item)}
        className="bg-orange-600 text-white w-full py-2 rounded"
      >
        Add to Cart
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#faf7f2] p-4 pb-28">

      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-orange-700">Vijaya Home Foods</h1>
          <p className="text-sm text-gray-600">Traditional Andhra Brahmin Preparations</p>
        </div>
        <button onClick={() => setShowAdmin(!showAdmin)} className="text-sm underline">
          Admin
        </button>
      </header>

      {showAdmin && !isAdmin && (
        <input
          type="password"
          placeholder="Enter Admin PIN"
          className="border p-2 mb-4"
          onKeyDown={(e) =>
            e.key === "Enter" && e.target.value === ADMIN_PIN && setIsAdmin(true)
          }
        />
      )}

      {isAdmin && (
        <div className="bg-white p-4 rounded mb-6">
          <h3 className="font-semibold mb-2">Sales Summary</h3>
          <h4 className="font-semibold">Daily</h4>
          {Object.entries(dailySales).map(([d, v]) => (
            <p key={d}>{d}: ₹{v}</p>
          ))}
          <h4 className="font-semibold mt-2">Monthly</h4>
          {Object.entries(monthlySales).map(([m, v]) => (
            <p key={m}>{m}: ₹{v}</p>
          ))}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-3">Pickles</h2>
      <div className="grid grid-cols-2 gap-4">{PICKLES.map(renderItem)}</div>

      <h2 className="text-xl font-semibold my-3">Podulu</h2>
      <div className="grid grid-cols-2 gap-4">{PODULU.map(renderItem)}</div>

      <h2 className="text-xl font-semibold my-3">Masalalu</h2>
      <div className="grid grid-cols-2 gap-4">{MASALALU.map(renderItem)}</div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow">
          <p className="font-semibold">Total ₹{total}</p>
          <button
            onClick={placeOrderWhatsApp}
            className="bg-green-600 text-white w-full py-2 rounded mt-2"
          >
            Order on WhatsApp
          </button>
        </div>
      )}
    </div>
  );
}
