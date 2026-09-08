function Reports({ products, sales, purchases }) {
  const completedSales = sales.filter((sale) => sale.status == "Completed");
  const pendingSales = sales.filter((sale) => sale.status == "Pending");

  const receivedPurchases = purchases.filter(
    (purchase) => purchase.status == "Received",
  );

  const pendingPurchases = purchases.filter(
    (purchase) => purchase.status == "Pending",
  );

  const totalSales = completedSales.reduce(
    (total, sale) => total + Number(sale.total),
    0,
  );

  const totalPurchases = receivedPurchases.reduce(
    (total, purchase) => total + Number(purchase.total),
    0,
  );

  const inventoryValue = products.reduce(
    (total, product) => total + product.stock * product.price,
    0,
  );

  const totalUnitsSold = completedSales.reduce((total, sale) => {
    if (sale.items) {
      return (
        total +
        sale.items.reduce((itemTotal, item) => {
          return itemTotal + Number(item.qty);
        }, 0)
      );
    }

    return total + Number(sale.qty);
  }, 0);

  const totalUnitsPurchased = receivedPurchases.reduce((total, purchase) => {
    if (purchase.items) {
      return (
        total +
        purchase.items.reduce((itemTotal, item) => {
          return itemTotal + Number(item.qty);
        }, 0)
      );
    }

    return total + Number(purchase.qty);
  }, 0);

  const productSales = products
    .map((product) => {
      let quantity = 0;
      let revenue = 0;

      completedSales.forEach((sale) => {
        if (sale.items) {
          sale.items.forEach((item) => {
            if (item.productId == product.id) {
              quantity += Number(item.qty);
              revenue += product.price * Number(item.qty);
            }
          });
        } else if (sale.productId == product.id) {
          quantity += Number(sale.qty);
          revenue += Number(sale.total);
        }
      });

      return {
        ...product,
        quantity,
        revenue,
      };
    })
    .filter((product) => product.quantity > 0)
    .sort((a, b) => b.quantity - a.quantity);

  const productPurchases = products
    .map((product) => {
      let quantity = 0;
      let spending = 0;

      receivedPurchases.forEach((purchase) => {
        if (purchase.items) {
          purchase.items.forEach((item) => {
            if (item.productId == product.id) {
              quantity += Number(item.qty);
              spending += Number(item.qty) * Number(item.cost);
            }
          });
        } else if (purchase.productId == product.id) {
          quantity += Number(purchase.qty);
          spending += Number(purchase.total);
        }
      });

      return {
        ...product,
        quantity,
        spending,
      };
    })
    .filter((product) => product.quantity > 0)
    .sort((a, b) => b.quantity - a.quantity);

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="section-kicker">ANALYTICS</div>
          <h1>Reports</h1>
          <p>Review sales, purchasing, and inventory performance.</p>
        </div>
      </div>

      <div className="stats-grid">
        <Stat
          label="SALES REVENUE"
          value={formatCurrency(totalSales)}
          detail={`${completedSales.length} completed orders`}
        />

        <Stat
          label="PURCHASE SPENDING"
          value={formatCurrency(totalPurchases)}
          detail={`${receivedPurchases.length} received orders`}
        />

        <Stat
          label="INVENTORY VALUE"
          value={formatCurrency(inventoryValue)}
          detail="Based on current selling price"
        />

        <Stat
          label="UNITS SOLD"
          value={totalUnitsSold}
          detail={`${completedSales.length} completed orders`}
        />
      </div>

      <div className="report-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <div className="section-kicker">SALES</div>
              <h2>Sales Overview</h2>
            </div>
          </div>

          <div className="report-summary">
            <div>
              <span>COMPLETED</span>
              <strong>{completedSales.length}</strong>
            </div>

            <div>
              <span>PENDING</span>
              <strong>{pendingSales.length}</strong>
            </div>

            <div>
              <span>REVENUE</span>
              <strong>{formatCurrency(totalSales)}</strong>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <div className="section-kicker">PURCHASING</div>
              <h2>Purchasing Overview</h2>
            </div>
          </div>

          <div className="report-summary">
            <div>
              <span>RECEIVED</span>
              <strong>{receivedPurchases.length}</strong>
            </div>

            <div>
              <span>PENDING</span>
              <strong>{pendingPurchases.length}</strong>
            </div>

            <div>
              <span>UNITS PURCHASED</span>
              <strong>{totalUnitsPurchased}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <div className="section-kicker">PRODUCT PERFORMANCE</div>
            <h2>Best-Selling Products</h2>
          </div>

          <span className="result-count">{productSales.length} products</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>SKU</th>
                <th>QUANTITY SOLD</th>
                <th>REVENUE</th>
              </tr>
            </thead>

            <tbody>
              {productSales.length > 0 ? (
                productSales.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <strong>{product.name}</strong>
                    </td>

                    <td>{product.sku}</td>

                    <td>{product.quantity}</td>

                    <td>{formatCurrency(product.revenue)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-cell">
                    No completed sales found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel" style={{ marginTop: "20px" }}>
        <div className="panel-header">
          <div>
            <div className="section-kicker">PURCHASING PERFORMANCE</div>
            <h2>Purchased Products</h2>
          </div>

          <span className="result-count">
            {productPurchases.length} products
          </span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>SKU</th>
                <th>QUANTITY PURCHASED</th>
                <th>SPENDING</th>
              </tr>
            </thead>

            <tbody>
              {productPurchases.length > 0 ? (
                productPurchases.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <strong>{product.name}</strong>
                    </td>

                    <td>{product.sku}</td>

                    <td>{product.quantity}</td>

                    <td>{formatCurrency(product.spending)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-cell">
                    No received purchases found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel" style={{ marginTop: "20px" }}>
        <div className="panel-header">
          <div>
            <div className="section-kicker">INVENTORY</div>
            <h2>Inventory Valuation</h2>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>SKU</th>
                <th>STOCK</th>
                <th>UNIT PRICE</th>
                <th>STOCK VALUE</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <strong>{product.name}</strong>
                  </td>

                  <td>{product.sku}</td>

                  <td>{product.stock}</td>

                  <td>{formatCurrency(product.price)}</td>

                  <td>{formatCurrency(product.stock * product.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
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

function formatCurrency(value) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value);
}

export default Reports;
