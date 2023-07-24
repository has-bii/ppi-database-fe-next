import MyNavbar from "@components/MyNavbar";
import UserDashboard from "@components/UserDashboard";
import { fetchData } from "@lib/fetchData";
import { fetchUser } from "@lib/fetchUser";
import { hasCookie, setCookie } from "cookies-next";
import Head from "next/head";

export default function index({ user, jurusans }) {
  const submitHandler = async (e) => {
    e.preventDefault();

    console.log(e.target.name.value);
  };

  return (
    <>
      <div className="bg-base-grey">
        <Head>
          <title>My App | PPI Karabük</title>
        </Head>
        <div className="flex flex-col w-screen h-screen overflow-auto _hide_scrollbar lg:flex-row">
          <MyNavbar role_id={user.role_id} />
          <div className="flex flex-col w-full gap-4 p-4">
            {/* User info */}
            <UserDashboard pageName="Users" user={user} />

            {/* Contents */}
            <div className="_myapp_content">
              <form className="_form_container" onSubmit={submitHandler}>
                <span className="_form_header">Daftar Karabük University</span>
                <div className="_form">
                  <div className="_form_col">
                    <label htmlFor="nama">Nama</label>
                    <input
                      type="text"
                      placeholder="Nama lengkap"
                      id="nama"
                      name="name"
                      required
                    />
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      placeholder="Alamat email"
                      id="email"
                      name="email"
                      required
                    />
                    <label htmlFor="kelamin">Jenis kelamin</label>
                    <select required id="kelamin" name="jenis_kelamin">
                      <option value="">Pilih jenis kelamin</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                    <label htmlFor="tanggal-lahir">Tanggal lahir</label>
                    <input
                      type="date"
                      id="tanggal-lahir"
                      name="jenis_kelamin"
                      required
                    />
                  </div>
                  <div className="_form_col">
                    <label htmlFor="whatsapp">Nomor Whatsapp</label>
                    <input
                      type="text"
                      id="whatsapp"
                      name="whatsapp"
                      placeholder="Nomor Whatsapp dengan kode negara"
                      required
                    />
                    <label htmlFor="no-paspor">Nomor Paspor</label>
                    <input
                      type="text"
                      placeholder="Nomor paspor"
                      id="no-paspor"
                      name="no_paspor"
                    />
                    <label htmlFor="jenjang">Jenjang pendidikan</label>
                    <select id="jenjang" name="jenjang_pendidikan" required>
                      <option value="">Pendidikan yang akan ditempuh</option>
                      <option value="S1">S1</option>
                      <option value="S2">S2</option>
                      <option value="S3">S3</option>
                    </select>
                    <label htmlFor="jurusan">Jurusan</label>
                    <select id="jurusan" name="jurusan_id" required>
                      <option value="">Pilih jurusan</option>
                      {jurusans.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type="submit" className="ml-auto _green">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req, res, resolvedUrl }) {
  let cookie = hasCookie("user_token", { req, res });

  if (!cookie) {
    setCookie("callback_url", resolvedUrl, { req, res });
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  const user = await fetchUser(req, res);

  if (!user)
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };

  const jurusans = await fetchData("/jurusan", req, res);

  if (!jurusans)
    return {
      redirect: {
        destination: "/500",
        permanent: false,
      },
    };

  return { props: { user, jurusans } };
}
