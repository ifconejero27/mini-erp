function Inventory({
  products,
  movements,
  canCreateTransactions,
  onAdjustStock,
}) {
  const totalUnits = products.reduce(
    (total, product) => total + product.stock,
    0,
  );

  const lowStockCount = products.filter(
    (product) => product.stock <= product.reorder,
  ).length;

  const recentMovements = [...movements]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="section-kicker">WAREHOUSE</div>
          <h1>Inventory</h1>
          <p>Track stock levels and inventory movements.</p>
        </div>

        {canCreateTransactions && (
          <button className="primary-btn" onClick={onAdjustStock}>
            + Adjust Stock
          </button>
        )}
      </div>

      <div className="inventory-summary">
        <div>
          <span>TOTAL PRODUCTS</span>
          <strong>{products.length}</strong>
        </div>

        <div>
          <span>TOTAL UNITS</span>
          <strong>{totalUnits}</strong>
        </div>

        <div>
          <span>LOW STOCK ITEMS</span>
          <strong>{lowStockCount}</strong>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <div className="section-kicker">STOCK LEVELS</div>
            <h2>Current Inventory</h2>
          </div>

          <span className="result-count">{products.length} products</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>PRODUCT</th>
                <th>CATEGORY</th>
                <th>CURRENT STOCK</th>
                <th>REORDER LEVEL</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => {
                const isLow = product.stock <= product.reorder;

                return (
                  <tr key={product.id}>
                    <td>{product.sku}</td>

                    <td>
                      <strong>{product.name}</strong>
                    </td>

                    <td>{product.category}</td>

                    <td>{product.stock}</td>

                    <td>{product.reorder}</td>

                    <td>
                      <span
                        className={`stock-status ${isLow ? "low" : "good"}`}
                      >
                        {isLow ? "Low Stock" : "In Stock"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel" style={{ marginTop: "20px" }}>
        <div className="panel-header">
          <div>
            <div className="section-kicker">MOVEMENTS</div>
            <h2>Inventory History</h2>
          </div>

          <span className="result-count">{movements.length} movements</span>
        </div>

        <div className="movement-list">
          {recentMovements.length > 0 ? (
            recentMovements.map((movement) => (
              <div className="movement-item" key={movement.id}>
                <div className={`movement-icon ${movement.type.toLowerCase()}`}>
                  {movement.type}
                </div>

                <div className="movement-info">
                  <strong>{movement.productName}</strong>

                  <span>
                    {movement.reference} · {formatDate(movement.date)}
                  </span>

                  {movement.reason && <span>{movement.reason}</span>}
                </div>

                <strong
                  className={
                    movement.type == "IN" ? "movement-in" : "movement-out"
                  }
                >
                  {movement.type == "IN" ? "+" : "-"}
                  {movement.qty}
                </strong>
              </div>
            ))
          ) : (
            <div className="empty-state">No inventory movements found.</div>
          )}
        </div>
      </div>
    </>
  );
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-PH", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default Inventory;
