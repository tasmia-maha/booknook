import HeroSection from "@/components/Hero";
import NewArrivals from "@/components/new-arrivals";
import HowItWorks from "@/components/how-it-works";
import GenreExplorer from "@/components/genre-explorer";



export const metadata = { title: "BookNook | Home" };

export default function HomePage() {
  return (
   <>
      
      <HeroSection />
      <NewArrivals/>
      <HowItWorks/>
      <GenreExplorer/>
     
    </>
  );
}