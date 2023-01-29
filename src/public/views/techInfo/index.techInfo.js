const tbody = document.querySelector('#tableBody');
const { origin } = window.location;
document.addEventListener('DOMContentLoaded', async (e) => {
  const response = await fetch(`${origin}/api/v1/test/tech-info`);
  const data = await response.json();

  tbody.innerHTML = `<tr class = "trData">
    <th>Argumentos</th>
    <td></td>
  </tr>
  <tr class = "trData">
    <th class = "tableHead">Ruta de Ejecución</th>
    <td>${data.exec}</td>
  </tr>
  <tr class = "trData">
    <th class = "tableHead">Plataforma</th>
    <td>${data.platform}</td>
  </tr>
  <tr class = "trData">
    <th class = "tableHead">Process ID</th>
    <td>${data.processId}</td>
  </tr>
  <tr class = "trData">
    <th class = "tableHead">Node Version</th>
    <td>${data.nodeVersion}</td>
  </tr>
  <tr class = "trData">
    <th class = "tableHead">Carpeta Proyecto</th>
    <td>${data.directory}</td>
  </tr>
  <tr class = "trData">
    <th class = "tableHead">Memoria Total Reservada</th>
    <td>${data.memoryUsage}</td>
  </tr>
  <tr class = "trData">
    <th class = "tableHead">Nucleos disponibles en el servidor</th>
    <td>${data.cpuCore}</td>
  </tr>
  <tr class = "trData">
    <th class = "tableHead">Nucleos disponibles en el servidor</th>
  <td>${data.cpuCore}</td>
</tr>`;
});
