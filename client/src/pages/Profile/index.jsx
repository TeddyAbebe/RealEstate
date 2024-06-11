import { useSelector } from "react-redux";
import { selectUser } from "../../redux/user/selectors";

export default function Profile() {
  const { currentUser } = useSelector(selectUser);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form className="flex flex-col gap-4">
        <img
          src={currentUser.avatar}
          alt="Profile"
          className="rounded-full w-24 h-24 object-cover cursor-pointer self-center mt-2"
        />

        <input
          type="text"
          id="username"
          placeholder="User Name"
          className="border p-3 rounded-lg"
        />

        <input
          type="email"
          id="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
        />

        <input
          type="password"
          id="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
        />

        <button
          // disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {/* {loading ? "Loading..." : "Update"} */}
          Update
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
