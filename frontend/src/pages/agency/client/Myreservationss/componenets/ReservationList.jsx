import React, { useState } from "react";

const ReservationList = ({ bookings }) => {
  const [expandedId, setExpandedId] = useState(null);

  const handleRowClick = (booking) => {
    console.log("📋 Réservation sélectionnée:", booking);
    setExpandedId(expandedId === booking.id ? null : booking.id);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      canceled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "⏳ En attente",
      confirmed: "✅ Confirmée",
      canceled: "❌ Annulée",
      completed: "✔️ Complétée",
    };
    return labels[status] || status;
  };

  return (
    <div className="reservation-list">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Véhicule
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Client
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Dates
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Prix Total
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Statut
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <React.Fragment key={booking.id}>
                <tr
                  onClick={() => handleRowClick(booking)}
                  className="hover:bg-gray-50 cursor-pointer border-b border-gray-300"
                >
                  <td className="border border-gray-300 px-4 py-2">
                    <span className="font-semibold text-blue-600">
                      #{booking.id}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div>
                      <p className="font-semibold">
                        {booking.car?.brand} {booking.car?.model}
                      </p>
                      <p className="text-sm text-gray-600">
                        {booking.car?.year}
                      </p>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div>
                      <p className="font-semibold">{booking.user?.name}</p>
                      <p className="text-sm text-gray-600">
                        {booking.user?.email}
                      </p>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="text-sm">
                      <p>📅 Du: {booking.start_date}</p>
                      <p>📅 Au: {booking.end_date}</p>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className="font-bold text-lg">
                      {booking.total_price} DH
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}
                    >
                      {getStatusLabel(booking.status)}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(booking);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      {expandedId === booking.id ? "▼ Masquer" : "▶ Voir plus"}
                    </button>
                  </td>
                </tr>

                {/* Ligne d'expansion */}
                {expandedId === booking.id && (
                  <tr className="bg-gray-50 border-b border-gray-300">
                    <td
                      colSpan="7"
                      className="border border-gray-300 px-4 py-4"
                    >
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Informations du véhicule */}
                          <div>
                            <h4 className="font-bold text-lg mb-3 text-blue-600">
                              🚗 Véhicule
                            </h4>
                            <div className="space-y-2 text-sm">
                              {booking.car?.cover_image_url && (
                                <img
                                  src={booking.car.cover_image_url}
                                  alt="Voiture"
                                  className="w-full h-48 object-cover rounded-lg mb-3"
                                />
                              )}
                              <p>
                                <strong>Marque:</strong> {booking.car?.brand}
                              </p>
                              <p>
                                <strong>Modèle:</strong> {booking.car?.model}
                              </p>
                              <p>
                                <strong>Année:</strong> {booking.car?.year}
                              </p>
                            </div>
                          </div>

                          {/* Informations du client */}
                          <div>
                            <h4 className="font-bold text-lg mb-3 text-green-600">
                              👤 Client
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p>
                                <strong>Nom:</strong> {booking.user?.name}
                              </p>
                              <p>
                                <strong>Email:</strong> {booking.user?.email}
                              </p>
                              <p>
                                <strong>Téléphone:</strong>{" "}
                                {booking.user?.phone || "N/A"}
                              </p>
                            </div>
                          </div>

                          {/* Détails de la réservation */}
                          <div>
                            <h4 className="font-bold text-lg mb-3 text-purple-600">
                              📅 Dates
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p>
                                <strong>Date de début:</strong>{" "}
                                {booking.start_date}
                              </p>
                              <p>
                                <strong>Date de fin:</strong> {booking.end_date}
                              </p>
                              <p>
                                <strong>Durée:</strong>{" "}
                                {Math.ceil(
                                  (new Date(booking.end_date) -
                                    new Date(booking.start_date)) /
                                    (1000 * 60 * 60 * 24),
                                )}{" "}
                                jours
                              </p>
                            </div>
                          </div>

                          {/* Informations de prix */}
                          <div>
                            <h4 className="font-bold text-lg mb-3 text-orange-600">
                              💰 Tarification
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p>
                                <strong>Prix total:</strong>{" "}
                                {booking.total_price} DH
                              </p>
                              <p>
                                <strong>Statut:</strong>{" "}
                                <span
                                  className={`px-2 py-1 rounded ${getStatusColor(booking.status)}`}
                                >
                                  {getStatusLabel(booking.status)}
                                </span>
                              </p>
                              <p>
                                <strong>Créée:</strong> {booking.created_at}
                              </p>
                              <p>
                                <strong>Mise à jour:</strong>{" "}
                                {booking.updated_at}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* JSON Affichage */}
                        <div className="mt-6 p-4 bg-gray-900 rounded-lg">
                          <p className="text-white font-bold mb-2">
                            📊 Données JSON (Voir la console):
                          </p>
                          <pre className="text-green-400 text-xs overflow-auto max-h-48">
                            {JSON.stringify(booking, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Résumé */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-gray-700">
          <strong>Total:</strong> {bookings.length} réservation(s) trouvée(s)
        </p>
        <p className="text-sm text-gray-600 mt-2">
          💡 Cliquez sur une ligne pour voir les détails ou ouvrez la console
          (F12) pour voir les données
        </p>
      </div>
    </div>
  );
};

export default ReservationList;
