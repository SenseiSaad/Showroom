import { useEffect, useMemo, useState } from 'react';
import { Brand, Category, Vehicle, createVehicle, getBrands, getCategories, getVehicles, login, registerUser } from './api';

type Page = 'home' | 'marketplace' | 'privacy' | 'about' | 'login';

const emptyVehicle = {
  brand: '',
  category: '',
  name: '',
  price: '',
  fuel_type: '',
  transmission: '',
  top_speed: '',
  horsepower: '',
  country_of_origin: '',
  year: '',
  description: '',
};

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [status, setStatus] = useState('');
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '' });
  const [vehicleForm, setVehicleForm] = useState(emptyVehicle);

  useEffect(() => {
    Promise.all([getVehicles(), getBrands(), getCategories()])
      .then(([vehicleResult, brandResult, categoryResult]) => {
        setVehicles(Array.isArray(vehicleResult) ? vehicleResult : vehicleResult.results || []);
        setBrands(brandResult);
        setCategories(categoryResult);
      })
      .catch(() => setStatus('Could not reach Django backend. Start it first.'));
  }, []);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const label = `${vehicle.brand_name || vehicle.brand} ${vehicle.name}`.toLowerCase();
      return label.includes(query.toLowerCase());
    });
  }, [vehicles, query]);

  const onLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const data = await login(authForm.username, authForm.password);
    setSessionToken(data.access);
    setStatus('Logged in successfully.');
    setPage('marketplace');
  };

  const onRegister = async () => {
    await registerUser(authForm);
    setStatus('User registered. Now log in.');
    setPage('login');
  };

  const onCreateVehicle = async (event: React.FormEvent) => {
    event.preventDefault();
    await createVehicle(sessionToken, {
      ...vehicleForm,
      brand: Number(vehicleForm.brand),
      category: Number(vehicleForm.category),
      price: Number(vehicleForm.price),
      top_speed: Number(vehicleForm.top_speed),
      horsepower: Number(vehicleForm.horsepower),
      year: Number(vehicleForm.year),
    });
    const fresh = await getVehicles();
    setVehicles(Array.isArray(fresh) ? fresh : fresh.results || []);
    setVehicleForm(emptyVehicle);
    setStatus('Vehicle created successfully.');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand" onClick={() => setPage('home')} role="button" tabIndex={0}>Hyperthon</div>
        <nav>
          <button onClick={() => setPage('home')}>Home</button>
          <button onClick={() => setPage('marketplace')}>Marketplace</button>
          <button onClick={() => setPage('about')}>About Us</button>
          <button onClick={() => setPage('privacy')}>Privacy Policy</button>
          <button onClick={() => setPage('login')}>Login</button>
        </nav>
      </header>

      {status ? <div className="status-banner">{status}</div> : null}

      {page === 'home' && (
        <section className="hero panel">
          <div>
            <p className="eyebrow">Connected to Django</p>
            <h1>Premium Automotive Marketplace</h1>
            <p>Explore vehicles by brand, horsepower, category, and price. Login to add new inventory directly from the frontend.</p>
            <div className="hero-actions">
              <button onClick={() => setPage('marketplace')} className="primary">Browse Marketplace</button>
              <button onClick={() => setPage('login')} className="secondary">Login</button>
            </div>
          </div>
          <aside className="stats-card">
            <span>{vehicles.length}</span>
            <small>vehicles loaded from Django</small>
          </aside>
        </section>
      )}

      {page === 'marketplace' && (
        <section className="panel stack">
          {sessionToken ? (
            <form onSubmit={onCreateVehicle} className="create-form">
              <h2>Add Vehicle</h2>
              <div className="grid">
                <select value={vehicleForm.brand} onChange={(e) => setVehicleForm((prev) => ({ ...prev, brand: e.target.value }))}>
                  <option value="">Brand</option>
                  {brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
                </select>
                <select value={vehicleForm.category} onChange={(e) => setVehicleForm((prev) => ({ ...prev, category: e.target.value }))}>
                  <option value="">Category</option>
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
                <input placeholder="Name" value={vehicleForm.name} onChange={(e) => setVehicleForm((prev) => ({ ...prev, name: e.target.value }))} />
                <input placeholder="Price" type="number" value={vehicleForm.price} onChange={(e) => setVehicleForm((prev) => ({ ...prev, price: e.target.value }))} />
                <input placeholder="Horsepower" type="number" value={vehicleForm.horsepower} onChange={(e) => setVehicleForm((prev) => ({ ...prev, horsepower: e.target.value }))} />
                <input placeholder="Top speed" type="number" value={vehicleForm.top_speed} onChange={(e) => setVehicleForm((prev) => ({ ...prev, top_speed: e.target.value }))} />
                <input placeholder="Fuel type" value={vehicleForm.fuel_type} onChange={(e) => setVehicleForm((prev) => ({ ...prev, fuel_type: e.target.value }))} />
                <input placeholder="Transmission" value={vehicleForm.transmission} onChange={(e) => setVehicleForm((prev) => ({ ...prev, transmission: e.target.value }))} />
                <input placeholder="Country" value={vehicleForm.country_of_origin} onChange={(e) => setVehicleForm((prev) => ({ ...prev, country_of_origin: e.target.value }))} />
                <input placeholder="Year" type="number" value={vehicleForm.year} onChange={(e) => setVehicleForm((prev) => ({ ...prev, year: e.target.value }))} />
                <textarea placeholder="Description" value={vehicleForm.description} onChange={(e) => setVehicleForm((prev) => ({ ...prev, description: e.target.value }))} />
              </div>
              <button className="primary" type="submit">Create Vehicle</button>
            </form>
          ) : (
            <p className="muted">Login first to create vehicles.</p>
          )}

          <div className="search-row">
            <input placeholder="Search by brand or model" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>

          <div className="vehicle-grid">
            {filteredVehicles.map((vehicle) => (
              <article key={vehicle.id} className="vehicle-card">
                <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200" alt={vehicle.name} />
                <div>
                  <p>{vehicle.brand_name || vehicle.brand}</p>
                  <h3>{vehicle.name}</h3>
                  <span>{vehicle.horsepower} HP</span>
                  <span>{vehicle.top_speed} km/h</span>
                  <strong>${Number(vehicle.price).toLocaleString()}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {page === 'login' && (
        <section className="panel auth-panel">
          <form onSubmit={onLogin} className="auth-form">
            <h2>Login</h2>
            <input placeholder="Username" value={authForm.username} onChange={(e) => setAuthForm((prev) => ({ ...prev, username: e.target.value }))} />
            <input placeholder="Email" value={authForm.email} onChange={(e) => setAuthForm((prev) => ({ ...prev, email: e.target.value }))} />
            <input placeholder="Password" type="password" value={authForm.password} onChange={(e) => setAuthForm((prev) => ({ ...prev, password: e.target.value }))} />
            <button className="primary" type="submit">Sign In</button>
            <button className="secondary" type="button" onClick={onRegister}>Create Account</button>
          </form>
        </section>
      )}

      {page === 'about' && (
        <section className="panel copy-page">
          <h2>About Us</h2>
          <p>This separate frontend is connected to the Django backend through the `/api/token/`, `/vehicle/`, `/vehicle/brands/`, and `/vehicle/categories/` endpoints.</p>
        </section>
      )}

      {page === 'privacy' && (
        <section className="panel copy-page">
          <h2>Privacy Policy</h2>
          <p>We only send login and inventory data required to authenticate users and manage vehicles.</p>
        </section>
      )}
    </div>
  );
}