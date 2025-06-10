import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import dotenv from 'dotenv';
dotenv.config();

const AddProduct = () => {
  const [images, setImages] = useState([null, null, null, null]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [sizes, setSizes] = useState([]);
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e, idx) => {
    const files = e.target.files;
    if (files && files[0]) {
      const newImages = [...images];
      newImages[idx] = files[0];
      setImages(newImages);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !description ||
      !category ||
      !subCategory ||
      sizes.length === 0 ||
      !price ||
      !offerPrice
    ) {
      toast.error('Please fill all fields, including subcategory and sizes!');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      images.forEach((img) => {
        if (img) formData.append('images', img);
      });
      formData.append('name', name);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      sizes.forEach((size) => formData.append('sizes', size));
      formData.append('price', price);
      formData.append('offerPrice', offerPrice);

      await axios.post(`${process.env.REACT_APP_Backend_URL}/seller/add-products`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });



      toast.success('Product added successfully!');
      setImages([null, null, null, null]);
      setName('');
      setDescription('');
      setCategory('');
      setSubCategory('');
      setSizes([]);
      setPrice('');
      setOfferPrice('');
      
    } catch (error) {
      toast.error('Failed to add product.');
    }
    setLoading(false);
  };


  return (
    <div className="py-10 flex flex-col justify-between bg-white">
      <form className="md:p-10 p-4 space-y-5 max-w-lg" onSubmit={handleSubmit}>
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4)
              .fill('')
              .map((_, index) => (
                <label key={index} htmlFor={`image${index}`}>
                  <input
                    accept="image/*"
                    type="file"
                    id={`image${index}`}
                    hidden
                    onChange={(e) => handleImageChange(e, index)}
                  />
                  <img
                    className="max-w-24 cursor-pointer"
                    src={
                      images[index]
                        ? URL.createObjectURL(images[index])
                        : 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png'
                    }
                    alt="uploadArea"
                    width={100}
                    height={100}
                  />
                </label>
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-description">
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="subCategory">
            Subcategory <span className="text-red-500">*</span>
          </label>
          <select
            id="subCategory"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            required
          >
            <option value="">Select Subcategory</option>
            <option value="Shirts">Shirts</option>
            <option value="T-Shirts">T-Shirts</option>
            <option value="Jeans">Jeans</option>
            <option value="Dresses">Dresses</option>
            <option value="Shoes">Shoes</option>
            {/* Add more as needed */}
          </select>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="sizes">
            Sizes <span className="text-red-500">*</span>
          </label>
          <select
            id="sizes"
            multiple
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            value={sizes}
            onChange={(e) => {
              const selected = Array.from(
                e.target.selectedOptions,
                (option) => option.value
              );
              setSizes(selected);
            }}
          >
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
          <small className="text-gray-500">
            Hold Ctrl (Windows) or Cmd (Mac) to select multiple sizes.
          </small>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          className="px-8 py-2.5 bg-indigo-500 text-white font-medium rounded"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'ADD'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
