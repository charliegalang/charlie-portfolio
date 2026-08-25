import cloudinary from '../config/cloudinary.js';

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const tag = req.body.tag || 'general';
    const isSvg = req.file.mimetype === 'image/svg+xml' || req.file.originalname.endsWith('.svg');
    const isVideo = req.file.mimetype.startsWith('video/');

    const uploadOptions = {
      tags: [tag],
      folder: "portfolio",
      use_filename: false,
      unique_filename: true,
      resource_type: isVideo ? "video" : (isSvg ? "image" : "auto"),
      timeout: 600000
    };

    const preset = process.env.VITE_CLOUDINARY_UPLOAD_PRESET || process.env.CLOUDINARY_UPLOAD_PRESET;
    if (preset) {
      uploadOptions.upload_preset = preset;
    }

    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        // Pipe the buffer to the stream
        uploadStream.end(req.file.buffer);
      });
    };

    const result = await uploadToCloudinary();

    res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id,
      version: result.version,
      resource_type: result.resource_type
    });

  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    if (error.http_code === 499 || error.name === 'TimeoutError') {
      return res.status(504).json({
        message: 'Upload timed out. The file might be too large for the current server connection.',
        error: error.message
      });
    }
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

export const getResourcesByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    const { type = 'image' } = req.query;

    const result = await cloudinary.api.resources_by_tag(tag, {
      max_results: 100,
      resource_type: type
    });

    const resources = result.resources.map(res => ({
      url: res.secure_url,
      public_id: res.public_id,
      version: res.version,
      resource_type: res.resource_type
    }));

    res.status(200).json(resources);
  } catch (error) {
    console.error('Cloudinary Fetch Error:', error);
    res.status(500).json({ message: 'Failed to fetch resources', error: error.message });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const { public_id, resource_type = 'image' } = req.body;
    if (!public_id) return res.status(400).json({ message: 'Public ID is required' });
    const result = await cloudinary.uploader.destroy(public_id, { resource_type });
    res.status(200).json({ message: 'Resource deleted successfully', result: result.result });
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
};
