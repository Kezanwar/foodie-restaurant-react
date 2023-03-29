export const getFormDataFromObject = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach((entry) => {
    let itemToAppend = entry[1];
    const key = entry[0];

    const imageKeys = ['avatar', 'cover_photo'];

    const includedInImagesArray = imageKeys.includes(key);

    if (
      !includedInImagesArray &&
      (typeof itemToAppend === 'object' || Array.isArray(itemToAppend))
    ) {
      itemToAppend = JSON.stringify(itemToAppend);
    }

    formData.append(key, itemToAppend);
  });
  return formData;
};
