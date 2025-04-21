import React, { useEffect, useState } from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
  Card,
} from "@material-tailwind/react";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { MdFormatPaint } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "../../../config/axios";
import pic from "../../../assets/def.webp";
import Modal from "../../../components/Modal";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

function UserProfile() {
  const [userinfo, setuserinfo] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [profile, setprofile] = useState(pic);
  const [logout, setlogout] = useState(false)
   const [opendialog, setopendialog] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        })
        .then((res) => {
          console.log("User  data:", res.data);
          setuserinfo(res.data);
          setprofile(res.data.profilePic || pic); // Set profile picture or default to pic

          // Handle profile data here
        })
        .catch((err) => {
          console.error(err);
          // Handle errors (e.g., token is invalid or expired)
        });
    }
  }, []); // Emp
  const navigate = useNavigate();

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log("Logout button clicked");
    try {
      const token = localStorage.getItem("token");

      // 🔥 Call backend to logout (regardless of token presence)
      const response = await axios.get(
        "http://localhost:3000/api/user/logout",
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}, // Send token only if exists
          withCredentials: true, // Ensures cookies are cleared
        }
      );
      console.log("outside");

      // 🔥 Remove JWT token if exists

      localStorage.removeItem("token");
      console.log("JWT token removed");

      if (response.data.redirectUrl) {
        console.log("Redirecting to:", response.data.redirectUrl);
        window.location.href = response.data.redirectUrl; // Client-side redirection
      }
    } catch (err) {
      console.error("Logout failed:", err.message);
      console.log("Error details:", err.response || err);
    }
  };
  const openmodal = () => {
    setlogout(true);
  }
  const closeModal = () => {
    setlogout(false);
  };
  

  useEffect(
    () => async () => {
      // Fetch user profile from the backend
      await axios
        .get("/api/user/profile", { withCredentials: true })

        .then((response) => {
          console.log("✅ User Profile Data:", response.data);
          setuserinfo(response.data);
          setprofile(response.data.profilePic || pic); // Set profile picture or default to pic
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        });
    },
    []
  );
  if (!userinfo) {
    return <div>Loading...</div>;
  }

  const { email, name, profilePic } = userinfo;
  console.log("User Info:", userinfo);

  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Avatar
          onClick={handleClick}
          sx={{
            border: ".5px black solid",
            width: { md: 34, sm: 34, lg: 40 },
            height: { md: 34, sm: 34, lg: 40 },
            fontSize: { md: "1.5vw" },
          }}
          src={profilePic && profilePic !== "" ? profilePic : pic}
        >
          {" "}
        </Avatar>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <Avatar /> <p className="dropdown ">Profile</p>
        </MenuItem>
        <MenuItem>
          <Avatar /> <p className="dropdown ">My account</p>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <MdFormatPaint fontSize="large" className="iconscolor " />
          </ListItemIcon>
          <p className="dropdown ">Themes</p>
          {/* <MaterialUISwitch checked={darkMode} onChange={handleThemeChange}/> */}

          <div>
            {/* <button onClick={toggleDarkMode} className="ml-4 px-4 py-2 border rounded">
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button> */}

            {/* <MaterialUISwitch checked={darkMode} onChange={toggleDarkMode} /> */}
          </div>
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize="small" className="iconscolor " />
          </ListItemIcon>
          <p className="dropdown ">Add another account</p>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Settings className="iconscolor " fontSize="small" />
          </ListItemIcon>
          <p className="dropdown "> Settings</p>
        </MenuItem>
        <MenuItem onClick={openmodal} >
        {logout && <Modal>
      <Dialog open={opendialog} onClose={closeModal} className="relative z-10">
    <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                  <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                    You are Logging out!
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to Logout? All of your data will be permanently removed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
                Logout
              </button>
              <button
                type="button"
                data-autofocus
                onClick={closeModal}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>

          </Modal>}
          <ListItemIcon>
            <Logout className="iconscolor " fontSize="small" />
          </ListItemIcon>
          <p className="dropdown "> Logout</p>
        </MenuItem>
      </Menu>
    </div>
  );
}

export default UserProfile;
