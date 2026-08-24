const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Uploads a file with an accurate 0-100% progress model.
 * Accounts for actual internet speed and projected server-side processing time.
 */
export const uploadToCloudinary = (file, tag, onProgress) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('tag', tag);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}/cloudinary/upload`, true);
    xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);

    const isVideo = file.type.startsWith('video/');
    const fileSizeMB = file.size / (1024 * 1024);

    // --- ACCURACY CONSTANTS ---
    // Journey split: Upload (70%) and Processing (30%)
    const UPLOAD_WEIGHT = 0.7;
    // Estimated minimum processing time in seconds
    const estProcessingDuration = isVideo ? (fileSizeMB * 4 + 12) : (fileSizeMB * 0.8 + 3);

    let startTime = Date.now();
    let bytesSent = 0;
    let isUploadFinished = false;
    let uploadFinishedTime = 0;
    let currentVisualPercent = 0;

    // Speed tracking variables
    let measuredSpeedBps = 0;
    let lastTime = startTime;
    let lastBytes = 0;

    // The Animation Loop: Updates every 100ms for buttery smoothness
    const progressInterval = setInterval(() => {
      const now = Date.now();
      const elapsedTotal = (now - startTime) / 1000;

      let targetPercent = 0;

      if (!isUploadFinished) {
        // PHASE 1: UPLOADING
        const timeDiff = (now - lastTime) / 1000;
        if (timeDiff >= 0.5) {
          const bytesDiff = bytesSent - lastBytes;
          const currentSpeed = bytesDiff / timeDiff;
          // Weighted average for stable speed calculation
          measuredSpeedBps = measuredSpeedBps === 0 ? currentSpeed : (measuredSpeedBps * 0.8 + currentSpeed * 0.2);
          lastBytes = bytesSent;
          lastTime = now;
        }

        // Estimate total journey time
        const effectiveSpeed = Math.max(measuredSpeedBps, 50 * 1024); // Baseline 50KB/s
        const estTotalUploadTime = file.size / effectiveSpeed;
        const totalEstDuration = estTotalUploadTime + estProcessingDuration;

        // Target is based on time, but bounded by real byte progress
        const timeBasedTarget = (elapsedTotal / totalEstDuration) * 100;
        const byteBasedTarget = (bytesSent / file.size) * 100 * UPLOAD_WEIGHT;

        // We favor time-based progress for smoothness, but anchor it to bytes
        targetPercent = Math.min(timeBasedTarget, byteBasedTarget + 5, UPLOAD_WEIGHT * 100);
      } else {
        // PHASE 2: PROCESSING
        const processingElapsed = (now - uploadFinishedTime) / 1000;

        // Exponentially slowing crawl from (UPLOAD_WEIGHT*100) toward 99
        const decayFactor = 1 - Math.exp(-processingElapsed / (estProcessingDuration * 0.8));
        targetPercent = (UPLOAD_WEIGHT * 100) + (decayFactor * (99 - (UPLOAD_WEIGHT * 100)));
      }

      // NO-JUMP INTERPOLATION (Lerping)
      // This makes the bar move continuously every 100ms
      const diff = targetPercent - currentVisualPercent;
      if (diff > 0) {
        currentVisualPercent += Math.max(diff * 0.05, 0.01);
      }

      const displayPercent = Math.min(Math.round(currentVisualPercent), 99);

      onProgress({
        percent: displayPercent,
        phase: isUploadFinished ? 'processing' : 'uploading',
        timeRemaining: isUploadFinished ? null : Math.round((100 - currentVisualPercent) * (elapsedTotal / (currentVisualPercent || 1)))
      });
    }, 100);

    if (xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          bytesSent = event.loaded;
        }
      };

      xhr.upload.onload = () => {
        isUploadFinished = true;
        uploadFinishedTime = Date.now();
      };
    }

    xhr.onload = () => {
      clearInterval(progressInterval);
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress({ percent: 100, phase: 'complete' });
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } catch (e) {
          reject(new Error('Failed to parse response'));
        }
      } else {
        try {
          const data = JSON.parse(xhr.responseText);
          reject(new Error(data.error?.message || 'Upload failed'));
        } catch (e) {
          reject(new Error('Upload failed'));
        }
      }
    };

    xhr.onerror = () => {
      clearInterval(progressInterval);
      reject(new Error('Network error'));
    };

    xhr.send(formData);
  });
};

export const fetchResourcesByTag = async (tag, type = 'image') => {
  try {
    const response = await fetch(`${API_URL}/cloudinary/list/${tag}?type=${type}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch Error:', error);
    return [];
  }
};

export const deleteFromCloudinary = async (public_id, resource_type = 'image') => {
  try {
    const response = await fetch(`${API_URL}/cloudinary/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ public_id, resource_type }),
    });

    return response.ok;
  } catch (error) {
    console.error('Delete Error:', error);
    return false;
  }
};
