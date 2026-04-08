import { useState, useEffect } from "react";

const BASE_API = "/api/v1/aids-deaths-stats";

const ESTADOS = {
  200: "200 - OK: La operación fue un éxito",
  201: "201 - Created: Creado correctamente",
  400: "400 - Bad Request: Incompatibilidad en los datos enviados",
  404: "404 - Not Found: El recurso no existe",
  405: "405 - Method Not Allowed: No puedes realizar esa operación",
  409: "409 - Conflict: Conflicto, ya existe en la base de datos",
  500: "500 - Internal Server Error: Error interno en el servidor",
};

const EMPTY = {
  country: "", codecountry: "", year: "",
  death_count_hiv_aids_under_5: 0,
  death_count_hiv_aids_70_plus: 0,
  death_count_hiv_aids_5_14: 0,
  death_count_hiv_aids_15_49: 0,
  death_count_hiv_aids_50_69: 0,
};

const LIMIT = 10;

export default function AidsDeathsStats() {
  const [datos, setDatos] = useState([]);
  const [status, setStatus] = useState(null);
  const [newRow, setNewRow] = useState(EMPTY);
  const [page, setPage] = useState(0);

  async function getDatos(p = page) {
    const res = await fetch(`${BASE_API}?limit=${LIMIT}&offset=${LIMIT * p}`);
    setDatos(await res.json());
  }

  useEffect(() => { getDatos(); }, [page]);

  async function loadInitial() {
    const res = await fetch(BASE_API + "/loadInitialData");
    setStatus(res.status);
    if (res.ok) getDatos();
  }

  async function add() {
    if (!newRow.country || !newRow.codecountry || !newRow.year) {
      setStatus(400); return;
    }
    const res = await fetch(BASE_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRow),
    });
    setStatus(res.status);
    if (res.status === 201) { setNewRow(EMPTY); getDatos(); }
  }

  async function del(code, yr) {
    if (!confirm("¿Borrar este registro?")) return;
    const res = await fetch(`${BASE_API}/${code}/${yr}`, { method: "DELETE" });
    setStatus(res.status);
    if (res.ok) getDatos();
  }

  async function delAll() {
    if (!confirm("¿Borrar TODOS los registros?")) return;
    const res = await fetch(BASE_API, { method: "DELETE" });
    setStatus(res.status);
    if (res.ok) { setPage(0); getDatos(0); }
  }

  const set = (field) => (e) =>
    setNewRow((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div style={{ padding: 16, fontFamily: "sans-serif" }}>
      <h1>Muertes por SIDA</h1>
      <button onClick={loadInitial}>Cargar datos iniciales</button>{" "}
      <button onClick={delAll}>Borrar todo</button>

      <hr />

      <table border="1" cellPadding="4" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>País</th><th>Código</th><th>Año</th>
            <th>&lt;5</th><th>&gt;70</th><th>5–14</th><th>15–49</th><th>50–69</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((d) => (
            <tr key={d.codecountry + d.year} data-testid="dataRow">
              <td>{d.country}</td>
              <td>{d.codecountry}</td>
              <td>{d.year}</td>
              <td>{d.death_count_hiv_aids_under_5}</td>
              <td>{d.death_count_hiv_aids_70_plus}</td>
              <td>{d.death_count_hiv_aids_5_14}</td>
              <td>{d.death_count_hiv_aids_15_49}</td>
              <td>{d.death_count_hiv_aids_50_69}</td>
              <td>
                <button onClick={() => del(d.codecountry, d.year)}>Borrar</button>{" "}
                <button onClick={() => window.location.href = `/react/${d.codecountry}/${d.year}`}>Editar</button>
              </td>
            </tr>
          ))}

          {/* FILA AÑADIR */}
          <tr>
            <td><input data-testid="paisInput"       value={newRow.country}     onChange={set("country")} placeholder="País" /></td>
            <td><input data-testid="codigoPaisInput" value={newRow.codecountry} onChange={set("codecountry")} placeholder="Código" /></td>
            <td><input data-testid="añoInput"        type="number" value={newRow.year} onChange={set("year")} placeholder="Año" /></td>
            <td><input data-testid="under5Input"     type="number" value={newRow.death_count_hiv_aids_under_5} onChange={set("death_count_hiv_aids_under_5")} /></td>
            <td><input data-testid="plus70Input"     type="number" value={newRow.death_count_hiv_aids_70_plus} onChange={set("death_count_hiv_aids_70_plus")} /></td>
            <td><input data-testid="5-14Input"       type="number" value={newRow.death_count_hiv_aids_5_14}   onChange={set("death_count_hiv_aids_5_14")} /></td>
            <td><input data-testid="15-49Input"      type="number" value={newRow.death_count_hiv_aids_15_49}  onChange={set("death_count_hiv_aids_15_49")} /></td>
            <td><input data-testid="50-69Input"      type="number" value={newRow.death_count_hiv_aids_50_69}  onChange={set("death_count_hiv_aids_50_69")} /></td>
            <td><button onClick={add}>+ Añadir</button></td>
          </tr>
        </tbody>
      </table>

      {/* PAGINACIÓN */}
      <p>
        <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>← Anterior</button>{" "}
        Página {page + 1}{" "}
        <button onClick={() => setPage((p) => p + 1)} disabled={datos.length < LIMIT}>Siguiente →</button>
      </p>

      {/* CÓDIGOS DE ESTADO */}
      <hr />
      <h2>Códigos de estado</h2>
      {status && <p><strong>Último resultado:</strong> {ESTADOS[status] ?? `${status} - Respuesta desconocida`}</p>}
      
    </div>
  );
}