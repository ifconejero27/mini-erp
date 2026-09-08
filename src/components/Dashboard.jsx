function Dashboard({
  products,
  sales,
  purchases,
  totalStock,
  salesToday,
  purchaseSpending,
  pendingSales,
  pendingPurchases,
  onNavigate,
}) {
  const lowStockProducts = products.filter(
    (product) => product.stock <= product.reorder,
  );

  const completedSales = sales.filter((sale) => sale.status == "Completed");

  const totalSalesRevenue = completedSales.reduce(
    (total, sale) => total + Number(sale.total || 0),
    0,
  );

  const totalUnitsSold = completedSales.reduce((total, sale) => {
    if (sale.items && sale.items.length > 0) {
      return (
        total +
        sale.items.reduce(
          (itemTotal, item) => itemTotal + Number(item.qty || 0),
          0,
        )
      );
    }

    return total + Number(sale.qty || 0);
  }, 0);

  const recentTransactions = [
    ...sales.map((sale) => ({
      id: sale.id,
      type: "Sale",
      reference: sale.number,
      name: sale.customer,
      total: sale.total,
      date: sale.date,
      status: sale.status,
    })),

    ...purchases.map((purchase) => ({
      id: purchase.id,
      type: "Purchase",
      reference: purchase.number,
      name: purchase.supplier,
      total: purchase.total,
      date: purchase.date,
      status: purchase.status,
    })),
  ]
    .sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    })
    .slice(0, 6);

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="section-kicker">OVERVIEW</div>
          <h1>Dashboard</h1>
          <p>Monitor your business operations and inventory.</p>
        </div>
      </div>

      <div className="stats-grid">
        <Stat
          label="PRODUCTS"
          value={products.length}
          detail="Active products"
        />

        <Stat
          label="TOTAL STOCK"
          value={totalStock}
          detail="Units in inventory"
        />

        <Stat
          label="SALES TODAY"
          value={formatCurrency(salesToday)}
          detail="Completed sales"
        />

        <Stat
          label="LOW STOCK"
          value={lowStockProducts.length}
          detail="Products needing attention"
        />

        <Stat
          label="SALES REVENUE"
          value={formatCurrency(totalSalesRevenue)}
          detail="All completed sales"
        />

        <Stat
          label="PURCHASE SPENDING"
          value={formatCurrency(purchaseSpending)}
          detail="All received purchases"
        />

        <Stat
          label="UNITS SOLD"
          value={totalUnitsSold}
          detail="From completed sales"
        />

        <Stat
          label="PENDING SALES"
          value={pendingSales}
          detail="Orders awaiting confirmation"
        />

        <Stat
          label="PENDING PURCHASES"
          value={pendingPurchases}
          detail="Orders awaiting receipt"
        />
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <div className="section-kicker">ACTIVITY</div>
              <h2>Recent Transactions</h2>
            </div>

            <span className="result-count">
              {recentTransactions.length} records
            </span>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>TYPE</th>
                  <th>REFERENCE</th>
                  <th>PARTY</th>
                  <th>TOTAL</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction) => (
                    <tr key={`${transaction.type}-${transaction.id}`}>
                      <td>{transaction.type}</td>

                      <td>
                        <strong>{transaction.reference}</strong>
                      </td>

                      <td>{transaction.name}</td>

                      <td>{formatCurrency(transaction.total)}</td>

                      <td>{formatDate(transaction.date)}</td>

                      <td>
                        <Status status={transaction.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-cell">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <div className="section-kicker">INVENTORY</div>
              <h2>Low Stock</h2>
            </div>

            <span className="result-count">
              {lowStockProducts.length} items
            </span>
          </div>

          <div className="low-stock-list">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <div className="low-stock-item" key={product.id}>
                  <div>
                    <strong>{product.name}</strong>

                    <span>
                      {product.category} · Reorder at {product.reorder}
                    </span>
                  </div>

                  <span className="stock-status low">{product.stock} left</span>
                </div>
              ))
            ) : (
              <div className="empty-state">
                All products have sufficient stock.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <div className="section-kicker">SHORTCUTS</div>
            <h2>Quick Actions</h2>
          </div>
        </div>

        <div className="quick-actions">
          <button onClick={() => onNavigate("Products")}>
            <span>01</span>
            Manage Products
          </button>

          <button onClick={() => onNavigate("Purchasing")}>
            <span>02</span>
            Create Purchase
          </button>

          <button onClick={() => onNavigate("Sales")}>
            <span>03</span>
            Create Sale
          </button>

          <button onClick={() => onNavigate("Inventory")}>
            <span>04</span>
            View Inventory
          </button>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value, detail }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function Status({ status }) {
  return <span className={`status ${status.toLowerCase()}`}>{status}</span>;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number(value || 0));
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-PH", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default Dashboard;
