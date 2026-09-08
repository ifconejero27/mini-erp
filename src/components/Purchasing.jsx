function Purchasing({
  purchases,
  products,
  canCreateTransactions,
  onCreatePurchase,
  onReceivePurchase,
  onViewPurchase,
}) {
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="section-kicker">PROCUREMENT</div>
          <h1>Purchasing</h1>
          <p>Create purchase orders and receive incoming stock.</p>
        </div>

        {canCreateTransactions && (
          <button className="primary-btn" onClick={onCreatePurchase}>
            + Create Purchase
          </button>
        )}
      </div>

      <div className="process-flow">
        <div>
          <span>01</span>
          Create PO
        </div>

        <div className="flow-arrow">→</div>

        <div>
          <span>02</span>
          Receive
        </div>

        <div className="flow-arrow">→</div>

        <div>
          <span>03</span>
          Stock +
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <div className="section-kicker">PURCHASE ORDERS</div>
            <h2>Purchase History</h2>
          </div>

          <span className="result-count">{purchases.length} orders</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>PO NUMBER</th>
                <th>SUPPLIER</th>
                <th>PRODUCTS</th>
                <th>QTY</th>
                <th>TOTAL</th>
                <th>DATE</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {purchases.length > 0 ? (
                purchases.map((purchase) => (
                  <PurchaseRow
                    key={purchase.id}
                    purchase={purchase}
                    products={products}
                    canCreateTransactions={canCreateTransactions}
                    onReceivePurchase={onReceivePurchase}
                    onViewPurchase={onViewPurchase}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-cell">
                    No purchase orders found.
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

function PurchaseRow({
  purchase,
  products,
  canCreateTransactions,
  onReceivePurchase,
  onViewPurchase,
}) {
  const items = purchase.items || [
    {
      productId: purchase.productId,
      qty: purchase.qty,
      cost: purchase.total / purchase.qty,
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
        <strong>{purchase.number}</strong>
      </td>

      <td>{purchase.supplier}</td>

      <td>
        <div className="transaction-products">
          {productNames.map((name, index) => (
            <span key={`${purchase.id}-${index}`}>
              {name}
              {index < productNames.length - 1 ? "," : ""}
            </span>
          ))}
        </div>
      </td>

      <td>{totalQty}</td>

      <td>{formatCurrency(purchase.total)}</td>

      <td>{formatDate(purchase.date)}</td>

      <td>
        <Status status={purchase.status} />
      </td>

      <td>
        <div className="transaction-actions">
          <button
            className="small-action"
            onClick={() => onViewPurchase(purchase)}
          >
            View
          </button>

          {purchase.status == "Pending" && canCreateTransactions ? (
            <button
              className="small-action"
              onClick={() => onReceivePurchase(purchase.id)}
            >
              Receive
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

export default Purchasing;
