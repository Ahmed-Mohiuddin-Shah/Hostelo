import Link from "next/link";
import { usePathname } from "next/navigation";
import path from "path";

interface SideBarLinkProps {
  linkName: string;
  path: string;
  Icon: React.ElementType;
}

export default function SideBarLinkSingle({
  linkName,
  Icon,
  path,
}: SideBarLinkProps) {
  const pathname = usePathname();

  return (
    <li>
      <Link
        href={path}
        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
          pathname.includes(path) && "bg-graydark dark:bg-meta-4"
        }`}
      >
        <Icon className="fill-current text-lg" />
        {linkName}
      </Link>
    </li>
  );
}
