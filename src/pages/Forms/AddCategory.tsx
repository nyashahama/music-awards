import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Form from "../../components/form/Form";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Switch from "../../components/form/switch/Switch";

interface CategoryFormData {
  name: string;
  description: string;
  isActive: boolean;
}

export default function AddCategory() {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    isActive: true,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name) {
      alert("Please fill in the category name");
      return;
    }

    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData);

    // Simulate API call
    setTimeout(() => {
      alert("Category added successfully!");

      // Reset form
      setFormData({
        name: "",
        description: "",
        isActive: true,
      });
    }, 1000);
  };

  return (
    <>
      <PageMeta
        title="Add Category | Zimdancehall Music Awards"
        description="Add a new category to the awards system"
      />
      <PageBreadcrumb pageTitle="Add Category" />

      <div className="space-y-6">
        <ComponentCard title="Add New Category">
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
                    />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Enter a clear and descriptive name for the category
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <TextArea
                      value={formData.description}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, description: value }))
                      }
                      rows={5}
                      placeholder="Describe what this category represents and any criteria for nomination..."
                    />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Optional: Provide details about the category criteria and
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
                  className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 text-white bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors font-medium"
                >
                  Add Category
                </button>
              </div>
            </div>
          </Form>
        </ComponentCard>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ComponentCard title="Total Categories">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              12
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Active award categories
            </p>
          </ComponentCard>

          <ComponentCard title="Active Nominations">
            <div className="text-2xl font-bold text-green-500">127</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nominees across categories
            </p>
          </ComponentCard>

          <ComponentCard title="This Month">
            <div className="text-2xl font-bold text-blue-500">2</div>
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
      </div>
    </>
  );
}
