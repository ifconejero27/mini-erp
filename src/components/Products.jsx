function Products({
  products,
  search,
  onSearchChange,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  canManageProducts,
}) {
  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase();

    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="section-kicker">CATALOG</div>
          <h1>Products</h1>
          <p>Manage your products, pricing, and stock levels.</p>
        </div>

        {canManageProducts && (
          <button className="primary-btn" onClick={onAddProduct}>
            + Add Product
          </button>
        )}
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search products, categories, or SKU..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <div className="section-kicker">PRODUCT LIST</div>
            <h2>All Products</h2>
          </div>

          <span className="result-count">
            {filteredProducts.length} products
          </span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>PRODUCT</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th>REORDER LEVEL</th>
                <th>STATUS</th>
                {canManageProducts && <th>ACTIONS</th>}
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.sku}</td>

                    <td>
                      <strong>{product.name}</strong>
                    </td>

                    <td>{product.category}</td>

                    <td>{formatCurrency(product.price)}</td>

                    <td>{product.stock}</td>

                    <td>{product.reorder}</td>

                    <td>
                      <StockStatus product={product} />
                    </td>

                    {canManageProducts && (
                      <td>
                        <div className="table-actions">
                          <button
                            className="text-btn"
                            onClick={() => onEditProduct(product)}
                          >
                            Edit
                          </button>

                          <button
                            className="text-btn delete-text"
                            onClick={() => onDeleteProduct(product.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={canManageProducts ? "8" : "7"}
                    className="empty-cell"
                  >
                    No products found.
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

function StockStatus({ product }) {
  if (product.stock == 0) {
    return <span className="stock-status low">Out of Stock</span>;
  }

  const isLow = product.stock <= product.reorder;

  return (
    <span className={`stock-status ${isLow ? "low" : "good"}`}>
      {isLow ? "Low Stock" : "In Stock"}
    </span>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value);
}

export default Products;
