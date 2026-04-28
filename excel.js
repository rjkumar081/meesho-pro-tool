document.getElementById("excelUpload").addEventListener("change", e => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = evt => {
    const rows = evt.target.result.split("\n").map(r => {
      let c = r.split(",");
      return { title: c[0], price: c[1], category: c[2] };
    });

    localStorage.setItem("excelData", JSON.stringify(rows));
    alert("Excel Loaded");
  };

  reader.readAsText(file);
});
