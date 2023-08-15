import DividerVer from "./DividerVer";
import Theme from "./Theme";
import User from "./User";
import { useSession } from "./UserProvider";

export default function TopBar() {
  const { user } = useSession();

  return (
    <div className="flex-row items-center hidden lg:flex">
      <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">
        Hi, {user ? user?.name?.split(" ")[0] : "..."}
      </h1>
      <Theme />
      <DividerVer style="mr-4" />
      <User user={user} />
    </div>
  );
}
