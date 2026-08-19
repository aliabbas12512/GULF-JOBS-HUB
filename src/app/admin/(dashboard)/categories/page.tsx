import { getCategories } from "@/lib/db/reference-data";
import { CategoryManager } from "@/components/admin/CategoryManager";

export const metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
        <p className="mt-1 text-sm text-slate-500">Manage job categories used across the site.</p>
      </div>
      <CategoryManager categories={categories} />
    </div>
  );
}
