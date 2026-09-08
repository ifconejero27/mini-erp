function Login({ users, error, onLogin }) {
  const handleSubmit = (event) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    onLogin(form.get("email"), form.get("password"));
  };

  return (
    <div className="login-page">
      <div className="login-decoration">ERP</div>

      <div className="login-card">
        <div className="login-brand">
          <div className="brand-icon">E</div>

          <div>
            <strong>MINI ERP</strong>
            <span>ENTERPRISE RESOURCE SYSTEM</span>
          </div>
        </div>

        <div className="login-heading">
          <div className="section-kicker">SYSTEM ACCESS</div>
          <h1>Welcome.</h1>
          <p>Sign in to access the ERP system.</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            EMAIL
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </label>

          <label>
            PASSWORD
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </label>

          <button className="login-btn" type="submit">
            Sign In
          </button>
        </form>

        <div className="demo-accounts">
          <span>DEMO ACCOUNTS</span>

          <p>Admin: admin@minierp.com / admin123</p>
          <p>Staff: staff@minierp.com / staff123</p>
          <p>User: user@minierp.com / user123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
