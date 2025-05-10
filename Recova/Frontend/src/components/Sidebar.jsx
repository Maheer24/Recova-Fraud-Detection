import React from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Alert,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  CubeTransparentIcon,
} from "@heroicons/react/24/outline";
import { RiSparkling2Fill } from "react-icons/ri";
import { MdHomeFilled } from "react-icons/md";
 
export default function Sidebar() {
  const [open, setOpen] = React.useState(0);
  const [openAlert, setOpenAlert] = React.useState(true);
 
  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };
 
  return (
    <Card className="h-[calc(100vh-2rem)] dark:bg-secondary fixed rounded-lg w-full max-w-[15rem] p-1 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 flex items-center  gap-4 p-2">
        {/* <img src="https://docs.material-tailwind.com/img/logo-ct-dark.png" alt="brand" className="h-8 w-8" /> */}
        {/* <Typography variant="h5" color="blue-gray">
          Sidebar
        </Typography> */}
      </div>
      <List>
        <Accordion
          open={open === 1}
       
        >
        <a href="/profile">
            <ListItem className="p-0  dark:text-white" selected={open === 1}>
            <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3">
              <ListItemPrefix>
               <MdHomeFilled />
              </ListItemPrefix>
              <Typography  className="mr-auto   text-sm text-black dark:text-white font-light tracking-wider font-poppinsLight ">
                Home
              </Typography>
            </AccordionHeader>
          </ListItem>
        </a>
          {/* <AccordionBody className="py-1">
            <List className="p-0">
              <ListItem>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5 " />
                </ListItemPrefix>
                Analytics
              </ListItem>
              <ListItem>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Reporting
              </ListItem>
              <ListItem>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Projects
              </ListItem>
            </List>
          </AccordionBody> */}
        </Accordion> 
      
       
        <a href="/ai">
          <ListItem className="text-black dark:text-white text-sm  font-poppinsLight tracking-wider">
          <ListItemPrefix>
            <RiSparkling2Fill />
          </ListItemPrefix>
          Assistant
          {/* <ListItemSuffix>
            <Chip value="14" size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
          </ListItemSuffix> */}
        </ListItem>
        </a>
        <ListItem className="text-black dark:text-white text-sm font-poppinsLight tracking-wider ">
          <ListItemPrefix>
            <UserCircleIcon className="h-5 w-5" />
          </ListItemPrefix>
          Profile
        </ListItem>
        <ListItem className="text-black dark:text-white text-sm font-poppinsLight tracking-wider ">
          <ListItemPrefix>
            <Cog6ToothIcon className="h-5 w-5" />
          </ListItemPrefix>
          Settings
        </ListItem>
        
      </List>
  
    </Card>
  );
}