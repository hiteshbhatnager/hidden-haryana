import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  Shield,
  MapPin,
  Sparkles,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Upload,
  X,
  Check,
} from 'lucide-react';
import { destinationService } from '../services/destinationService';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Loader } from '../components/common/Loader';
import { HARYANA_DISTRICTS, DESTINATION_CATEGORIES } from '../constants/haryanaData';

export const AdminDashboardPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const initialForm = {
    name: '',
    category: 'Heritage & Forts',
    district: 'Panchkula',
    description: '',
    history: '',
    latitude: 30.6978,
    longitude: 77.0864,
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    imageCaption: '',
    isFree: true,
    entryAmount: 0,
    entryDetails: 'Free entry for visitors',
    openTime: '09:00 AM',
    closeTime: '06:00 PM',
    daysOpen: 'Open all days',
    facilitiesText: 'Parking, Restrooms, Drinking Water',
    tipsText: 'Wear comfortable walking shoes. Arrive early for tranquil views.',
    isFeatured: false,
    isHiddenGem: true,
  };

  const [form, setForm] = useState(initialForm);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const data = await destinationService.getAll({ limit: 100 });
      setDestinations(data.destinations || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (dest) => {
    setEditingId(dest._id);
    setForm({
      name: dest.name || '',
      category: dest.category || 'Heritage & Forts',
      district: dest.district || 'Panchkula',
      description: dest.description || '',
      history: dest.history || '',
      latitude: dest.coordinates?.latitude || 30.0,
      longitude: dest.coordinates?.longitude || 76.0,
      imageUrl: dest.images?.[0]?.url || '',
      imageCaption: dest.images?.[0]?.caption || '',
      isFree: dest.entryFee?.isFree ?? true,
      entryAmount: dest.entryFee?.amount || 0,
      entryDetails: dest.entryFee?.details || '',
      openTime: dest.visitingHours?.openTime || '09:00 AM',
      closeTime: dest.visitingHours?.closeTime || '06:00 PM',
      daysOpen: dest.visitingHours?.days || 'Open all days',
      facilitiesText: (dest.facilities || []).join(', '),
      tipsText: (dest.visitorTips || []).join('; '),
      isFeatured: Boolean(dest.isFeatured),
      isHiddenGem: Boolean(dest.isHiddenGem),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await destinationService.uploadImage(formData);
      const uploadedUrl = res.url || res.data?.url;
      if (uploadedUrl) {
        setForm((prev) => ({ ...prev, imageUrl: uploadedUrl }));
        setSuccessMsg('Photograph uploaded successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      setError(`Image upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);

    const payload = {
      name: form.name,
      category: form.category,
      district: form.district,
      description: form.description,
      history: form.history,
      coordinates: {
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
      },
      images: [
        {
          url: form.imageUrl,
          caption: form.imageCaption || form.name,
          isPrimary: true,
        },
      ],
      entryFee: {
        isFree: form.isFree,
        amount: form.isFree ? 0 : parseFloat(form.entryAmount) || 0,
        currency: 'INR',
        details: form.entryDetails,
      },
      visitingHours: {
        openTime: form.openTime,
        closeTime: form.closeTime,
        days: form.daysOpen,
      },
      facilities: form.facilitiesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      visitorTips: form.tipsText
        .split(/[;\n]/)
        .map((s) => s.trim())
        .filter(Boolean),
      isFeatured: form.isFeatured,
      isHiddenGem: form.isHiddenGem,
      verificationStatus: 'verified',
    };

    try {
      if (editingId) {
        await destinationService.update(editingId, payload);
        setSuccessMsg(`Successfully updated "${form.name}"!`);
      } else {
        await destinationService.create(payload);
        setSuccessMsg(`Successfully added "${form.name}" to Hidden Haryana!`);
      }
      closeModal();
      await fetchDestinations();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    setActionLoading(true);
    try {
      await destinationService.delete(id);
      setSuccessMsg(`Deleted "${name}"`);
      await fetchDestinations();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
            <Shield className="w-3.5 h-3.5 text-forest-700" />
            <span>Haryana Tourism Administrative Control</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">
            Destination Management Portal
          </h1>
        </div>

        <Button variant="primary" size="md" onClick={openAddModal} icon={Plus}>
          Add New Destination
        </Button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
            Total Destinations
          </span>
          <span className="font-serif text-3xl font-bold text-stone-900 mt-1 block">
            {destinations.length}
          </span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
            Hidden Gems
          </span>
          <span className="font-serif text-3xl font-bold text-amber-600 mt-1 block">
            {destinations.filter((d) => d.isHiddenGem).length}
          </span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
            Featured Highlights
          </span>
          <span className="font-serif text-3xl font-bold text-forest-800 mt-1 block">
            {destinations.filter((d) => d.isFeatured).length}
          </span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
            Districts Represented
          </span>
          <span className="font-serif text-3xl font-bold text-terracotta-600 mt-1 block">
            {new Set(destinations.map((d) => d.district)).size}
          </span>
        </div>
      </div>

      {/* Destinations Table */}
      <div className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-stone-900">
            Registered Destinations
          </h3>
          <span className="text-xs text-stone-500">
            Click on edit to modify descriptions, GPS tags, or visiting timings.
          </span>
        </div>

        {loading ? (
          <Loader message="Loading destination records..." />
        ) : destinations.length === 0 ? (
          <div className="p-12 text-center text-stone-500 text-sm">
            No destinations found. Add your first destination above!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-700">
              <thead className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Tags</th>
                  <th className="py-3 px-4">Entry</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {destinations.map((dest) => (
                  <tr key={dest._id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-stone-900 flex items-center gap-3">
                      <img
                        src={
                          dest.images?.[0]?.url ||
                          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=120&q=80'
                        }
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover shrink-0 bg-stone-200"
                      />
                      <div>
                        <span className="block">{dest.name}</span>
                        <span className="text-[11px] text-stone-400 block font-normal">
                          /{dest.slug}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{dest.district}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant="forest" size="sm">
                        {dest.category}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {dest.isHiddenGem && (
                          <Badge variant="gem" size="sm">
                            Gem
                          </Badge>
                        )}
                        {dest.isFeatured && (
                          <Badge variant="terracotta" size="sm">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium">
                      {dest.entryFee?.isFree ? 'Free' : `₹${dest.entryFee?.amount}`}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(dest)}
                          className="p-1.5 text-stone-600 hover:text-forest-800 hover:bg-forest-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(dest._id, dest.name)}
                          className="p-1.5 text-stone-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Destination Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                {editingId ? 'Edit Destination' : 'Add New Destination'}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Destination Name */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Destination Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Tosham Rock Inscription & Fort"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              {/* Category & District Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none"
                  >
                    {DESTINATION_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    District of Haryana *
                  </label>
                  <select
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none"
                  >
                    {HARYANA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Overview Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detailed geographic and natural overview of the destination..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              {/* Historical Information */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Historical and Cultural Information
                </label>
                <textarea
                  rows={2}
                  value={form.history}
                  onChange={(e) => setForm({ ...form, history: e.target.value })}
                  placeholder="Dynasty origins, archaeological findings, folk legends..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              {/* GPS Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Latitude (e.g. 30.6978) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={form.latitude}
                    onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Longitude (e.g. 77.0864) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={form.longitude}
                    onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Image Upload & URL */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-stone-700">
                    Destination Photography *
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-forest-800 hover:bg-forest-900 text-white rounded-lg text-[11px] font-medium cursor-pointer shadow-sm transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload File (Cloudinary)'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-stone-500 mb-1">
                      Or Paste Image URL directly:
                    </label>
                    <input
                      type="url"
                      required
                      value={form.imageUrl}
                      onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-500 mb-1">
                      Image Caption:
                    </label>
                    <input
                      type="text"
                      value={form.imageCaption}
                      onChange={(e) => setForm({ ...form, imageCaption: e.target.value })}
                      placeholder="e.g. Sunset view over the hill fort"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none"
                    />
                  </div>
                </div>

                {form.imageUrl && (
                  <div className="flex items-center gap-3 pt-1">
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="w-14 h-10 object-cover rounded-lg border border-stone-200"
                    />
                    <span className="text-[11px] text-stone-500 truncate max-w-sm">
                      {form.imageUrl}
                    </span>
                  </div>
                )}
              </div>

              {/* Entry Fee */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-800">
                    <input
                      type="checkbox"
                      checked={form.isFree}
                      onChange={(e) => setForm({ ...form, isFree: e.target.checked })}
                      className="w-4 h-4 text-forest-700 rounded"
                    />
                    <span>Free Entry</span>
                  </label>
                  {!form.isFree && (
                    <div className="flex items-center gap-2">
                      <span className="text-stone-500">Amount (₹):</span>
                      <input
                        type="number"
                        min="0"
                        value={form.entryAmount}
                        onChange={(e) => setForm({ ...form, entryAmount: e.target.value })}
                        className="w-24 px-2 py-1 bg-white border border-stone-300 rounded-lg text-sm"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    value={form.entryDetails}
                    onChange={(e) => setForm({ ...form, entryDetails: e.target.value })}
                    placeholder="Entry fee details, foreign tourist charge, etc."
                    className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Visiting Hours */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Open</label>
                  <input
                    type="text"
                    value={form.openTime}
                    onChange={(e) => setForm({ ...form, openTime: e.target.value })}
                    className="w-full px-2 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Close</label>
                  <input
                    type="text"
                    value={form.closeTime}
                    onChange={(e) => setForm({ ...form, closeTime: e.target.value })}
                    className="w-full px-2 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Days</label>
                  <input
                    type="text"
                    value={form.daysOpen}
                    onChange={(e) => setForm({ ...form, daysOpen: e.target.value })}
                    className="w-full px-2 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Facilities & Tips */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Facilities (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.facilitiesText}
                  onChange={(e) => setForm({ ...form, facilitiesText: e.target.value })}
                  placeholder="Parking, Restrooms, Cafeteria, Boating"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Visitor Tips (separate by semicolon or newline)
                </label>
                <textarea
                  rows={2}
                  value={form.tipsText}
                  onChange={(e) => setForm({ ...form, tipsText: e.target.value })}
                  placeholder="Wear comfortable walking shoes; Bring binoculars for birdwatching"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              {/* Toggles: Featured & Hidden Gem */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-800">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-forest-700 rounded"
                  />
                  <span>Mark as Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-800">
                  <input
                    type="checkbox"
                    checked={form.isHiddenGem}
                    onChange={(e) => setForm({ ...form, isHiddenGem: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Mark as Hidden Gem</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-stone-100">
                <Button variant="outline" size="sm" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={actionLoading}
                >
                  {editingId ? 'Save Changes' : 'Publish Destination'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
