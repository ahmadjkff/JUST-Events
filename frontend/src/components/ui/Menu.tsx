import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "./Button";

function Menu({
  title,
  items,
  selected,
  setSelected,
  className,
}: {
  title: string;
  items: string[];
  selected: string;
  setSelected: (item: string | null) => void;
  className?: string;
}) {
  const handleSelect = (item: string) => {
    item === title ? setSelected(null) : setSelected(item);
  };
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline" className={className}>
          {selected || title}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        color="popper"
        sideOffset={5}
        className="min-w-[160px]"
      >
        <DropdownMenu.Item
          key={0}
          className="bg-accent p-2 hover:bg-gray-200 cursor-pointer"
          onClick={() => handleSelect(title)}
        >
          {title}
        </DropdownMenu.Item>
        {items.map((item, index) => (
          <DropdownMenu.Item
            key={index}
            className="bg-accent p-2 hover:bg-gray-200 cursor-pointer"
            onClick={() => handleSelect(item)}
          >
            {item}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

export default Menu;
