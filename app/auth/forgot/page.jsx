import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export const metadata = {
  title: "Forgot Password | PPI Karabuk",
};

export default function page() {
  return (
    <div className="_card">
      <div className="mb-4 text-2xl font-bold text-center">
        Forgot Password?
      </div>
      <form>
        <div className="_form-input">
          <label htmlFor="email" className="_label-input">
            email
          </label>
          <input
            type="email"
            className="_input"
            id="email"
            placeholder="Enter email address"
            required
          />
        </div>
        <button type="submit" className="mt-2 mb-4 _button">
          <FontAwesomeIcon icon={faArrowRightToBracket} />
          Reset password
        </button>
        <div className="text-sm text-center text-gray-400">
          Already have an account?
        </div>
        <div className="flex justify-center w-full">
          <Link href="/auth" className="text-center _link">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
