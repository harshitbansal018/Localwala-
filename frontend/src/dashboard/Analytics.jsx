import { useEffect, useState } from "react";
import "./Analytics.css";
function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

const token =
  localStorage.getItem("token") ||
  localStorage.getItem("shopkeeperToken");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(
          "  http://localhost:5000/api/orders/shopkeeper/analytics",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await res.json();

        if (res.ok) {
          setData(result);
        }

      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

    fetchAnalytics();
  }, [token]);

  if (loading) return <p>Loading analytics...</p>;

  if (!data) return <p>No data available</p>;

  return (
    <div className="analytics-wrapper">
      <h2 className="analytics-title">Sales Overview</h2>

      <div className="analytics-cards">

        <div className="analytics-card">
          <h3>Today's Sales</h3>
          <p>₹ {data.todaySales}</p>
        </div>

        <div className="analytics-card">
          <h3>Monthly Revenue</h3>
          <p>₹ {data.monthlyRevenue}</p>
        </div>

        <div className="analytics-card">
          <h3>Pending Amount</h3>
          <p>₹ {data.pendingAmount}</p>
        </div>

        <div className="analytics-card">
  <h3>Total Delivered Orders</h3>
  <p>{data.totalDeliveredOrders}</p>
</div>
<div className="analytics-card">
  <h3>Total Revenue (All Time)</h3>
  <p>₹ {data.totalRevenue}</p>
</div>

      </div>
    </div>
  );
}

export default Analytics;
