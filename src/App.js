import "./App.css";
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

// 🔐 Admin PIN (stored securely)
const DEFAULT_ADMIN_PIN = "845921";

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
  adminBox: { background: "#fff", padding: 12, borderRadius: 10, marginBottom: 12 },
  lowStock: { border: "2px solid #facc15" },   // yellow
  outStock: { border: "2px solid #dc2626", background: "#fef2f2" }, // red
  badgeLow: {background: "#fde68a", color: "#92400e", padding: "2px 6px", borderRadius: 6, fontSize: 11, marginLeft: 6},
  badgeOut: {background: "#fee2e2", color: "#991b1b", padding: "2px 6px", borderRadius: 6, fontSize: 11, marginLeft: 6}

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
  const [invoiceType, setInvoiceType] = useState("THERMAL");
  const [showConfirm, setShowConfirm] = useState(false);
  const [productSales, setProductSales] = useState(localStorage.getItem("productSales") || "{}")


  // 🔐 Admin PIN states
  const [adminPin, setAdminPin] = useState(localStorage.getItem("ADMIN_PIN") || DEFAULT_ADMIN_PIN);
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinMsg, setPinMsg] = useState("");
  const [adminTab, setAdminTab] = useState("OVERVIEW");


  useEffect(() => {
    setProductSales(JSON.parse(localStorage.getItem("productSales") || "{}"));
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
    const weight = selectedWeights[item.id] || "250g";
    const unitPrice = priceFor(item);

    const existing = cart.find(
      c => c.id === item.id && c.weight === weight
    );

    if (existing) {
      if (existing.qty >= stock[item.id]) {
        alert("Cannot add more than available stock");
        return;
      }

      setCart(cart.map(c =>
        c === existing
          ? { ...c, qty: c.qty + 1, price: (c.qty + 1) * unitPrice }
          : c
      ));
    } else {
      if (stock[item.id] <= 0) return;

      setCart([
        ...cart,
        {
          id: item.id,
          name: item.name,
          weight,
          unitPrice,
          qty: 1,
          price: unitPrice
        }
      ]);
    }
  };
  {
    cart.map((item, index) => (
      <div key={index} style={{ marginBottom: 6 }}>
        <strong>{item.name}</strong> ({item.weight})<br />

        <button
          onClick={() =>
            setCart(cart.map(c =>
              c === item && c.qty > 1
                ? { ...c, qty: c.qty - 1, price: (c.qty - 1) * c.unitPrice }
                : c
            ))
          }
        >➖</button>

        <span style={{ margin: "0 8px" }}>{item.qty}</span>

        <button
          onClick={() => {
            if (item.qty >= stock[item.id]) {
              alert("Stock limit reached");
              return;
            }

            setCart(cart.map(c =>
              c === item
                ? { ...c, qty: c.qty + 1, price: (c.qty + 1) * c.unitPrice }
                : c
            ));
          }}
        >➕</button>

        <span style={{ float: "right" }}>₹{item.price}</span>

        <div>
          <button
            style={{ color: "red", fontSize: 12 }}
            onClick={() => setCart(cart.filter(c => c !== item))}
          >
            Remove
          </button>
        </div>
      </div>
    ))
  }



  const updateStock = (id, value) => {
    const updated = { ...stock, [id]: Math.max(0, Number(value)) };
    setStock(updated);
    localStorage.setItem("stock", JSON.stringify(updated));
  };

  const total = cart.reduce((sum, i) => sum + i.price, 0);

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
          <img src="logo.jpeg" style="max-width:120px;margin-bottom:8px;" />
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
    const msg = cart
      .map(i => `${i.name} ${i.weight} - ₹${i.price}`)
      .join("\n");

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

    if (invoiceType === "THERMAL") generateThermalInvoice();
    else generateInvoicePDF();
    const productSales = JSON.parse(localStorage.getItem("productSales") || "{}");

    cart.forEach(item => {
      if (!productSales[item.id]) {
        productSales[item.id] = {
          name: item.name,
          qty: 0,
          total: 0
        };
      }
      productSales[item.id].qty += item.qty;
      productSales[item.id].total += item.price;
    });

    localStorage.setItem("productSales", JSON.stringify(productSales));

    setCart([]);
  };

  const filterItems = (items) => items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = (item) => {
    const isOut = stock[item.id] <= 0;
    const isLow = stock[item.id] > 0 && stock[item.id] <= 3;

    const getLast7Days = () => {
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d.toISOString().slice(0, 10));
      }
      return days;
    };

    const dailyLabels = getLast7Days();
    const dailyTotals = dailyLabels.map(
      d => sales[d]?.total || 0
    );

    const monthlyMap = {};
    Object.entries(sales).forEach(([date, v]) => {
      const m = date.slice(0, 7);
      if (!monthlyMap[m]) monthlyMap[m] = 0;
      monthlyMap[m] += v.total;
    });

    const monthlyLabels = Object.keys(monthlyMap).sort();
    const monthlyTotals = monthlyLabels.map(m => monthlyMap[m]);

    const dailyChartData = {
      labels: dailyLabels,
      datasets: [
        {
          label: "Daily Sales (₹)",
          data: dailyTotals,
          borderColor: "#16a34a",
          backgroundColor: "rgba(22,163,74,0.2)",
          tension: 0.3
        }
      ]
    };

    const monthlyChartData = {
      labels: monthlyLabels,
      datasets: [
        {
          label: "Monthly Sales (₹)",
          data: monthlyTotals,
          backgroundColor: "#2563eb"
        }
      ]
    };

    return (
      <div
        key={item.id}
        style={{
          ...styles.card,
          ...(isOut ? styles.outStock : {}),
          ...(isLow ? styles.lowStock : {}),
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div style={{fontWeight:'bold'}}>{item.name}</div>
          {stock[item.id] === 0 && (
            <div style={styles.badgeOut}>Out of stock</div>
          )}
          {stock[item.id] > 0 && stock[item.id] <= 3 && (
            <div style={styles.badgeLow}>Low stock</div>
          )}
        </div>

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
          onChange={(e) =>
            setSelectedWeights({ ...selectedWeights, [item.id]: e.target.value })
          }
        >
          {WEIGHTS.map((w) => (
            <option key={w}>{w}</option>
          ))}
        </select>

        <div>₹{priceFor(item)}</div>

        <button
          style={styles.buttonOrange}
          disabled={stock[item.id] <= 0}
          onClick={() => addToCart(item)}
        >
          Add to Cart
        </button>

      </div>
    );
  };

  const todayKey = new Date().toISOString().slice(0, 10);

  const exportExcel = (mode) => {
    let dataRows = [];

    if (mode === "DAILY") {
      Object.entries(sales).forEach(([date, v]) => {
        dataRows.push(`${date},${v.orders},${v.total}`);
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
        dataRows.push(`${m},${v.orders},${v.total}`);
      });
    }

    if (dataRows.length === 0) {
      alert("No sales data to export yet");
      return;
    }

    const csvData = "Date/Month,Orders,Total" +
      dataRows.join("\n");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = mode === "DAILY" ? "daily-sales.csv" : "monthly-sales.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };// export function

  const todaySales = sales[todayKey] || { orders: 0, total: 0 };
  // 📊 DAILY SALES (LAST 7 DAYS)
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }
    return days;
  };//getLast7Days

  const dailyLabels = getLast7Days();
  const dailyTotals = dailyLabels.map(d => sales[d]?.total || 0);

  const dailyChartData = {
    labels: dailyLabels,
    datasets: [
      {
        label: "Daily Sales (₹)",
        data: dailyTotals,
        borderColor: "#16a34a",
        backgroundColor: "rgba(22,163,74,0.2)",
        tension: 0.3
      }
    ]
  };

  // 📈 MONTHLY SALES
  const monthlyMap = {};
  Object.entries(sales).forEach(([date, v]) => {
    const month = date.slice(0, 7);
    if (!monthlyMap[month]) monthlyMap[month] = 0;
    monthlyMap[month] += v.total;
  });

  const monthlyLabels = Object.keys(monthlyMap).sort();
  const monthlyTotals = monthlyLabels.map(m => monthlyMap[m]);

  const monthlyChartData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Monthly Sales (₹)",
        data: monthlyTotals,
        backgroundColor: "#2563eb"
      }
    ]
  };

  const adminLogin = () => {
    let code = prompt("enter the password");
    if (code === adminPin) {
      setIsAdmin(true);
      setView("ADMIN");
      setShowAdmin( () => !showAdmin);
    } else {
      alert("password is incorrect");
    }
    
  }


  return (
    <>
      <div style={styles.page}>
        <div style={styles.header}>
          <h2>Vijaya Home Foods</h2>
          <div>
            {/* {isAdmin && <button onClick={() => setView("SHOP")} style={{ marginRight: 8 }}>Shop</button>} */}
            {/* {isAdmin && <button onClick={() => setView("ADMIN")}>Admin Dashboard</button>} */}
            {!isAdmin && <button onClick={ () => adminLogin()} style={{ marginLeft: 8 }}>Admin Login</button>}
            {isAdmin && <button onClick={() => setShowAdmin(() => {setIsAdmin(false); setView("SHOP"); return !showAdmin})} style={{ marginLeft: 8 }}>Admin Logout</button>}
          </div>
        </div>
{/* 
        {showAdmin && !isAdmin && (
          <input
            type="password"
            placeholder="Admin PIN"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value === adminPin) {
                setIsAdmin(true);
                setView("ADMIN");
                e.target.value = "";
              }
            }}
          />

        )} */}

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
                <div style={{ marginBottom: 6 }}>
                  <strong>Invoice Type:</strong><br />
                  <label>
                    <input type="radio" checked={invoiceType === "THERMAL"} onChange={() => setInvoiceType("THERMAL")} /> Thermal (80mm)
                  </label>{" "}
                  <label style={{ marginLeft: 12 }}>
                    <input type="radio" checked={invoiceType === "A4"} onChange={() => setInvoiceType("A4")} /> A4 PDF
                  </label>
                </div>
                <div>Total ₹{total}</div>
                <button
                  style={styles.buttonGreen}
                  onClick={() => setShowConfirm(true)}
                >
                  Review Order
                </button>

              </div>
            )}
          </>
        )}
        {isAdmin && (<>
         <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {["OVERVIEW", "STOCK", "REPORTS", "SETTINGS"].map(tab => (
            <button
              key={tab}
              onClick={() => setAdminTab(tab)}
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 8,
                border: "none",
                background: adminTab === tab ? "#16a34a" : "#e5e7eb",
                color: adminTab === tab ? "#fff" : "#000"
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {adminTab === "OVERVIEW" && (
          <>
            <div style={styles.adminBox}>
              <h3>Today Summary</h3>
              <div>Orders: {todaySales.orders}</div>
              <div>Sales: ₹{todaySales.total}</div>
            </div>

            <div style={styles.adminBox}>
              <h3>This Month</h3>
              <div>
                Orders: {
                  Object.entries(sales)
                    .filter(([d]) => d.startsWith(new Date().toISOString().slice(0, 7)))
                    .reduce((s, [_, v]) => s + v.orders, 0)
                }
              </div>
              <div>
                Sales: ₹{
                  Object.entries(sales)
                    .filter(([d]) => d.startsWith(new Date().toISOString().slice(0, 7)))
                    .reduce((s, [_, v]) => s + v.total, 0)
                }
              </div>
            </div>
          </>
        )}
        {adminTab === "STOCK" && (
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
        )}
        {adminTab === "REPORTS" && (
          <div style={{ marginTop: 24 }}>
            <h3>Product-wise Sales</h3>

            {Object.keys(productSales).length === 0 ? (
              <div>No product sales yet</div>
            ) : (
              <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th align="left">Product</th>
                    <th align="right">Qty Sold</th>
                    <th align="right">Revenue (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(productSales)
                    .sort((a, b) => b.qty - a.qty)
                    .map((p, i) => (
                      <tr key={i}>
                        <td>{p.name}</td>
                        <td align="right">{p.qty}</td>
                        <td align="right">₹{p.total}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}

            <div style={styles.adminBox}>
              <h3>Sales Export</h3>
              <button style={styles.exportBtn} onClick={() => exportExcel("DAILY")}>Export Daily Excel</button>
              <button style={styles.exportBtn} onClick={() => exportExcel("MONTHLY")}>Export Monthly Excel</button>
            </div>
            
            <div style={styles.adminBox}>
              <h3>Sales Reports</h3>
              <div style={{ marginTop: 16 }}>
                <h4>Daily Sales</h4>
                <Line data={dailyChartData} />
              </div>

              <div style={{ marginTop: 24 }}>
                <h4>Monthly Sales</h4>
                <Bar data={monthlyChartData} />
              </div>

            </div>
          </div>
        )}

        {adminTab === "SETTINGS" && (
          <div style={styles.adminBox}>
            <h3>Change Admin PIN</h3>
            <input
              type="password"
              placeholder="Current PIN"
              value={oldPin}
              onChange={(e) => setOldPin(e.target.value)}
              style={{ width: "100%", marginBottom: 6 }}
            />
            <input
              type="password"
              placeholder="New 6-digit PIN"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              style={{ width: "100%", marginBottom: 6 }}
            />
            <input
              type="password"
              placeholder="Confirm New PIN"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              style={{ width: "100%", marginBottom: 6 }}
            />
            <button
              style={styles.buttonGreen}
              onClick={() => {
                if (oldPin !== adminPin) return setPinMsg("Incorrect current PIN");
                if (newPin.length !== 6) return setPinMsg("PIN must be 6 digits");
                if (newPin !== confirmPin) return setPinMsg("PINs do not match");
                localStorage.setItem("ADMIN_PIN", newPin);
                setAdminPin(newPin);
                setOldPin("");
                setNewPin("");
                setConfirmPin("");
                setPinMsg("PIN updated successfully");
              }}
            >Save PIN</button>
            {pinMsg && <div style={{ marginTop: 6, color: pinMsg.includes("success") ? "green" : "red" }}>{pinMsg}</div>}
          </div>
        )}</>)}

        {showConfirm && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}>
            <div style={{
              background: "#fff",
              padding: 16,
              borderRadius: 12,
              width: "90%",
              maxWidth: 400
            }}>
              <h3>Confirm Your Order</h3>

              {cart.map((i, idx) => (
                <div key={idx} style={{ marginBottom: 6 }}>
                  {i.name} ({i.weight}) × {i.qty}
                  <span style={{ float: "right" }}>₹{i.price}</span>
                </div>
              ))}

              <hr />
              <strong>Total: ₹{total}</strong>

              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button
                  style={{ ...styles.buttonGreen, flex: 1 }}
                  onClick={() => {
                    setShowConfirm(false);
                    placeOrderWhatsApp();
                  }}
                >
                  Confirm & Order
                </button>

                <button
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                    background: "#fff"
                  }}
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>

  );

}
