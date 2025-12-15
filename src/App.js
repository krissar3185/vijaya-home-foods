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

// 🌶️ PODULU
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
  exportBtn: { background: "#2563eb", color: "#fff", padding: 8, borderRadius: 6, border: "none", marginRight: 8 },
  page: { padding: 16, paddingBottom: 120, background: "#faf7f2", minHeight: "100vh", fontFamily: "Arial, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  grid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 },
  card: { background: "#fff", padding: 12, borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.15)" },
  faded: { opacity: 0.5 },
  buttonOrange: { background: "#ea580c", color: "#fff", padding: 10, borderRadius: 8, width: "100%", border: "none" },
  buttonGreen: { background: "#16a34a", color: "#fff", padding: 12, borderRadius: 8, width: "100%", border: "none" },
  cart: { position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", padding: 12, boxShadow: "0 -2px 6px rgba(0,0,0,0.2)" },
  adminBox: { background: "#fff", padding: 12, borderRadius: 10, marginBottom: 12 }
};

export default function VijayaHomeFoods() {
  const [view, setView] = useState("SHOP");
  const [search, setSearch] = useState("");
  const [selectedWeights, setSelectedWeights] = useState({});
  const [cart, setCart] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stock, setStock] = useState({});
  const [sales, setSales] = useState({});

  useEffect(() => {
    const savedStock = JSON.parse(localStorage.getItem("stock") || "{}");
    const initialStock = {};
    [...PICKLES, ...PODULU].forEach(p => {
      initialStock[p.id] = savedStock[p.id] ?? 10;
    });
    setStock(initialStock);

    setSales(JSON.parse(localStorage.getItem("sales") || "{}"));
  }, []);

  const priceFor = (item) => Math.round(
    item.basePrice *
      (WEIGHT_IN_GRAMS[selectedWeights[item.id] || "250g"] /
        WEIGHT_IN_GRAMS[item.baseWeight])
  );

  const addToCart = (item) => {
    if (stock[item.id] <= 0) return;
    const weight = selectedWeights[item.id] || "250g";
    const price = priceFor(item);
    setCart([...cart, { ...item, weight, price }]);
  };

  const updateStock = (id, value) => {
    const updated = { ...stock, [id]: Math.max(0, Number(value)) };
    setStock(updated);
    localStorage.setItem("stock", JSON.stringify(updated));
  };

  const total = cart.reduce((s, i) => s + i.price, 0);

  const generateInvoicePDF = () => {
    const invoiceNo = "VH-" + Date.now().toString().slice(-5);
    const dateStr = new Date().toLocaleString();

    const rows = cart
      .map(i => `${i.name} ${i.weight}  ₹${i.price}`)
      .join("\n");

    const html = `
      <html>
      <head>
        <title>Invoice</title>
      </head>
      <body style="font-family:Arial,sans-serif;padding:20px;">
        <div style="text-align:center;">
          <img src="logo.png" style="max-width:120px;margin-bottom:8px;" />
          <h2 style="margin:4px 0;">Vijaya Home Foods</h2>
          <div style="font-size:13px;">Authentic Andhra Brahmin Preparations</div>
        </div>

        <hr />
        <div style="font-size:13px;">Invoice No: ${invoiceNo}</div>
        <div style="font-size:13px;">Date: ${dateStr}</div>
        <hr />

        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <thead>
            <tr>
              <th style="border:1px solid #ccc;padding:6px;text-align:left;">Item</th>
              <th style="border:1px solid #ccc;padding:6px;text-align:center;">Qty</th>
              <th style="border:1px solid #ccc;padding:6px;text-align:right;">Price</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

        <h3 style="text-align:right;margin-top:10px;">Total: ₹${total}</h3>

        <hr />
        <div style="text-align:center;font-size:13px;">Thank you for your order 🙏</div>
        <div style="text-align:center;font-size:13px;">WhatsApp: 9030124218</div>

        <script>
          window.onload = () => { window.print(); }
        </script>
      </body>
      </html>
    `;

    const win = window.open("", "Invoice", "width=800,height=600");
    if (!win) return alert("Please allow popups to download invoice");
    win.document.write(html);
    win.document.close();
  };

  const generateThermalInvoice = () => {
    const rows = cart
      .map(i => `${i.name} ${i.weight}  ₹${i.price}`)
      .join("\n");

    const text = `VIJAYA HOME FOODS
--------------------
${rows}
--------------------
TOTAL ₹${total}
--------------------
WhatsApp: 9030124218`;

    const win = window.open("", "ThermalInvoice", "width=300,height=600");
    if (!win) return;
    win.document.write(`<pre style="font-family:monospace;font-size:14px;">${text}</pre>`);
    win.print();
  };

  const placeOrderWhatsApp = () => {
    const msg = cart.map(i => `${i.name} ${i.weight} - ₹${i.price}`).join("\n");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");

    const updatedStock = { ...stock };
    cart.forEach(i => {
      if (updatedStock[i.id] > 0) updatedStock[i.id] -= 1;
    });
    setStock(updatedStock);
    localStorage.setItem("stock", JSON.stringify(updatedStock));

    const today = new Date().toISOString().slice(0, 10);
    const updatedSales = { ...sales };
    if (!updatedSales[today]) updatedSales[today] = { orders: 0, total: 0 };
    updatedSales[today].orders += 1;
    updatedSales[today].total += total;
    setSales(updatedSales);
    localStorage.setItem("sales", JSON.stringify(updatedSales));

    generateInvoicePDF();
    setCart([]);
  };

  const filterItems = (items) => items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = (item) => (
    <div key={item.id} style={{ ...styles.card, ...(stock[item.id] <= 0 ? styles.faded : {}) }}>
      <strong>{item.name}</strong>
      {isAdmin && (
        <input
          type="number"
          min="0"
          value={stock[item.id]}
          onChange={(e) => updateStock(item.id, e.target.value)}
          style={{ width: "100%", margin: "6px 0" }}
        />
      )}
      <select
        style={{ width: "100%", padding: 6, margin: "6px 0" }}
        value={selectedWeights[item.id] || "250g"}
        onChange={(e) => setSelectedWeights({ ...selectedWeights, [item.id]: e.target.value })}
      >
        {WEIGHTS.map(w => <option key={w}>{w}</option>)}
      </select>
      <div>₹{priceFor(item)}</div>
      <button style={styles.buttonOrange} disabled={stock[item.id] <= 0} onClick={() => addToCart(item)}>Add to Cart</button>
    </div>
  );

  const todayKey = new Date().toISOString().slice(0, 10);

  const exportExcel = (mode) => {
    let rows = [];

    if (mode === "DAILY") {
      Object.entries(sales).forEach(([date, v]) => {
        rows.push(`${date},${v.orders},${v.total}`);
      });
    } else {
      const monthly = {};
      Object.entries(sales).forEach(([date, v]) => {
        const month = date.slice(0, 7);
        if (!monthly[month]) monthly[month] = { orders: 0, total: 0 };
        monthly[month].orders += v.orders;
        monthly[month].total += v.total;
      });
      Object.entries(monthly).forEach(([m, v]) => {
        rows.push(`${m},${v.orders},${v.total}`);
      });
    }

    const csv = "Date/Month,Orders,Total" + rows.join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = mode === "DAILY" ? "daily-sales.csv" : "monthly-sales.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const todaySales = sales[todayKey] || { orders: 0, total: 0 };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2>Vijaya Home Foods</h2>
        <div>
          <button onClick={() => setView("SHOP")} style={{ marginRight: 8 }}>Shop</button>
          {isAdmin && <button onClick={() => setView("ADMIN")}>Admin Dashboard</button>}
          {!isAdmin && <button onClick={() => setShowAdmin(!showAdmin)} style={{ marginLeft: 8 }}>Admin</button>}
        </div>
      </div>

      {showAdmin && !isAdmin && (
        <input
          type="password"
          placeholder="Admin PIN"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value === ADMIN_PIN) {
              setIsAdmin(true);
              setView("ADMIN");
              e.target.value = "";
            }
          }}
        />
      )}

      {view === "SHOP" && (
        <>
          <input
            placeholder="Search products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 12 }}
          />

          <h3>Pickles</h3>
          <div style={styles.grid}>{filterItems(PICKLES).map(renderItem)}</div>

          <h3 style={{ marginTop: 16 }}>Podulu</h3>
          <div style={styles.grid}>{filterItems(PODULU).map(renderItem)}</div>

          {cart.length > 0 && (
            <div style={styles.cart}>
              <div>Total ₹{total}</div>
              <button style={styles.buttonGreen} onClick={() => { placeOrderWhatsApp(); generateThermalInvoice(); }}>
                Order on WhatsApp & Download Invoice
              </button>
            </div>
          )}
        </>
      )}

      {view === "ADMIN" && isAdmin && (
        <>
          <div style={styles.adminBox}>
            <h3>Today Summary</h3>
            <div>Orders: {todaySales.orders}</div>
            <div>Sales: ₹{todaySales.total}</div>
          </div>

          <div style={styles.adminBox}>
            <h3>Stock Management</h3>
            {[...PICKLES, ...PODULU].map(p => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span>{p.name}</span>
                <input
                  type="number"
                  min="0"
                  value={stock[p.id]}
                  onChange={(e) => updateStock(p.id, e.target.value)}
                  style={{ width: 80 }}
                />
              </div>
            ))}
          </div>

          <div style={styles.adminBox}>
            <h3>Sales Export</h3>
            <button style={styles.exportBtn} onClick={() => exportExcel("DAILY")}>Export Daily Excel</button>
            <button style={styles.exportBtn} onClick={() => exportExcel("MONTHLY")}>Export Monthly Excel</button>
          </div>

          <div style={styles.adminBox}>
            <h3>Monthly Summary</h3>
            <p style={{ fontSize: 12, opacity: 0.7 }}>
              Monthly totals & Excel export will be enabled in Phase 3
            </p>
          </div>
        </>
      )}
    </div>
  );
}
