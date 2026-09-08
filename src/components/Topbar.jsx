function Topbar({ user, page, onMenuClick }) {
  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={onMenuClick}>
        ☰
      </button>

      <div className="topbar-title">
        <span>ERP</span>
        <strong>{page}</strong>
      </div>

      <div className="topbar-user">
        <span>{user.name}</span>
        <small>{user.email}</small>
      </div>
    </header>
  );
}

export default Topbar;
