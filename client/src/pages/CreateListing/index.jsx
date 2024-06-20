/* eslint-disable no-unused-vars */
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { app } from "../../utils/firebase";
import Delete from "../../assets/icon/Delete.json";
import Lottie from "lottie-react";
export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [upLoading, setUploading] = useState(false);

  const handleImagesSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image Upload failed (2 mb max per image).");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only update 6 images per listings !");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);

      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress} % done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7 ">
        Create a Listing
      </h1>

      <form className="flex flex-col sm:flex-row gap-10">
        <div className="flex flex-col flex-1 gap-4">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg outline-none"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg outline-none"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg outline-none"
            id="address"
            required
          />

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5 outline-none" />
              <span>Sell</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5 outline-none" />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5 outline-none"
              />
              <span>Parking Spot</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5 outline-none"
              />
              <span>Furnished</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5 outline-none" />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2 w-full justify-around">
              <div className="flex flex-row flex-1 items-center gap-2">
                <input
                  type="number"
                  id="bedRooms"
                  min="1"
                  max="10"
                  required
                  className="px-2 py-1 border border-gray-300 rounded outline-none text-sm w-20"
                />
                <p>Beds</p>
              </div>

              <div className="flex flex-row flex-1 items-center gap-2">
                <input
                  type="number"
                  id="bathRooms"
                  min="1"
                  max="10"
                  required
                  className="px-2 py-1 border border-gray-300 rounded outline-none text-sm w-20"
                />
                <p>Baths</p>
              </div>
            </div>

            <div className="flex gap-2 w-full justify-around">
              <div className="flex flex-row flex-1 items-center gap-2">
                <input
                  type="number"
                  id="regularPrice"
                  required
                  className="px-2 py-1 border border-gray-300 rounded outline-none text-sm w-20"
                />

                <div className="flex flex-col items-center">
                  <p className="text-sm font-bold">Regular Price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>

              <div className="flex flex-row flex-1 items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  required
                  className="px-2 py-1 border border-gray-300 rounded outline-none text-sm w-20"
                />

                <div className="flex flex-col items-center">
                  <p className="text-sm font-bold">Discounted Price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <div className="flex items-center gap-1">
            <FaInfoCircle />
            <span className="font-normal text-gray-600">
              The first image will be the cover (max-6)
            </span>
          </div>

          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="px-3 py-1 border border-gray-300 w-full rounded"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />

            <button
              type="button"
              disabled={upLoading}
              onClick={handleImagesSubmit}
              className="px-3 w-36 py-1 text-sm text-green-700 hover:text-white hover:bg-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 "
            >
              {upLoading ? (
                <div className="flex">
                  <p className="">Uploading</p>
                  <span className="dot-animate">..</span>
                </div>
              ) : (
                "Upload"
              )}
            </button>
          </div>

          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>

          {formData.imageUrls.length > 0 ? (
            <div className="h-[15rem] overflow-y-scroll">
              {formData.imageUrls.map((url, index) => (
                <div
                  className="flex justify-between p-3 border items-center"
                  key={url}
                >
                  <img
                    src={url}
                    alt="Listing Image"
                    className="w-20 h-16 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="text-red-700 rounded-lg uppercase hover:opacity-95 hover:bg-slate-950 h-10 pb-4 flex items-center justify-center"
                  >
                    <Lottie
                      animationData={Delete}
                      style={{ width: 50, height: 50 }}
                      loop={true}
                      autoplay={true}
                    />
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
