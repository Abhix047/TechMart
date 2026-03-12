

const AdminDashboard = () => {

  const stats = [
    { title: "Total Products", value: "120" },
    { title: "Total Orders", value: "540" },
    { title: "Revenue", value: "$12,450" },
    { title: "Customers", value: "320" }
  ];

  return (
    <div className="bg-gray-100 min-h-screen">


      <div className="p-8">

        <h1 className="text-3xl font-bold mb-6">
          Admin Dashboard
        </h1>

        {/* Stats Cards */}

        <div className="grid grid-cols-4 gap-6 mb-10">

          {stats.map((item, index) => (

            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >

              <h2 className="text-gray-500">
                {item.title}
              </h2>

              <p className="text-2xl font-bold mt-2">
                {item.value}
              </p>

            </div>

          ))}

        </div>

        {/* Recent Orders */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Recent Orders
          </h2>

          <table className="w-full text-left">

            <thead>

              <tr className="border-b">

                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>

              </tr>

            </thead>

            <tbody>

              <tr className="border-b">
                <td className="p-3">#1001</td>
                <td className="p-3">Rahul</td>
                <td className="p-3">$120</td>
                <td className="p-3 text-green-600">Delivered</td>
              </tr>

              <tr className="border-b">
                <td className="p-3">#1002</td>
                <td className="p-3">Aman</td>
                <td className="p-3">$240</td>
                <td className="p-3 text-yellow-600">Pending</td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;