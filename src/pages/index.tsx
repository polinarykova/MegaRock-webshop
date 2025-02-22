import { useState, useEffect } from "react";

type Inventory = {
  [item: string]: {
    [size: string]: number;
  };
};

export default function Home() {
  const [inventory, setInventory] = useState<Inventory>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchInventory();

    const savedFormData = localStorage.getItem("formData");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);
  
  function fetchInventory() {
    fetch("/api/getInventory")
    .then((res) => res.json())
    .then((data: Inventory) => setInventory(data));
  }


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
        setMessage("Zaprimili smo Vašu narudžbu. Hvala!");
        setIsModalOpen(false);
        localStorage.setItem("formData", JSON.stringify(formData));
        setIsMessageModalOpen(true);
        

        if (selectedItem && selectedSize) inventory[selectedItem][selectedSize] -= 1;

        await fetch("/api/updateInventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(inventory),
        });
      } else {
        setMessage(data.error || "Failed to send order email.");
      }
    } catch (error) {
      setMessage("Error sending order email.");
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
       <div className="flex flex-col items-center px-6 md:px-12">
       <hr className="border-gray-500 w-full my-4" />
  <h1 className="text-5xl font-extrabold text-blue-500 text-center mb-6">
    {'MEGARock majice - Sell off'}
  </h1>
  <hr className="border-gray-500 w-full mb-4" />

  <div className="text-lg text-white max-w-5xl space-y-6 mb-20 bg-gray-500 rounded-lg p-8 shadow-lg mt-12">
    <p className="leading-relaxed">
      {'Predstavljamo jednostavan '}
      <span className="font-semibold text-blue-400">{'webshop'}</span>
      {' gdje možete pronaći klupske majice koje još nisu našle svoje vlasnike. Dostupne boje i veličine su ograničene.'}
    </p>
    <p className="leading-relaxed">
      {'Webshop radi na principu '}
      <span className="font-semibold text-blue-400">{'"jedna majica - jedna narudžba"'}</span>
      {'. Ako želite naručiti više majica, potrebno je napraviti više narudžbi. Cijena jedne majice je'} <span className="font-semibold text-blue-400">{'5€'}</span>{'.'}
    </p>
    <p className="leading-relaxed">
      {'Odaberite željeni izgled majice, veličinu i unesite kontakt podatke. Nakon što zaprimimo vašu narudžbu, poslat ćemo vam '}
      <span className="font-semibold text-blue-400">{'uplatnicu'}</span>
      {' putem sustava kojeg koristimo i za članarine i ostale uplate.'}
    </p>
  </div>
</div>

      <div className="flex flex-wrap justify-center gap-16 px-10">
      {inventory && Object.keys(inventory).map((item) => (
          <div
            key={item}
            className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:scale-110 w-[350px] flex flex-col items-center"
          >
            <img
              src="https://zpacks.com/cdn/shop/files/Zpacks-TrailCoolMerinoWoolT-Shirt-02_2048x.jpg?v=1686743695"
              alt={item}
              className="w-[250px] h-[400px] object-cover mb-4 rounded-lg mx-auto object-fit"
            />
            <div className="mb-4">
              <select
                onChange={(e) => {
                  setSelectedItem(item);
                  setSelectedSize(e.target.value);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                <option value="">Odaberite veličinu</option>
                {Object.entries(inventory[item]).map(([size, count]) => (
                  <option key={size} value={size} disabled={count === 0}>
                    {size} ({count} u ponudi)
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                if (selectedItem === item && selectedSize) {
                  if (inventory[item][selectedSize] === 0) { 
                    setSelectedSize(null); 
                    return;
                  }
                  openModal(item, selectedSize);
                }
              }}
              disabled={selectedItem !== item || !selectedSize}
              className="w-full px-6 py-2 rounded-lg mx-4 bg-gradient-to-r from-blue-400 to-blue-400 text-white rounded-full hover:from-blue-500 hover:to-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Naruči
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="bg-white rounded-lg p-6 z-10 w-11/12 max-w-md text-black">
            <h2 className="text-2xl font-bold mb-4">Upišite podatke:</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block">Ime člana kluba</label>
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
                <label className="block">Prezime člana kluba</label>
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
                <label className="block">Email adresa</label>
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
                <label className="block">Broj mobitela</label>
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
                  className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-600"
                >
                  Potvrdi narudžbu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isMessageModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setIsMessageModalOpen(false)}
          ></div>
          <div className="bg-white rounded-lg p-6 z-10 w-11/12 max-w-md text-black">
            <h2 className="text-2xl font-bold mb-4">Uspjeh</h2>
            <p>{message}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setIsMessageModalOpen(false);
                }}
                className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-600"
              >
                Zatvori
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}