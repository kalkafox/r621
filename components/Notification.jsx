import { faBell, faPencil, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Color = require("color");

const Notification = ({ color, text = "Notification", icon = faCircle }) => {
  const colorApi = Color(color);
  console.log(colorApi.luminosity());
  console.log(-colorApi.luminosity());
  return (
    <div className="mx-16 my-14 w-48">
      <div
        style={{
          backgroundColor: colorApi.alpha(0.5),
          color:
            colorApi.luminosity() === 1
              ? colorApi.darken(1)
              : colorApi.isDark()
              ? colorApi.lightness(50)
              : colorApi.isLight() && colorApi.darken(0.9),
        }}
        className="absolute p-12 rounded-xl backdrop-blur-md font-[Poppins]">
        <FontAwesomeIcon className="text-4xl" icon={icon} />
        <span className="mx-4 text-2xl">{text}</span>
        <div className="right-0 bottom-0 absolute mx-2 my-1 fa-shake text-3xl">
          <FontAwesomeIcon icon={faBell} />
        </div>
      </div>
    </div>
  );
};

export default Notification;
