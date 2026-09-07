import { BusTicketData, TripDetailsType } from "@/data/data";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface BookingContextType {
  selectedBus: BusTicketData | null;
  selectedSeats: string[];
  tripDetails: TripDetailsType | null;
  totalPrice: number;
  txnId: string;
  setBus: (bus: BusTicketData | null) => void;
  setSeats: (seats: string[]) => void;
  setTripDetails: (details: TripDetailsType | null) => void;
  setTotalPrice: (price: number) => void;
  setTxnId: (id: string) => void;
  clearBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({
  children,
}) => {
  const [selectedBus, setSelectedBus] = useState<BusTicketData | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [tripDetails, setTripDetails] = useState<TripDetailsType | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [txnId, setTxnId] = useState<string>("");

  const clearBooking = () => {
    setSelectedBus(null);
    setSelectedSeats([]);
    setTripDetails(null);
    setTotalPrice(0);
    setTxnId("");
  };

  return (
    <BookingContext.Provider
      value={{
        selectedBus,
        selectedSeats,
        tripDetails,
        totalPrice,
        txnId,
        setBus: setSelectedBus,
        setSeats: setSelectedSeats,
        setTripDetails,
        setTotalPrice,
        setTxnId,
        clearBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context)
    throw new Error("useBooking must be used within a BookingProvider");
  return context;
};
