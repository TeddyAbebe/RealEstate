import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../redux/user/selectors";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../utils/firebase";
import { CiCircleCheck } from "react-icons/ci";
import { AiFillEdit } from "react-icons/ai";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  logOutUserFailure,
  logOutUserStart,
  logOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../../redux/user/userSlice";

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector(selectUser);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Profile Picture Update
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setIsUploading(true);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },

      // eslint-disable-next-line no-unused-vars
      (error) => {
        setFileUploadError(true);
        setIsUploading(false);
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            avatar: downloadURL,
          }));
          setFilePercentage(100);

          // Simulate a delay to show the progress for small files
          setTimeout(() => {
            setIsUploading(false);
          }, 500);
        });
      }
    );
  };

  // Handle Input fields Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle Update Profile Function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  // Handle Delete Account Function
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // Handle Logout Function
  const handleLogOut = async () => {
    try {
      dispatch(logOutUserStart());

      const res = await fetch(`/api/auth/signOut`);

      const data = await res.json();

      if (data.success === false) {
        return;
      }

      dispatch(logOutUserSuccess(data));
    } catch (error) {
      dispatch(logOutUserFailure(error.message));
    }
  };

  useEffect(() => {
    if (file) {
      setFilePercentage(0);
      setFileUploadError(false);
      handleFileUpload(file);
    }
  }, [file]);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center mb-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <div
          className="relative rounded-full w-24 h-24 transition-transform duration-300 ease-in-out transform hover:scale-105 self-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt="Profile"
            className="rounded-full w-full h-full object-cover cursor-pointer transition duration-300 ease-in-out transform hover:blur-[1px]"
          />

          {isHovered && (
            <AiFillEdit
              size={28}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-700 pointer-events-none"
            />
          )}
        </div>

        <p className="text-sm self-center font-semibold tracking-wide">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image Uploading (Image must be less than 2 MB)
            </span>
          ) : isUploading ? (
            <span className="text-green-700">
              {`Uploading ${filePercentage}%`}
            </span>
          ) : filePercentage === 100 ? (
            <span className="text-green-700 flex items-center gap-1">
              <CiCircleCheck size={24} />
              Image Uploaded Successfully!
            </span>
          ) : (
            ""
          )}
        </p>

        <p className="text-red-700 self-center font-semibold tracking-wide">
          {error ? error : ""}
        </p>

        <p className="text-green-700 self-center font-semibold tracking-wide">
          {updateSuccess ? "User Updated Successfully!" : ""}
        </p>

        <input
          type="text"
          id="userName"
          placeholder="User Name"
          defaultValue={currentUser.userName}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <input
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <input
          type="password"
          id="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>

        <span onClick={handleLogOut} className="text-red-700 cursor-pointer">
          Log Out
        </span>
      </div>
    </div>
  );
}
