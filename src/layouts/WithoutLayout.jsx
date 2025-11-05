// layouts/WithoutLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Layout from "./Layout";

function WithoutLayout() {
  return (
    <Layout showHeader={false} showFooter={false}>
      <Outlet />
    </Layout>
  );
}

export default WithoutLayout;
