import { Link, NavLink, Outlet } from 'react-router';

export function Layout() {
  return (
    <div className="wrap">
      <header className="top">
        <NavLink to="/hub" className="brand">
          Behavioural Science Playground
        </NavLink>
        <nav aria-label="Main" className="nav">
          <NavLink to="/hub">Experiments</NavLink>
          <NavLink to="/about">About biases</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </nav>
      </header>
      <main id="main">
        <Outlet />
      </main>
      <footer className="foot">
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Terms of use</Link>
      </footer>
    </div>
  );
}
