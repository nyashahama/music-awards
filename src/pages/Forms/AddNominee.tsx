// File: AddNominee.tsx
import { useState } from "react";
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

  // Category options
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

  // Subcategory options
  const subcategoryOptions = [
    { value: "dancehall", text: "Dancehall" },
    { value: "reggae", text: "Reggae" },
    { value: "afrobeats", text: "Afrobeats" },
    { value: "hiphop", text: "Hip Hop" },
    { value: "rnb", text: "R&B" },
    { value: "traditional", text: "Traditional" },
    { value: "fusion", text: "Fusion" },
  ];

  // Social media platforms
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
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.stageName || !formData.category || !formData.song) {
      alert("Please fill in all required fields");
      return;
    }

    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData);

    // Simulate API call
    setTimeout(() => {
      alert("Nominee added successfully!");

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
    }, 1000);
  };

  return (
    <>
      <PageMeta
        title="Add Nominee | Zimdancehall Music Awards"
        description="Add a new nominee to the voting system"
      />
      <PageBreadcrumb pageTitle="Add Nominee" />

      <div className="space-y-6">
        <ComponentCard title="Add New Nominee">
          <Form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Basic Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Stage Name */}
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
                    />
                  </div>

                  {/* Real Name */}
                  <div>
                    <Label htmlFor="realName">Real Name</Label>
                    <Input
                      type="text"
                      id="realName"
                      name="realName"
                      value={formData.realName}
                      onChange={handleInputChange}
                      placeholder="Enter real name"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      options={categoryOptions}
                      placeholder="Select category"
                      onChange={handleSelectChange("category")}
                      defaultValue={formData.category}
                    />
                  </div>

                  {/* Subcategories */}
                  <div>
                    <MultiSelect
                      label="Music Genres/Subcategories"
                      options={subcategoryOptions}
                      defaultSelected={formData.subcategories}
                      onChange={handleMultiSelectChange}
                      placeholder="Select genres"
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
                  {/* Song Title */}
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
                    />
                  </div>

                  {/* Album */}
                  <div>
                    <Label htmlFor="album">Album</Label>
                    <Input
                      type="text"
                      id="album"
                      name="album"
                      value={formData.album}
                      onChange={handleInputChange}
                      placeholder="Enter album name"
                    />
                  </div>

                  {/* Release Date */}
                  <div>
                    <DatePicker
                      id="releaseDate"
                      label="Release Date"
                      placeholder="Select release date"
                      onChange={(dates, dateString) => {
                        setFormData((prev) => ({
                          ...prev,
                          releaseDate: dateString,
                        }));
                      }}
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
                  {/* Biography */}
                  <div>
                    <Label htmlFor="bio">Biography</Label>
                    <TextArea
                      value={formData.bio}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, bio: value }))
                      }
                      rows={6}
                      placeholder="Tell us about the artist..."
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <Label>Artist Image</Label>
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="flex-1">
                        <FileInput onChange={handleImageChange} />
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          Recommended: Square image, 500x500 pixels, JPG, PNG or
                          WebP
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
                        />
                      </div>
                      <div className="md:col-span-2">
                        {formData.socialMedia.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSocialMediaField(index)}
                            className="w-full px-4 py-2 text-red-600 bg-red-100 rounded-lg hover:bg-red-200 dark:bg-red-900 dark:text-red-200 transition-colors"
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
                    className="px-4 py-2 text-brand-600 bg-brand-100 rounded-lg hover:bg-brand-200 dark:bg-brand-900 dark:text-brand-200 transition-colors"
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
                  {/* Status */}
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
                      />
                    </div>
                  </div>

                  {/* Featured Artist */}
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
                      />
                    </div>
                  </div>

                  {/* Voting Enabled */}
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
                      />
                    </div>
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
                  Add Nominee
                </button>
              </div>
            </div>
          </Form>
        </ComponentCard>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ComponentCard title="Total Nominees">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              127
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Across all categories
            </p>
          </ComponentCard>

          <ComponentCard title="Pending Review">
            <div className="text-2xl font-bold text-orange-500">8</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Awaiting approval
            </p>
          </ComponentCard>

          <ComponentCard title="This Month">
            <div className="text-2xl font-bold text-green-500">12</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              New nominees added
            </p>
          </ComponentCard>
        </div>
      </div>
    </>
  );
}
