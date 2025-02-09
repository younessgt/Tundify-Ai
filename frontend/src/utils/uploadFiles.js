import axios from "axios";

const cloudary_name = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const cloudary_preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

const uploadFileToCloud = async (formData, type) => {
  try {
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudary_name}/${type}/upload`,
      formData,
      {
        timeout: 10000,
      }
    );
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

const createFormDataForAudio = (file) => {
  const formData = new FormData();
  formData.append("upload_preset", cloudary_preset);
  formData.append("file", file);
  return formData;
};

export const uploadFiles = async (files) => {
  if (!cloudary_name || !cloudary_preset) {
    throw new Error("Cloudinary configuration is missing!");
  }

  const uploadFileToCloud = async (formData, type) => {
    try {
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudary_name}/${type}/upload`,
        formData,
        {
          timeout: 10000,
        }
      );
      return data;
    } catch (err) {
      throw new Error(err);
    }
  };

  const createFormData = ({ file }) => {
    const formData = new FormData();
    formData.append("upload_preset", cloudary_preset);
    formData.append("file", file);
    return formData;
  };

  const uploadPromises = files.map(({ file, type, message }) =>
    uploadFileToCloud(createFormData({ file }), "raw").then((response) => ({
      file: response,
      type,
      message,
    }))
  );

  return Promise.all(uploadPromises);
};

export const uploadFile = async (audioFile) => {
  const { file, type } = audioFile;

  const formData = createFormDataForAudio(file);

  const data = await uploadFileToCloud(formData, "auto");

  console.log("data: ", data);
  return {
    file: data,
    type,
  };
};
