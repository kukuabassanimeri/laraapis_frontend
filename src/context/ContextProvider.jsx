import { createContext, useContext, useState } from "react";

const StateContext = createContext({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
});

export const ContextProvider = ({ children }) => {
  //* Read stored user from localStorage on initial load
  const [user, _setUser] = useState(() => {
    const savedUser = localStorage.getItem("USER");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));

  //* Persist or remove user in localStorage
  const setUser = (user) => {
    _setUser(user);
    if (user) {
      localStorage.setItem("USER", JSON.stringify(user));
    } else {
      localStorage.removeItem("USER");
    }
  };

  //* Persist or remove token in localStorage
  const setToken = (token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  return (
    <StateContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </StateContext.Provider>
  );
};

export default ContextProvider;

export const useStateContext = () => useContext(StateContext);