import Image from "next/image";

export default function User({ user, className, showName = false }) {
  return (
    <div className={`inline-flex items-center gap-4 ${className}`}>
      {user ? (
        <Image
          src={user.profile_photo_url}
          width={40}
          height={40}
          className="object-cover rounded-xl"
          alt=""
        />
      ) : (
        <Image
          src="/image/dummy-pp.jpeg"
          width={40}
          height={40}
          className="object-cover rounded-xl "
          alt=""
        />
      )}

      {showName && (
        <div className="text-slate-400 dark:text-white/75 hidden lg:flex">
          {user ? user.name : "Loading..."}
        </div>
      )}
    </div>
  );
}
