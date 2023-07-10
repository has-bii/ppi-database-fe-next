import Layout from "@components/Layout";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <Layout>
      <div>Homepage</div>
    </Layout>
  );
}
