import { useState } from "react";
import categories from "../../../components/Header/data.js";
import { FaPlus } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { updateProfileData } from "../../../redux-toolkit/Auth/authSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { resetUpdated } from "../../../redux-toolkit/Auth/authSlice";
import { useEffect } from "react";
import { CgSpinner } from "react-icons/cg";

const ProfileEdit = ({ isOpen, onClose }) => {
  const { updated, status } = useSelector((state) => state.auth);
  const dispatch = useDispatch()

  const intrests = categories.filter((item) => item.title !== "Top Headlines")

  const [fullname, setFullname] = useState("");
  const [about, setAbout] = useState("");
  const [intrest, setIntrest] = useState([]);
  const [profileImage, setProfileImage] = useState(null);

  const toggleIntrest = (value) => {
    setIntrest((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };
  const handleSubmit = (userData) => {
    if (fullname === "") alert("Name field is required")
    else dispatch(updateProfileData(userData))
  }
  useEffect(() => {
    if (updated) {
      onClose();
      dispatch(resetUpdated());
    }
  }, [updated, dispatch, onClose]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center">
      <div className="w-full max-w-md rounded-lg m-8 p-8 text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 relative">
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-5 right-5 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-400"
        >
          <RxCross2 size={20} />
        </button>
        <h1 className="text-neutral-400 font-semibold  dark:text-neutral-500 mb-5 sm:mb-10 text-xl text-center">EDIT PROFILE</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit({ fullname, about, intrest, profileImage });
          }}
          className="space-y-5">
          <input
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            type="text"
            className="w-full rounded-lg px-4 py-3 bg-neutral-300/30 dark:bg-neutral-700/30 focus:outline-none"
            placeholder="Name"
          />
          <input
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            type="text"
            className="w-full rounded-lg px-4 py-3 bg-neutral-300/30 dark:bg-neutral-700/30 focus:outline-none"
            placeholder="About"
          />
          <div className="w-1/3 aspect-square bg-neutral-300/30 dark:bg-neutral-700/30 rounded-full flex justify-center items-center overflow-hidden">
            <label htmlFor="fileUpload" className="cursor-pointer h-full w-full flex justify-center items-center">
              {profileImage ? (
                <img
                  src={URL.createObjectURL(profileImage)}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaPlus className="text-neutral-500" />
              )}
            </label>
            <input
              id="fileUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setProfileImage(e.target.files[0])}
            />
          </div>
          <ul className="grid grid-cols-3 gap-2">
            {intrests.map((item) => (
              <li key={item.title}>
                <button
                  type="button"
                  onClick={() => toggleIntrest(item.title)}
                  className={`w-full px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-full overflow-hidden
                  ${intrest.includes(item.title)
                      ? "bg-red-500 text-white"
                      : "bg-neutral-200/30 dark:bg-neutral-700/40 text-neutral-700 dark:text-neutral-200"}`}>
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
          <button type="submit" className="w-full px-4 py-3 bg-red-500 cursor-pointer rounded-lg flex justify-center items-center">
            {status === "loading" && <CgSpinner className="animate-spin" />}
            Save
          </button>
        </form>
      </div>
    </div>
  );
};
export default ProfileEdit