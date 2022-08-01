// Import packages
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setAlienMode } from "../redux/actions";

// CSS
import extraMain from "../styles/components/Extra.module.css";
import invadedExtra from "../styles/components/ExtraI.module.css";

export function Extra() {
  // Alien
  const dispatch = useDispatch();
  const alienMode = useSelector((state) => state.alienMode);
  const storedMode =
    localStorage.getItem("alienMode") === "true" ? true : false;
  dispatch(setAlienMode(storedMode));

  let extra = useMemo(() => {
    return alienMode ? invadedExtra : extraMain;
  }, [alienMode]);

  const completed = localStorage.getItem("completedInvasion");

  // Render
  return (
    <>
      {extra === extraMain ? (
        <div className={`${extra.container}`}>
          <p className={`${extra.p}`}>
            ¡Bienvenido a la aventura!
            <br />
            <br />
            Si eres quien creo que eres, y si sabes quién creo que eres, vas a
            saber a qué me refiero. Si no, ¡sigue de largo!
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
              <span className={`${extra.code}`}>NEILA</span>
            </li>
            <li>¡Y te espero aquí de regreso para el resto...!</li>
            <li>
              No olvides presionar <code>ctrl + z</code> desde la{" "}
              <Link to="/" className={`${extra.link}`}>
                estratósfera
              </Link>{" "}
              para no dejar rastros de tu presencia en caso de peligro
            </li>
          </ol>
        </div>
      ) : completed ? (
        <div className={`${extra.container}`}>
          <Link to="/" className={`${extra.link}`}>
            ¡INVASIÓN COMPLETADA!
          </Link>
          <br />
          <br />
          <ul>
            <li>
              Presiona <code>ctrl + z</code> desde la{" "}
              <Link to="/" className={`${extra.link}`}>
                estratósfera
              </Link>{" "}
              para viajar a otra dimensión y continuar nuestra expansión sin
              límites
            </li>
          </ul>
        </div>
      ) : (
        <div className={`${extra.container}`}>
          <p className={`${extra.p}`}>
            ¡Ha llegado la invasión!
            <br />
            <br />
            Es hora de que termines el trabajo... ¡Únete a nuestras fuerzas!
            <br />
            <br />
            El protocolo de invasión culmina con los siguientes pasos:
          </p>
          <ol className={`${extra.ol}`}>
            <li>
              Ve a la plataforma de{" "}
              <Link to="/activities" className={`${extra.link}`}>
                invasión
              </Link>
            </li>
            <li>
              Presiona <code>ctrl + c</code>
            </li>
            <li>
              Invade con el nombre{" "}
              <span className={`${extra.code}`}>NEILA</span> a los países
              correspondientes a las 3 capitales que recibirás (la plataforma de{" "}
              <Link to="/home" className={`${extra.link}`}>
                inspección
              </Link>{" "}
              tiene pistas en la bandera indicada)
            </li>
            <li>
              Cuidado con invadir otro lugar con ese código, ¡arruinarías
              nuestros planes! Pero puedes solucionarlo desde el mismo lugar,
              presionando <code>ctrl + v</code> para distorsionar el
              espacio-tiempo y obtener otras capitales desde el pasado
            </li>
            <li>
              No olvides presionar <code>ctrl + z</code> desde la{" "}
              <Link to="/" className={`${extra.link}`}>
                estratósfera
              </Link>{" "}
              para no dejar rastros de tu presencia en caso de peligro
            </li>
            <li>
              Contempla la victoria con nosotros desde la{" "}
              <Link to="/" className={`${extra.link}`}>
                estratósfera
              </Link>
            </li>
          </ol>
        </div>
      )}{" "}
    </>
  );
}
