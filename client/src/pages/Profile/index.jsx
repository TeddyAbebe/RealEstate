import { useSelector } from "react-redux";
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

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector(selectUser);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  useEffect(() => {
    if (file) {
      setFilePercentage(0);
      setFileUploadError(false);
      handleFileUpload(file);
    }
  }, [file]);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7"></h1>
      <form className="flex flex-col gap-4">
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

        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
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
