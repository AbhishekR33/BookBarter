// src/pages/BookUpload.jsx
import React, { useState } from 'react';
import axios from '../api/axios';

const BookUpload = () => {
  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/books', form);
      alert('✅ Book uploaded successfully!');
      setForm({ title: '', author: '', description: '', price: '' });
    } catch (err) {
      console.error(err);
      alert('❌ Error uploading book.');
    }
  };

  return (
    <div>
      <h2>📚 Upload a Book</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Book Title" value={form.title} onChange={handleChange} required />
        <input type="text" name="author" placeholder="Author" value={form.author} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} required />
        <button type="submit">Upload Book</button>
      </form>
    </div>
  );
};

export default BookUpload;
