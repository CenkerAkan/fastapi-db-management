import HamburgerMenu from "../components/HamburgerMenu";

export default function FrameOnly() {
  const maxElements = 5; // Number of list elements

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
      {/* Full-Screen Rectangular Frame */}
      <div className="relative w-full h-full min-h-screen flex flex-col border-[20px] border-blue-500">
        
        {/* Embedded Header inside Frame */}
        <div className="absolute top-0 w-full flex justify-center bg-blue-500 text-white text-xl font-bold py-3">
          Frame Only Page
        </div>

        {/* Reusable Hamburger Menu */}
        <HamburgerMenu />

        {/* Full-Screen List (No Division) */}
        <div className="flex flex-col items-center justify-center flex-grow p-6">
          <p className="text-lg font-bold mb-4">Dynamic List</p>

          {/* Render List Items */}
          <ul className="w-full max-w-md space-y-4">
            {Array.from({ length: maxElements }, (_, index) => (
              <li key={index} className="flex justify-between items-center border p-3 rounded-lg shadow-md bg-white dark:bg-gray-800">
                
                {/* Left Image + Text */}
                <div className="flex flex-col items-center">
                  <img
                    src={`/images/left-${index + 1}.png`} // Replace with real image paths
                    alt={`Left ${index + 1}`}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  <p className="text-sm text-center mt-2">Left {index + 1}</p>
                </div>

                {/* Right Image + Text */}
                <div className="flex flex-col items-center">
                  <img
                    src={`/images/right-${index + 1}.png`} // Replace with real image paths
                    alt={`Right ${index + 1}`}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  <p className="text-sm text-center mt-2">Right {index + 1}</p>
                </div>

              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
