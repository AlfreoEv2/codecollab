import "./Menu.css";

interface MenuProps {
  items: { label: string }[];
}

const Menu = ({ items }: MenuProps) => {
  return (
    <div className="menu">
      <div className="separator"></div>
      {items.map((item, index) =>
        item.label === "Separator" ? (
          <div key={index} className="separator"></div>
        ) : (
          <button key={index}>{item.label}</button>
        )
      )}
    </div>
  );
};

export default Menu;
