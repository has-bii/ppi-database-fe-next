import Layout from "@components/Layout";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-wrap">
        <div className="w-full flex divide-x-2 divide-black h-[calc(100vh-84px)]">
          <div className="self-center block w-full px-12 lg:w-2/5">
            <h1 className="mb-5 text-4xl font-light text-center lg:text-left">
              Welcome to
              <span className="block font-extrabold text-red-900 lg:text-6xl">
                "PPI Karabük"
              </span>
            </h1>
            <p className="text-xl text-center lg:text-left">
              PPI Karabük adalah wadah berhimpunnya pelajar Indonesia di Karabük
              untuk membina anggota, pendalaman etika, ilmu, akselerasi potensi
              diri dan penyaluran aspirasi.
            </p>
            <div className="flex justify-center gap-4 mt-4 lg:justify-start">
              <Link href="/kuliah" className="_button">
                Daftar kuliah
              </Link>
              <Link href="/about" className="_button _white">
                Tentang kami
              </Link>
            </div>
          </div>
          <div className="relative hidden w-3/5 h-full lg:flex">
            <Image
              src="/image/hero.jpg"
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover "
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full gap-12 py-16 bg-black bg-center bg-no-repeat lg:py-0 lg:h-screen bg-mobile">
          <h2 className="_heading2">Konten PPI Karabük</h2>
          <div className="_youtube_wrapper">
            <iframe
              src="https://www.youtube.com/embed/GwlJz_sn_RQ?controls=0"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-2 border-black"
            ></iframe>
            <span className="_youtube_bg"></span>
          </div>
          <Link
            href="https://www.youtube.com/@mahasiswakarabuk6988"
            className="lg:text-2xl _button _white"
            target="_blank"
          >
            Youtube channel
          </Link>
        </div>
      </div>
    </Layout>
  );
}
