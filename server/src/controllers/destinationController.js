import mongoose from 'mongoose';
import { Destination } from '../models/Destination.js';
import { seedDestinations } from '../data/seedData.js';
import { ApiResponse, ApiError } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// In-memory fallback destination store when MongoDB is not connected
let memoryDestinations = [...seedDestinations.map((d, index) => ({
  ...d,
  _id: `mem_${index + 1}`,
  createdAt: new Date(Date.now() - index * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
}))];

const isDBConnected = () => mongoose.connection.readyState === 1;

/**
 * @desc    Get all destinations with query filters, search, sorting & pagination
 * @route   GET /api/destinations
 * @access  Public
 */
export const getDestinations = asyncHandler(async (req, res) => {
  const {
    keyword,
    category,
    district,
    isFeatured,
    isHiddenGem,
    sort,
    page = 1,
    limit = 9,
  } = req.query;

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 9;

  // If MongoDB is connected, execute database query
  if (isDBConnected()) {
    const query = {};

    if (keyword && keyword.trim() !== '') {
      const searchRegex = new RegExp(keyword.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { district: searchRegex },
        { history: searchRegex },
        { category: searchRegex },
      ];
    }

    if (category && category !== 'All') query.category = category;
    if (district && district !== 'All') query.district = district;
    if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';
    if (isHiddenGem !== undefined) query.isHiddenGem = isHiddenGem === 'true';

    let sortOption = { createdAt: -1 };
    if (sort === 'name-asc') sortOption = { name: 1 };
    else if (sort === 'name-desc') sortOption = { name: -1 };
    else if (sort === 'rating-desc') sortOption = { rating: -1 };
    else if (sort === 'oldest') sortOption = { createdAt: 1 };

    const skip = (pageNum - 1) * limitNum;
    const total = await Destination.countDocuments(query);
    const destinations = await Destination.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .populate('createdBy', 'name email');

    const totalPages = Math.ceil(total / limitNum) || 1;

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          destinations,
          pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1,
          },
        },
        'Destinations fetched successfully'
      )
    );
  }

  // Graceful in-memory fallback for local development without active MongoDB daemon
  let filtered = [...memoryDestinations];

  if (keyword && keyword.trim() !== '') {
    const term = keyword.trim().toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.name.toLowerCase().includes(term) ||
        d.description.toLowerCase().includes(term) ||
        d.district.toLowerCase().includes(term) ||
        (d.history && d.history.toLowerCase().includes(term))
    );
  }

  if (category && category !== 'All') {
    filtered = filtered.filter((d) => d.category === category);
  }

  if (district && district !== 'All') {
    filtered = filtered.filter((d) => d.district === district);
  }

  if (isFeatured !== undefined) {
    const featBool = isFeatured === 'true';
    filtered = filtered.filter((d) => Boolean(d.isFeatured) === featBool);
  }

  if (isHiddenGem !== undefined) {
    const gemBool = isHiddenGem === 'true';
    filtered = filtered.filter((d) => Boolean(d.isHiddenGem) === gemBool);
  }

  // Sorting
  if (sort === 'name-asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'name-desc') {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sort === 'rating-desc') {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sort === 'oldest') {
    filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else {
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const total = filtered.length;
  const skip = (pageNum - 1) * limitNum;
  const paginated = filtered.slice(skip, skip + limitNum);
  const totalPages = Math.ceil(total / limitNum) || 1;

  res.status(200).json(
    new ApiResponse(
      200,
      {
        destinations: paginated,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
      'Destinations fetched successfully (Local Development Mode)'
    )
  );
});

/**
 * @desc    Get featured destinations for homepage
 * @route   GET /api/destinations/featured
 * @access  Public
 */
export const getFeaturedDestinations = asyncHandler(async (req, res) => {
  if (isDBConnected()) {
    const destinations = await Destination.find({ isFeatured: true })
      .limit(6)
      .sort({ rating: -1 });
    return res.status(200).json(new ApiResponse(200, destinations, 'Featured destinations fetched'));
  }

  const featured = memoryDestinations.filter((d) => d.isFeatured).slice(0, 6);
  res.status(200).json(new ApiResponse(200, featured, 'Featured destinations fetched (Local Mode)'));
});

/**
 * @desc    Get hidden gems for homepage
 * @route   GET /api/destinations/hidden-gems
 * @access  Public
 */
export const getHiddenGems = asyncHandler(async (req, res) => {
  if (isDBConnected()) {
    const destinations = await Destination.find({ isHiddenGem: true })
      .limit(6)
      .sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, destinations, 'Hidden gems fetched'));
  }

  const gems = memoryDestinations.filter((d) => d.isHiddenGem).slice(0, 6);
  res.status(200).json(new ApiResponse(200, gems, 'Hidden gems fetched (Local Mode)'));
});

/**
 * @desc    Get recently added destinations
 * @route   GET /api/destinations/recent
 * @access  Public
 */
