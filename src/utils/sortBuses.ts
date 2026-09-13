import { BusTicketData } from "@/data/data";

export type SortOption =
  "price-asc" | "price-desc" | "fastest-boarding" | "seats-desc" | "seats-asc";

export const DEFAULT_SORT_OPTION: SortOption = "price-asc";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "fastest-boarding", label: "Fastest Boarding" },
  { value: "seats-desc", label: "Seats: High to Low" },
  { value: "seats-asc", label: "Seats: Low to High" },
];

const getAvailableSeats = (bus: BusTicketData): number =>
  bus.totalSeats - bus.unavailableSeats.length;

export const sortBuses = (
  buses: BusTicketData[],
  sortOption: SortOption,
): BusTicketData[] => {
  const sorted = [...buses];

  switch (sortOption) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "fastest-boarding":
      return sorted.sort((a, b) => a.reportingTimeValue - b.reportingTimeValue);
    case "seats-desc":
      return sorted.sort((a, b) => getAvailableSeats(b) - getAvailableSeats(a));
    case "seats-asc":
      return sorted.sort((a, b) => getAvailableSeats(a) - getAvailableSeats(b));
    default:
      return sorted;
  }
};
