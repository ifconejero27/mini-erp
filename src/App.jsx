import { useMemo, useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import Purchasing from "./components/Purchasing";
import Sales from "./components/Sales";
import Inventory from "./components/Inventory";
import Users from "./components/Users";
import Login from "./components/Login";
import Footer from "./components/Footer";
import Reports from "./components/Reports";

import {
  ProductModal,
  PurchaseModal,
  SaleModal,
  UserModal,
  InventoryAdjustmentModal,
  TransactionDetailsModal,
} from "./components/Modals";

import { loadData, saveData } from "./utils/storage";

const initialProducts = [
  {
    id: 1,
    name: "Wireless Mouse WM-001",
    sku: "WM-001",
    category: "Accessories",
    price: 850,
    stock: 42,
    reorder: 10,
  },
  {
    id: 2,
    name: "Mechanical Keyboard MK-002",
    sku: "MK-002",
    category: "Accessories",
    price: 2450,
    stock: 18,
    reorder: 10,
  },
  {
    id: 3,
    name: "USB-C Hub UH-003",
    sku: "UH-003",
    category: "Accessories",
    price: 1250,
    stock: 7,
    reorder: 10,
  },
  {
    id: 4,
    name: '27" Monitor MN-004',
    sku: "MN-004",
    category: "Displays",
    price: 12900,
    stock: 12,
    reorder: 5,
  },
  {
    id: 5,
    name: "Laptop Stand LS-005",
    sku: "LS-005",
    category: "Office",
    price: 1750,
    stock: 4,
    reorder: 8,
  },
  {
    id: 6,
    name: "Webcam HD WC-006",
    sku: "WC-006",
    category: "Accessories",
    price: 3200,
    stock: 25,
    reorder: 8,
  },
];

const initialSales = [
  {
    id: 6,
    number: "SO-1006",
    customer: "ABC Corporation",
    productId: 4,
    qty: 2,
    total: 25800,
    date: "2026-09-08",
    status: "Completed",
  },
  {
    id: 5,
    number: "SO-1005",
    customer: "Juan Dela Cruz",
    productId: 2,
    qty: 2,
    total: 4900,
    date: "2026-09-08",
    status: "Completed",
  },
  {
    id: 4,
    number: "SO-1004",
    customer: "Tech Solutions PH",
    productId: 6,
    qty: 5,
    total: 16000,
    date: "2026-09-07",
    status: "Pending",
  },
  {
    id: 3,
    number: "SO-1003",
    customer: "Maria Santos",
    productId: 6,
    qty: 1,
    total: 3200,
    date: "2026-09-06",
    status: "Completed",
  },
];

const initialPurchases = [
  {
    id: 4,
    number: "PO-2004",
    supplier: "TechSource PH",
    productId: 1,
    qty: 50,
    total: 40000,
    date: "2026-09-08",
    status: "Received",
  },
  {
    id: 3,
    number: "PO-2003",
    supplier: "Digital Supply Co.",
    productId: 3,
    qty: 25,
    total: 25000,
    date: "2026-09-07",
    status: "Received",
  },
  {
    id: 2,
    number: "PO-2002",
    supplier: "Office Depot PH",
    productId: 5,
    qty: 10,
    total: 14000,
    date: "2026-09-06",
    status: "Pending",
  },
];

const initialMovements = [
  {
    id: 1,
    type: "IN",
    reference: "PO-2004",
    productName: "Wireless Mouse WM-001",
    qty: 50,
    date: "2026-09-08",
  },
  {
    id: 2,
    type: "IN",
    reference: "PO-2003",
    productName: "USB-C Hub UH-003",
    qty: 25,
    date: "2026-09-07",
  },
  {
    id: 3,
    type: "OUT",
    reference: "SO-1006",
    productName: '27" Monitor MN-004',
    qty: 2,
    date: "2026-09-08",
  },
  {
    id: 4,
    type: "OUT",
    reference: "SO-1005",
    productName: "Mechanical Keyboard MK-002",
    qty: 2,
    date: "2026-09-08",
  },
  {
    id: 5,
    type: "OUT",
    reference: "SO-1003",
    productName: "Webcam HD WC-006",
    qty: 1,
    date: "2026-09-06",
  },
];

const initialUsers = [
  {
    id: 1,
    name: "Ivan Conejero",
    email: "admin@minierp.com",
    password: "admin123",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Staff User",
    email: "staff@minierp.com",
    password: "staff123",
    role: "Staff",
    status: "Active",
  },
  {
    id: 3,
    name: "Viewer User",
    email: "user@minierp.com",
    password: "user123",
    role: "User",
    status: "Active",
  },
];

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("mini-erp-user");
    return saved ? JSON.parse(saved) : null;
  });

  const [page, setPage] = useState("Dashboard");

  const [products, setProducts] = useState(() =>
    loadData("mini-erp-products", initialProducts),
  );

  const [sales, setSales] = useState(() =>
    loadData("mini-erp-sales", initialSales),
  );

  const [purchases, setPurchases] = useState(() =>
    loadData("mini-erp-purchases", initialPurchases),
  );

  const [movements, setMovements] = useState(() =>
    loadData("mini-erp-movements", initialMovements),
  );

  const [users, setUsers] = useState(() =>
    loadData("mini-erp-users", initialUsers),
  );

  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showProductModal, setShowProductModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [viewingTransaction, setViewingTransaction] = useState(null);
  const [viewingTransactionType, setViewingTransactionType] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const [error, setError] = useState("");

  const canManageProducts = user?.role == "Admin";

  const canCreateSales =
    user?.role == "Admin" || user?.role == "Staff" || user?.role == "User";

  const canManagePurchasing = user?.role == "Admin" || user?.role == "Staff";

  const canAdjustInventory = user?.role == "Admin" || user?.role == "Staff";

  const canProcessTransactions = user?.role == "Admin" || user?.role == "Staff";

  const totalStock = useMemo(() => {
    return products.reduce((total, product) => total + product.stock, 0);
  }, [products]);

  const salesToday = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];

    return sales
      .filter((sale) => sale.date == today && sale.status == "Completed")
      .reduce((total, sale) => total + sale.total, 0);
  }, [sales]);

  const purchaseSpending = useMemo(() => {
    return purchases
      .filter((purchase) => purchase.status == "Received")
      .reduce((total, purchase) => total + purchase.total, 0);
  }, [purchases]);

  const pendingSales = useMemo(() => {
    return sales.filter((sale) => sale.status == "Pending").length;
  }, [sales]);

  const pendingPurchases = useMemo(() => {
    return purchases.filter((purchase) => purchase.status == "Pending").length;
  }, [purchases]);

  const updateProducts = (data) => {
    if (user?.role != "Admin" && user?.role != "Staff") {
      setError("You do not have permission to manage products.");
      return;
    }

    setProducts(data);
    saveData("mini-erp-products", data);
  };

  const updateSales = (data) => {
    setSales(data);
    saveData("mini-erp-sales", data);
  };

  const updatePurchases = (data) => {
    setPurchases(data);
    saveData("mini-erp-purchases", data);
  };

  const updateMovements = (data) => {
    setMovements(data);
    saveData("mini-erp-movements", data);
  };

  const updateUsers = (data) => {
    setUsers(data);
    saveData("mini-erp-users", data);
  };

  const navigate = (nextPage) => {
    if (!nextPage) {
      setSidebarOpen(false);
      return;
    }

    setPage(nextPage);
    setSidebarOpen(false);
    setError("");
  };

  const handleLogin = (email, password) => {
    const account = users.find(
      (item) =>
        item.email.toLowerCase() == email.toLowerCase() &&
        item.status == "Active",
    );

    if (!account) {
      setError("Invalid email or password.");
      return;
    }

    if (account.password != password) {
      setError("Invalid email or password.");
      return;
    }

    const sessionUser = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      status: account.status,
    };

    setUser(sessionUser);
    localStorage.setItem("mini-erp-user", JSON.stringify(sessionUser));
    setError("");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("mini-erp-user");
    setPage("Dashboard");
  };

  const addProduct = (product) => {
    if (user?.role != "Admin") {
      setError("You do not have permission to manage products.");
      return;
    }
    const skuExists = products.some(
      (item) => item.sku.toLowerCase() == product.sku.toLowerCase(),
    );

    if (skuExists) {
      setError("A product with this SKU already exists.");
      return;
    }

    const newProduct = {
      ...product,
      id: Date.now(),
    };

    updateProducts([...products, newProduct]);
    setShowProductModal(false);
    setError("");
  };

  const editProduct = (data) => {
    const skuExists = products.some(
      (item) =>
        item.id != data.id && item.sku.toLowerCase() == data.sku.toLowerCase(),
    );

    if (skuExists) {
      setError("A product with this SKU already exists.");
      return;
    }

    const updatedProducts = products.map((item) => {
      if (item.id != data.id) {
        return item;
      }

      return {
        ...item,
        name: data.name,
        sku: data.sku,
        category: data.category,
        price: data.price,
        stock: data.stock,
        reorder: data.reorder,
      };
    });

    updateProducts(updatedProducts);
    setEditingProduct(null);
    setShowProductModal(false);
    setError("");
  };

  const deleteProduct = (productId) => {
    if (user?.role != "Admin") {
      setError("You do not have permission to manage products.");
      return;
    }
    const product = products.find((item) => item.id == productId);

    if (!product) {
      return;
    }

    const usedInSales = sales.some((sale) => sale.productId == productId);
    const usedInPurchases = purchases.some(
      (purchase) => purchase.productId == productId,
    );

    if (usedInSales || usedInPurchases) {
      setError(
        "This product cannot be deleted because it is used in existing transactions.",
      );
      return;
    }

    const confirmed = window.confirm(`Delete ${product.name}?`);

    if (!confirmed) {
      return;
    }

    updateProducts(products.filter((item) => item.id != productId));
    setError("");
  };

  const createPurchase = (data) => {
    if (user?.role != "Admin" && user?.role != "Staff") {
      setError("You do not have permission to create purchase orders.");
      return;
    }
    const validItems = data.items.filter((item) => {
      return products.some((product) => product.id == item.productId);
    });

    if (validItems.length == 0) {
      setError("No valid products were selected.");
      return;
    }

    const purchase = {
      id: Date.now(),
      number: `PO-${2000 + purchases.length + 1}`,
      supplier: data.supplier,
      items: validItems,
      total: validItems.reduce(
        (total, item) => total + item.qty * item.cost,
        0,
      ),
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
    };

    updatePurchases([purchase, ...purchases]);
    setShowPurchaseModal(false);
    setError("");
  };

  const receivePurchase = (purchaseId) => {
    if (user?.role != "Admin" && user?.role != "Staff") {
      setError("You do not have permission to receive purchases.");
      return;
    }
    const purchase = purchases.find((item) => item.id == purchaseId);

    if (!purchase || purchase.status == "Received") {
      return;
    }

    const items = purchase.items || [
      {
        productId: purchase.productId,
        qty: purchase.qty,
        cost: purchase.total / purchase.qty,
      },
    ];

    const updatedProducts = products.map((product) => {
      const purchaseItems = items.filter(
        (item) => item.productId == product.id,
      );

      if (purchaseItems.length == 0) {
        return product;
      }

      const addedStock = purchaseItems.reduce(
        (total, item) => total + item.qty,
        0,
      );

      return {
        ...product,
        stock: product.stock + addedStock,
      };
    });

    const updatedPurchases = purchases.map((item) => {
      if (item.id == purchaseId) {
        return {
          ...item,
          status: "Received",
        };
      }

      return item;
    });

    const newMovements = items.map((item, index) => {
      const product = products.find(
        (productItem) => productItem.id == item.productId,
      );

      return {
        id: Date.now() + index,
        type: "IN",
        reference: purchase.number,
        productName: product ? product.name : "Unknown Product",
        qty: item.qty,
        date: new Date().toISOString().split("T")[0],
      };
    });

    updateProducts(updatedProducts);
    updatePurchases(updatedPurchases);
    updateMovements([...newMovements, ...movements]);
    setError("");
  };

  const createSale = (data) => {
    const validItems = data.items.filter((item) => {
      return products.some((product) => product.id == item.productId);
    });

    if (validItems.length == 0) {
      setError("No valid products were selected.");
      return;
    }

    const sale = {
      id: Date.now(),
      number: `SO-${1000 + sales.length + 1}`,
      customer: data.customer,
      items: validItems,
      total: validItems.reduce((total, item) => {
        const product = products.find(
          (productItem) => productItem.id == item.productId,
        );

        return total + product.price * item.qty;
      }, 0),
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
    };

    updateSales([sale, ...sales]);
    setShowSaleModal(false);
    setError("");
  };

  const completeSale = (saleId) => {
    if (user?.role != "Admin" && user?.role != "Staff") {
      setError("You do not have permission to confirm sales orders.");
      return;
    }
    const sale = sales.find((item) => item.id == saleId);

    if (!sale || sale.status == "Completed") {
      return;
    }

    const items = sale.items || [
      {
        productId: sale.productId,
        qty: sale.qty,
      },
    ];

    for (const item of items) {
      const product = products.find(
        (productItem) => productItem.id == item.productId,
      );

      if (!product) {
        setError("A product in this sale no longer exists.");
        return;
      }

      if (product.stock < item.qty) {
        setError(
          `Not enough stock for ${product.name}. Available: ${product.stock}.`,
        );
        return;
      }
    }

    const updatedProducts = products.map((product) => {
      const saleItems = items.filter((item) => item.productId == product.id);

      if (saleItems.length == 0) {
        return product;
      }

      const soldQty = saleItems.reduce((total, item) => total + item.qty, 0);

      return {
        ...product,
        stock: product.stock - soldQty,
      };
    });

    const updatedSales = sales.map((item) => {
      if (item.id == saleId) {
        return {
          ...item,
          status: "Completed",
        };
      }

      return item;
    });

    const newMovements = items.map((item, index) => {
      const product = products.find(
        (productItem) => productItem.id == item.productId,
      );

      return {
        id: Date.now() + index,
        type: "OUT",
        reference: sale.number,
        productName: product ? product.name : "Unknown Product",
        qty: item.qty,
        date: new Date().toISOString().split("T")[0],
      };
    });

    updateProducts(updatedProducts);
    updateSales(updatedSales);
    updateMovements([...newMovements, ...movements]);
    setError("");
  };

  const adjustStock = (data) => {
    if (user?.role != "Admin" && user?.role != "Staff") {
      setError("You do not have permission to adjust inventory.");
      return;
    }
    const product = products.find((item) => item.id == data.productId);

    if (!product) {
      setError("Product not found.");
      return;
    }

    if (data.type == "OUT" && data.qty > product.stock) {
      setError(
        `Cannot remove ${data.qty} units. ${product.name} only has ${product.stock} units.`,
      );
      return;
    }

    const updatedProducts = products.map((item) => {
      if (item.id != data.productId) {
        return item;
      }

      return {
        ...item,
        stock:
          data.type == "IN" ? item.stock + data.qty : item.stock - data.qty,
      };
    });

    const movement = {
      id: Date.now(),
      type: data.type,
      reference: `ADJ-${Date.now()}`,
      productName: product.name,
      qty: data.qty,
      reason: data.reason,
      date: new Date().toISOString().split("T")[0],
    };

    updateProducts(updatedProducts);
    updateMovements([movement, ...movements]);
    setShowAdjustmentModal(false);
    setError("");
  };

  const viewPurchase = (purchase) => {
    setViewingTransaction(purchase);
    setViewingTransactionType("purchase");
  };

  const viewSale = (sale) => {
    setViewingTransaction(sale);
    setViewingTransactionType("sale");
  };

  const closeTransactionDetails = () => {
    setViewingTransaction(null);
    setViewingTransactionType("");
  };

  const addUser = (data) => {
    if (user?.role != "Admin") {
      setError("You do not have permission to manage users.");
      return;
    }

    const emailExists = users.some(
      (item) => item.email.toLowerCase() == data.email.toLowerCase(),
    );

    if (emailExists) {
      setError("A user with this email already exists.");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      status: "Active",
    };

    updateUsers([...users, newUser]);
    setShowUserModal(false);
    setEditingUser(null);
    setError("");
  };

  const editUser = (data) => {
    if (user?.role != "Admin") {
      setError("You do not have permission to manage users.");
      return;
    }

    const emailExists = users.some(
      (item) =>
        item.id != data.id &&
        item.email.toLowerCase() == data.email.toLowerCase(),
    );

    if (emailExists) {
      setError("A user with this email already exists.");
      return;
    }

    const existingUser = users.find((item) => item.id == data.id);

    if (!existingUser) {
      setError("User could not be found.");
      return;
    }

    const updatedUsers = users.map((item) => {
      if (item.id != data.id) {
        return item;
      }

      return {
        ...item,
        name: data.name,
        email: data.email,
        password:
          data.password && data.password.trim() != ""
            ? data.password
            : existingUser.password,
        role: data.role,
        status: existingUser.status || "Active",
      };
    });

    updateUsers(updatedUsers);

    if (data.id == user.id) {
      const updatedCurrentUser = updatedUsers.find(
        (item) => item.id == user.id,
      );

      if (updatedCurrentUser) {
        const sessionUser = {
          id: updatedCurrentUser.id,
          name: updatedCurrentUser.name,
          email: updatedCurrentUser.email,
          role: updatedCurrentUser.role,
          status: updatedCurrentUser.status,
        };

        setUser(sessionUser);
        localStorage.setItem("mini-erp-user", JSON.stringify(sessionUser));
      }
    }

    setEditingUser(null);
    setShowUserModal(false);
    setError("");
  };

  const toggleUserStatus = (userId) => {
    const target = users.find((item) => item.id == userId);

    if (!target) {
      return;
    }

    if (target.id == user.id) {
      setError("You cannot deactivate your own account.");
      return;
    }

    if (target.role == "Admin" && target.status == "Active") {
      const activeAdmins = users.filter(
        (item) => item.role == "Admin" && item.status == "Active",
      );

      if (activeAdmins.length <= 1) {
        setError("The system must have at least one active Admin.");
        return;
      }
    }

    const updatedUsers = users.map((item) => {
      if (item.id == userId) {
        return {
          ...item,
          status: item.status == "Active" ? "Inactive" : "Active",
        };
      }

      return item;
    });

    updateUsers(updatedUsers);
    setError("");
  };

  const deleteUser = (userId) => {
    if (user?.role != "Admin") {
      setError("You do not have permission to delete users.");
      return;
    }

    const target = users.find((item) => item.id == userId);

    if (!target) {
      return;
    }

    if (target.id == user.id) {
      setError("You cannot delete your own account.");
      return;
    }

    if (target.role == "Admin" && target.status == "Active") {
      const activeAdmins = users.filter(
        (item) => item.role == "Admin" && item.status == "Active",
      );

      if (activeAdmins.length <= 1) {
        setError("The system must have at least one active Admin.");
        return;
      }
    }

    const confirmed = window.confirm(`Delete ${target.name}?`);

    if (!confirmed) {
      return;
    }

    updateUsers(users.filter((item) => item.id != userId));
    setError("");
  };

  const resetDemoData = () => {
    updateProducts(initialProducts);
    updateSales(initialSales);
    updatePurchases(initialPurchases);
    updateMovements(initialMovements);
    updateUsers(initialUsers);

    const admin = {
      id: initialUsers[0].id,
      name: initialUsers[0].name,
      email: initialUsers[0].email,
      role: initialUsers[0].role,
      status: initialUsers[0].status,
    };

    setUser(admin);
    localStorage.setItem("mini-erp-user", JSON.stringify(admin));

    setPage("Dashboard");
    setError("");
  };

  if (!user) {
    return <Login users={users} error={error} onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <Sidebar
        user={user}
        page={page}
        onNavigate={navigate}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
      />

      <main className="main">
        <Topbar
          user={user}
          page={page}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="content">
          {error && (
            <div className="global-error">
              <span>{error}</span>

              <button onClick={() => setError("")}>×</button>
            </div>
          )}

          {page == "Dashboard" && (
            <Dashboard
              products={products}
              sales={sales}
              purchases={purchases}
              totalStock={totalStock}
              salesToday={salesToday}
              purchaseSpending={purchaseSpending}
              pendingSales={pendingSales}
              pendingPurchases={pendingPurchases}
              onNavigate={navigate}
            />
          )}

          {page == "Products" && (
            <Products
              products={products}
              search={search}
              onSearchChange={setSearch}
              onAddProduct={() => {
                setEditingProduct(null);
                setShowProductModal(true);
                setError("");
              }}
              onEditProduct={(selectedProduct) => {
                setEditingProduct(selectedProduct);
                setShowProductModal(true);
                setError("");
              }}
              onDeleteProduct={deleteProduct}
              canManageProducts={canManageProducts}
            />
          )}

          {page == "Purchasing" && (
            <Purchasing
              purchases={purchases}
              products={products}
              canCreateTransactions={canManagePurchasing}
              onCreatePurchase={() => setShowPurchaseModal(true)}
              onReceivePurchase={receivePurchase}
              onViewPurchase={viewPurchase}
            />
          )}

          {page == "Sales" && (
            <Sales
              sales={
                user.role == "User"
                  ? sales.filter((sale) => sale.customer == user.name)
                  : sales
              }
              products={products}
              canCreateTransactions={canCreateSales}
              canProcessTransactions={canProcessTransactions}
              onCreateSale={() => setShowSaleModal(true)}
              onCompleteSale={completeSale}
              onViewSale={viewSale}
            />
          )}

          {page == "Inventory" && (
            <Inventory
              products={products}
              movements={movements}
              canCreateTransactions={canAdjustInventory}
              onAdjustStock={() => {
                setShowAdjustmentModal(true);
                setError("");
              }}
            />
          )}

          {page == "Users" && user.role == "Admin" && (
            <Users
              users={users}
              currentUser={user}
              onAddUser={() => {
                setEditingUser(null);
                setShowUserModal(true);
              }}
              onEditUser={(selectedUser) => {
                setEditingUser(selectedUser);
                setShowUserModal(true);
              }}
              onToggleStatus={toggleUserStatus}
              onDeleteUser={deleteUser}
            />
          )}

          {page == "Reports" && (
            <Reports products={products} sales={sales} purchases={purchases} />
          )}
        </div>

        <Footer />
      </main>

      {showProductModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setEditingProduct(null);
            setShowProductModal(false);
            setError("");
          }}
          onSubmit={editingProduct ? editProduct : addProduct}
        />
      )}

      {showPurchaseModal && (
        <PurchaseModal
          products={products}
          onClose={() => setShowPurchaseModal(false)}
          onSubmit={createPurchase}
        />
      )}

      {showSaleModal && (
        <SaleModal
          products={products}
          currentUser={user}
          onClose={() => setShowSaleModal(false)}
          onSubmit={createSale}
        />
      )}

      {showUserModal && (
        <UserModal
          user={editingUser}
          onSubmit={editingUser ? editUser : addUser}
          onClose={() => {
            setShowUserModal(false);
            setEditingUser(null);
          }}
        />
      )}

      {showAdjustmentModal && (
        <InventoryAdjustmentModal
          products={products}
          onSubmit={adjustStock}
          onClose={() => {
            setShowAdjustmentModal(false);
            setError("");
          }}
        />
      )}

      {viewingTransaction && (
        <TransactionDetailsModal
          transaction={viewingTransaction}
          type={viewingTransactionType}
          products={products}
          onClose={closeTransactionDetails}
        />
      )}
    </div>
  );
}

export default App;
