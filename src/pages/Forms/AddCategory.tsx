// File: AddCategory.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Form from "../../components/form/Form";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Switch from "../../components/form/switch/Switch";
import { useCategories } from "../../hooks/useCategories";
import { CreateCategoryRequest } from "../../api/services/categoryService";

interface CategoryFormData {
  name: string;
  description: string;
  isActive: boolean;
}

export default function AddCategory() {
  const navigate = useNavigate();
  const { createCategory, categories, listCategories } = useCategories();

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Load categories on mount to display stats
  useEffect(() => {
    listCategories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push("Category name is required");
    }

    if (formData.name.trim().length < 3) {
      errors.push("Category name must be at least 3 characters long");
    }

    if (formData.name.trim().length > 100) {
      errors.push("Category name must be less than 100 characters");
    }

    // Check for duplicate category names
    const duplicateName = categories.categories.some(
      (cat) => cat.name.toLowerCase() === formData.name.trim().toLowerCase()
    );
    if (duplicateName) {
      errors.push("A category with this name already exists");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setValidationErrors([]);

    try {
      const categoryData: CreateCategoryRequest = {
        name: formData.name.trim(),
        description: formData.description.trim(),
      };

      await createCategory(categoryData);

      // Show success message
      alert(`Category "${formData.name}" added successfully!`);

      // Reset form
      setFormData({
        name: "",
        description: "",
        isActive: true,
      });

      // Navigate to categories list
      navigate("/categories/manage");
    } catch (err: any) {
      console.error("Error creating category:", err);
      const errorMessage =
        err?.response?.data?.error ||
        "Failed to create category. Please try again.";
      setValidationErrors([errorMessage]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? All unsaved changes will be lost."
      )
    ) {
      navigate("/categories");
    }
  };

  // Calculate stats
  const totalCategories = categories.categories.length;
  const activeCategories = categories.categories.filter(
    (c) => c.is_active
  ).length;

  // Calculate new categories this month
  const thisMonth = new Date();
  const newThisMonth = categories.categories.filter((cat) => {
    const createdDate = new Date(cat.created_at);
    return (
      createdDate.getMonth() === thisMonth.getMonth() &&
      createdDate.getFullYear() === thisMonth.getFullYear()
    );
  }).length;

  return (
    <>
      <PageMeta
        title="Add Category | Zimdancehall Music Awards"
        description="Add a new category to the awards system"
      />
      <PageBreadcrumb pageTitle="Add Category" />

      <div className="space-y-6">
        <ComponentCard title="Add New Category">
          {/* Error Messages */}
          {validationErrors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <h4 className="text-red-800 dark:text-red-200 font-semibold mb-2">
                Please fix the following errors:
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li
                    key={index}
                    className="text-red-700 dark:text-red-300 text-sm"
                  >
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Basic Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Category Information
                </h3>
                <div className="space-y-6">
                  {/* Category Name */}
                  <div>
                    <Label htmlFor="name">Category Name *</Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Best Male Artist, Song of the Year"
                      required
                      disabled={isSubmitting}
                    />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Enter a clear and descriptive name for the category
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <TextArea
                      value={formData.description}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, description: value }))
                      }
                      rows={5}
                      placeholder="Describe what this category represents and any criteria for nomination..."
                      disabled={isSubmitting}
                    />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Provide details about the category criteria and
                      eligibility
                    </p>
                  </div>
                </div>
              </div>

              {/* Settings Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Category Settings
                </h3>
                <div className="space-y-4">
                  {/* Active Status */}
                  <div>
                    <Switch
                      label="Activate this category immediately"
                      defaultChecked={formData.isActive}
                      onChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          isActive: checked,
                        }))
                      }
                      disabled={isSubmitting}
                    />
                    <p className="mt-2 ml-14 text-sm text-gray-500 dark:text-gray-400">
                      When activated, this category will be visible to users and
                      can accept nominees
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || categories.isLoading}
                  className="px-6 py-3 text-white bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Adding Category...
                    </>
                  ) : (
                    "Add Category"
                  )}
                </button>
              </div>
            </div>
          </Form>
        </ComponentCard>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ComponentCard title="Total Categories">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalCategories}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Active award categories
            </p>
          </ComponentCard>

          <ComponentCard title="Active Categories">
            <div className="text-2xl font-bold text-green-500">
              {activeCategories}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Currently accepting nominees
            </p>
          </ComponentCard>

          <ComponentCard title="This Month">
            <div className="text-2xl font-bold text-blue-500">
              {newThisMonth}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              New categories added
            </p>
          </ComponentCard>
        </div>

        {/* Category Examples */}
        <ComponentCard title="Category Examples">
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Here are some common category types for music awards:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  Artist Categories
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Best Male/Female Artist, Best Newcomer, Artist of the Year
                </p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  Song Categories
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Song of the Year, Best Collaboration, Best Single
                </p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  Production Categories
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Best Producer, Best Music Video, Album of the Year
                </p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  Genre Categories
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Best Dancehall, Best Reggae, Best Hip Hop
                </p>
              </div>
            </div>
          </div>
        </ComponentCard>

        {/* Best Practices */}
        <ComponentCard title="Category Best Practices">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  className="w-4 h-4 text-purple-600 dark:text-purple-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  Be Specific and Clear
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Use descriptive names that clearly indicate what the category
                  represents
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  className="w-4 h-4 text-purple-600 dark:text-purple-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  Define Clear Criteria
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Include specific eligibility requirements in the description
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  className="w-4 h-4 text-purple-600 dark:text-purple-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  Avoid Overlapping Categories
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Make sure each category has a distinct purpose and doesn't
                  duplicate others
                </p>
              </div>
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
