import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import Alert from "../../components/ui/alert/Alert";
import { useCategories } from "../../hooks";

type FormErrors = {
  name?: string;
  slug?: string;
  description?: string;
  icon?: string;
  startDate?: string;
  endDate?: string;
};
interface FormData {
  name: string;
  slug: string;
  description: string;
  icon: string;
  status: "active" | "inactive" | "upcoming";
  startDate: string;
  endDate: string;
}
// Mock data - replace with actual API call
// const mockCategory = {
//   id: "1",
//   name: "Best Male Artist",
//   slug: "best-male",
//   description: "Vote for your favorite male artist of the year",
//   icon: "👨‍🎤",
//   status: "active",
//   startDate: "2024-01-01",
//   endDate: "2024-12-31",
// };

export default function EditCategory() {
  const { getCategory, updateCategory } = useCategories();
  const { categoryId } = useParams<{ categoryId: string }>();
  const [alert, setAlert] = useState<{
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    slug: "",
    description: "",
    icon: "",
    status: "active",
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({
    name: false,
    slug: false,
    description: false,
    icon: false,
    startDate: false,
    endDate: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) {
        setAlert({
          variant: "error",
          title: "Invalid Category",
          message: "No category ID provided.",
        });
        setIsLoadingData(false);
        return;
      }
      try {
        const category = await getCategory(categoryId);

        setFormData({
          name: category.name || "",
          slug: category.slug || "",
          description: category.description || "",
          icon: category.icon || "",
          status: category.is_active ? "active" : "inactive",
          startDate: category.startDate || "",
          endDate: category.endDate || "",
        });
      } catch (error) {
        setAlert({
          variant: "error",
          title: "Failed to Load Category",
          message: "Could not load category data. Please try again.",
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  useEffect(() => {
    if (!isLoadingData) {
      nameInputRef.current?.focus();
    }
  }, [isLoadingData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const field = name as keyof FormErrors;
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    const field = name as keyof typeof touched;

    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    if (touched[field]) {
      const validationErrors = validateForm();
      if (validationErrors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: validationErrors[field],
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryId) {
      setAlert({
        variant: "error",
        title: "Invalid Category",
        message: "No category ID provided.",
      });
      return;
    }

    setTouched({
      name: true,
      slug: true,
      description: true,
      icon: true,
      startDate: true,
      endDate: true,
    });

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      nameInputRef.current?.focus();
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // Map form data to API request format
      await updateCategory(categoryId, {
        name: formData.name,
        description: formData.description,
        // still need to update for more data
      });

      setAlert({
        variant: "success",
        title: "Category Updated",
        message: "The category has been successfully updated.",
      });

      setTimeout(() => {
        navigate("/categories/manage");
      }, 1500);
    } catch (error: any) {
      setAlert({
        variant: "error",
        title: "Failed to Update Category",
        message:
          error?.response?.data?.error ||
          "Something went wrong. Please try again.",
      });
      setTimeout(() => setAlert(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = "Category name is required";
    } else if (formData.name.trim().length < 3) {
      errors.name = "Category name must be at least 3 characters";
    }

    if (!formData.slug.trim()) {
      errors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug =
        "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters";
    }

    if (!formData.icon.trim()) {
      errors.icon = "Icon is required";
    }

    if (!formData.startDate) {
      errors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      errors.endDate = "End date is required";
    } else if (formData.startDate && formData.endDate < formData.startDate) {
      errors.endDate = "End date must be after start date";
    }

    return errors;
  };

  if (isLoadingData) {
    return (
      <>
        <PageMeta
          title="Edit Category | Zimdancehall Music Awards"
          description="Edit category details"
        />
        <PageBreadcrumb pageTitle="Edit Category" />
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 rounded-full border-brand-500 border-t-transparent animate-spin"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading category...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Edit Category | Zimdancehall Music Awards"
        description="Edit category details"
      />
      <PageBreadcrumb pageTitle="Edit Category" />

      {alert && (
        <Alert variant={alert.variant} title={alert.title}>
          {alert.message}
        </Alert>
      )}

      <div className="space-y-6">
        <ComponentCard title="Edit Category Details">
          <form onSubmit={handleSubmit}>
            <fieldset disabled={isLoading} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Category Name */}
                <div>
                  <Label htmlFor="name">
                    Category Name <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    ref={nameInputRef}
                    type="text"
                    id="name"
                    name="name"
                    placeholder="e.g., Best Male Artist"
                    value={formData.name}
                    required
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p
                      id="name-error"
                      className="mt-1 text-sm text-error-500"
                      role="alert"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Slug */}
                <div>
                  <Label htmlFor="slug">
                    Slug <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="slug"
                    name="slug"
                    placeholder="e.g., best-male-artist"
                    value={formData.slug}
                    required
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={!!errors.slug}
                    aria-describedby={errors.slug ? "slug-error" : undefined}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    URL-friendly version
                  </p>
                  {errors.slug && (
                    <p
                      id="slug-error"
                      className="mt-1 text-sm text-error-500"
                      role="alert"
                    >
                      {errors.slug}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">
                  Description <span className="text-error-500">*</span>
                </Label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Enter category description..."
                  value={formData.description}
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!errors.description}
                  aria-describedby={
                    errors.description ? "description-error" : undefined
                  }
                  className="w-full px-4 py-3 text-sm text-gray-700 border border-gray-200 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:bg-white/5 dark:border-gray-800 dark:text-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {errors.description && (
                  <p
                    id="description-error"
                    className="mt-1 text-sm text-error-500"
                    role="alert"
                  >
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Icon */}
                <div>
                  <Label htmlFor="icon">
                    Icon (Emoji) <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="icon"
                    name="icon"
                    placeholder="👨‍🎤"
                    value={formData.icon}
                    required
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={!!errors.icon}
                    aria-describedby={errors.icon ? "icon-error" : undefined}
                  />
                  {errors.icon && (
                    <p
                      id="icon-error"
                      className="mt-1 text-sm text-error-500"
                      role="alert"
                    >
                      {errors.icon}
                    </p>
                  )}
                </div>

                {/* Start Date */}
                <div>
                  <Label htmlFor="startDate">
                    Start Date <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    required
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={!!errors.startDate}
                    aria-describedby={
                      errors.startDate ? "startDate-error" : undefined
                    }
                  />
                  {errors.startDate && (
                    <p
                      id="startDate-error"
                      className="mt-1 text-sm text-error-500"
                      role="alert"
                    >
                      {errors.startDate}
                    </p>
                  )}
                </div>

                {/* End Date */}
                <div>
                  <Label htmlFor="endDate">
                    End Date <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    required
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={!!errors.endDate}
                    aria-describedby={
                      errors.endDate ? "endDate-error" : undefined
                    }
                  />
                  {errors.endDate && (
                    <p
                      id="endDate-error"
                      className="mt-1 text-sm text-error-500"
                      role="alert"
                    >
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm text-gray-700 border border-gray-200 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:bg-white/5 dark:border-gray-800 dark:text-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/categories/manage")}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Category"}
                </Button>
              </div>
            </fieldset>
          </form>
        </ComponentCard>
      </div>
    </>
  );
}
