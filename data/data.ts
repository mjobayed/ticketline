export interface TripDetailsType {
  from: string;
  to: string;
  month: string;
  day: string;
}

export interface BusTicketData {
  busId: string;
  company: string;
  busNumber: string;
  type: "AC" | "Non-AC";
  totalSeats: number;
  unavailableSeats: string[];
  startingTime: string;
  reportingTime: string;
  boardingPoint: string;
  price: number;
}

export const CITIES: string[] = [
  "Dhaka",
  "Chattogram",
  "Gazipur",
  "Narayanganj",
  "Khulna",
  "Rajshahi",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
  "Barishal",
  "Cumilla",
  "Bogura",
  "Cox's Bazar",
  "Jashore",
  "Kushtia",
  "Tangail",
  "Dinajpur",
  "Faridpur",
  "Sirajganj",
  "Feni",
  "Brahmanbaria",
  "Noakhali",
  "Chandpur",
  "Lakshmipur",
  "Pabna",
  "Naogaon",
  "Chapainawabganj",
  "Thakurgaon",
  "Panchagarh",
  "Kurigram",
  "Lalmonirhat",
  "Gaibandha",
  "Nilphamari",
  "Sherpur",
  "Netrokona",
  "Jamalpur",
  "Kishoreganj",
  "Manikganj",
  "Munshiganj",
  "Narsingdi",
  "Rajbari",
  "Gopalganj",
  "Madaripur",
  "Shariatpur",
  "Satkhira",
  "Bagerhat",
  "Jhenaidah",
  "Magura",
  "Narail",
  "Chuadanga",
  "Meherpur",
  "Bhola",
  "Patuakhali",
  "Pirojpur",
  "Jhalokathi",
  "Barguna",
  "Habiganj",
  "Moulvibazar",
  "Sunamganj",
  "Bandarban",
  "Rangamati",
  "Khagrachhari",
];
const BUS_COMPANIES: string[] = [
  "Green Line Paribahan",
  "Hanif Enterprise",
  "Shyamoli NR Travels",
  "Ena Transport",
  "Shohagh Paribahan",
  "Desh Travels",
  "Saudia Coach Service",
  "Saintmartin Travels",
  "S. Alam Service",
  "Nabil Paribahan",
  "Sakura Paribahan",
  "Tisha Group",
  "Tuba Line",
];

const BOARDING_POINTS: Record<string, string[]> = {
  dhaka: [
    "Gabtoli",
    "Kalyanpur",
    "Sayedabad",
    "Mohakhali",
    "Abdullahpur",
    "Arambagh",
    "Fakirapool",
    "Kuril Bishwa Road",
  ],
  chattogram: ["Dampara", "AK Khan", "Bahaddarhat", "Cinema Palace", "Alankar"],
  sylhet: ["Kadamtoli Bus Terminal", "Humayun Rashid Chottor", "Surma Point"],
  rajshahi: ["Shiroil Bus Terminal", "Bhadra", "Talaimari"],
  khulna: ["Sonadanga Bus Terminal", "Royal More", "Shib Bari"],
  bogura: ["Charmatha", "Thanthania", "Banani"],
  "cox's bazar": ["Kalatoli", "Jhawtola", "Dolphin Kiron"],
  barishal: ["Nathullabad", "Rupatoli"],
  rangpur: ["Kamargari", "Modern More"],
  cumilla: ["Paduar Bazar", "Kandirpar", "Gouripur"],
  jashore: ["Palbari", "Chanchra", "Monihar"],
};

const GENERIC_BOARDING_POINTS: string[] = [
  "Central Bus Terminal",
  "City Center Stand",
  "Highway Point",
];

