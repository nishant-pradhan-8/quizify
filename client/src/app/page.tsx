import HomeHeader from "./components/HomeHeader";
import UploadSection from "./components/UploadSection";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-full">

    <div className="flex flex-col items-center  max-w-[1280px] m-auto  p-4">
      <HomeHeader />
      <UploadSection />
    </div>
    </div>
  );
}
