const stores = [
  // 🇺🇸 USA
  { id: 1, name: "RTK Store New York", lat: 40.712776, lng: -74.005974, address: "5th Avenue, New York, USA", country: "USA" },
  { id: 2, name: "RTK Store Los Angeles", lat: 34.052235, lng: -118.243683, address: "Sunset Blvd, Los Angeles, USA", country: "USA" },
  { id: 3, name: "RTK Store Chicago", lat: 41.878113, lng: -87.629799, address: "Michigan Ave, Chicago, USA", country: "USA" },
  { id: 4, name: "RTK Store San Francisco", lat: 37.774929, lng: -122.419418, address: "Market St, San Francisco, USA", country: "USA" },
  { id: 5, name: "RTK Store Miami", lat: 25.761681, lng: -80.191788, address: "Ocean Drive, Miami, USA", country: "USA" },

  // 🇨🇦 Canada
  { id: 6, name: "RTK Store Toronto", lat: 43.653225, lng: -79.383186, address: "Yonge Street, Toronto, Canada", country: "Canada" },
  { id: 7, name: "RTK Store Vancouver", lat: 49.282729, lng: -123.120738, address: "Robson St, Vancouver, Canada", country: "Canada" },
  { id: 8, name: "RTK Store Montreal", lat: 45.501690, lng: -73.567253, address: "Saint Catherine St, Montreal, Canada", country: "Canada" },

  // 🇬🇧 UK
  { id: 9, name: "RTK Store London", lat: 51.507351, lng: -0.127758, address: "Oxford Street, London, UK", country: "UK" },
  { id: 10, name: "RTK Store Manchester", lat: 53.480759, lng: -2.242631, address: "Market Street, Manchester, UK", country: "UK" },
  { id: 11, name: "RTK Store Birmingham", lat: 52.486244, lng: -1.890401, address: "Bullring, Birmingham, UK", country: "UK" },

  // 🇫🇷 France
  { id: 12, name: "RTK Store Paris", lat: 48.856613, lng: 2.352222, address: "Champs-Élysées, Paris, France", country: "France" },
  { id: 13, name: "RTK Store Lyon", lat: 45.764043, lng: 4.835659, address: "Rue de la République, Lyon, France", country: "France" },

  // 🇩🇪 Germany
  { id: 14, name: "RTK Store Berlin", lat: 52.520008, lng: 13.404954, address: "Alexanderplatz, Berlin, Germany", country: "Germany" },
  { id: 15, name: "RTK Store Munich", lat: 48.135124, lng: 11.581981, address: "Marienplatz, Munich, Germany", country: "Germany" },
  { id: 16, name: "RTK Store Hamburg", lat: 53.551086, lng: 9.993682, address: "Reeperbahn, Hamburg, Germany", country: "Germany" },

  // 🇯🇵 Japan
  { id: 17, name: "RTK Store Tokyo", lat: 35.689487, lng: 139.691711, address: "Shibuya, Tokyo, Japan", country: "Japan" },
  { id: 18, name: "RTK Store Osaka", lat: 34.693737, lng: 135.502167, address: "Namba, Osaka, Japan", country: "Japan" },
  { id: 19, name: "RTK Store Kyoto", lat: 35.011635, lng: 135.768036, address: "Gion, Kyoto, Japan", country: "Japan" },

  // 🇰🇷 South Korea
  { id: 20, name: "RTK Store Seoul", lat: 37.566536, lng: 126.977966, address: "Myeongdong, Seoul, Korea", country: "South Korea" },
  { id: 21, name: "RTK Store Busan", lat: 35.179554, lng: 129.075638, address: "Haeundae, Busan, Korea", country: "South Korea" },

  // 🇸🇬 Singapore
  { id: 22, name: "RTK Store Singapore", lat: 1.352083, lng: 103.819839, address: "Orchard Road, Singapore", country: "Singapore" },

  // 🇹🇭 Thailand
  { id: 23, name: "RTK Store Bangkok", lat: 13.756331, lng: 100.501762, address: "Siam Square, Bangkok, Thailand", country: "Thailand" },
  { id: 24, name: "RTK Store Chiang Mai", lat: 18.788343, lng: 98.985300, address: "Nimmanhaemin, Chiang Mai", country: "Thailand" },

  // 🇻🇳 Vietnam
  { id: 25, name: "RTK Store Ho Chi Minh", lat: 10.776889, lng: 106.700806, address: "Nguyen Hue, HCMC, Vietnam", country: "Vietnam" },
  { id: 26, name: "RTK Store Hanoi", lat: 21.027763, lng: 105.834160, address: "Hoan Kiem, Hanoi, Vietnam", country: "Vietnam" },
  { id: 27, name: "RTK Store Da Nang", lat: 16.054407, lng: 108.202164, address: "My Khe Beach, Da Nang", country: "Vietnam" },

  // 🇦🇺 Australia
  { id: 28, name: "RTK Store Sydney", lat: -33.868820, lng: 151.209290, address: "George Street, Sydney", country: "Australia" },
  { id: 29, name: "RTK Store Melbourne", lat: -37.813629, lng: 144.963058, address: "Collins Street, Melbourne", country: "Australia" },

  // 🇧🇷 Brazil
  { id: 30, name: "RTK Store São Paulo", lat: -23.550520, lng: -46.633308, address: "Paulista Avenue, São Paulo", country: "Brazil" },

  // 🇮🇳 India
  { id: 31, name: "RTK Store Mumbai", lat: 19.076090, lng: 72.877426, address: "Bandra, Mumbai", country: "India" },
  { id: 32, name: "RTK Store Delhi", lat: 28.613939, lng: 77.209023, address: "Connaught Place, Delhi", country: "India" },

  // 🇦🇪 UAE
  { id: 33, name: "RTK Store Dubai", lat: 25.204849, lng: 55.270782, address: "Dubai Mall, Dubai", country: "UAE" },

  // 🇿🇦 South Africa
  { id: 34, name: "RTK Store Cape Town", lat: -33.924870, lng: 18.424055, address: "V&A Waterfront, Cape Town", country: "South Africa" },

  // 🇲🇽 Mexico
  { id: 35, name: "RTK Store Mexico City", lat: 19.432608, lng: -99.133209, address: "Polanco, Mexico City", country: "Mexico" },

  // 🇮🇹 Italy
  { id: 36, name: "RTK Store Milan", lat: 45.464203, lng: 9.189982, address: "Via Montenapoleone, Milan", country: "Italy" },
  { id: 37, name: "RTK Store Rome", lat: 41.902782, lng: 12.496366, address: "Via del Corso, Rome", country: "Italy" },

  // 🇪🇸 Spain
  { id: 38, name: "RTK Store Madrid", lat: 40.416775, lng: -3.703790, address: "Gran Via, Madrid", country: "Spain" },
  { id: 39, name: "RTK Store Barcelona", lat: 41.385063, lng: 2.173404, address: "La Rambla, Barcelona", country: "Spain" },

  // 🇷🇺 Russia
  { id: 40, name: "RTK Store Moscow", lat: 55.755825, lng: 37.617298, address: "Tverskaya Street, Moscow", country: "Russia" },

  // ---- Remaining stores (41–100) ----
  // Same pattern, spread globally
];
export default stores;
