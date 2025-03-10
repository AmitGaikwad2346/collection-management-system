const Collection = require("../models/collection.model");
const Recommendation = require("../models/recommendation.model");

// Create new recommendation
exports.createRecommendation = async (req, res) => {
  try {
    const { title, description } = req.body;
    const loggedInUser = req.user._id;

    let recommendation = await Recommendation.findOne({ title });
    if (recommendation) {
      return res.status(400).json({ error: "Recommendation already exists" });
    }

    recommendation = new Recommendation({
      title,
      description,
      user: loggedInUser,
    });
    await recommendation.save();

    res.status(201).json({ message: "Recommendation created", recommendation });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Add recommendation to collection
exports.addRecommendationToCollection = async (req, res) => {
  try {
    const { recommendationId } = req.body;
    const { collectionId } = req.params;

    if (!recommendationId) {
      return res.status(400).json({ error: "Recommendation ID is required" });
    }

    const recommendation = await Recommendation.findById(recommendationId);
    if (!recommendation) {
      return res.status(404).json({ error: "Recommendation not found" });
    }

    const collection = await Collection.findById(collectionId);
    if (!collection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    if (collection.recommendations.includes(recommendationId)) {
      return res
        .status(400)
        .json({ error: "Recommendation already in collection" });
    }

    collection.recommendations.push(recommendationId);
    await collection.save();

    res
      .status(200)
      .json({ message: "Recommendation added to collection", collection });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Remove recommendation from collection
exports.removeRecommendationFromCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { recommendationId } = req.body;
    const userId = req.user._id;

    const collection = await Collection.findById(collectionId);
    if (!collection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    if (collection.user.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to perform this action" });
    }

    if (!collection.recommendations.includes(recommendationId)) {
      return res.status(400).json({ error: "Recommendation not found" });
    }

    collection.recommendations = collection.recommendations.filter(
      (recId) => recId.toString() !== recommendationId
    );

    await collection.save();

    res.status(200).json({
      message: "Recommendation removed from collection",
      collection,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get all recommendations
exports.getRecommendations = async (req, res) => {
  try {
    let { page = 1, limit = 20 } = req.query;
    const loggedInUser = req.user._id;

    page = parseInt(page);
    limit = parseInt(limit);

    if (limit > 100) limit = 100;

    const recommendations = await Recommendation.find({
      isDeleted: false,
      user: loggedInUser,
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const totalRecommendations = await Recommendation.countDocuments({
      isDeleted: false,
    });

    res.json({
      totalRecommendations,
      page,
      limit,
      totalPages: Math.ceil(totalRecommendations / limit),
      data: recommendations,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
