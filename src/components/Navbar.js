import { Fragment } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
// import Sidebar from "./Sidebar.js";
import { HomeFilled } from '@ant-design/icons';

const user = {
  name: 'username',
  email: 'email@example.com',
  imageUrl:
  'profilepic.png'
}

// function handleProfileClick(){
//     console.log("Profil/ Setting CLicked")
// }

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const navigation = [
  // { index: 0, name: 'Master Stock', href: '#', current: false},
  // { index: 1, name: 'Melting Book', href: '#', current: false},
  // { index: 2, name: 'Kareegar Book', href: '#', current: false},
]


export default function Navbar(checkLoggedIn) {
 
  const handleLogoClick = () => {
    console.log("home")
    checkLoggedIn.handlePageChange("home");
  }
    // navigation[navigation_path]['current'] = true;
    // const navigate = useNavigate();
    const handleLogout = () => {
        // console.log("logging out")
        // Clear the token from localStorage
        localStorage.removeItem('token');

        // console.log(localStorage.getItem("token"));
        // Redirect the user to the login page
    //     navigate('/');
    checkLoggedIn.checkLoggedIn.checkLoggedIn();
    // checkLoggedIn.checkLoggedIn();
      };  

    const handleIndex = (index) => {
      // console.log("index", index);
      if (typeof index === 'number' && !isNaN(index) && (index >= 0) && (index < navigation.length)){
      // console.log("path", index);
      for (let i = 0; i < navigation.length; i++) {
        // console.log(i, "Er", navigation[i])
        navigation[i].current = false; 
      }
      // console.log(index, "Vash", navigation);
      navigation[index].current = true;
    }
    }
    
    const userNavigation = [
    { name: 'Sign out', href: '#', click: handleLogout},
    ]
  
  return (
    <>
      <div className="min-h-full h-16	">
        <Disclosure as="nav" className="bg-gray-800 fixed w-full z-30">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 ml-0">
                <div className="flex ml-12 h-16 items-center justify-between">
                  
                  <div className="flex items-center ">
                    <div className="flex-shrink-0 text-white">
                    MEHTA JEWELLERS
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                              'rounded-md px-3 py-2 text-sm font-medium'
                            )}
                            onClick={handleIndex(item.index)}
                            aria-current={item.current ? 'page' : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                    <div className="flex-shrink-0 text-gray-400 hover:text-white focus:outline-none">
                      <HomeFilled className="pt-1.5 pr-2 pb-1.5" style={{fontSize: "175%"}} aria-hidden="true" onClick={handleLogoClick}/>
                    </div>

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a
                                    href={item.href}
                                    className={classNames(
                                      active ? 'bg-gray-100' : '',
                                      'block px-4 py-2 text-sm text-gray-700'
                                    )}
                                    onClick={item.click}
                                  >
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      onClick={handleIndex(item.index)}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="border-t border-gray-700 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                    </div>
                    {/* <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">{user.name}</div>
                      <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                    </div> */}
                    {/* <div className="flex-shrink-0"> */}
                    {/* <button
                      type="button"
                      className="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none"
                      onClick={handleLogoClick}
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span> */}
                    <div className="ml-auto flex-shrink-0 text-gray-400 hover:text-white focus:outline-none">
                      <HomeFilled className="pt-1.5 pr-2 pb-1" style={{fontSize: "250%"}} aria-hidden="true" onClick={handleLogoClick}/>
                    </div>
                    {/* </button> */}
                    {/* </div> */}
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        onClick={item.click}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

      </div>
    </>
  )
}
