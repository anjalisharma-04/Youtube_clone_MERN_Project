import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar, Sidebar } from "./components";

const App = () => {
  const location = useLocation();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [searchInput, setSearchInput] = useState("");

  const isWatchPage = location.pathname.startsWith("/watch");

  // Handle changes in the search bar
  const updateSearchInput = (input) => {
    setSearchInput(input);
  };

  // Sidebar visibility logic
  useEffect(() => {
    const adjustSidebar = () => {
      if (isWatchPage || window.innerWidth < 769) {
        setIsSidebarVisible(false);
      } else {
        setIsSidebarVisible(true);
      }
    };

    adjustSidebar(); // Run on mount
    window.addEventListener("resize", adjustSidebar);

    return () => {
      window.removeEventListener("resize", adjustSidebar);
    };
  }, [isWatchPage]);

  return (
    <>
      <Navbar
        openChange={() => setIsSidebarVisible((prev) => !prev)}
        onSearch={updateSearchInput}
      />

      <div
        className={`flex pt-8 overflow-hidden bg-white ${
          isWatchPage && isSidebarVisible ? "relative" : ""
        }`}
      >
        <Sidebar hidden={isSidebarVisible} />

        <div
          id="main-content"
          className={`w-full h-full overflow-y-auto bg-white ${
            !isWatchPage && isSidebarVisible ? "lg:ml-52" : "ml-0"
          }`}
          style={{
            position: isWatchPage && isSidebarVisible ? "relative" : "static",
            zIndex: isWatchPage && isSidebarVisible ? 10 : "auto",
          }}
        >
          <main>
            <Outlet context={{ searchTerm: searchInput }} />
          </main>
        </div>
      </div>
    </>
  );
};

export default App;
