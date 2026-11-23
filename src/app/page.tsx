import HeroSection from "@/components/Hero";
import NewArrivals from "@/components/new-arrivals";

export const metadata = { title: "BookNook | Home" };

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <NewArrivals/>
    </>
  );
}