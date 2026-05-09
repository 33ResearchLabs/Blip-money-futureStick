import { createContext, useContext } from "react";

const BannerContext = createContext<{ bannerHeight: number }>({
  bannerHeight: 0,
});

export const useBannerHeight = () => {
  const { bannerHeight } = useContext(BannerContext);
  return bannerHeight;
};

export function NotificationBannerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BannerContext.Provider value={{ bannerHeight: 0 }}>
      {children}
    </BannerContext.Provider>
  );
}
