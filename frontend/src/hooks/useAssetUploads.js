import { useState } from 'react';
import { uploadToCloudinary } from "../services/CloudinaryService";

export const useAssetUploads = (sessionUploadsRef) => {
  const [uploads, setUploads] = useState({});

  const updateUpload = (id, data) => {
    if (data === null) {
      setUploads(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } else {
      setUploads(prev => ({
        ...prev,
        [id]: { ...prev[id], ...data, id }
      }));
    }
  };

  const handleStaticUpload = async (e, type, setters) => {
    const file = e.target.files[0];
    if (!file) return;
    const taskId = `static_${type}_${Date.now()}`;
    updateUpload(taskId, { percent: 0, phase: 'starting' });
    try {
      const data = await uploadToCloudinary(file, `static_${type}`, (progress) => {
        updateUpload(taskId, progress);
      });
      if (data) {
        if (type === 'profile') {
          setters.setProfileUrl(data.url);
          setters.setProfileId(data.public_id);
        } else if (type === 'bg') {
          setters.setBgUrl(data.url);
          setters.setBgId(data.public_id);
        } else if (type === 'bgMobile') {
          setters.setBgUrlMobile(data.url);
          setters.setBgIdMobile(data.public_id);
        }
        sessionUploadsRef.current.add(data.public_id);
        updateUpload(taskId, { percent: 100, phase: 'success' });
        setTimeout(() => updateUpload(taskId, null), 3000);
      }
    } catch (error) {
      alert("Upload failed: " + error.message);
      updateUpload(taskId, null);
    }
  };

  return { uploads, updateUpload, handleStaticUpload };
};
