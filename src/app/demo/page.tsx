import { TacticViewer } from "@/features/tactic/components/TacticViewer";
import { DEMO_TACTIC } from "@/features/tactic/lib/demoTactic";

export const metadata = {
  title: "Démo : Pick & Roll",
};

export default function DemoPage() {
  return (
    <TacticViewer
      id="demo"
      name="Pick & Roll (démo)"
      data={DEMO_TACTIC}
      autoPlay
      loop
    />
  );
}
