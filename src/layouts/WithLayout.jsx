// layouts/WithLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Layout from "./Layout";

function WithLayout() {
  return (
    <Layout showHeader={true} showFooter={true}>
      <Outlet />
    </Layout>
  );
}

export default WithLayout;
