import { createContext, useContext, useState } from "react";

const CouponContext = createContext();

export function CouponProvider({ children }) {
  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState("");

  return (
    <CouponContext.Provider
      value={{
        discount,
        setDiscount,
        coupon,
        setCoupon,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
}

export const useCoupon = () => useContext(CouponContext);
