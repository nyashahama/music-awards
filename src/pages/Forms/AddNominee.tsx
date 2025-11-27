import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Form from "../../components/form/Form";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import TextArea from "../../components/form/input/TextArea";
import FileInput from "../../components/form/input/FileInput";
import Radio from "../../components/form/input/Radio";
import Checkbox from "../../components/form/input/Checkbox";
import MultiSelect from "../../components/form/MultiSelect";
import Switch from "../../components/form/switch/Switch";
import DatePicker from "../../components/form/date-picker";
import { useNominees } from "../../hooks/useNominees";
import { CreateNomineeRequest } from "../../api/services/nomineeService";

interface NomineeFormData {
  stageName: string;
  realName: string;
  category: string;
  subcategories: string[];
  song: string;
  album: string;
  bio: string;
  image: File | null;
  status: "active" | "pending";
  featured: boolean;
  votingEnabled: boolean;
  releaseDate: string;
  socialMedia: {
    platform: string;
    handle: string;
  }[];
}

export default function AddNominee() {
  const navigate = useNavigate();
  const { createNominee, nominees, error: apiError } = useNominees();

  const [formData, setFormData] = useState<NomineeFormData>({
    stageName: "",
    realName: "",
    category: "",
    subcategories: [],
    song: "",
    album: "",
    bio: "",
    image: null,
    status: "pending",
    featured: false,
    votingEnabled: true,
    releaseDate: "",
    socialMedia: [{ platform: "", handle: "" }],
  });

  const [previewImage, setPreviewImage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const categoryOptions = [
    { value: "best-male", label: "Best Male Artist" },
    { value: "best-female", label: "Best Female Artist" },
    { value: "song-year", label: "Song of the Year" },
    { value: "collaboration", label: "Best Collaboration" },
    { value: "newcomer", label: "Best Newcomer" },
    { value: "album-year", label: "Album of the Year" },
    { value: "video", label: "Best Music Video" },
    { value: "producer", label: "Best Producer" },
  ];

  const subcategoryOptions = [
    { value: "dancehall", text: "Dancehall" },
    { value: "reggae", text: "Reggae" },
    { value: "afrobeats", text: "Afrobeats" },
    { value: "hiphop", text: "Hip Hop" },
    { value: "rnb", text: "R&B" },
    { value: "traditional", text: "Traditional" },
    { value: "fusion", text: "Fusion" },
  ];

  const socialPlatforms = [
    { value: "instagram", label: "Instagram" },
    { value: "twitter", label: "Twitter" },
    { value: "facebook", label: "Facebook" },
    { value: "youtube", label: "YouTube" },
    { value: "tiktok", label: "TikTok" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiSelectChange = (values: string[]) => {
    setFormData((prev) => ({
      ...prev,
      subcategories: values,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Please upload a valid image file (JPG, PNG, or WebP)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSocialMediaChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedSocialMedia = [...formData.socialMedia];
    updatedSocialMedia[index] = {
      ...updatedSocialMedia[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      socialMedia: updatedSocialMedia,
    }));
  };

  const addSocialMediaField = () => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: [...prev.socialMedia, { platform: "", handle: "" }],
    }));
  };

  const removeSocialMediaField = (index: number) => {
    if (formData.socialMedia.length > 1) {
      const updatedSocialMedia = formData.socialMedia.filter(
        (_, i) => i !== index
      );
      setFormData((prev) => ({
        ...prev,
        socialMedia: updatedSocialMedia,
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.stageName.trim()) {
      errors.push("Stage name is required");
    }

    if (!formData.category) {
      errors.push("Category is required");
    }

    if (!formData.song.trim()) {
      errors.push("Song title is required");
    }

    if (!formData.image) {
      errors.push("Artist image is required");
    }

    const validSocialMedia = formData.socialMedia.filter(
      (sm) => sm.platform && sm.handle
    );
    if (
      validSocialMedia.length !== formData.socialMedia.length &&
      formData.socialMedia.some((sm) => sm.platform || sm.handle)
    ) {
      errors.push(
        "Please complete all social media entries or remove empty ones"
      );
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setValidationErrors([]);

    try {
      // Convert image to base64 data URL
      const imageDataUrl = formData.image
        ? await convertToBase64(formData.image)
        : "";

      // Build sample works object
      const sampleWorks = {
        song: formData.song,
        album: formData.album || undefined,
        releaseDate: formData.releaseDate || undefined,
        genres: formData.subcategories,
      };

      // Build social media links
      const socialMediaLinks = formData.socialMedia
        .filter((sm) => sm.platform && sm.handle)
        .reduce(
          (acc, sm) => {
            acc[sm.platform] = sm.handle;
            return acc;
          },
          {} as Record<string, string>
        );

      // Prepare the data for API matching the interface
      const nomineeData: CreateNomineeRequest = {
        name: formData.stageName,
        description: formData.bio || `${formData.stageName} - ${formData.song}`,
        sample_works: {
          ...sampleWorks,
          socialMedia: socialMediaLinks,
          realName: formData.realName || undefined,
        },
        image_url: imageDataUrl,
        category_ids: formData.category ? [formData.category] : [],
      };

      const createdNominee = await createNominee(nomineeData);
      console.log(createdNominee);

      alert(`Nominee "${formData.stageName}" added successfully!`);

      // Reset form
      setFormData({
        stageName: "",
        realName: "",
        category: "",
        subcategories: [],
        song: "",
        album: "",
        bio: "",
        image: null,
        status: "pending",
        featured: false,
        votingEnabled: true,
        releaseDate: "",
        socialMedia: [{ platform: "", handle: "" }],
      });
      setPreviewImage("");

      // Navigate to nominees list
      navigate("/nominees");
    } catch (err: any) {
      console.error("Error creating nominee:", err);
      const errorMessage =
        err?.response?.data?.error ||
        "Failed to create nominee. Please try again.";
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
      navigate("/nominees");
    }
  };

  // Calculate stats from actual nominee data
  const activeNominees = nominees.nominees.filter((n) => n.is_active);
  const pendingNominees = nominees.nominees.filter((n) => !n.is_active);

  return (
    <>
      <PageMeta
        title="Add Nominee | Zimdancehall Music Awards"
        description="Add a new nominee to the voting system"
      />
      <PageBreadcrumb pageTitle="Add Nominee" />

      <div className="space-y-6">
        <ComponentCard title="Add New Nominee">
          {(validationErrors.length > 0 || apiError) && (
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
                {apiError && (
                  <li className="text-red-700 dark:text-red-300 text-sm">
                    {apiError}
                  </li>
                )}
              </ul>
            </div>
          )}

          <Form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Basic Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="stageName">Stage Name *</Label>
                    <Input
                      type="text"
                      id="stageName"
                      name="stageName"
                      value={formData.stageName}
                      onChange={handleInputChange}
                      placeholder="Enter stage name"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="realName">Real Name</Label>
                    <Input
                      type="text"
                      id="realName"
                      name="realName"
                      value={formData.realName}
                      onChange={handleInputChange}
                      placeholder="Enter real name"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      options={categoryOptions}
                      placeholder="Select category"
                      onChange={handleSelectChange("category")}
                      defaultValue={formData.category}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <MultiSelect
                      label="Music Genres/Subcategories"
                      options={subcategoryOptions}
                      defaultSelected={formData.subcategories}
                      onChange={handleMultiSelectChange}
                      placeholder="Select genres"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Music Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Music Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="song">Song Title *</Label>
                    <Input
                      type="text"
                      id="song"
                      name="song"
                      value={formData.song}
                      onChange={handleInputChange}
                      placeholder="Enter song title"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="album">Album</Label>
                    <Input
                      type="text"
                      id="album"
                      name="album"
                      value={formData.album}
                      onChange={handleInputChange}
                      placeholder="Enter album name"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <DatePicker
                      id="releaseDate"
                      label="Release Date"
                      placeholder="Select release date"
                      onChange={(_, dateString) => {
                        setFormData((prev) => ({
                          ...prev,
                          releaseDate: dateString,
                        }));
                      }}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Biography Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Biography & Media
                </h3>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="bio">Biography</Label>
                    <TextArea
                      value={formData.bio}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, bio: value }))
                      }
                      rows={6}
                      placeholder="Tell us about the artist..."
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label>Artist Image *</Label>
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="flex-1">
                        <FileInput
                          onChange={handleImageChange}
                          disabled={isSubmitting}
                        />
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          Recommended: Square image, 500x500 pixels, JPG, PNG or
                          WebP (Max 5MB)
                        </p>
                      </div>
                      {previewImage && (
                        <div className="w-32 h-32 overflow-hidden rounded-lg border-2 border-gray-300 dark:border-gray-600">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Social Media
                </h3>
                <div className="space-y-4">
                  {formData.socialMedia.map((social, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
                    >
                      <div className="md:col-span-4">
                        <Label>Platform</Label>
                        <Select
                          options={socialPlatforms}
                          placeholder="Select platform"
                          onChange={(value) =>
                            handleSocialMediaChange(index, "platform", value)
                          }
                          defaultValue={social.platform}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="md:col-span-6">
                        <Label>Handle/URL</Label>
                        <Input
                          type="text"
                          value={social.handle}
                          onChange={(e) =>
                            handleSocialMediaChange(
                              index,
                              "handle",
                              e.target.value
                            )
                          }
                          placeholder="@username or profile URL"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="md:col-span-2">
                        {formData.socialMedia.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSocialMediaField(index)}
                            disabled={isSubmitting}
                            className="w-full px-4 py-2 text-red-600 bg-red-100 rounded-lg hover:bg-red-200 dark:bg-red-900 dark:text-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSocialMediaField}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-purple-600 bg-purple-100 rounded-lg hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    + Add Social Media
                  </button>
                </div>
              </div>

              {/* Settings Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Status</Label>
                    <div className="flex gap-6 mt-2">
                      <Radio
                        id="status-pending"
                        name="status"
                        value="pending"
                        checked={formData.status === "pending"}
                        onChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            status: value as "pending",
                          }))
                        }
                        label="Pending Review"
                        disabled={isSubmitting}
                      />
                      <Radio
                        id="status-active"
                        name="status"
                        value="active"
                        checked={formData.status === "active"}
                        onChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            status: value as "active",
                          }))
                        }
                        label="Active"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Featured Artist</Label>
                    <div className="mt-2">
                      <Checkbox
                        checked={formData.featured}
                        onChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            featured: checked,
                          }))
                        }
                        label="Feature this artist on homepage"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Voting Settings</Label>
                    <div className="mt-2">
                      <Switch
                        label="Enable voting for this nominee"
                        defaultChecked={formData.votingEnabled}
                        onChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            votingEnabled: checked,
                          }))
                        }
                        disabled={isSubmitting}
                      />
                    </div>
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
                  disabled={isSubmitting || nominees.isLoading}
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
                      Adding Nominee...
                    </>
                  ) : (
                    "Add Nominee"
                  )}
                </button>
              </div>
            </div>
          </Form>
        </ComponentCard>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ComponentCard title="Total Nominees">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {nominees.nominees.length}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Across all categories
            </p>
          </ComponentCard>

          <ComponentCard title="Pending Review">
            <div className="text-2xl font-bold text-orange-500">
              {pendingNominees.length}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Awaiting approval
            </p>
          </ComponentCard>

          <ComponentCard title="Active Nominees">
            <div className="text-2xl font-bold text-green-500">
              {activeNominees.length}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Currently active
            </p>
          </ComponentCard>
        </div>
      </div>
    </>
  );
}
