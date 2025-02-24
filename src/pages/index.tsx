import TitleAndInfoSection from "@/components/TitleAndInfoSection";
import { useState, useEffect } from "react";

type Inventory = {
  [item: string]: {
    [size: string]: number;
  };
};

const images = ["Zute.png", "Bijele-I_love_RNR.png", "Tirkizne-polo.png", "Svjetlo_plave.png", "Narancaste.png", "Crvene.png", "Bijele_s_plavim.png", "Plave.png", "Tirkizne.png"];

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
  const [orderError, setOrderError] = useState<string | null>(null);

  useEffect(() => {
    const cachedInventory = localStorage.getItem("inventory");
    if (!cachedInventory) {
      fetchInventory();
    } else {
      setInventory(JSON.parse(cachedInventory));
    }
    const savedFormData = localStorage.getItem("formData");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await fetch("/api/getInventory");
      const data = await response.json();
      setInventory(data);
      localStorage.setItem("inventory", JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  function openModal(item: string, size: string) {
    setSelectedItem(item);
    setSelectedSize(size);
    setIsModalOpen(true);
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (selectedItem && selectedSize && inventory[selectedItem][selectedSize] === 0) {
      setOrderError(
        "Nažalost netko je upravo naručio ovaj artikl. Pokušajte s drugim artiklom ili veličinom."
      );
      setIsModalOpen(false);
      setIsMessageModalOpen(true);
      return;
    }

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

      if (response.ok) {
        setMessage("Zaprimili smo Vašu narudžbu. Hvala!");
        setIsModalOpen(false);
        localStorage.setItem("formData", JSON.stringify(formData));
        setIsMessageModalOpen(true);

        if (selectedItem && selectedSize) inventory[selectedItem][selectedSize] -= 1;

        const updateResponse = await fetch("/api/updateInventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(inventory),
        });

        if (updateResponse.ok) {
          localStorage.setItem("inventory", JSON.stringify(inventory));       
        }
      } else {
        setMessage("Greška pri slanju narudžbe. Pokušajte ponovno.");
      }
    } catch (error) {
      setMessage("Greška pri slanju narudžbe. Pokušajte ponovno.");
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col items-center lg:p-8 p-2 bg-gray-100 min-h-screen">
      <TitleAndInfoSection />
      <div className="flex flex-wrap justify-center gap-16 px-10">
        {inventory &&
          Object.entries(inventory).map(([item, sizes]) => (
            <div
              key={item}
              className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-transform duration-300 hover:scale-110 w-[350px] flex flex-col items-center"
            >
              <img
                src={images[Object.keys(inventory).indexOf(item)]}
                alt={item}
                className="w-[300px] h-[400px] object-cover mb-4 rounded-lg"
              />
              <h2 className="text-xl font-bold text-gray-600 mb-4 text-center">{item}</h2>
              <div className="mb-4 w-full">
                <select
                  onChange={(e) => {
                    setSelectedItem(item);
                    setSelectedSize(e.target.value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                >
                  <option value="">Odaberite veličinu</option>
                  {Object.entries(sizes).map(([size, count]) => (
                    <option key={size} value={size} disabled={count === 0}>
                      {size} ({count} u ponudi)
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={async () => {
                  await fetchInventory();
                  if (selectedItem === item && selectedSize && inventory[item][selectedSize] > 0) {
                    openModal(item, selectedSize);
                  }
                }}
                disabled={selectedItem !== item || !selectedSize}
                className="w-full px-6 py-2 bg-gradient-to-r from-blue-400 to-blue-400 text-white rounded-full hover:from-blue-500 hover:to-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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
            <h2 className="text-2xl font-bold mb-4">Upišite podatke</h2>
            <form onSubmit={handleFormSubmit}>
              {(["firstName", "lastName", "email", "phone"] as const).map((field) => (
                <div key={field} className="mb-4">
                  <label className="block">
                    {field === "firstName"
                      ? "Ime"
                      : field === "lastName"
                      ? "Prezime"
                      : field === "email"
                      ? "Email adresa"
                      : "Broj mobitela"}
                  </label>
                  <input
                    type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                    value={formData[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
                    required
                  />
                </div>
              ))}
              <div className="flex justify-end">
                <button type="submit" className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-600">
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
            <h2 className="text-2xl font-bold mb-4">{orderError ? "Greška" : "Uspjeh"}</h2>
            <p>{orderError ? orderError : message}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setIsMessageModalOpen(false);
                   setOrderError(null)
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
