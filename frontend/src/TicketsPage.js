import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const { user } = useUser();

  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    avgTime: '0h'
  });

  const [categoryCounts, setCategoryCounts] = useState([]);

  const COLORS = ['#2A5C8C', '#4CAF50', '#FF6B6B', '#e28743', '#9932CC'];

  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, []);

  const fetchTickets = () => {
    axios.get('http://localhost:8080/tickets')
      .then(response => {
        setTickets(response.data);
        computeCategoryData(response.data);
      })
      .catch(err => console.error(err));
  };

  const computeCategoryData = (tickets) => {
    const counts = {};
    tickets.forEach(ticket => {
      counts[ticket.category] = (counts[ticket.category] || 0) + 1;
    });
    const data = Object.keys(counts).map(category => ({
      name: category,
      value: counts[category]
    }));
    setCategoryCounts(data);
  };

  const fetchStats = async () => {
    try {
      const total = await axios.get('http://localhost:8080/tickets/count');
      const resolved = await axios.get('http://localhost:8080/tickets/count/resolved');
      const pending = await axios.get('http://localhost:8080/tickets/count/pending');

      setStats({
        total: total.data,
        resolved: resolved.data,
        pending: pending.data,
        avgTime: '2.4h' // You can replace this with real API call if needed
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleClose = async (ticketId) => {
    try {
      await axios.put(`http://localhost:8080/ticket/${ticketId}`);
      fetchTickets();
      fetchStats(); // refresh stats
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const categoryMatch = categoryFilter === "All" || ticket.category === categoryFilter;
    const statusMatch = statusFilter === "All" || ticket.status === statusFilter;
    return categoryMatch && statusMatch;
  });

  return (
    <div className="App">
      <div className="d-flex justify-content-center py-5">
        <div className="container" style={{ maxWidth: '1100px' }}>
          <h2 className="mb-4 text-center ticket-heading">Tickets Dashboard</h2>

          {/* Filters */}
          <div className="row mb-4">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Filter by Category</label>
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option>All</option>
                <option>Technology</option>
                <option>Accounts</option>
                <option>Delivery</option>
                <option>Finance</option>
                <option>Product</option>
                <option>Refund</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Filter by Status</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All</option>
                <option>Open</option>
                <option>Resolved</option>
              </select>
            </div>
          </div>

          {/* Ticket List */}
          <div className="ticket-scroll-area border rounded p-3 mb-5 bg-white" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <div className="row">
              {filteredTickets.length > 0 ? (
                filteredTickets.map(ticket => (
                  <div key={ticket.id} className="col-md-6 mb-4">
                    <div className="card shadow-sm h-100 bg-white" style={{ borderRadius: '12px' }}>
                      <div className="card-body d-flex flex-column justify-content-between">
                        <div>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="card-title mb-0">Ticket :{ticket.ticketId}</h5>
                            <small className="text-muted">
                              {new Date(ticket.createdAt).toLocaleDateString()}
                            </small>
                          </div>

                          <span className={`badge ${ticket.status === 'Resolved' ? 'bg-success' : 'bg-primary'} mb-2`}>
                            {ticket.status}
                          </span>

                          <div className="mb-2">
                            <small className="text-muted">From: </small>
                            <span className="text-dark">{ticket.senderEmail}</span>
                          </div>

                          <div className="mb-2">
                            <small className="text-muted">Description:</small>
                            <span className="ms-1">{ticket.message}</span>
                          </div>

                          <div>
                            <small className="text-muted">Category: </small>
                            <span className="badge bg-secondary">{ticket.category}</span>
                          </div>
                        </div>

                        {/* Close Button */}
                        {ticket.status !== 'Resolved' && (
                          <div className="text-end mt-3">
                            <button className="btn btn-outline-success btn-sm" onClick={() => handleClose(ticket.id)}>
                              Close
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <p className="text-muted">No tickets found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="row mb-5">
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm h-100 bg-white">
                <div className="card-body">
                  <h5 className="card-title text-center mb-4">Ticket Distribution by Category</h5>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryCounts}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {categoryCounts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend layout="vertical" align="right" verticalAlign="middle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="col-md-6">
              <div className="row h-100">
                <div className="col-6 mb-4">
                  <div className="card stat-card h-100 text-center p-3">
                    <i className="bi bi-ticket-perforated fs-2 mb-2 text-primary"></i>
                    <h1 className="display-5">{stats.total}</h1>
                    <p className="text-muted mb-0">Total Tickets</p>
                  </div>
                </div>
                <div className="col-6 mb-4">
                  <div className="card stat-card h-100 text-center p-3">
                    <i className="bi bi-check-circle fs-2 mb-2 text-success"></i>
                    <h1 className="display-5">{stats.resolved}</h1>
                    <p className="text-muted mb-0">Resolved Tickets</p>
                  </div>
                </div>
                <div className="col-6 mb-4">
                  <div className="card stat-card h-100 text-center p-3">
                    <i className="bi bi-clock-history fs-2 mb-2 text-warning"></i>
                    <h1 className="display-5">{stats.pending}</h1>
                    <p className="text-muted mb-0">Pending Tickets</p>
                  </div>
                </div>
                <div className="col-6 mb-4">
                  <div className="card stat-card h-100 text-center p-3">
                    <i className="bi bi-speedometer2 fs-2 mb-2 text-info"></i>
                    <h1 className="display-5">{stats.avgTime}</h1>
                    <p className="text-muted mb-0">Avg. Resolution Time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-light py-5 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4" id="about">
              <h5>Company</h5>
              <ul className="list-unstyled">
                <li><Link to="/about" className="text-light text-decoration-none">Our Story</Link></li>
                <li><Link to="/careers" className="text-light text-decoration-none">Careers</Link></li>
                <li><Link to="/contact" className="text-light text-decoration-none">Contact</Link></li>
              </ul>
            </div>
            <div className="col-md-4 mb-4" id="careers">
              <h5>Resources</h5>
              <ul className="list-unstyled">
                <li><Link to="/docs" className="text-light text-decoration-none">Documentation</Link></li>
                <li><Link to="/faq" className="text-light text-decoration-none">FAQ</Link></li>
                <li><Link to="/privacy" className="text-light text-decoration-none">Privacy Policy</Link></li>
              </ul>
            </div>
            <div className="col-md-4 mb-4" id="contact">
              <h5>Get Started</h5>
              <button className="btn btn-outline-light">Free Trial</button>
              <p className="mt-3">New Horizon College<br />Bangalore, India</p>
            </div>
          </div>
          <div className="row mt-4 pt-3 border-top">
            <div className="col-12 text-center">
              <p className="mb-0 text-muted">
                © 2035 ResolveRight. Powered by Us
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default TicketsPage;
