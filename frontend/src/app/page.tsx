import Image from "next/image";
import styles from "./page.module.css";
import ModuleDashboard from "@/components/moduleDashboard";

export default function Home() {
  return (
    <div className="mx-auto">
      <ModuleDashboard />
    </div>
  );
}
