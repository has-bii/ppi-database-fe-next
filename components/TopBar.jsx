import { useRouter } from "next/router";
import User from "./User";
import { useSession } from "./UserProvider";
import Notifications from "./Notifications";
import SearchBar from "./SearchBar";
import CaretUser from "./CaretUser";

export default function TopBar() {
  const { user } = useSession();
  const router = useRouter();
  const path = router.pathname.split("/").reverse();

  return (
    <div className="flex-row items-center flex gap-4 px-4 py-2 lg:pl-0">
      {/* Path site */}
      <div>
        <h4 className="capitalize">{path[0]}</h4>
      </div>

      <SearchBar className="ml-auto" />

      <Notifications className="ml-auto lg:ml-0" />

      <User user={user} showName={true} showDropdown={true} />

      <CaretUser />
    </div>
  );
}
