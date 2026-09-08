import { useState } from "react";

function ProductModal({ product, onClose, onSubmit }) {
  const [name, setName] = useState(product ? product.name : "");
  const [sku, setSku] = useState(product ? product.sku : "");
  const [category, setCategory] = useState(product ? product.category : "");
  const [price, setPrice] = useState(product ? product.price : "");
  const [stock, setStock] = useState(product ? product.stock : "");
  const [reorder, setReorder] = useState(product ? product.reorder : "");

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      id: product ? product.id : null,
      name: name.trim(),
      sku: sku.trim(),
      category: category.trim(),
      price: Number(price),
      stock: Number(stock),
      reorder: Number(reorder),
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="section-kicker">
              {product ? "EDIT PRODUCT" : "NEW PRODUCT"}
            </div>
            <h2>{product ? "Edit Product" : "Add Product"}</h2>
          </div>

          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Product Name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </label>

            <label>
              SKU
              <input
                type="text"
                value={sku}
                onChange={(event) => setSku(event.target.value)}
                required
              />
            </label>

            <label>
              Category
              <input
                type="text"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
              />
            </label>

            <label>
              Selling Price
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                required
              />
            </label>

            <label>
              Stock
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(event) => setStock(event.target.value)}
                required
              />
            </label>

            <label>
              Reorder Level
              <input
                type="number"
                min="0"
                value={reorder}
                onChange={(event) => setReorder(event.target.value)}
                required
              />
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="primary-btn">
              {product ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PurchaseModal({ products, onClose, onSubmit }) {
  const [supplier, setSupplier] = useState("");

  const [items, setItems] = useState([
    {
      id: Date.now(),
      productId: "",
      qty: "",
      cost: "",
    },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        productId: "",
        qty: "",
        cost: "",
      },
    ]);
  };

  const removeItem = (id) => {
    if (items.length == 1) {
      return;
    }

    setItems(items.filter((item) => item.id != id));
  };

  const updateItem = (id, field, value) => {
    setItems(
      items.map((item) => {
        if (item.id != id) {
          return item;
        }

        return {
          ...item,
          [field]: value,
        };
      }),
    );
  };

  const total = items.reduce((sum, item) => {
    return sum + Number(item.qty || 0) * Number(item.cost || 0);
  }, 0);

  const handleSubmit = (event) => {
    event.preventDefault();

    const validItems = items.filter((item) => {
      return (
        item.productId != "" &&
        item.qty != "" &&
        item.cost != "" &&
        Number(item.qty) > 0 &&
        Number(item.cost) >= 0
      );
    });

    if (!supplier.trim()) {
      alert("Please enter a supplier.");
      return;
    }

    if (validItems.length == 0) {
      alert("Please add at least one valid product.");
      return;
    }

    onSubmit({
      supplier: supplier.trim(),
      items: validItems.map((item) => ({
        productId: Number(item.productId),
        qty: Number(item.qty),
        cost: Number(item.cost),
      })),
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal modal-large">
        <div className="modal-header">
          <div>
            <div className="section-kicker">PROCUREMENT</div>
            <h2>Create Purchase Order</h2>
          </div>

          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            Supplier
            <input
              type="text"
              value={supplier}
              onChange={(event) => setSupplier(event.target.value)}
              placeholder="Enter supplier name"
              required
            />
          </label>

          <div className="purchase-items-header">
            <h3>Products</h3>

            <button type="button" className="secondary-btn" onClick={addItem}>
              + Add Product
            </button>
          </div>

          <div className="purchase-items">
            {items.map((item, index) => {
              const product = products.find(
                (productItem) => productItem.id == Number(item.productId),
              );

              const lineTotal = Number(item.qty || 0) * Number(item.cost || 0);

              return (
                <div className="purchase-item" key={item.id}>
                  <div className="purchase-item-number">{index + 1}</div>

                  <div className="purchase-item-fields">
                    <label>
                      Product
                      <select
                        value={item.productId}
                        onChange={(event) =>
                          updateItem(item.id, "productId", event.target.value)
                        }
                        required
                      >
                        <option value="">Select product</option>

                        {products.map((productItem) => (
                          <option key={productItem.id} value={productItem.id}>
                            {productItem.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      Quantity
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(event) =>
                          updateItem(item.id, "qty", event.target.value)
                        }
                        required
                      />
                    </label>

                    <label>
                      Unit Cost
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.cost}
                        onChange={(event) =>
                          updateItem(item.id, "cost", event.target.value)
                        }
                        required
                      />
                    </label>

                    <div className="purchase-stock-info">
                      Current stock:{" "}
                      <strong>{product ? product.stock : "—"}</strong>
                    </div>

                    <div className="purchase-item-total">
                      {formatCurrency(lineTotal)}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="remove-item-btn"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length == 1}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          <div className="purchase-total">
            <span>Total Purchase</span>
            <strong>{formatCurrency(total)}</strong>
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="primary-btn">
              Create Purchase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SaleModal({ products, onClose, onSubmit, currentUser }) {
  const isCustomer = currentUser?.role == "User";
  const [customer, setCustomer] = useState(isCustomer ? currentUser.name : "");

  const [items, setItems] = useState([
    {
      id: Date.now(),
      productId: "",
      qty: "",
    },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        productId: "",
        qty: "",
      },
    ]);
  };

  const removeItem = (id) => {
    if (items.length == 1) {
      return;
    }

    setItems(items.filter((item) => item.id != id));
  };

  const updateItem = (id, field, value) => {
    setItems(
      items.map((item) => {
        if (item.id != id) {
          return item;
        }

        return {
          ...item,
          [field]: value,
        };
      }),
    );
  };

  const total = items.reduce((sum, item) => {
    const product = products.find(
      (productItem) => productItem.id == Number(item.productId),
    );

    return sum + (product ? product.price * Number(item.qty || 0) : 0);
  }, 0);

  const handleSubmit = (event) => {
    event.preventDefault();

    const validItems = items.filter((item) => {
      return item.productId != "" && item.qty != "" && Number(item.qty) > 0;
    });

    if (!customer.trim()) {
      alert("Please enter a customer.");
      return;
    }

    if (validItems.length == 0) {
      alert("Please add at least one valid product.");
      return;
    }

    onSubmit({
      customer: isCustomer ? currentUser.name : customer.trim(),
      customerId: isCustomer ? currentUser.id : null,
      items: validItems.map((item) => ({
        productId: Number(item.productId),
        qty: Number(item.qty),
      })),
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal modal-large">
        <div className="modal-header">
          <div>
            <div className="section-kicker">REVENUE</div>
            <h2>Create Sales Order</h2>
          </div>

          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            Customer
            <input
              type="text"
              value={customer}
              onChange={(event) => setCustomer(event.target.value)}
              placeholder="Enter customer name"
              disabled={isCustomer}
              required
            />
          </label>

          <div className="purchase-items-header">
            <h3>Products</h3>

            <button type="button" className="secondary-btn" onClick={addItem}>
              + Add Product
            </button>
          </div>

          <div className="purchase-items">
            {items.map((item, index) => {
              const product = products.find(
                (productItem) => productItem.id == Number(item.productId),
              );

              const lineTotal = product
                ? product.price * Number(item.qty || 0)
                : 0;

              return (
                <div className="purchase-item" key={item.id}>
                  <div className="purchase-item-number">{index + 1}</div>

                  <div className="purchase-item-fields">
                    <label>
                      Product
                      <select
                        value={item.productId}
                        onChange={(event) =>
                          updateItem(item.id, "productId", event.target.value)
                        }
                        required
                      >
                        <option value="">Select product</option>

                        {products.map((productItem) => (
                          <option key={productItem.id} value={productItem.id}>
                            {productItem.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      Quantity
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(event) =>
                          updateItem(item.id, "qty", event.target.value)
                        }
                        required
                      />
                    </label>

                    <div className="purchase-stock-info">
                      Available stock:{" "}
                      <strong>{product ? product.stock : "—"}</strong>
                    </div>

                    <div className="purchase-item-total">
                      {formatCurrency(lineTotal)}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="remove-item-btn"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length == 1}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          <div className="purchase-total">
            <span>Total Sale</span>
            <strong>{formatCurrency(total)}</strong>
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="primary-btn">
              Create Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UserModal({ user, onClose, onSubmit }) {
  const [name, setName] = useState(user ? user.name : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [role, setRole] = useState(user ? user.role : "User");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      id: user ? user.id : null,
      name: name.trim(),
      email: email.trim(),
      role,
      password,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="section-kicker">
              {user ? "EDIT USER" : "NEW USER"}
            </div>

            <h2>{user ? "Edit User" : "Add User"}</h2>
          </div>

          <button type="button" className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Role
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
              <option value="User">User</option>
            </select>
          </label>

          <label>
            {user ? "New Password (optional)" : "Password"}
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required={!user}
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="primary-btn">
              {user ? "Save Changes" : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InventoryAdjustmentModal({ products, onClose, onSubmit }) {
  const [productId, setProductId] = useState("");
  const [type, setType] = useState("IN");
  const [qty, setQty] = useState("");

  const selectedProduct = products.find(
    (product) => product.id == Number(productId),
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const reason = form.get("reason").trim();

    if (!selectedProduct) {
      alert("Please select a product.");
      return;
    }

    if (!reason) {
      alert("Please enter a reason for the adjustment.");
      return;
    }

    if (!qty || Number(qty) <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (type == "OUT" && Number(qty) > selectedProduct.stock) {
      alert(
        `Cannot remove ${qty} units. ${selectedProduct.name} only has ${selectedProduct.stock} units.`,
      );
      return;
    }

    onSubmit({
      productId: Number(productId),
      type,
      qty: Number(qty),
      reason,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="section-kicker">INVENTORY</div>
            <h2>Adjust Stock</h2>
          </div>

          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            Product
            <select
              value={productId}
              onChange={(event) => setProductId(event.target.value)}
              required
            >
              <option value="">Select product</option>

              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} — {product.stock} in stock
                </option>
              ))}
            </select>
          </label>

          <label>
            Adjustment Type
            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="IN">Stock In</option>
              <option value="OUT">Stock Out</option>
            </select>
          </label>

          <label>
            Quantity
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(event) => setQty(event.target.value)}
              required
            />
          </label>

          <label>
            Reason
            <textarea
              name="reason"
              rows="4"
              placeholder="Enter reason for adjustment"
              required
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="primary-btn">
              Apply Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TransactionDetailsModal({ transaction, type, products, onClose }) {
  if (!transaction) {
    return null;
  }

  const isPurchase = type == "purchase";

  const items = transaction.items || [
    {
      productId: transaction.productId,
      qty: transaction.qty,
      cost: isPurchase ? transaction.total / transaction.qty : undefined,
    },
  ];

  const getProduct = (productId) => {
    return products.find((product) => product.id == productId);
  };

  return (
    <div className="modal-overlay">
      <div className="modal modal-large">
        <div className="modal-header">
          <div>
            <div className="section-kicker">
              {isPurchase ? "PURCHASE ORDER" : "SALES ORDER"}
            </div>

            <h2>{transaction.number}</h2>
          </div>

          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="transaction-detail-header">
          <div>
            <span>{isPurchase ? "SUPPLIER" : "CUSTOMER"}</span>
            <strong>
              {isPurchase ? transaction.supplier : transaction.customer}
            </strong>
          </div>

          <div>
            <span>DATE</span>
            <strong>{formatDate(transaction.date)}</strong>
          </div>

          <div>
            <span>STATUS</span>
            <Status status={transaction.status} />
          </div>
        </div>

        <div className="transaction-detail-table">
          <table>
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>SKU</th>
                <th>QTY</th>
                {isPurchase && <th>UNIT COST</th>}
                {!isPurchase && <th>UNIT PRICE</th>}
                <th>TOTAL</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => {
                const product = getProduct(item.productId);
                const qty = Number(item.qty || 0);

                const unitPrice = isPurchase
                  ? Number(item.cost || 0)
                  : Number(product ? product.price : 0);

                const lineTotal = qty * unitPrice;

                return (
                  <tr key={`${transaction.id}-${index}`}>
                    <td>
                      <strong>
                        {product ? product.name : "Unknown Product"}
                      </strong>
                    </td>

                    <td>{product ? product.sku : "—"}</td>

                    <td>{qty}</td>

                    <td>{formatCurrency(unitPrice)}</td>

                    <td>{formatCurrency(lineTotal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="transaction-detail-total">
          <span>Total</span>
          <strong>{formatCurrency(transaction.total)}</strong>
        </div>

        <div className="modal-actions">
          <button className="secondary-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
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

export {
  ProductModal,
  PurchaseModal,
  SaleModal,
  UserModal,
  InventoryAdjustmentModal,
  TransactionDetailsModal,
};