export const getRecentDestinations = asyncHandler(async (req, res) => {
  if (isDBConnected()) {
    const destinations = await Destination.find({})
      .sort({ createdAt: -1 })
      .limit(4);
    return res.status(200).json(new ApiResponse(200, destinations, 'Recent destinations fetched'));
  }

  const recent = [...memoryDestinations]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);
  res.status(200).json(new ApiResponse(200, recent, 'Recent destinations fetched (Local Mode)'));
});

/**
 * @desc    Get filter metadata
 * @route   GET /api/destinations/meta
 * @access  Public
 */
export const getDestinationsMeta = asyncHandler(async (req, res) => {
  if (isDBConnected()) {
    const categories = await Destination.distinct('category');
    const districts = await Destination.distinct('district');
    const totalCount = await Destination.countDocuments({});
    return res.status(200).json(
      new ApiResponse(200, { categories, districts: districts.sort(), totalCount }, 'Metadata fetched')
    );
  }

  const categories = [...new Set(memoryDestinations.map((d) => d.category))];
  const districts = [...new Set(memoryDestinations.map((d) => d.district))].sort();
  res.status(200).json(
    new ApiResponse(200, { categories, districts, totalCount: memoryDestinations.length }, 'Metadata fetched (Local Mode)')
  );
});

/**
 * @desc    Get single destination by slug or ID
 * @route   GET /api/destinations/:idOrSlug
 * @access  Public
 */
export const getDestinationByIdOrSlug = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;

  if (isDBConnected()) {
    let destination = null;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      destination = await Destination.findById(idOrSlug).populate('createdBy', 'name email');
    }
    if (!destination) {
      destination = await Destination.findOne({ slug: idOrSlug }).populate('createdBy', 'name email');
    }

    if (!destination) {
      throw new ApiError(404, `Destination '${idOrSlug}' not found`);
    }

    const relatedDestinations = await Destination.find({
      _id: { $ne: destination._id },
      $or: [{ category: destination.category }, { district: destination.district }],
    }).limit(3);

    return res.status(200).json(
      new ApiResponse(200, { destination, relatedDestinations }, 'Destination retrieved')
    );
  }

  // In-memory lookup
  const destination = memoryDestinations.find(
    (d) => d.slug === idOrSlug || d._id === idOrSlug
  );

  if (!destination) {
    throw new ApiError(404, `Destination '${idOrSlug}' not found`);
  }

  const relatedDestinations = memoryDestinations
    .filter((d) => d.slug !== destination.slug && (d.category === destination.category || d.district === destination.district))
    .slice(0, 3);

  res.status(200).json(
    new ApiResponse(200, { destination, relatedDestinations }, 'Destination retrieved (Local Mode)')
  );
});

/**
 * @desc    Create a new destination
 * @route   POST /api/destinations
 * @access  Private (Admin)
 */
export const createDestination = asyncHandler(async (req, res) => {
  if (isDBConnected()) {
    const existing = await Destination.findOne({ name: req.body.name });
    if (existing) {
      throw new ApiError(400, 'A destination with this name already exists');
    }

    const destination = await Destination.create({
      ...req.body,
      createdBy: req.user?._id,
    });

    return res.status(201).json(
      new ApiResponse(201, destination, 'Destination created successfully')
    );
  }

  // Memory creation
  const slug = req.body.name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-');

  const newDest = {
    ...req.body,
    _id: `mem_${Date.now()}`,
    slug,
    rating: req.body.rating || 4.5,
    reviewsCount: req.body.reviewsCount || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  memoryDestinations.unshift(newDest);

  res.status(201).json(
    new ApiResponse(201, newDest, 'Destination created successfully (Local Mode)')
  );
});

/**
 * @desc    Update destination
 * @route   PUT /api/destinations/:id
 * @access  Private (Admin)
 */
export const updateDestination = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (isDBConnected()) {
    const destination = await Destination.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!destination) throw new ApiError(404, 'Destination not found');
    return res.status(200).json(new ApiResponse(200, destination, 'Destination updated'));
  }

  const index = memoryDestinations.findIndex((d) => d._id === id || d.slug === id);
  if (index === -1) throw new ApiError(404, 'Destination not found');

  memoryDestinations[index] = {
    ...memoryDestinations[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  res.status(200).json(new ApiResponse(200, memoryDestinations[index], 'Destination updated (Local Mode)'));
});

/**
 * @desc    Delete destination
 * @route   DELETE /api/destinations/:id
 * @access  Private (Admin)
 */
export const deleteDestination = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (isDBConnected()) {
    const destination = await Destination.findByIdAndDelete(id);
    if (!destination) throw new ApiError(404, 'Destination not found');
    return res.status(200).json(new ApiResponse(200, { id }, 'Destination deleted'));
  }

  const index = memoryDestinations.findIndex((d) => d._id === id || d.slug === id);
  if (index === -1) throw new ApiError(404, 'Destination not found');

  memoryDestinations.splice(index, 1);
  res.status(200).json(new ApiResponse(200, { id }, 'Destination deleted (Local Mode)'));
});
