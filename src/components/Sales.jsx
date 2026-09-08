function Sales({
  sales,
  products,
  canCreateTransactions,
  canProcessTransactions,
  onCreateSale,
  onCompleteSale,
  onViewSale,
}) {
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="section-kicker">REVENUE</div>
          <h1>Sales</h1>
          <p>Create sales orders and confirm outgoing stock.</p>
        </div>

        {canCreateTransactions && (
          <button className="primary-btn" onClick={onCreateSale}>
            + Create Sale
          </button>
        )}
      </div>

      <div className="process-flow">
        <div>
          <span>01</span>
          Create SO
        </div>

        <div className="flow-arrow">→</div>

        <div>
          <span>02</span>
          Confirm
        </div>

        <div className="flow-arrow">→</div>

        <div>
          <span>03</span>
          Stock -
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <div className="section-kicker">SALES ORDERS</div>
            <h2>Sales History</h2>
          </div>

          <span className="result-count">{sales.length} orders</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>SO NUMBER</th>
                <th>CUSTOMER</th>
                <th>PRODUCTS</th>
                <th>QTY</th>
                <th>TOTAL</th>
                <th>DATE</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {sales.length > 0 ? (
                sales.map((sale) => (
                  <SaleRow
                    key={sale.id}
                    sale={sale}
                    products={products}
                    canProcessTransactions={canProcessTransactions}
                    onCompleteSale={onCompleteSale}
                    onViewSale={onViewSale}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-cell">
                    No sales orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function SaleRow({
  sale,
  products,
  canProcessTransactions,
  onCompleteSale,
  onViewSale,
}) {
  const items = sale.items || [
    {
      productId: sale.productId,
      qty: sale.qty,
    },
  ];

  const productNames = items.map((item) => {
    const product = products.find(
      (productItem) => productItem.id == item.productId,
    );

    return product ? product.name : "Unknown Product";
  });

  const totalQty = items.reduce(
    (total, item) => total + Number(item.qty || 0),
    0,
  );

  return (
    <tr>
      <td>
        <strong>{sale.number}</strong>
      </td>

      <td>{sale.customer}</td>

      <td>
        <div className="transaction-products">
          {productNames.map((name, index) => (
            <span key={`${sale.id}-${index}`}>
              {name}
              {index < productNames.length - 1 ? "," : ""}
            </span>
          ))}
        </div>
      </td>

      <td>{totalQty}</td>

      <td>{formatCurrency(sale.total)}</td>

      <td>{formatDate(sale.date)}</td>

      <td>
        <Status status={sale.status} />
      </td>

      <td>
        <div className="transaction-actions">
          <button className="small-action" onClick={() => onViewSale(sale)}>
            View
          </button>

          {sale.status == "Pending" && canProcessTransactions ? (
            <button
              className="small-action"
              onClick={() => onCompleteSale(sale.id)}
            >
              Confirm
            </button>
          ) : null}
        </div>
      </td>
    </tr>
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

export default Sales;
