function Sidebar({ user, page, onNavigate, onLogout, isOpen }) {
  let navigation = [
    { name: "Dashboard", page: "Dashboard" },
    { name: "Products", page: "Products" },
    { name: "Purchasing", page: "Purchasing" },
    { name: "Sales", page: "Sales" },
    { name: "Inventory", page: "Inventory" },
    { name: "Reports", page: "Reports" },
  ];

  if (user.role == "User") {
    navigation = [
      { name: "Dashboard", page: "Dashboard" },
      { name: "Products", page: "Products" },
      { name: "Sales", page: "Sales" },
    ];
  }

  if (user.role == "Admin") {
    navigation.push({ name: "Users", page: "Users" });
  }

  return (
    <>
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">E</div>
          <div>
            <strong>MINI ERP</strong>
            <span>ENTERPRISE RESOURCE SYSTEM</span>
          </div>
        </div>

        <nav>
          {navigation.map((item) => (
            <button
              key={item.page}
              className={`nav-btn ${page == item.page ? "active" : ""}`}
              onClick={() => onNavigate(item.page)}
            >
              {item.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="avatar">{getInitials(user.name)}</div>

            <div>
              <strong>{user.name}</strong>
              <span>{user.role}</span>
            </div>
          </div>

          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </aside>

      {isOpen && (
        <div className="sidebar-overlay" onClick={() => onNavigate(null)} />
      )}
    </>
  );
}

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default Sidebar;
