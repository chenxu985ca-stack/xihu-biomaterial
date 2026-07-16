import { createContext } from 'react';

/** Shared context so ProductsSection / NewsSection can tell Navbar to hide when a detail modal opens. */
const NavForceHideContext = createContext({
  setForceHide: () => {},
});

export default NavForceHideContext;
