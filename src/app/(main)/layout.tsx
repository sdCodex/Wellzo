import { ReactNode } from "react";

const Layout = ({ children }:{children:ReactNode}) => {
  return <div className="container mx-auto my-20">{children}</div>;
};

export default Layout;