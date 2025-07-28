// Already defined:
const CareTip = require('../Models/careTips');

// GET all care tips
exports.getAllCareTips = async (req, res) => {
  try {
    const tips = await CareTip.find();
    res.json(tips);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch care tips', error: err });
  }
};

// GET single care tip by ID
exports.getCareTipById = async (req, res) => {
  try {
    const tip = await CareTip.findById(req.params.id);
    if (!tip) return res.status(404).json({ message: 'Care tip not found' });
    if (tipObj.careTips && tipObj.careTips.videoUrl) {
      delete tipObj.careTips.videoUrl;
    }
    res.json(tip);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch care tip', error: err });
  }
};

// POST create new care tip
exports.createCareTip = async (req, res) => {
  try {
    const { title, topic, summary, content, videoUrl } = req.body;
    const thumbnailUrl = req.file ? req.file.filename : null;

    const newTip = new CareTip({
      title,
      topic,
      summary,
      content,
      videoUrl,
      thumbnailUrl
    });

    await newTip.save();
    res.status(201).json({ message: 'Care tip created', careTip: newTip });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create care tip', error: err });
  }
};

// ✅ PUT update care tip
exports.updateCareTip = async (req, res) => {
  try {
    const { title, topic, summary, content, videoUrl } = req.body;
    const thumbnailUrl = req.file ? req.file.filename : null;

    const updatedFields = {
      title,
      topic,
      summary,
      content,
      videoUrl
    };

    if (thumbnailUrl) {
      updatedFields.thumbnailUrl = thumbnailUrl;
    }

    const updatedTip = await CareTip.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

    if (!updatedTip) return res.status(404).json({ message: 'Care tip not found' });

    res.json({ message: 'Care tip updated', careTip: updatedTip });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update care tip', error: err });
  }
};

// ✅ DELETE care tip
exports.deleteCareTip = async (req, res) => {
  try {
    const deleted = await CareTip.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Care tip not found' });

    res.json({ message: 'Care tip deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete care tip', error: err });
  }
};
