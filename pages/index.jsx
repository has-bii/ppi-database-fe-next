import Layout from "@components/Layout";
import Image from "next/image";
import Link from "next/link";
import Hero from "../public/image/hero.jpg";
import Head from "next/head";

export const album = [
  "photo_1.jpg",
  "photo_2.jpg",
  "photo_3.jpg",
  "photo_4.jpg",
  "photo_5.jpg",
  "photo_6.jpg",
  "photo_7.jpg",
  "photo_8.jpg",
  "photo_9.jpg",
  "photo_10.jpg",
  "photo_11.jpg",
  "photo_12.jpg",
  "photo_13.jpg",
  "photo_14.jpg",
  "photo_15.jpg",
  "photo_16.jpg",
];

export default function Index() {
  return (
    <Layout>
      <Head>
        <title>PPI Karabük - Perhimpunan Pelajar Indonesia di Karabük</title>
        <meta
          name="description"
          content="PPI Karabuk - PPI Karabük adalah wadah berhimpunnya pelajar Indonesia di Karabük untuk membina anggota, pendalaman etika, ilmu, akselerasi potensi diri..."
        />
      </Head>
      <div className="flex flex-wrap">
        {/* Hero */}
        <div className="w-full flex divide-x-2 divide-black h-[calc(100vh-84px)]">
          <div className="self-center block w-full px-12 lg:w-2/5">
            <h1 className="mb-5 text-4xl font-light text-center lg:text-left">
              <span className="block font-extrabold text-red-900 lg:text-6xl">
                &quot;PPI Karabük&quot;
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
              src={Hero}
              alt="hero"
              fill
              priority
              sizes="(max-width: 768px) 100vw"
              className="object-cover"
            />
          </div>
        </div>
        {/* Hero end */}

        {/* Channel YT */}
        <div className="flex flex-col items-center justify-center w-full h-full gap-4 px-4 py-6 bg-black lg:gap-10 lg:px-20 lg:py-14">
          <h2 className="text-2xl font-bold text-white lg:text-4xl">
            Konten PPI Karabük
          </h2>
          <div className="relative w-full pb-[56.25%]">
            <iframe
              src="https://www.youtube.com/embed/GwlJz_sn_RQ"
              title="YouTube video player"
              allowFullScreen
              className="absolute top-0 bottom-0 w-full h-full border-0"
            ></iframe>
          </div>
          <Link
            href="https://www.youtube.com/@mahasiswakarabuk6988"
            className="lg:text-2xl _button _white"
            target="_blank"
          >
            Youtube channel
          </Link>
        </div>
        {/* Channel YT end */}

        {/* Album */}
        <div className="flex flex-col items-center justify-center w-full gap-8 py-16 bg-white">
          <h2 className="text-black _heading2">Album</h2>
          <div className="grid w-3/4 grid-flow-col grid-rows-4 gap-2 overflow-x-auto lg:grid-rows-2 _hide_scrollbar">
            {album.map((photo, index) => (
              <div
                key={index}
                className="relative bg-black w-36 h-36 lg:h-52 lg:w-52"
              >
                <Image
                  src={`/album/${photo}`}
                  fill
                  className="object-cover"
                  alt="photo album"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL={`/album/${photo}`}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Album end */}
      </div>
    </Layout>
  );
}
