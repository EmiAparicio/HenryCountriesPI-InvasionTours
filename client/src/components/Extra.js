// Import packages
import { Link } from "react-router-dom";

// CSS
import extraMain from "../styles/components/Extra.module.css";

const extra = extraMain; // extraMain invadedMain

export function Extra() {
  return (
    <div className={`${extra.container}`}>
      <p className={`${extra.p}`}>
        ¡Bienvenido a la aventura!
        <br />
        <br />
        Si eres quien creo que eres, y si sabes quién creo que eres, vas a saber
        a qué me refiero. Si no, ¡sigue de largo!
        <br />
        <br />
        Pero si eres... te recuerdo el protocolo de seguridad:
      </p>
      <ol className={`${extra.ol}`}>
        <li>
          Regresa a la{" "}
          <Link to="/" className={`${extra.link}`}>
            estratósfera
          </Link>
        </li>
        <li>
          Presiona <code>ctrl + x</code>
        </li>
        <li>
          Introduce nuestro código invertido{" "}
          <span className={`${extra.code}`}>NIELA</span>
        </li>
        <li>¡Y te espero aquí de regreso para el resto...!</li>
      </ol>
    </div>
  );
}
