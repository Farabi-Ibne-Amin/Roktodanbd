// Bangladesh Hospital Data — Major hospitals across all 64 districts
// Each entry: { name, district, division, type, lat, lng, phone }

const BD_HOSPITALS = [
  // ─── DHAKA DIVISION ───────────────────────────────────
  { name: "Dhaka Medical College Hospital", district: "Dhaka", division: "Dhaka", type: "Government", lat: 23.7258, lng: 90.3982, phone: "02-55165088" },
  { name: "Bangabandhu Sheikh Mujib Medical University", district: "Dhaka", division: "Dhaka", type: "Government", lat: 23.7387, lng: 90.3966, phone: "02-55165001" },
  { name: "Sir Salimullah Medical College & Mitford Hospital", district: "Dhaka", division: "Dhaka", type: "Government", lat: 23.7077, lng: 90.4014, phone: "02-7319011" },
  { name: "National Institute of Cardiovascular Diseases", district: "Dhaka", division: "Dhaka", type: "Government", lat: 23.7412, lng: 90.3945, phone: "02-9125450" },
  { name: "Shishu (Children) Hospital, Sher-e-Bangla Nagar", district: "Dhaka", division: "Dhaka", type: "Government", lat: 23.7607, lng: 90.3701, phone: "02-9122542" },
  { name: "Shaheed Suhrawardy Medical College Hospital", district: "Dhaka", division: "Dhaka", type: "Government", lat: 23.7592, lng: 90.3736, phone: "02-8117030" },
  { name: "Square Hospital", district: "Dhaka", division: "Dhaka", type: "Private", lat: 23.7512, lng: 90.3794, phone: "02-8159457" },
  { name: "United Hospital", district: "Dhaka", division: "Dhaka", type: "Private", lat: 23.7964, lng: 90.4120, phone: "02-8836000" },
  { name: "Apollo Hospitals Dhaka", district: "Dhaka", division: "Dhaka", type: "Private", lat: 23.7959, lng: 90.4121, phone: "02-8401661" },
  { name: "Labaid Hospital Dhanmondi", district: "Dhaka", division: "Dhaka", type: "Private", lat: 23.7457, lng: 90.3745, phone: "02-9674937" },
  { name: "Evercare Hospital Dhaka", district: "Dhaka", division: "Dhaka", type: "Private", lat: 23.8152, lng: 90.4243, phone: "02-9858934" },
  { name: "Ibn Sina Hospital Dhanmondi", district: "Dhaka", division: "Dhaka", type: "Private", lat: 23.7427, lng: 90.3755, phone: "02-9668037" },
  { name: "Birdem General Hospital", district: "Dhaka", division: "Dhaka", type: "Specialized", lat: 23.7379, lng: 90.3951, phone: "02-9661551" },
  { name: "National Institute of Mental Health", district: "Dhaka", division: "Dhaka", type: "Government", lat: 23.7382, lng: 90.3959, phone: "02-9115433" },
  { name: "Dhaka Shishu Hospital", district: "Dhaka", division: "Dhaka", type: "Government", lat: 23.7610, lng: 90.3704, phone: "02-9122542" },
  { name: "Holy Family Red Crescent Medical College Hospital", district: "Dhaka", division: "Dhaka", type: "Private", lat: 23.7549, lng: 90.3960, phone: "02-9346009" },
  { name: "Anwer Khan Modern Hospital", district: "Dhaka", division: "Dhaka", type: "Private", lat: 23.7442, lng: 90.3769, phone: "02-9676516" },

  // Gazipur
  { name: "Shaheed Tajuddin Ahmad Medical College Hospital", district: "Gazipur", division: "Dhaka", type: "Government", lat: 23.9999, lng: 90.4203, phone: "02-9250701" },
  { name: "Gazipur Sadar Hospital", district: "Gazipur", division: "Dhaka", type: "Government", lat: 23.9966, lng: 90.4161, phone: "02-9257101" },

  // Narayanganj
  { name: "300 Bed General Hospital Narayanganj", district: "Narayanganj", division: "Dhaka", type: "Government", lat: 23.6238, lng: 90.5000, phone: "02-7633501" },
  { name: "Khidirpur Khaja Yunus Ali Medical College Hospital", district: "Narayanganj", division: "Dhaka", type: "Private", lat: 23.6211, lng: 90.4946, phone: "02-7632567" },

  // Narsingdi
  { name: "Narsingdi District Hospital", district: "Narsingdi", division: "Dhaka", type: "Government", lat: 23.9219, lng: 90.7153, phone: "02-9461011" },

  // Manikganj
  { name: "Manikganj District Hospital", district: "Manikganj", division: "Dhaka", type: "Government", lat: 23.8643, lng: 90.0036, phone: "0651-63031" },

  // Munshiganj
  { name: "Munshiganj District Hospital", district: "Munshiganj", division: "Dhaka", type: "Government", lat: 23.5422, lng: 90.5310, phone: "0661-61001" },

  // Tangail
  { name: "Sheikh Hasina Medical College Hospital Tangail", district: "Tangail", division: "Dhaka", type: "Government", lat: 24.2512, lng: 89.9167, phone: "0921-52061" },
  { name: "Tangail General Hospital", district: "Tangail", division: "Dhaka", type: "Government", lat: 24.2508, lng: 89.9150, phone: "0921-52031" },

  // Kishoreganj
  { name: "Kishoreganj District Hospital", district: "Kishoreganj", division: "Dhaka", type: "Government", lat: 24.4444, lng: 90.7768, phone: "0941-61001" },

  // Rajbari
  { name: "Rajbari District Hospital", district: "Rajbari", division: "Dhaka", type: "Government", lat: 23.7580, lng: 89.6439, phone: "0641-65001" },

  // Shariatpur
  { name: "Shariatpur District Hospital", district: "Shariatpur", division: "Dhaka", type: "Government", lat: 23.2397, lng: 90.4367, phone: "0601-61001" },

  // Faridpur
  { name: "Faridpur Medical College Hospital", district: "Faridpur", division: "Dhaka", type: "Government", lat: 23.5961, lng: 89.4913, phone: "0631-63001" },

  // Gopalganj
  { name: "Gopalganj District Hospital", district: "Gopalganj", division: "Dhaka", type: "Government", lat: 23.0057, lng: 89.8267, phone: "04931-62001" },

  // Madaripur
  { name: "Madaripur Medical College Hospital", district: "Madaripur", division: "Dhaka", type: "Government", lat: 23.1795, lng: 90.1990, phone: "0621-62001" },

  // ─── CHITTAGONG DIVISION ──────────────────────────────
  { name: "Chittagong Medical College Hospital", district: "Chittagong", division: "Chittagong", type: "Government", lat: 22.3569, lng: 91.8324, phone: "031-630011" },
  { name: "Chittagong General Hospital", district: "Chittagong", division: "Chittagong", type: "Government", lat: 22.3394, lng: 91.8361, phone: "031-2515261" },
  { name: "Park View Hospital Chittagong", district: "Chittagong", division: "Chittagong", type: "Private", lat: 22.3690, lng: 91.8325, phone: "031-2855600" },
  { name: "Max Hospital Chittagong", district: "Chittagong", division: "Chittagong", type: "Private", lat: 22.3611, lng: 91.8317, phone: "031-2850000" },
  { name: "Medinova Medical Services Chittagong", district: "Chittagong", division: "Chittagong", type: "Private", lat: 22.3658, lng: 91.8335, phone: "031-627861" },
  { name: "Holy Crescent Hospital Chittagong", district: "Chittagong", division: "Chittagong", type: "Private", lat: 22.3570, lng: 91.8302, phone: "031-618051" },

  // Cox's Bazar
  { name: "Cox's Bazar District Hospital", district: "Cox's Bazar", division: "Chittagong", type: "Government", lat: 21.4372, lng: 92.0058, phone: "0341-62001" },
  { name: "Cox's Bazar Medical College Hospital", district: "Cox's Bazar", division: "Chittagong", type: "Private", lat: 21.4456, lng: 92.0112, phone: "0341-63001" },

  // Comilla
  { name: "Comilla Medical College Hospital", district: "Comilla", division: "Chittagong", type: "Government", lat: 23.4572, lng: 91.1920, phone: "081-75871" },
  { name: "Comilla General Hospital", district: "Comilla", division: "Chittagong", type: "Government", lat: 23.4606, lng: 91.1919, phone: "081-67001" },

  // Brahmanbaria
  { name: "Brahmanbaria District Hospital", district: "Brahmanbaria", division: "Chittagong", type: "Government", lat: 23.9608, lng: 91.1116, phone: "0851-51001" },

  // Chandpur
  { name: "Chandpur District Hospital", district: "Chandpur", division: "Chittagong", type: "Government", lat: 23.2321, lng: 90.6701, phone: "0841-64001" },

  // Feni
  { name: "Feni District Hospital", district: "Feni", division: "Chittagong", type: "Government", lat: 23.0152, lng: 91.3979, phone: "0331-62001" },

  // Lakshmipur
  { name: "Lakshmipur District Hospital", district: "Lakshmipur", division: "Chittagong", type: "Government", lat: 22.9464, lng: 90.8350, phone: "0381-62001" },

  // Noakhali
  { name: "Noakhali Medical College Hospital", district: "Noakhali", division: "Chittagong", type: "Government", lat: 22.8696, lng: 91.0991, phone: "0321-64001" },
  { name: "Noakhali General Hospital", district: "Noakhali", division: "Chittagong", type: "Government", lat: 22.8724, lng: 91.1001, phone: "0321-62001" },

  // Khagrachhari
  { name: "Khagrachhari District Hospital", district: "Khagrachhari", division: "Chittagong", type: "Government", lat: 23.1193, lng: 91.9847, phone: "0371-61001" },

  // Rangamati
  { name: "Rangamati General Hospital", district: "Rangamati", division: "Chittagong", type: "Government", lat: 22.6500, lng: 92.1820, phone: "0351-63001" },

  // Bandarban
  { name: "Bandarban District Hospital", district: "Bandarban", division: "Chittagong", type: "Government", lat: 22.1953, lng: 92.2184, phone: "0361-62001" },

  // ─── SYLHET DIVISION ──────────────────────────────────
  { name: "Sylhet MAG Osmani Medical College Hospital", district: "Sylhet", division: "Sylhet", type: "Government", lat: 24.8994, lng: 91.8686, phone: "0821-716493" },
  { name: "Sylhet Women's Medical College Hospital", district: "Sylhet", division: "Sylhet", type: "Private", lat: 24.9055, lng: 91.8701, phone: "0821-727001" },
  { name: "Ibn Sina Hospital Sylhet", district: "Sylhet", division: "Sylhet", type: "Private", lat: 24.8962, lng: 91.8749, phone: "0821-724002" },
  { name: "North East Medical College Hospital", district: "Sylhet", division: "Sylhet", type: "Private", lat: 24.9110, lng: 91.8654, phone: "0821-811201" },

  // Habiganj
  { name: "Habiganj District Hospital", district: "Habiganj", division: "Sylhet", type: "Government", lat: 24.3752, lng: 91.4155, phone: "0831-62001" },

  // Moulvibazar
  { name: "Moulvibazar District Hospital", district: "Moulvibazar", division: "Sylhet", type: "Government", lat: 24.4827, lng: 91.7774, phone: "0861-52001" },

  // Sunamganj
  { name: "Sunamganj District Hospital", district: "Sunamganj", division: "Sylhet", type: "Government", lat: 25.0658, lng: 91.3988, phone: "0871-62001" },

  // ─── RAJSHAHI DIVISION ────────────────────────────────
  { name: "Rajshahi Medical College Hospital", district: "Rajshahi", division: "Rajshahi", type: "Government", lat: 24.3745, lng: 88.6042, phone: "0721-772150" },
  { name: "Rajshahi Shishu Hospital", district: "Rajshahi", division: "Rajshahi", type: "Government", lat: 24.3720, lng: 88.6030, phone: "0721-772001" },
  { name: "Popular Medical Center Rajshahi", district: "Rajshahi", division: "Rajshahi", type: "Private", lat: 24.3630, lng: 88.5988, phone: "0721-773001" },

  // Bogura
  { name: "Shaheed Ziaur Rahman Medical College Hospital", district: "Bogura", division: "Rajshahi", type: "Government", lat: 24.8465, lng: 89.3773, phone: "051-64201" },
  { name: "Bogura District Hospital", district: "Bogura", division: "Rajshahi", type: "Government", lat: 24.8488, lng: 89.3753, phone: "051-66901" },

  // Chapai Nawabganj
  { name: "Chapai Nawabganj District Hospital", district: "Chapai Nawabganj", division: "Rajshahi", type: "Government", lat: 24.5908, lng: 88.2759, phone: "0781-52001" },

  // Joypurhat
  { name: "Joypurhat District Hospital", district: "Joypurhat", division: "Rajshahi", type: "Government", lat: 25.0961, lng: 89.0211, phone: "0571-62001" },

  // Naogaon
  { name: "Naogaon District Hospital", district: "Naogaon", division: "Rajshahi", type: "Government", lat: 24.8048, lng: 88.9352, phone: "0741-62001" },

  // Natore
  { name: "Natore District Hospital", district: "Natore", division: "Rajshahi", type: "Government", lat: 24.4205, lng: 88.9881, phone: "0771-62001" },

  // Pabna
  { name: "Pabna Mental Hospital", district: "Pabna", division: "Rajshahi", type: "Government", lat: 24.0065, lng: 89.2356, phone: "0731-63001" },
  { name: "Pabna District Hospital", district: "Pabna", division: "Rajshahi", type: "Government", lat: 24.0087, lng: 89.2366, phone: "0731-64001" },

  // Sirajganj
  { name: "Sirajganj District Hospital", district: "Sirajganj", division: "Rajshahi", type: "Government", lat: 24.4543, lng: 89.7049, phone: "0751-62001" },

  // ─── KHULNA DIVISION ──────────────────────────────────
  { name: "Khulna Medical College Hospital", district: "Khulna", division: "Khulna", type: "Government", lat: 22.8456, lng: 89.5403, phone: "041-731001" },
  { name: "Khulna General Hospital", district: "Khulna", division: "Khulna", type: "Government", lat: 22.8369, lng: 89.5501, phone: "041-720001" },
  { name: "Gazi Medical College Hospital Khulna", district: "Khulna", division: "Khulna", type: "Private", lat: 22.8410, lng: 89.5456, phone: "041-760001" },

  // Bagerhat
  { name: "Bagerhat District Hospital", district: "Bagerhat", division: "Khulna", type: "Government", lat: 22.6554, lng: 89.7860, phone: "0468-62001" },

  // Chuadanga
  { name: "Chuadanga District Hospital", district: "Chuadanga", division: "Khulna", type: "Government", lat: 23.6400, lng: 88.8416, phone: "0761-62001" },

  // Jessore
  { name: "Khulna Medical College Hospital Jessore Branch", district: "Jessore", division: "Khulna", type: "Government", lat: 23.1634, lng: 89.2182, phone: "0421-65001" },
  { name: "Jessore General Hospital", district: "Jessore", division: "Khulna", type: "Government", lat: 23.1628, lng: 89.2160, phone: "0421-64001" },

  // Jhenaidah
  { name: "Jhenaidah District Hospital", district: "Jhenaidah", division: "Khulna", type: "Government", lat: 23.5449, lng: 89.1530, phone: "0451-62001" },

  // Kushtia
  { name: "Kushtia General Hospital", district: "Kushtia", division: "Khulna", type: "Government", lat: 23.8986, lng: 89.1179, phone: "0711-62001" },
  { name: "Kushtia Medical College Hospital", district: "Kushtia", division: "Khulna", type: "Government", lat: 23.9012, lng: 89.1188, phone: "0711-65001" },

  // Magura
  { name: "Magura District Hospital", district: "Magura", division: "Khulna", type: "Government", lat: 23.4876, lng: 89.4200, phone: "0488-62001" },

  // Meherpur
  { name: "Meherpur District Hospital", district: "Meherpur", division: "Khulna", type: "Government", lat: 23.7627, lng: 88.6317, phone: "0791-62001" },

  // Narail
  { name: "Narail District Hospital", district: "Narail", division: "Khulna", type: "Government", lat: 23.1723, lng: 89.5119, phone: "0481-62001" },

  // Satkhira
  { name: "Satkhira District Hospital", district: "Satkhira", division: "Khulna", type: "Government", lat: 22.7185, lng: 89.0705, phone: "0471-63001" },

  // ─── BARISAL DIVISION ─────────────────────────────────
  { name: "Sher-e-Bangla Medical College Hospital Barisal", district: "Barisal", division: "Barisal", type: "Government", lat: 22.7010, lng: 90.3533, phone: "0431-63001" },
  { name: "Barisal General Hospital", district: "Barisal", division: "Barisal", type: "Government", lat: 22.7050, lng: 90.3604, phone: "0431-64001" },
  { name: "Barisal City Medical Center", district: "Barisal", division: "Barisal", type: "Private", lat: 22.7066, lng: 90.3520, phone: "0431-65001" },

  // Barguna
  { name: "Barguna District Hospital", district: "Barguna", division: "Barisal", type: "Government", lat: 22.1524, lng: 90.1213, phone: "0448-62001" },

  // Bhola
  { name: "Bhola District Hospital", district: "Bhola", division: "Barisal", type: "Government", lat: 22.6858, lng: 90.6482, phone: "0491-62001" },

  // Jhalokati
  { name: "Jhalokati District Hospital", district: "Jhalokati", division: "Barisal", type: "Government", lat: 22.6440, lng: 90.1987, phone: "0498-62001" },

  // Patuakhali
  { name: "Patuakhali Medical College Hospital", district: "Patuakhali", division: "Barisal", type: "Government", lat: 22.3596, lng: 90.3297, phone: "0441-65001" },
  { name: "Patuakhali General Hospital", district: "Patuakhali", division: "Barisal", type: "Government", lat: 22.3607, lng: 90.3283, phone: "0441-64001" },

  // Pirojpur
  { name: "Pirojpur District Hospital", district: "Pirojpur", division: "Barisal", type: "Government", lat: 22.5812, lng: 89.9758, phone: "0461-62001" },

  // ─── RANGPUR DIVISION ─────────────────────────────────
  { name: "Rangpur Medical College Hospital", district: "Rangpur", division: "Rangpur", type: "Government", lat: 25.7454, lng: 89.2752, phone: "0521-65001" },
  { name: "Rangpur General Hospital", district: "Rangpur", division: "Rangpur", type: "Government", lat: 25.7439, lng: 89.2763, phone: "0521-64001" },
  { name: "Popular Medical Center Rangpur", district: "Rangpur", division: "Rangpur", type: "Private", lat: 25.7430, lng: 89.2745, phone: "0521-63001" },

  // Dinajpur
  { name: "M. Abdur Rahim Medical College Hospital", district: "Dinajpur", division: "Rangpur", type: "Government", lat: 25.6279, lng: 88.6355, phone: "0531-64001" },
  { name: "Dinajpur General Hospital", district: "Dinajpur", division: "Rangpur", type: "Government", lat: 25.6266, lng: 88.6331, phone: "0531-63001" },

  // Gaibandha
  { name: "Gaibandha District Hospital", district: "Gaibandha", division: "Rangpur", type: "Government", lat: 25.3288, lng: 89.5287, phone: "0541-62001" },

  // Kurigram
  { name: "Kurigram District Hospital", district: "Kurigram", division: "Rangpur", type: "Government", lat: 25.8073, lng: 89.6361, phone: "0581-62001" },

  // Lalmonirhat
  { name: "Lalmonirhat District Hospital", district: "Lalmonirhat", division: "Rangpur", type: "Government", lat: 25.9217, lng: 89.4515, phone: "0591-62001" },

  // Nilphamari
  { name: "Nilphamari District Hospital", district: "Nilphamari", division: "Rangpur", type: "Government", lat: 25.9318, lng: 88.8560, phone: "0551-62001" },

  // Panchagarh
  { name: "Panchagarh District Hospital", district: "Panchagarh", division: "Rangpur", type: "Government", lat: 26.3407, lng: 88.5561, phone: "0564-62001" },

  // Thakurgaon
  { name: "Thakurgaon District Hospital", district: "Thakurgaon", division: "Rangpur", type: "Government", lat: 26.0338, lng: 88.4616, phone: "0561-62001" },

  // ─── MYMENSINGH DIVISION ──────────────────────────────
  { name: "Mymensingh Medical College Hospital", district: "Mymensingh", division: "Mymensingh", type: "Government", lat: 24.7543, lng: 90.4020, phone: "091-65001" },
  { name: "Mymensingh General Hospital", district: "Mymensingh", division: "Mymensingh", type: "Government", lat: 24.7525, lng: 90.4047, phone: "091-64001" },

  // Jamalpur
  { name: "Jamalpur District Hospital", district: "Jamalpur", division: "Mymensingh", type: "Government", lat: 24.9375, lng: 89.9381, phone: "0981-62001" },

  // Netrokona
  { name: "Netrokona District Hospital", district: "Netrokona", division: "Mymensingh", type: "Government", lat: 24.8701, lng: 90.7279, phone: "0951-62001" },

  // Sherpur
  { name: "Sherpur District Hospital", district: "Sherpur", division: "Mymensingh", type: "Government", lat: 25.0186, lng: 90.0168, phone: "0931-62001" }
];

window.BD_HOSPITALS = BD_HOSPITALS;
