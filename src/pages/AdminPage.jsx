import CategoryForm from "components/Templates/CategoryForm";
import CategoryList from "components/Templates/CategoryList";
import React from "react";

function AdminPage() {
  return (
    <div>
      <CategoryForm />
      <CategoryList />
    </div>
  );
}

export default AdminPage;
