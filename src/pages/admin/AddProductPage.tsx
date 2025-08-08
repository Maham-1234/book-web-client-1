import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

// A reusable input component
const Input = ({
  label,
  name,
  register,
  required,
  type = "text",
  errors,
  ...rest
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={name}
      type={type}
      {...register(name, { required: required && `${label} is required` })}
      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      {...rest}
    />
    {errors[name] && (
      <p className="mt-2 text-sm text-red-600">{errors[name].message}</p>
    )}
  </div>
);

// A reusable select component
const Select = ({
  label,
  name,
  register,
  required,
  children,
  errors,
  ...rest
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      id={name}
      {...register(name, { required: required && `${label} is required` })}
      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      {...rest}
    >
      {children}
    </select>
    {errors[name] && (
      <p className="mt-2 text-sm text-red-600">{errors[name].message}</p>
    )}
  </div>
);

// Main component for adding a product
const AddProductPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [productId, setProductId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Watch for changes in the productType field
  const productType = watch("productType");

  // Handle the first step of form submission: creating the product
  const onSubmitProduct = async (data) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await axios.post("/api/products", data); // Adjust API endpoint as needed
      setProductId(response.data.product.id);
      setSuccess("Product created successfully! Now, upload images.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while creating the product."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Handle the second step: uploading images
  const handleImageUpload = async () => {
    if (selectedImages.length === 0) {
      setError("Please select at least one image to upload.");
      return;
    }

    const formData = new FormData();
    selectedImages.forEach((image) => {
      formData.append("images", image);
    });

    setIsUploading(true);
    setError(null);

    try {
      await axios.post(`/api/products/${productId}/images`, formData, {
        // Adjust API endpoint as needed
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("Images uploaded successfully!");
      setSelectedImages([]);
      setImagePreviews([]);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while uploading images."
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      {error && (
        <div
          className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg"
          role="alert"
        >
          {error}
        </div>
      )}
      {success && (
        <div
          className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg"
          role="alert"
        >
          {success}
        </div>
      )}

      {!productId ? (
        // Step 1: Product Details Form
        <form onSubmit={handleSubmit(onSubmitProduct)} className="space-y-6">
          <Input
            label="Product Name"
            name="name"
            register={register}
            required
            errors={errors}
          />
          <Input
            label="Description"
            name="description"
            register={register}
            required
            errors={errors}
          />
          <Input
            label="Price"
            name="price"
            type="number"
            step="0.01"
            register={register}
            required
            errors={errors}
          />
          <Input
            label="SKU"
            name="sku"
            register={register}
            required
            errors={errors}
          />
          <Input
            label="Stock"
            name="stock"
            type="number"
            register={register}
            required
            errors={errors}
          />
          {/* You would typically fetch categories from your API */}
          <Select
            label="Category"
            name="categoryId"
            register={register}
            required
            errors={errors}
          >
            <option value="">Select a category</option>
            <option value="1">Category 1</option>
            <option value="2">Category 2</option>
          </Select>
          <Select
            label="Product Type"
            name="productType"
            register={register}
            required
            errors={errors}
          >
            <option value="">Select a product type</option>
            <option value="Books">Books</option>
            <option value="Stationary">Stationary</option>
          </Select>

          {productType === "Books" && (
            <>
              <Input
                label="Author"
                name="author"
                register={register}
                required
                errors={errors}
              />
              <Input
                label="ISBN"
                name="isbn"
                register={register}
                required
                errors={errors}
              />
            </>
          )}

          {productType === "Stationary" && (
            <Input
              label="Brand"
              name="brand"
              register={register}
              required
              errors={errors}
            />
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isSubmitting ? "Creating..." : "Create Product"}
          </button>
        </form>
      ) : (
        // Step 2: Image Upload
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Product Images
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload files</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>
          </div>

          {imagePreviews.length > 0 && (
            <div>
              <h3 className="text-lg font-medium">Image Previews:</h3>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt="Preview"
                    className="w-full h-auto rounded-md"
                  />
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleImageUpload}
            disabled={isUploading || selectedImages.length === 0}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isUploading ? "Uploading..." : "Upload Selected Images"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddProductPage;
