import { fetchDataClient } from "@lib/fetchDataClient";
import { createContext, useContext, useEffect, useState } from "react";

const MyNavContext = createContext();

export const MyNavProvider = ({ children }) => {
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetchDataClient("/my-menu");

      if (res) setMenuData(res.menu);
    }

    fetchData();
  }, []);

  return (
    <MyNavContext.Provider value={{ menuData }}>
      {children}
    </MyNavContext.Provider>
  );
};

export const useNavData = () => {
  return useContext(MyNavContext);
};
