import { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/orders");
      setOrders(res.data);
    } catch (err) {
      alert("Failed to fetch orders");
    }
  };

  const toggleOrderSelect = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  const updateStatus = async () => {
    if (!newStatus || selectedOrders.length === 0) {
      alert("Please select orders and a new status");
      return;
    }
    try {
      await axios.put("http://localhost:5000/api/admin/orders/bulk-status", {
        orderIds: selectedOrders,
        newStatus,
      });
      alert("Status updated");
      setSelectedOrders([]);
      fetchOrders();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="admin-orders">
      <h2>Admin Orders Panel</h2>

      <button
        onClick={() =>
          window.open("http://localhost:5000/api/admin/orders/export", "_blank")
        }
      >
        Export to CSV
      </button>

      <div style={{ margin: "10px 0" }}>
        <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button onClick={updateStatus}>Update Status</button>
      </div>

      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Select</th>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order._id)}
                  onChange={() => toggleOrderSelect(order._id)}
                />
              </td>
              <td>{order._id}</td>
              <td>
                {order.userId?.fullname} ({order.userId?.email})
              </td>
              <td>
                <ul>
                  {order.items.map((item) => (
                    <li key={item._id}>
                      {item.productId?.name} x {item.quantity} @ ${item.price}
                    </li>
                  ))}
                </ul>
              </td>
              <td>${order.totalPrice.toFixed(2)}</td>
              <td>{order.status}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
