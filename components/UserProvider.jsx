import axios from "@lib/axios";
import { hasCookie } from "cookies-next";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Set initial state to null

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get("/user");
        if (res.data && res.data.result) {
          setUser(res.data.result);
        }
      } catch (err) {
        console.log(err);
      }
    }

    if (hasCookie("user_token")) fetchUser();
  }, []);

  const isLogged = () => {
    return user !== null && Object.keys(user).length !== 0;
  };

  return (
    <UserContext.Provider value={{ user, isLogged }}>
      {children}
    </UserContext.Provider>
  );
};

export const useSession = () => useContext(UserContext);
