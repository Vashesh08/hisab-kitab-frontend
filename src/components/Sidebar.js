import React from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  BookOpenIcon,
} from "@heroicons/react/24/solid";
import {
  ChevronRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
 
export default function Sidebar({ changeVisibility, isVisible }) {
  const [open, setOpen] = React.useState(0);
 
  const changePage = (value) => {
    changeVisibility(value);
  }

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };
  return (
    <Card className="rounded-none	bg-gray-800 text-white	h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-gray-800/5">
      <List 
      // className="divide-y divide-solid"
      >
        <Accordion
          open={open === 1}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto break-all h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`}
            />
          }
        >
          <ListItem className="p-0" selected={open === 1}>
            <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3 text-white hover:text-black active:text-black">
              <ListItemPrefix>
                <BookOpenIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Typography className="mr-auto font-normal">
                Utilites
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0 items-center">
              <ListItem className="w-10/12 text-[#ABD6DFFF] hover:text-black active:text-black">
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Analytics
              </ListItem>
              <ListItem className="w-10/12 text-[#ABD6DFFF] hover:text-black active:text-black">
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Reporting
              </ListItem>
              <ListItem className="w-10/12 text-[#ABD6DFFF] hover:text-black active:text-black">
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Projects
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>
          {isVisible ? (
            <>
            <Accordion
            open={open === 2}
            icon={
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`mx-auto h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""}`}
              />
            }
          >
            <ListItem className="p-0" selected={open === 2}>
            <AccordionHeader onClick={() => handleOpen(2)} className="border-b-0 p-3 text-white hover:text-black active:text-black">
              <ListItemPrefix>
                <BookOpenIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Typography className="mr-auto font-normal">
                Books
              </Typography>
            </AccordionHeader>
          </ListItem>
          
            <AccordionBody className="py-1">
              <List className="p-0 items-center">
              <ListItem onClick={() => changePage("balancesheet")}
                className="text-[#ABD6DFFF] w-10/12 hover:text-black active:text-black">
                  Balance Sheet
                </ListItem>
                <ListItem onClick={() => changePage("masterstock")}
                className="text-[#ABD6DFFF] w-10/12 hover:text-black active:text-black">
                  Master Stock
                </ListItem>
                <ListItem onClick={() => changePage("meltingbook")} className="text-[#ABD6DFFF] w-10/12 hover:text-black active:text-black">
                  Melting Book
                </ListItem>
                <ListItem onClick={() => changePage("kareegardetails")} className="text-[#ABD6DFFF] w-10/12 hover:text-black active:text-black">
                  Kareegar Book
                </ListItem>
                <ListItem onClick={() => changePage("polish")} className="text-[#ABD6DFFF] w-10/12 hover:text-black active:text-black">
                  Polish Book
                </ListItem>
                <ListItem onClick={() => changePage("lossacct")} className="text-[#ABD6DFFF] w-10/12 hover:text-black active:text-black">
                  Loss Book
                </ListItem>
              </List>
            </AccordionBody>
            </Accordion>
          {/* <Accordion
            open={open === 3}
            icon={
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`mx-auto h-4 w-4 transition-transform ${open === 3 ? "rotate-180" : ""}`}
              />
            }
          >
            <ListItem className="p-0" selected={open === 3}>
            <AccordionHeader onClick={() => handleOpen(3)} className="border-b-0 p-3 text-white hover:text-black active:text-black">
              <ListItemPrefix>
                <BookOpenIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Typography className="mr-auto font-normal">
                Govind Book
              </Typography>
            </AccordionHeader>
          </ListItem>
          
            <AccordionBody className="py-1">
              <List className="p-0 items-center">
                <ListItem onClick={() => changePage("govindmeltingbook")}
                  className="text-[#ABD6DFFF] w-10/12 hover:text-black active:text-black">
                    Melting Book
                </ListItem>
                <ListItem onClick={() => changePage("govindtarpatta")}
                  className="text-[#ABD6DFFF] w-10/12 hover:text-black active:text-black">
                    Tar Patta
                </ListItem>
                <ListItem onClick={() => changePage("govindmachine")}
                  className="text-[#ABD6DFFF] w-10/12 hover:text-black active:text-black">
                    Machine
                </ListItem>
                <ListItem onClick={() => changePage("govinddaibhukha")}
                  className="text-[#ABD6DFFF] w-10/12 hover:text-black active:text-black">
                    Dai + Bhukha
                </ListItem>
                <ListItem onClick={() => changePage("govinddai")}
                  className="text-[#ABD6DFFF] w-10/12 hover:text-black active:text-black">
                    Dai + (83.50 + 75 A/C)
                </ListItem>
              </List>
            </AccordionBody>
            </Accordion> */}
            <Accordion
            open={open === 4}
            icon={
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`mx-auto h-4 w-4 transition-transform ${open === 4 ? "rotate-180" : ""}`}
              />
            }
          >
            <ListItem className="p-0" selected={open === 4}>
            <AccordionHeader onClick={() => handleOpen(4)} className="border-b-0 p-3 text-white hover:text-black active:text-black">
              <ListItemPrefix>
                <BookOpenIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Typography className="mr-auto font-normal">
                Vijay Book
              </Typography>
            </AccordionHeader>
          </ListItem>
          
            <AccordionBody className="py-1">
              <List className="p-0 items-center">
                <ListItem onClick={() => changePage("vijaymeltingbook")}
                  className="text-[#ABD6DFFF] w-10/12 hover:text-black active:text-black">
                    Melting Book
                </ListItem>
                <ListItem onClick={() => changePage("vijaytarpatta")}
                  className="text-[#ABD6DFFF] w-10/12 hover:text-black active:text-black">
                    Tar Patta
                </ListItem>
              </List>
            </AccordionBody>
            </Accordion>
 
            </>
          ):(
            <></>
          )}
  </List>
  </Card>
  );
}