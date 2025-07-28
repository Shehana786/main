const Product = require('../Models/Plants');
const sendMail = require('../utils/mailer'); // ✅ Make sure to import your mailer

exports.updateStock = async (req, res) => {
  try {
    const io = req.app.get('io'); // ✅ Socket.IO instance
    const productId = req.params.id;
    const { stock } = req.body;

    if (stock == null || isNaN(stock)) {
      return res.status(400).json({ message: 'Invalid stock value' });
    }

    // ✅ Update stock in the database
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { stock: Number(stock) },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // ✅ Emit socket event if stock is low
    if (updatedProduct.stock < 5) {
      io.emit('lowStockAlert', {
        name: updatedProduct.name,
        stock: updatedProduct.stock,
      });

      // ✅ Send email notification
      await sendMail(
        process.env.EMAIL_USER, // or 'admin@example.com'
        `Low Stock Alert: ${updatedProduct.name}`,
        `The stock for ${updatedProduct.name} is low: ${updatedProduct.stock} remaining.`
      );
    }

    res.json({
      message: 'Stock updated successfully',
      product: updatedProduct,
    });

  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
