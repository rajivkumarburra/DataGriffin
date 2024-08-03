function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const messageElement = document.getElementById('message');
  
    if (!file) {
      messageElement.textContent = 'Please select a file.';
      messageElement.style.color = 'red';
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    fetch('/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      messageElement.textContent = 'File uploaded successfully!';
      messageElement.style.color = 'green';
    })
    .catch(error => {
      console.error('Error:', error);
      messageElement.textContent = 'Error uploading file.';
      messageElement.style.color = 'red';
    });
  }
  