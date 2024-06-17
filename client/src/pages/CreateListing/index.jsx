import { FaInfoCircle } from "react-icons/fa";

export default function CreateListing() {
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
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bedRooms"
                  min="1"
                  max="10"
                  required
                  className="px-2 py-1 border border-gray-300 rounded outline-none text-sm"
                />
                <p>Beds</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bathRooms"
                  min="1"
                  max="10"
                  required
                  className="px-2 py-1 border border-gray-300 rounded outline-none text-sm"
                />
                <p>Baths</p>
              </div>
            </div>

            <div className="flex gap-2 w-full justify-around">
              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-col items-center">
                  <p>Regular Price</p>
                  <span className="text-xs">($ / month)</span>
                </div>

                <input
                  type="number"
                  id="regularPrice"
                  required
                  className="px-2 py-1 border border-gray-300 rounded outline-none text-sm w-32"
                />
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  <span className="text-xs">($ / month)</span>
                </div>

                <input
                  type="number"
                  id="discountPrice"
                  required
                  className="px-2 py-1 border border-gray-300 rounded outline-none text-sm w-32"
                />
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
              className="px-3 py-1 border border-gray-300 w-full rounded"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />

            <button className="px-3 py-1 text-sm text-green-700 hover:text-white hover:bg-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
              Upload
            </button>
          </div>

          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
