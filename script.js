// Ambil elemen dari HTML
const form = document.querySelector("form");
const resultDiv = document.querySelector(".result");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Supaya tidak reload halaman

  const urlInput = form.querySelector("input[name='url']").value;

  // Panggil backend kamu
  resultDiv.innerHTML = `<p>Sedang memproses...</p>`;
  try {
    const response = await fetch(`/download?url=${encodeURIComponent(urlInput)}`);
    const data = await response.json();

    if (data.download_url) {
      resultDiv.innerHTML = `
        <p>Link siap diunduh:</p>
        <a href="${data.download_url}" target="_blank" class="download-link" download>Download</a>
        <br><br>
        <video width="300" controls>
          <source src="${data.download_url}" type="video/mp4">
          Browser Anda tidak mendukung tag video.
        </video>
      `;
    } else if (data.error) {
      resultDiv.innerHTML = `<p>Error: ${data.error}</p>`;
    } else {
      resultDiv.innerHTML = `<p>Gagal mendapatkan link download.</p>`;
    }
  } catch (err) {
    resultDiv.innerHTML = `<p>Error: ${err.message}</p>`;
  }
});
