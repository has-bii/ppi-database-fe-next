import Layout from "@components/Layout";
import Head from "next/head";
import Image from "next/image";
import React from "react";
import JalurBerkas from "@public/image/jalur-berkas.jpg";
import JalurYos from "@public/image/jalur-yos.jpg";
import ListJurusan from "@public/image/list-jurusan.jpg";

export default function index() {
  return (
    <Layout>
      <Head>
        <title>Kuliah | PPI Karabük</title>
      </Head>
      <div className="container px-6 mx-auto py-14 lg:px-20 lg:py-14">
        <h1 className="text-center _heading1">Jalur Pendaftaran</h1>
        <p className="_paragraph ">
          Untuk pendaftaran masuk perguruan tinggi negeri bagi calon mahasiswa
          asing di Turki terdapat beberapa cara. Pada umumnya terdapat dua cara,
          yaitu lewat <b>jalur berkas</b> dan <b>jalur tes tulis</b> atau
          dikenal dengan <b>YÖS</b>.
        </p>

        {/* Image */}
        <div className="flex my-8 flex-col lg:flex-row w-full gap-2 h-[32rem]">
          <div className="relative w-full h-full overflow-hidden group">
            <Image
              src={JalurBerkas}
              fill
              alt="jalur berkas"
              sizes="50vw"
              className="object-cover transition-all duration-150 ease-in group-hover:scale-125 group-hover:grayscale-0 grayscale"
            />
            <span className="absolute inline-flex items-center justify-center w-full h-full text-3xl font-bold text-white">
              Jalur Berkas
            </span>
          </div>
          <div className="relative w-full h-full overflow-hidden group">
            <Image
              src={JalurYos}
              fill
              alt="jalur berkas"
              sizes="50vw"
              className="object-cover transition-all duration-150 ease-in group-hover:scale-125 group-hover:grayscale-0 grayscale"
            />
            <span className="absolute inline-flex items-center justify-center w-full h-full text-3xl font-bold text-white">
              Jalur YÖS
            </span>
          </div>
        </div>
        {/* Image End */}

        <h2 className="_heading2">Jalur Berkas</h2>
        <p className=" _paragraph">
          <b>Jalur berkas</b> merupakan jalur yang paling mudah dan paling
          banyak diminati oleh para calon mahasiswa Turki, karena kita hanya
          perlu upload berkas-berkas yang dibutuhkan oleh pihak Universitas.
          Untuk daftar program S1 Di Karabük Üniversitesi adapun berkas yang
          dibutuhkan adalah:
        </p>
        <ol className="_paragraph">
          <li>Ijazah.</li>
          <li>Nilai transkrip.</li>
          <li>Translate bahasa Inggris ijazah.</li>
          <li>Foto biometrik.</li>
        </ol>
        <h2 className="_heading2">Jalur YÖS</h2>
        <p className=" _paragraph">
          Jika kalian ingin kuliah di jurusan seperti teknik, kedokteran dan
          sebagainya, kalian dapat mendaftar lewat ujian YÖS karena tidak semua
          jurusan dapat didapatkan lewat jalur berkas. Adapun untuk materi ujian
          yang akan diuji adalah hanya matematika saja.
        </p>
        <p className=" _paragraph">
          Kalianpun dapat mendaftar di Universitas yang berbeda menggunakan
          hasil ujian YÖS di Universitas kalian ujian. Misal, hasil ujian YÖS di
          Istanbul University dapat digunakan untuk mendaftar di Marmara
          University. Adapun untuk tempat ujian, hampir semua Universitas
          menyelenggarakan di kampusnya sendiri. Tetapi ada
          Universitas-Universitas yang menyelenggarakan ujian YÖS di Jakarta,
          seperti Istanbul University.
        </p>
        <h2 className="_heading2">List Jurusan & Biaya Kuliah</h2>
        <p className="_paragraph">
          Lingkungan perkuliahan di Karabük Üniversitesi terkenal dengan
          beragamnya ras dan agama. Bahkan setiap programnya tersedia dari
          berbagai bahasa: Turki, Inggris dan Arab. Link menyusul.
        </p>
      </div>
    </Layout>
  );
}
