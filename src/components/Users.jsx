function Users({
  users = [],
  currentUser,
  onAddUser,
  onEditUser,
  onToggleStatus,
  onDeleteUser,
}) {
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="section-kicker">ADMINISTRATION</div>
          <h1>Users</h1>
          <p>Manage system users, roles, and account access.</p>
        </div>

        <button className="primary-btn" onClick={onAddUser}>
          + Add User
        </button>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <div className="section-kicker">USER ACCOUNTS</div>
            <h2>System Users</h2>
          </div>

          <span className="result-count">{users.length} users</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ROLE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {users.map((item) => {
                const isCurrentUser = currentUser && item.id == currentUser.id;

                const status = item.status || "Active";

                return (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.name || "Unnamed User"}</strong>
                    </td>

                    <td>{item.email || "—"}</td>

                    <td>
                      <span className="role-badge">{item.role || "User"}</span>
                    </td>

                    <td>
                      <span className={`user-status ${status.toLowerCase()}`}>
                        {status}
                      </span>
                    </td>

                    <td>
                      <div className="user-actions">
                        <button
                          className="small-action edit"
                          onClick={() => onEditUser(item)}
                        >
                          Edit
                        </button>

                        <button
                          className="small-action toggle"
                          disabled={isCurrentUser}
                          onClick={() => onToggleStatus(item.id)}
                        >
                          {status == "Active" ? "Deactivate" : "Activate"}
                        </button>

                        <button
                          className="small-action delete"
                          disabled={isCurrentUser}
                          onClick={() => onDeleteUser(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="role-cards">
        <div>
          <span>ROLE 01</span>
          <h3>Admin</h3>
          <p>
            Full access to the ERP system, including products, transactions,
            inventory, and user management.
          </p>
        </div>

        <div>
          <span>ROLE 02</span>
          <h3>Staff</h3>
          <p>
            Operational access for products, purchasing, sales, and inventory
            management.
          </p>
        </div>

        <div>
          <span>ROLE 03</span>
          <h3>User</h3>
          <p>Customer access for browsing products and placing sales orders.</p>
        </div>
      </div>

      <div className="modal-note" style={{ marginTop: "20px" }}>
        User accounts are stored locally for this demo application. This is not
        intended for production authentication.
      </div>
    </>
  );
}

export default Users;
