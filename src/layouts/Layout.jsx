import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import styles from "./Layout.module.css";

function Layout({ children, showHeader = true, showFooter = true }) {
  return (
    <div className={styles.layout}>
      {showHeader && <Header />}
      <main className={styles.layoutMain}>{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}

export default Layout;
