const Collection = require("../models/collection.model");

// Create Collection
exports.createCollection = async (req, res) => {
  try {
    const { name } = req.body;
    const user = req.user;
    const collection = await Collection.create({ name, user });
    res.status(201).json({ message: "Collection created", collection });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: { [field]: `${field} already exists` },
      });
    }
    res.status(500).json({ error: error.message });
  }
};

// Get single collection
exports.getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id, { __v: 0 })
      .populate("user", "_id fname")
      .populate("recommendations");
    if (!collection)
      return res.status(404).json({ message: "Collection not found" });
    res.status(200).json(collection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Collection
exports.updateCollection = async (req, res) => {
  try {
    await getAuthorizedCollection(req.params.id, req.user._id);

    const updatedCollection = await Collection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Collection updated", collection: updatedCollection });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

// Delete Collection
exports.deleteCollection = async (req, res) => {
  try {
    let collectionDetails = await getAuthorizedCollection(
      req.params.id,
      req.user._id
    );

    if (collectionDetails.isDeleted) {
      throw { status: 404, message: "Collection has been already deleted" };
    }

    await Collection.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    res.status(200).json({ message: "Collection deleted" });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

// Get Paginated collection list
exports.getCollections = async (req, res) => {
  try {
    let { page = 1, limit = 20 } = req.query;
    let loggedInUser = req.user._id;

    page = parseInt(page);
    limit = parseInt(limit);

    if (limit > 100) limit = 100;

    const collections = await Collection.find(
      {
        isDeleted: false,
      },
      { __v: 0 }
    )
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user", "fname")
      .populate({
        path: "recommendations",
        select: "title description isDeleted user",
        match: { user: loggedInUser, isDeleted: false },
      })
      .sort({ createdAt: -1 })
      .lean();

    collections.forEach((collection) => {
      if (!collection.recommendations?.length) {
        delete collection.recommendations;
      }
    });

    const totalCollections = await Collection.countDocuments({
      isDeleted: false,
    });

    res.json({
      totalCollections,
      page,
      limit,
      totalPages: Math.ceil(totalCollections / limit),
      data: collections,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Helper function to check collection existence and ownership
const getAuthorizedCollection = async (collectionId, userId) => {
  const collection = await Collection.findById(collectionId);
  if (!collection) {
    throw { status: 404, message: "Collection not found" };
  }
  if (collection.user.toString() !== userId.toString()) {
    throw { status: 403, message: "Not authorized to perform this action" };
  }
  return collection;
};
