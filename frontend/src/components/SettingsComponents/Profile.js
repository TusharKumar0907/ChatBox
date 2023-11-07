import React, { useState,useEffect} from "react";
import { Avatar } from "@mui/material";
import { useDispatch,useSelector} from "react-redux";
import { setUser } from "../../services/Actions/User/actions";

export default function Profile() {
  const dispatch=useDispatch();
  const dataredux=useSelector((state)=>state.user.userInfo)

  const data = JSON.parse(localStorage.getItem("info"));
  const[Pic,setPic]=useState(data.pic);
  const [selectedFile, setSelectedFile] = useState(null);


  useEffect(()=>{
    if(dataredux===null)
    return;

    setPic(dataredux.pic);
  },[dataredux])

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      console.log(selectedFile);
      formData.append("photo", selectedFile);

      const cookie = localStorage.getItem("jwt");
      fetch("http://127.0.0.1:4000/api/v1/users/uploadPhoto", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          dispatch(setUser(data.data.user));
        })
        .catch((error) => {
          // Handle any errors that occur during the upload.
          console.error("Error uploading image:", error);
        });
    }
  };

  let image = Pic;
  if (Pic.startsWith("user")) image = `http://127.0.0.1:4000/${Pic}`;

  return (
    <div className="flex flex-row items-center gap-10 mt-[2%]">
      <Avatar
        referrerPolicy="no-referrer"
        alt="User-pic"
        sx={{ width: 150, height: 150 }}
        src={image}
      />
      <div className="flex justify-center flex-col gap-5">
        <label
          htmlFor="fileInput"
          className="bg-[#202142] hover:bg-[#202162] text-white cursor-pointer px-4 py-2 rounded-md font-Roboto tracking-tight"
        >
          Select Picture
        </label>
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleFileChange}
        />
        <div
          onClick={handleUpload}
          className="font-medium border-[1px] cursor-pointer border-[#000000] px-4 py-2 rounded-md font-Roboto tracking-tight"
        >
          Upload Picture
        </div>
      </div>
    </div>
  );
}
