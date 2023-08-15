import Image from "next/image";
import React from "react";

export default function User({ user }) {
  return (
    <div className="inline-flex items-center gap-4">
      {user ? (
        <Image
          src={user.profile_photo_url}
          width={46}
          height={46}
          className="object-cover rounded-xl"
          alt=""
        />
      ) : (
        <Image
          src="/image/dummy-pp.jpeg"
          width={46}
          height={46}
          className="object-cover rounded-full"
          alt=""
        />
      )}

      <div>
        <p className="font-bold">{user ? user.name : "Loading..."}</p>
        <p className="text-sm font-semibold secondary">
          {user ? user.role.name : "Loading..."}
        </p>
      </div>
    </div>
  );
}
