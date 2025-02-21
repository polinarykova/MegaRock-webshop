import { useState, useEffect } from "react";

type Inventory = {
  [key: string]: { [size: string]: number };
};

export default function Home() {
  const [inventory, setInventory] = useState<Inventory>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetch("/api/getInventory")
      .then((res) => res.json())
      .then((data: Inventory) => setInventory(data));
  }, []);

  // Open modal and store selected item and size
  const openModal = (item: string, size: string) => {
    setSelectedItem(item);
    setSelectedSize(size);
    setIsModalOpen(true);
  };

  // Handle the form submission in the modal
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const orderData = {
      item: selectedItem,
      size: selectedSize,
      ...formData,
    };

    try {
      const response = await fetch("/api/sendOrderEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Order placed successfully! Email sent.");
        setIsModalOpen(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
        });
       
        await fetch("/api/updateInventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ item: selectedItem, size: selectedSize }),
        });
      } else {
        setMessage(data.error || "Failed to send order email.");
      }
    } catch (error) {
      setMessage("Error sending order email.");
    } 
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <h1 className="text-5xl font-extrabold mb-8 text-gray-800">MegaRock Shop</h1>
      {message && <p className="text-red-500 mb-4">{message}</p>}
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {Object.keys(inventory).map((item) => (
          <div
            key={item}
            className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
          >
            <img
              src={`https://source.unsplash.com/250x400/?${item},shirt`}
              alt={item}
              className="w-[250px] h-[400px] object-cover mb-4 rounded-lg mx-auto"
            />
            <div className="mb-4">
              <select
                onChange={(e) => {
                  setSelectedItem(item);
                  setSelectedSize(e.target.value);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                <option value="">Select size</option>
                {Object.entries(inventory[item]).map(([size, count]) => (
                  <option key={size} value={size} disabled={count === 0}>
                    {size} ({count} left)
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                if (selectedItem === item && selectedSize) {
                  openModal(item, selectedSize);
                }
              }}
              disabled={selectedItem !== item || !selectedSize}
              className="w-full px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Order Now
            </button>
          </div>
        ))}
      </div>

      {/* Modal for order details */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="bg-white rounded-lg p-6 z-10 w-11/12 max-w-md">
            <h2 className="text-2xl font-bold mb-4">Enter your details</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
