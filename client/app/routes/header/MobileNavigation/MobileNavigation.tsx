import Style from "./MobileNavigation.module.scss";

export default function Navigation({
  navItems,
  toggleIsdropdownOpen,
}: {
  toggleIsdropdownOpen: (e: React.MouseEvent) => void;
  navItems: { name: string; href: string }[];
}) {
  return (
    <div className={Style.Navigation__wrapper}>
      <nav className={Style.Navigation}>
        <ul className={Style.Navigation__ul}>
          {navItems.map((item) => (
            <li className={Style.Navigation__li} key={item.name}>
              <a
                className={Style.Navigation__link}
                key={item.name}
                href={item.href}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
        <div className={Style.Navigation__close} onClick={toggleIsdropdownOpen}>
          <span className={Style.Navigation__close__span}></span>
          <span className={Style.Navigation__close__span}></span>
        </div>
      </nav>
    </div>
  );
}
