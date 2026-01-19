'use client';

import { createContext, useContext, useState } from 'react';

const NavbarActionsContext = createContext({
  actions: null,
  setActions: () => {},
});

export function NavbarActionsProvider({ children }) {
  const [actions, setActions] = useState(null);

  return (
    <NavbarActionsContext.Provider value={{ actions, setActions }}>
      {children}
    </NavbarActionsContext.Provider>
  );
}

export function useNavbarActions() {
  return useContext(NavbarActionsContext);
}
