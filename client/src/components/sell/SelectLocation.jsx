import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useSell } from "../../contexts/SellContext";
import { ArrowLeft } from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function LocationMarker({ position }) {
  const map = useMap();
  if (position) {
    map.setView(position, 16);
  }
  return position ? <Marker position={position}></Marker> : null;
}

function ClickableMap({ setMarkerPos, setAddress }) {
  const map = useMap();
  const { handleLocation } = useSell();

  map.on("click", async (e) => {
    const { lat, lng } = e.latlng;
    setMarkerPos([lat, lng]);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      setAddress(data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } catch (err) {
      console.error(err);
      setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    }

    console.log("Latitude:", lat, "Longitude:", lng);
    handleLocation({lat, lng});

  });

  return null;
}

export default function SelectLocation() {
  const [address, setAddress] = useState("");
  const [markerPos, setMarkerPos] = useState(null);
  const { handleLocation, nextStep, prevStep } = useSell();

  const handleSearch = async () => {
    if (!address) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        const position = [parseFloat(lat), parseFloat(lon)];
        setMarkerPos(position);
        console.log("Latitude:", lat, "Longitude:", lon);
        handleLocation({lat, lon});
      } else {
        alert("Location not found");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNext = () => {
    nextStep();
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 md:bg-black/50 bg-white md:flex md:items-center md:justify-center z-50"
    >
      <div 
        className="bg-white rounded-none md:rounded-2xl shadow-xl w-full h-full md:w-[450px] md:max-h-[90vh] p-0 md:p-8 flex flex-col relative overflow-y-auto"
      >
        <div className="flex items-center p-6 md:p-0 md:mb-4">
          <button 
            onClick={prevStep}
            className="md:hidden mr-3"
            type="button"
          >
            <ArrowLeft className="size-6 text-gray-700" />
          </button>
          <h2 className="text-xl md:text-lg font-semibold text-left md:text-center flex-1 md:flex-none">
            Add Location
          </h2>
        </div>
        <div className="w-full h-[400px] md:h-[400px] mb-4">
          <MapContainer
            center={[8.5241, 76.9366]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker position={markerPos} />
            <ClickableMap setMarkerPos={setMarkerPos} setAddress={setAddress} />
          </MapContainer>
        </div>
        <div className="px-6 md:px-0 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Pathanamthitta, Kerala"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>
        <div className="flex-1 md:flex-none"></div>
        <div className="px-6 md:px-0 pb-24 md:pb-0">
          <button 
            onClick={handleNext} 
            className="bg-primary w-full py-3 rounded-xl mt-6 md:mt-10 text-white hover:bg-primary/90 font-medium"
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}