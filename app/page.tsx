import CinematicHero from "@/components/scroll/CinematicHero";
import EnvironmentTransition from "@/components/scroll/EnvironmentTransition";
import CollectionReveal from "@/components/scroll/CollectionReveal";
import SignatureProducts from "@/components/scroll/SignatureProducts";
import SocialProof from "@/components/scroll/SocialProof";
import CinematicCTA from "@/components/scroll/CinematicCTA";

export default function Home() {
  return (
    <div className="relative w-full overflow-hidden bg-bg-primary">
      <CinematicHero />
      <EnvironmentTransition />
      <CollectionReveal />
      <SignatureProducts />
      <SocialProof />
      <CinematicCTA />
    </div>
  );
}
