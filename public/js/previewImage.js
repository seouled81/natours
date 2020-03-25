const previewImage = e => {
  const reader = new FileReader();
  reader.onload = () => {
    const output = document.querySelector('.form__user-photo');
    output.src = reader.result;
  };
  reader.readAsDataURL(e.target.files[0]);
};

export default previewImage;
