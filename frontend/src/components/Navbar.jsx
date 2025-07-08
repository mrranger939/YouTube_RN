import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUserCircle,
  faVideo,
  faMagnifyingGlass,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import {
  Modal,
  ModalContent,
  Button,
  useDisclosure,
  Link,
} from "@heroui/react";
import LoginComponent from "./LoginComponent";
import SignupComponent from "./SignupComponent";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/AuthContext";

export default function Navbar({ onMenuClick }) {
  const { profilePic, logout, isAuthenticated } = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [showLogin, setShowLogin] = useState(true);
  return (
    <nav className="fixed w-full bg-white " style={{ zIndex: 50 }}>
      <div className="flex items-center justify-between px-4 py-2">
        <button
          id="menu"
          title="Menu"
          className="text-gray-700 px-2 mr-2"
          onClick={onMenuClick}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <a className="flex items-center px-2 min-w-[80px]" href="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="yt-ringo2-svg_yt8"
            width="93"
            height="20"
            viewBox="0 0 93 20"
            focusable="false"
            aria-hidden="true"
            style={{
              pointerEvents: "none",
              display: "inherit",
              width: "100%",
              height: "100%",
            }}
          >
            <g>
              <path
                d="M14.4848 20C14.4848 20 23.5695 20 25.8229 19.4C27.0917 19.06 28.0459 18.08 28.3808 16.87C29 14.65 29 9.98 29 9.98C29 9.98 29 5.34 28.3808 3.14C28.0459 1.9 27.0917 0.94 25.8229 0.61C23.5695 0 14.4848 0 14.4848 0C14.4848 0 5.42037 0 3.17711 0.61C1.9286 0.94 0.954148 1.9 0.59888 3.14C0 5.34 0 9.98 0 9.98C0 9.98 0 14.65 0.59888 16.87C0.954148 18.08 1.9286 19.06 3.17711 19.4C5.42037 20 14.4848 20 14.4848 20Z"
                fill="#FF0033"
              ></path>
              <path d="M19 10L11.5 5.75V14.25L19 10Z" fill="white"></path>
            </g>
            <g id="youtube-paths_yt8">
              <path d="M37.1384 18.8999V13.4399L40.6084 2.09994H38.0184L36.6984 7.24994C36.3984 8.42994 36.1284 9.65994 35.9284 10.7999H35.7684C35.6584 9.79994 35.3384 8.48994 35.0184 7.22994L33.7384 2.09994H31.1484L34.5684 13.4399V18.8999H37.1384Z"></path>
              <path d="M44.1003 6.29994C41.0703 6.29994 40.0303 8.04994 40.0303 11.8199V13.6099C40.0303 16.9899 40.6803 19.1099 44.0403 19.1099C47.3503 19.1099 48.0603 17.0899 48.0603 13.6099V11.8199C48.0603 8.44994 47.3803 6.29994 44.1003 6.29994ZM45.3903 14.7199C45.3903 16.3599 45.1003 17.3899 44.0503 17.3899C43.0203 17.3899 42.7303 16.3499 42.7303 14.7199V10.6799C42.7303 9.27994 42.9303 8.02994 44.0503 8.02994C45.2303 8.02994 45.3903 9.34994 45.3903 10.6799V14.7199Z"></path>
              <path d="M52.2713 19.0899C53.7313 19.0899 54.6413 18.4799 55.3913 17.3799H55.5013L55.6113 18.8999H57.6012V6.53994H54.9613V16.4699C54.6812 16.9599 54.0312 17.3199 53.4212 17.3199C52.6512 17.3199 52.4113 16.7099 52.4113 15.6899V6.53994H49.7812V15.8099C49.7812 17.8199 50.3613 19.0899 52.2713 19.0899Z"></path>
              <path d="M62.8261 18.8999V4.14994H65.8661V2.09994H57.1761V4.14994H60.2161V18.8999H62.8261Z"></path>
              <path d="M67.8728 19.0899C69.3328 19.0899 70.2428 18.4799 70.9928 17.3799H71.1028L71.2128 18.8999H73.2028V6.53994H70.5628V16.4699C70.2828 16.9599 69.6328 17.3199 69.0228 17.3199C68.2528 17.3199 68.0128 16.7099 68.0128 15.6899V6.53994H65.3828V15.8099C65.3828 17.8199 65.9628 19.0899 67.8728 19.0899Z"></path>
              <path d="M80.6744 6.26994C79.3944 6.26994 78.4744 6.82994 77.8644 7.73994H77.7344C77.8144 6.53994 77.8744 5.51994 77.8744 4.70994V1.43994H75.3244L75.3144 12.1799L75.3244 18.8999H77.5444L77.7344 17.6999H77.8044C78.3944 18.5099 79.3044 19.0199 80.5144 19.0199C82.5244 19.0199 83.3844 17.2899 83.3844 13.6099V11.6999C83.3844 8.25994 82.9944 6.26994 80.6744 6.26994ZM80.7644 13.6099C80.7644 15.9099 80.4244 17.2799 79.3544 17.2799C78.8544 17.2799 78.1644 17.0399 77.8544 16.5899V9.23994C78.1244 8.53994 78.7244 8.02994 79.3944 8.02994C80.4744 8.02994 80.7644 9.33994 80.7644 11.7299V13.6099Z"></path>
              <path d="M92.6517 11.4999C92.6517 8.51994 92.3517 6.30994 88.9217 6.30994C85.6917 6.30994 84.9717 8.45994 84.9717 11.6199V13.7899C84.9717 16.8699 85.6317 19.1099 88.8417 19.1099C91.3817 19.1099 92.6917 17.8399 92.5417 15.3799L90.2917 15.2599C90.2617 16.7799 89.9117 17.3999 88.9017 17.3999C87.6317 17.3999 87.5717 16.1899 87.5717 14.3899V13.5499H92.6517V11.4999ZM88.8617 7.96994C90.0817 7.96994 90.1717 9.11994 90.1717 11.0699V12.0799H87.5717V11.0699C87.5717 9.13994 87.6517 7.96994 88.8617 7.96994Z"></path>
            </g>
          </svg>
        </a>
        <form className="flex flex-grow py-1 max-w-xl mx-auto">
          <input
            className="form-input px-4 py-1 w-full border border-gray-300 rounded-l-full"
            id="search_key"
            name="search_key"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button
            className="bg-gray-200 px-6 py-1 rounded-r-full"
            title="Search"
            type="submit"
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </form>
        <div className="flex items-center space-x-7 px-4">
          {isAuthenticated ? (
            <a href="/studio" className="text-gray-700" title="Upload">
              <FontAwesomeIcon icon={faVideo} />
            </a>
          ) : (
            <button
              className="text-gray-700"
              type="button"
              title="Upload"
              onClick={onOpen}
            >
              <FontAwesomeIcon icon={faVideo} />
            </button>
          )}
          <button className="text-gray-700" type="button" title="Notifications">
            <FontAwesomeIcon icon={faBell} />
          </button>
          {isAuthenticated ? (
            <Popover>
              <PopoverTrigger>
                <button
                  className="text-gray-700 rounded-full w-6 h-6"
                  type="button"
                  title="Profile"
                >
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="rounded-full w-6 h-6"
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="px-2 py-2 w-[240px]">
                  <a
                    className="relative flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300"
                    onClick={logout}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#1f1f1f"
                    >
                      <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
                    </svg>
                    <span className="ml-2 text-sm font-medium">LogOut</span>
                  </a>
                  <a
                    className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300"
                    href="/createChannel"
                  >
                    <svg
                      version="1.1"
                      id="Layer_1"
                      x="0px"
                      y="0px"
                      width="20"
                      height="20"
                      viewBox="0 0 122.88 107.78"
                      style={{ enableBackground: "new 0 0 122.88 107.78" }}
                    >
                      <g>
                        <path d="M2.1,81.26c-1.16,0-2.1-0.94-2.1-2.1c0-1.16,0.94-2.1,2.1-2.1h9.09V12.44H2.1c-1.16,0-2.1-0.94-2.1-2.1 c0-1.16,0.94-2.1,2.1-2.1h57.12V2.1c0-1.16,0.94-2.1,2.1-2.1s2.1,0.94,2.1,2.1v6.14h57.12c1.16,0,2.1,0.94,2.1,2.1 c0,1.16-0.94,2.1-2.1,2.1h-8.95v64.62h9.18c1.16,0,2.1,0.94,2.1,2.1c0,1.16-0.94,2.1-2.1,2.1H63.75v9.6 c0.1,0.07,0.2,0.15,0.29,0.23l13.12,12.48c0.84,0.8,0.87,2.12,0.07,2.96c-0.8,0.84-2.12,0.87-2.96,0.07L63.75,96.6v9.08 c0,1.16-0.94,2.1-2.1,2.1c-1.16,0-2.1-0.94-2.1-2.1V96.2L48.6,106.61c-0.84,0.8-2.17,0.76-2.96-0.07c-0.8-0.84-0.77-2.17,0.07-2.96 L58.84,91.1c0.21-0.2,0.46-0.35,0.71-0.45v-9.39H2.1L2.1,81.26z M61.44,28.04c9.28,0,16.81,7.53,16.81,16.81 c0,9.28-7.53,16.81-16.81,16.81c-9.28,0-16.81-7.53-16.81-16.81C44.63,35.57,52.16,28.04,61.44,28.04L61.44,28.04z M70.05,44.94 l-13.4-8.72v17.89L70.05,44.94L70.05,44.94z M15.39,77.06h92V12.44h-92V77.06L15.39,77.06z" />
                      </g>
                    </svg>
                    <span className="ml-2 text-sm font-medium">
                      Your Channel
                    </span>
                  </a>
                  <a
                    className="relative flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300"
                    href="#"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="20"
                      height="20"
                      viewBox="0 0 50 50"
                    >
                      <path d="M 22.205078 2 A 1.0001 1.0001 0 0 0 21.21875 2.8378906 L 20.246094 8.7929688 C 19.076509 9.1331971 17.961243 9.5922728 16.910156 10.164062 L 11.996094 6.6542969 A 1.0001 1.0001 0 0 0 10.708984 6.7597656 L 6.8183594 10.646484 A 1.0001 1.0001 0 0 0 6.7070312 11.927734 L 10.164062 16.873047 C 9.583454 17.930271 9.1142098 19.051824 8.765625 20.232422 L 2.8359375 21.21875 A 1.0001 1.0001 0 0 0 2.0019531 22.205078 L 2.0019531 27.705078 A 1.0001 1.0001 0 0 0 2.8261719 28.691406 L 8.7597656 29.742188 C 9.1064607 30.920739 9.5727226 32.043065 10.154297 33.101562 L 6.6542969 37.998047 A 1.0001 1.0001 0 0 0 6.7597656 39.285156 L 10.648438 43.175781 A 1.0001 1.0001 0 0 0 11.927734 43.289062 L 16.882812 39.820312 C 17.936999 40.39548 19.054994 40.857928 20.228516 41.201172 L 21.21875 47.164062 A 1.0001 1.0001 0 0 0 22.205078 48 L 27.705078 48 A 1.0001 1.0001 0 0 0 28.691406 47.173828 L 29.751953 41.1875 C 30.920633 40.838997 32.033372 40.369697 33.082031 39.791016 L 38.070312 43.291016 A 1.0001 1.0001 0 0 0 39.351562 43.179688 L 43.240234 39.287109 A 1.0001 1.0001 0 0 0 43.34375 37.996094 L 39.787109 33.058594 C 40.355783 32.014958 40.813915 30.908875 41.154297 29.748047 L 47.171875 28.693359 A 1.0001 1.0001 0 0 0 47.998047 27.707031 L 47.998047 22.207031 A 1.0001 1.0001 0 0 0 47.160156 21.220703 L 41.152344 20.238281 C 40.80968 19.078827 40.350281 17.974723 39.78125 16.931641 L 43.289062 11.933594 A 1.0001 1.0001 0 0 0 43.177734 10.652344 L 39.287109 6.7636719 A 1.0001 1.0001 0 0 0 37.996094 6.6601562 L 33.072266 10.201172 C 32.023186 9.6248101 30.909713 9.1579916 29.738281 8.8125 L 28.691406 2.828125 A 1.0001 1.0001 0 0 0 27.705078 2 L 22.205078 2 z M 23.056641 4 L 26.865234 4 L 27.861328 9.6855469 A 1.0001 1.0001 0 0 0 28.603516 10.484375 C 30.066026 10.848832 31.439607 11.426549 32.693359 12.185547 A 1.0001 1.0001 0 0 0 33.794922 12.142578 L 38.474609 8.7792969 L 41.167969 11.472656 L 37.835938 16.220703 A 1.0001 1.0001 0 0 0 37.796875 17.310547 C 38.548366 18.561471 39.118333 19.926379 39.482422 21.380859 A 1.0001 1.0001 0 0 0 40.291016 22.125 L 45.998047 23.058594 L 45.998047 26.867188 L 40.279297 27.871094 A 1.0001 1.0001 0 0 0 39.482422 28.617188 C 39.122545 30.069817 38.552234 31.434687 37.800781 32.685547 A 1.0001 1.0001 0 0 0 37.845703 33.785156 L 41.224609 38.474609 L 38.53125 41.169922 L 33.791016 37.84375 A 1.0001 1.0001 0 0 0 32.697266 37.808594 C 31.44975 38.567585 30.074755 39.148028 28.617188 39.517578 A 1.0001 1.0001 0 0 0 27.876953 40.3125 L 26.867188 46 L 23.052734 46 L 22.111328 40.337891 A 1.0001 1.0001 0 0 0 21.365234 39.53125 C 19.90185 39.170557 18.522094 38.59371 17.259766 37.835938 A 1.0001 1.0001 0 0 0 16.171875 37.875 L 11.46875 41.169922 L 8.7734375 38.470703 L 12.097656 33.824219 A 1.0001 1.0001 0 0 0 12.138672 32.724609 C 11.372652 31.458855 10.793319 30.079213 10.427734 28.609375 A 1.0001 1.0001 0 0 0 9.6328125 27.867188 L 4.0019531 26.867188 L 4.0019531 23.052734 L 9.6289062 22.117188 A 1.0001 1.0001 0 0 0 10.435547 21.373047 C 10.804273 19.898143 11.383325 18.518729 12.146484 17.255859 A 1.0001 1.0001 0 0 0 12.111328 16.164062 L 8.8261719 11.46875 L 11.523438 8.7734375 L 16.185547 12.105469 A 1.0001 1.0001 0 0 0 17.28125 12.148438 C 18.536908 11.394293 19.919867 10.822081 21.384766 10.462891 A 1.0001 1.0001 0 0 0 22.132812 9.6523438 L 23.056641 4 z M 25 17 C 20.593567 17 17 20.593567 17 25 C 17 29.406433 20.593567 33 25 33 C 29.406433 33 33 29.406433 33 25 C 33 20.593567 29.406433 17 25 17 z M 25 19 C 28.325553 19 31 21.674447 31 25 C 31 28.325553 28.325553 31 25 31 C 21.674447 31 19 28.325553 19 25 C 19 21.674447 21.674447 19 25 19 z"></path>
                    </svg>
                    <span className="ml-2 text-sm font-medium">Settings</span>
                  </a>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <button
              className="text-gray-700 rounded-full w-6 h-6"
              type="button"
              title="Profile"
              onClick={onOpen}
            >
              <FontAwesomeIcon icon={faUserCircle} />
            </button>
          )}

          <Modal isOpen={isOpen} backdrop={"blur"} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  {showLogin ? (
                    <>
                      <LoginComponent onClose={onClose} />
                      <p className="mt-4 text-center text-sm pb-6">
                        Don't have an account?{" "}
                        <Link
                          onClick={() => setShowLogin(!showLogin)}
                          className="text-blue-600 hover:underline"
                          style={{ cursor: "pointer" }}
                        >
                          Create account
                        </Link>
                      </p>
                    </>
                  ) : (
                    <>
                      <SignupComponent setShowLogin={setShowLogin} />
                      <p className="mt-4 text-center text-sm pb-6">
                        Already have an account?{" "}
                        <Link
                          onClick={() => setShowLogin(!showLogin)}
                          className="text-blue-600 hover:underline"
                          style={{ cursor: "pointer" }}
                        >
                          Login
                        </Link>
                      </p>
                    </>
                  )}
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
    </nav>
  );
}
