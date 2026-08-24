import Portfolio from '../models/Portfolio.js';
import User from '../models/User.js';

// Get the portfolio data (public access)
export const getPortfolio = async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne();

    if (!portfolio) {
      return res.status(200).json({
        gallerySections: [],
        videoSections: [],
        stats: [],
        promiseItems: [],
        heroTitle: "Welcome",
        aboutName: "Your Name"
      });
    }

    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching portfolio', error: error.message });
  }
};

// Update or Create portfolio data
export const updatePortfolio = async (req, res) => {
  try {
    let userId = req.user?.id;

    if (!userId) {
      const firstUser = await User.findOne();
      if (firstUser) {
        userId = firstUser._id;
      } else {
        return res.status(400).json({ message: 'Please register at least one user in the database first.' });
      }
    }

    const updateData = req.body;

    // Use findOneAndUpdate with upsert: true to create if it doesn't exist
    const portfolio = await Portfolio.findOneAndUpdate(
      {},
      { ...updateData, user: userId },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ message: 'Portfolio saved to database!', portfolio });
  } catch (error) {
    console.error("Save Error:", error);
    res.status(500).json({ message: 'Error updating portfolio', error: error.message });
  }
};
