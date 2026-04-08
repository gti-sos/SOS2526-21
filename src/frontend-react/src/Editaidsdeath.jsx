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

export default function EditAidsDeath({ codecountry, year }) {
  const [status, setStatus] = useState(null);
  const [dato, setDato] = useState({
    country: "", codecountry: "", year: "",
    death_count_hiv_aids_under_5: 0,
    death_count_hiv_aids_70_plus: 0,
    death_count_hiv_aids_5_14: 0,
    death_count_hiv_aids_15_49: 0,
    death_count_hiv_aids_50_69: 0,
  });

  useEffect(() => {
    fetch(`${BASE_API}/${codecountry}/${year}`)
      .then((r) => r.json())
      .then(setDato);
  }, []);

  async function guardar() {
    const res = await fetch(`${BASE_API}/${codecountry}/${year}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dato),
    });
    setStatus(res.status);
    if (res.ok) {
      const data = await res.json();
      setDato(data);
    }
  }

  const set = (field) => (e) =>
    setDato((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div style={{ padding: 16, fontFamily: "sans-serif" }}>
      <button onClick={() => window.location.href = '/react'}>← Volver</button>
      <h1>Editar registro — {codecountry} / {year}</h1>

      <p>
        <label>País <input value={dato.country} readOnly /></label>{" "}
        <label>Código <input value={dato.codecountry} readOnly /></label>{" "}
        <label>Año <input type="number" value={dato.year} readOnly /></label>
      </p>

      <p>
        <label>
          &lt;5 años{" "}
          <input data-testid="under5Input" type="number" min="0"
            value={dato.death_count_hiv_aids_under_5}
            onChange={set("death_count_hiv_aids_under_5")} />
        </label>{" "}
        <label>
          5–14 años{" "}
          <input data-testid="5-14Input" type="number" min="0"
            value={dato.death_count_hiv_aids_5_14}
            onChange={set("death_count_hiv_aids_5_14")} />
        </label>{" "}
        <label>
          15–49 años{" "}
          <input data-testid="15-49Input" type="number" min="0"
            value={dato.death_count_hiv_aids_15_49}
            onChange={set("death_count_hiv_aids_15_49")} />
        </label>{" "}
        <label>
          50–69 años{" "}
          <input data-testid="50-69Input" type="number" min="0"
            value={dato.death_count_hiv_aids_50_69}
            onChange={set("death_count_hiv_aids_50_69")} />
        </label>{" "}
        <label>
          &gt;70 años{" "}
          <input data-testid="plus70Input" type="number" min="0"
            value={dato.death_count_hiv_aids_70_plus}
            onChange={set("death_count_hiv_aids_70_plus")} />
        </label>
      </p>

      <button onClick={guardar}>Guardar cambios</button>{" "}
      <button onClick={() => window.location.href = '/react'}>Cancelar</button>

      {/* CÓDIGOS DE ESTADO */}
      <hr />
      <h2>Códigos de estado</h2>
      {status && (
        <p><strong>Último resultado:</strong> {ESTADOS[status] ?? `${status} - Respuesta desconocida`}</p>
      )}
      
    </div>
  );
}