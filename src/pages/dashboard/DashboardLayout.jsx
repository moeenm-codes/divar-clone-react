// src/pages/dashboard/DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import styles from "./DashboardLayout.module.css";

function DashboardLayout() {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <DashboardSidebar />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