const ROUTE_PRICES: Record<string, { ac: number; nonAc: number }> = {
  "dhaka-chattogram": { ac: 1500, nonAc: 800 },
  "dhaka-cox's bazar": { ac: 2500, nonAc: 1100 },
  "dhaka-sylhet": { ac: 1300, nonAc: 700 },
  "dhaka-bogura": { ac: 1100, nonAc: 600 },
  "dhaka-rajshahi": { ac: 1400, nonAc: 700 },
  "dhaka-rangpur": { ac: 1800, nonAc: 900 },
  "dhaka-khulna": { ac: 1500, nonAc: 800 },
  "dhaka-barishal": { ac: 1200, nonAc: 650 },
  "dhaka-mymensingh": { ac: 600, nonAc: 350 },
  "dhaka-feni": { ac: 900, nonAc: 550 },
  "dhaka-cumilla": { ac: 700, nonAc: 400 },
  "dhaka-noakhali": { ac: 1000, nonAc: 650 },
  "dhaka-brahmanbaria": { ac: 750, nonAc: 450 },
  "dhaka-tangail": { ac: 500, nonAc: 300 },
  "dhaka-kishoreganj": { ac: 800, nonAc: 500 },
  "dhaka-faridpur": { ac: 800, nonAc: 500 },
  "dhaka-gopalganj": { ac: 1000, nonAc: 600 },
  "dhaka-madaripur": { ac: 900, nonAc: 550 },
  "dhaka-natore": { ac: 1200, nonAc: 650 },
  "dhaka-naogaon": { ac: 1300, nonAc: 750 },
  "dhaka-chapainawabganj": { ac: 1500, nonAc: 850 },
  "dhaka-pabna": { ac: 1200, nonAc: 650 },
  "dhaka-sirajganj": { ac: 800, nonAc: 450 },
  "dhaka-dinajpur": { ac: 1900, nonAc: 1000 },
  "dhaka-kurigram": { ac: 2000, nonAc: 1100 },
  "dhaka-thakurgaon": { ac: 2100, nonAc: 1150 },
  "dhaka-panchagarh": { ac: 2200, nonAc: 1200 },
  "dhaka-gaibandha": { ac: 1600, nonAc: 850 },
  "dhaka-nilphamari": { ac: 1900, nonAc: 1050 },
  "dhaka-jashore": { ac: 1400, nonAc: 750 },
  "dhaka-satkhira": { ac: 1600, nonAc: 850 },
  "dhaka-bagerhat": { ac: 1400, nonAc: 750 },
  "dhaka-kushtia": { ac: 1200, nonAc: 700 },
  "dhaka-chuadanga": { ac: 1300, nonAc: 750 },
  "dhaka-meherpur": { ac: 1400, nonAc: 800 },
  "dhaka-patuakhali": { ac: 1400, nonAc: 750 },
  "dhaka-kuakata": { ac: 1800, nonAc: 950 },
  "dhaka-pirojpur": { ac: 1300, nonAc: 700 },
  "dhaka-barguna": { ac: 1400, nonAc: 800 },
  "dhaka-bhola": { ac: 1500, nonAc: 850 },
  "dhaka-moulvibazar": { ac: 1200, nonAc: 650 },
  "dhaka-habiganj": { ac: 1000, nonAc: 550 },
  "dhaka-sunamganj": { ac: 1400, nonAc: 800 },
  "dhaka-bandarban": { ac: 1800, nonAc: 950 },
  "dhaka-rangamati": { ac: 1800, nonAc: 950 },
  "dhaka-khagrachari": { ac: 1600, nonAc: 850 },
  "dhaka-lakshmipur": { ac: 900, nonAc: 550 },
  "dhaka-chandpur": { ac: 600, nonAc: 350 },
  "chattogram-sylhet": { ac: 1600, nonAc: 900 },
  "chattogram-rajshahi": { ac: 2500, nonAc: 1300 },
  "chattogram-khulna": { ac: 2400, nonAc: 1200 },
  "chattogram-cox's bazar": { ac: 1000, nonAc: 500 },
  "sylhet-chattogram": { ac: 1600, nonAc: 900 },
  "rajshahi-khulna": { ac: 1100, nonAc: 600 },
  "bogura-rangpur": { ac: 600, nonAc: 300 },
  "mymensingh-sylhet": { ac: 1100, nonAc: 600 },
  "khulna-barishal": { ac: 700, nonAc: 400 },
  default: { ac: 1200, nonAc: 650 },
};

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomItem = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const getSeatLabel = (index: number): string => {
  const rowId = Math.floor(index / 4);
  const colId = (index % 4) + 1;
  const rowLetter = String.fromCharCode(65 + rowId);
  return `${rowLetter}${colId}`;
};

export const generateTxnId = () => {
  return `TL-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
};

export const generateBusData = (criteria: TripDetailsType): BusTicketData[] => {
  const { from, to, month, day } = criteria;
  const fromClean = from.trim().toLowerCase();
  const toClean = to.trim().toLowerCase();
  const numberOfBuses = getRandomInt(5, 10);
  const buses: BusTicketData[] = [];
  const regionalPrefixes = [
    "Dhaka",
    "Chattogram",
    "Sylhet",
    "Rajshahi",
    "Khulna",
  ];
  const letterPrefixes = ["Cha", "Da", "Ha", "Za", "Ba", "Ra", "La"];
  const baseDate = new Date(`2026-01-01T00:00:00Z`);
  const availableBoardingPoints =
    BOARDING_POINTS[fromClean] || GENERIC_BOARDING_POINTS;
  const basePrices =
    ROUTE_PRICES[`${fromClean}-${toClean}`] ||
    ROUTE_PRICES[`${toClean}-${fromClean}`] ||
    ROUTE_PRICES["default"];

  for (let i = 0; i < numberOfBuses; i++) {
    const isAC = Math.random() > 0.5;

    const totalSeats = isAC ? getRandomItem([28, 32]) : getRandomItem([36, 40]);

    const numUnavailable = getRandomInt(2, totalSeats - 5);
    const unavailableSeats: string[] = [];
    while (unavailableSeats.length < numUnavailable) {
      const seatIndex = getRandomInt(0, totalSeats - 1);
      const label = getSeatLabel(seatIndex);
      if (!unavailableSeats.includes(label)) {
        unavailableSeats.push(label);
      }
    }

    baseDate.setHours(getRandomInt(6, 23), getRandomItem([0, 15, 30, 45]));
    const startingTime = formatTime(baseDate);

    const reportingDate = new Date(baseDate.getTime() - 15 * 60000);
    const reportingTime = formatTime(reportingDate);

    const priceVariation = Math.floor(Math.random() * 5) * 50 - 50;
    const price = (isAC ? basePrices.ac : basePrices.nonAc) + priceVariation;

    buses.push({
      busId: `B-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${day}${month.substring(0, 3).toUpperCase()}`,
      company: getRandomItem(BUS_COMPANIES),
      busNumber: `${getRandomItem(regionalPrefixes)} Metro-${getRandomItem(letterPrefixes)} ${getRandomInt(11, 15)}-${getRandomInt(1000, 9999)}`,
      type: isAC ? "AC" : "Non-AC",
      totalSeats,
      unavailableSeats,
      startingTime,
      reportingTime,
      boardingPoint: getRandomItem(availableBoardingPoints),
      price,
    });
  }

  return buses.sort((a, b) => {
    const timeA = new Date(`1970/01/01 ${a.startingTime}`);
    const timeB = new Date(`1970/01/01 ${b.startingTime}`);
    return timeA.getTime() - timeB.getTime();
  });
};
