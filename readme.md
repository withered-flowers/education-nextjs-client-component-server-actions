# Education NextJS - Client Component & Server Action

## Table of Content

- [Demo](#demo)
  - [Step 0 - Menyalakan server](#step-0---menyalakan-server)
  - [Step 1 - Menambahkan "tombol" `Detail` pada `/dashboard/jokes`](#step-1---menambahkan-tombol-detail-pada-dashboardjokes)
  - [Step 2 - Menambahkan tombol `Delete` pada `/dashboard/jokes`](#step-2---menambahkan-tombol-delete-pada-dashboardjokes)
  - [Step 3 - Membuat Client Component `TableJokes`](#step-3---membuat-client-component-tablejokes)
  - [Step 4 - Implementasi Delete pada Client Component `TableJokes`](#step-4---implementasi-delete-pada-client-component-tablejokes)
  - [Intermezzo - Data Cache](#intermezzo---data-cache)
  - [Step 5 - Opt-out dari Data Cache](#step-5---opt-out-dari-data-cache)
  - [Step 6 - Membuat Form Add Joke (Client Component)](#step-6---membuat-form-add-joke-client-component)
  - [Step 7 - Membuat Form Add Joke (Server Rendered Component)](#step-7---membuat-form-add-joke-server-rendered-component)
- [References](#references)

## Scope Pembelajaran

- Client Component
- Caching Behaviour (`Data Cache`)
- Server Action

## Demo

### Step 0 - Menyalakan server

1. cd `/sources/a-start/server`
1. install package yang dibutuhkan dengan `npm install`
1. jalankan server dengan `npm run watch-delay`

   Pada perintah ini untuk setiap HTTP Request (POST,PUT,PATCH,DELETE,GET) akan memerlukan waktu sekitar 5 detik per request (untuk mensimulasikan loading)

### Step 1 - Menambahkan "tombol" `Detail` pada `/dashboard/jokes`

Pada langkah ini kita akan mencoba untuk menambahkan "tombol" Detail pada setiap item joke yang ada pada halaman `/dashboard/jokes`.

"Tombol" ini akan menavigasikan client ke halaman `/dashboard/jokes/[id-dari-item]`

1. cd `/sources/a-start-client`
1. Membuka file `/src/app/dashboard/jokes/page.tsx` dan modifikasi kode menjadi seperti berikut:

   ```tsx
   // ?? Step 1 - Menambahkan "tombol" Detail pada `/dashboard/jokes` (1)
   // Import Link untuk ke detail page
   import Link from "next/link";

   // Membuat definition type untuk data yang akan di-parse
   type Joke = {
     id: number;
     setup: string;
     delivery: string;
   };

   const fetchJokes = async () => {
     const response = await fetch("http://localhost:3001/jokes");
     const responseJson: Joke[] = await response.json();

     if (!response.ok) {
       throw new Error("Waduh Error ...");
     }

     return responseJson;
   };

   const DashboardJokePage = async () => {
     const jokes = await fetchJokes();

     return (
       <section>
         <h2 className="text-2xl font-semibold">Dashboard Page - Jokes</h2>

         <table className="mt-4">
           <thead>
             <tr>
               <th className="p-4">No</th>
               <th className="p-4">Setup</th>
               <th className="p-4">Delivery</th>
               {/* ?? Step 1 - Menambahkan "tombol" Detail pada `/dashboard/jokes` (2) */}
               {/* Menambahkan sebuah header untuk "Action" */}
               <th className="p-4">Action</th>
             </tr>
           </thead>
           <tbody>
             {jokes.map((joke, idx) => (
               <tr key={joke.id}>
                 <td>{idx + 1}</td>
                 <td>{joke.setup}</td>
                 <td>{joke.delivery}</td>
                 {/* Step 1 - Menambahkan "tombol" Detail pada `/dashboard/jokes` (3) */}
                 {/* Menambahkan sebuah td untuk menggunakan component Link yang akan ditampilkan sebagai sebuah button */}
                 <td className="p-2">
                   <Link
                     href={`/dashboard/jokes/${joke.id}`}
                     className="py-2 px-4 bg-blue-200 hover:bg-blue-400 hover:text-white transition-colors duration-300 rounded"
                   >
                     Detail
                   </Link>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </section>
     );
   };

   export default DashboardJokePage;
   ```

1. Jalankan pada terminal dengan perintah `npm run dev` dan tunggu hingga terminal siap.
1. Membuka browser dan akses `http://localhost:3000/dashboard/jokes`, dan lihat hasilnya.

   Sekarang pada halaman ini, untuk setiap item joke yang ada (1 baris tabel), akan muncul sebuah "button" Detail yang bisa ditekan untuk mengarah ke halaman detail `/dashboard/jokes/[id-dari-item]`

### Step 2 - Menambahkan tombol `Delete` pada `/dashboard/jokes`

Pada langkah ini kita akan mencoba untuk menambahkan tombol ` Delete` pada setiap item joke yang ada pada halaman `/dashboard/jokes`.

1. Membuka file `/src/app/dashboard/jokes/page.tsx` dan memodifikasi file menjadi sebagai berikut:

   (Perhatikan comment "?? Step 2")

   ```tsx
   // ?? Step 1 - Menambahkan "tombol" Detail pada `/dashboard/jokes` (1)
   // Import Link untuk ke detail page
   import Link from "next/link";

   // Membuat definition type untuk data yang akan di-parse
   type Joke = {
     id: number;
     setup: string;
     delivery: string;
   };

   const fetchJokes = async () => {
     const response = await fetch("http://localhost:3001/jokes");
     const responseJson: Joke[] = await response.json();

     if (!response.ok) {
       throw new Error("Waduh Error ...");
     }

     return responseJson;
   };

   const DashboardJokePage = async () => {
     const jokes = await fetchJokes();

     // ?? Step 2 - Menambahkan tombol `Delete` pada `/dashboard/jokes` (1)
     // Karena kita sekarang akan membuat button yang bisa menghapus data, maka sekarang kita akan membutuhkan sebuah event handler (onClick) yah !
     const buttonDeleteOnClickHandler = (
       // Info: untuk event ini akan memiliki interface dengan nama MouseEvent dan memiliki target interface HTMLButtonElement

       // Sehingga deklarasi typenya akan menjadi MouseEvent<HTMLButtonElement>
       // Mungkin di sini tidak akan digunakan, sehingga kita akan menambahkan _ (underscore) untuk mengabaikan parameter tersebut
       _event: React.MouseEvent<HTMLButtonElement>,
       id: number
     ) => {
       // Kita di sini akan mencoba untuk mensimulasikan terlebih dahulu dengan menggunakan console.log
       console.log("Delete Button Clicked for id:", id);
     };

     return (
       <section>
         <h2 className="text-2xl font-semibold">Dashboard Page - Jokes</h2>

         <table className="mt-4">
           <thead>
             <tr>
               <th className="p-4">No</th>
               <th className="p-4">Setup</th>
               <th className="p-4">Delivery</th>
               {/* ?? Step 1 - Menambahkan "tombol" Detail pada `/dashboard/jokes` (2) */}
               {/* Menambahkan sebuah header untuk "Action" */}
               <th className="p-4">Action</th>
             </tr>
           </thead>
           <tbody>
             {jokes.map((joke, idx) => (
               <tr key={joke.id}>
                 <td>{idx + 1}</td>
                 <td>{joke.setup}</td>
                 <td>{joke.delivery}</td>
                 {/* Step 1 - Menambahkan "tombol" Detail pada `/dashboard/jokes` (3) */}
                 {/* Menambahkan sebuah td untuk menggunakan component Link yang akan ditampilkan sebagai sebuah button */}
                 <td className="p-2">
                   <Link
                     href={`/dashboard/jokes/${joke.id}`}
                     className="py-2 px-4 bg-blue-200 hover:bg-blue-400 hover:text-white transition-colors duration-300 rounded"
                   >
                     Detail
                   </Link>
                 </td>
                 {/* ?? Step 2 - Menambahkan tombol `Delete` pada `/dashboard/jokes` (2) */}
                 {/* Di sini kita akan menambahkan button untuk melakukan interaksi buttonDeleteOnClickHandler */}
                 <td className="p-2">
                   <button
                     onClick={(event) =>
                       buttonDeleteOnClickHandler(event, joke.id)
                     }
                     className="py-2 px-4 bg-red-200 hover:bg-red-400 hover:text-white transition-colors duration-300 rounded"
                   >
                     Delete
                   </button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </section>
     );
   };

   export default DashboardJokePage;
   ```

1. Membuka browser kembali dan lihat pada `http://localhost:3000/dashboard/jokes`.

   Apakah hasilnya... ?

   Ya ! sekarang akan menjadi **ERROR**

   `Event handlers cannot be passed to Client Component props`

Waduh kenapa yah ini? 🤔

Hal ini terjadi karena kita masih belum terlalu mengerti tentang sesuatu di dalam NextJS yang dinamakan dengan `Client Component`.

By default, dalam NextJS ini, seluruh component akan di-render (dibuat tampilannya) pada "server side" dan kemudian akan dikirimkan ke client (browser) untuk ditampilkan.

Hal ini akan membuat kita sebagai developer lebih terasa mudah untuk mengambil data dari server dan menampilkannya di client.

NAMUN, ada beberapa hal yang tidak bisa dilakukan pada "server side" seperti misalnya kita tidak bisa menggunakan `Event Handler` pada "server side" karena "server side" tidak memiliki event.

Untuk itu cara mengakalinya adalah kita harus mendeklarasikan sebuah component yang akan di-render pada "client side", sehingga bisa menggunakan interaktifitas seperti event handler dan lain lainnya !

### Step 3 - Membuat Client Component `TableJokes`

1. Membuat sebuah file baru pada `src/components` dengan nama `TableJokes.tsx` (`src/components/TableJokes.tsx`) dan membuat kerangka Component sebagai berikut:

   ```tsx
   const TableJokes = () => {
     return (
       <>
         <div>TableJokes</div>;
       </>
     );
   };

   export default TableJokes;
   ```

1. Membuka file `src/app/dashboard/jokes/page.tsx` dan comment / hapus fungsi `buttonDeleteOnClickHandler` serta deklarasi element table `<table>...</table>`

   Fungsi dan element ini nanti akan dipindahkan ke `TableJokes.tsx`

1. Membuka kembali file `src/components/TableJokes.tsx` dan modifikasi kodenya menjadi sebagai berikut:

   ```tsx
   // ?? Step 3 - Membuat Client Component `TableJokes` (6)
   // Menambahkan perintah "use client" untuk mendeklarasikan component sebagai Client Component
   "use client";

   // ?? Step 3 - Membuat Client Component `TableJokes` (4)
   // import Link dari "next/link"
   import Link from "next/link";

   // ?? Step 3 - Membuat Client Component `TableJokes` (5)
   // Membuat definition type untuk data yang akan di-parse
   type Joke = {
     id: number;
     setup: string;
     delivery: string;
   };

   // ?? Step 3 - Membuat Client Component `TableJokes` (1)
   // Membuat component TableJokes ini
   const TableJokes = ({ jokes }: { jokes: Joke[] }) => {
     const buttonDeleteOnClickHandler = (
       _event: React.MouseEvent<HTMLButtonElement>,
       id: number
     ) => {
       console.log("Delete Button Clicked for id:", id);
     };

     return (
       <>
         {/* ?? Step 3 - Membuat Client Component `TableJokes` (6) */}
         {/* Memindahkan table dari dashboard/jokes/page.tsx ke sini */}
         <table className="mt-4">
           <thead>
             <tr>
               <th className="p-4">No</th>
               <th className="p-4">Setup</th>
               <th className="p-4">Delivery</th>
               <th className="p-4">Action</th>
             </tr>
           </thead>
           <tbody>
             {jokes.map((joke, idx) => (
               <tr key={joke.id}>
                 <td>{idx + 1}</td>
                 <td>{joke.setup}</td>
                 <td>{joke.delivery}</td>
                 <td className="p-2">
                   <Link
                     href={`/dashboard/jokes/${joke.id}`}
                     className="py-2 px-4 bg-blue-200 hover:bg-blue-400 hover:text-white transition-colors duration-300 rounded"
                   >
                     Detail
                   </Link>
                 </td>
                 <td className="p-2">
                   <button
                     onClick={(event) =>
                       buttonDeleteOnClickHandler(event, joke.id)
                     }
                     className="py-2 px-4 bg-red-200 hover:bg-red-400 hover:text-white transition-colors duration-300 rounded"
                   >
                     Delete
                   </button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </>
     );
   };

   export default TableJokes;
   ```

   Perhatikan bahwa pada line teratas pada component ini menggunakan `use client` untuk menyatakan bahwa component ini akan dianggap sebagai Client Component dan akan di-render "nanti" setelah server selesai memberikan page yang ada.

1. Memodifikasi kode pada `src/app/dashboard/jokes/page.tsx` menjadi seperti berikut:

   ```tsx
   // ?? Step 3 - Membuat Client Component `TableJokes` (7)
   // Comment import Link
   // Lakukan import TableJokes
   import TableJokes from "@/components/TableJokes";

   // Membuat definition type untuk data yang akan di-parse
   type Joke = {
     id: number;
     setup: string;
     delivery: string;
   };

   const fetchJokes = async () => {
     const response = await fetch("http://localhost:3001/jokes");
     const responseJson: Joke[] = await response.json();

     if (!response.ok) {
       throw new Error("Waduh Error ...");
     }

     return responseJson;
   };

   const DashboardJokePage = async () => {
     const jokes = await fetchJokes();

     return (
       <section>
         <h2 className="text-2xl font-semibold">Dashboard Page - Jokes</h2>

         {/* ?? Step 3 - Membuat Client Component `TableJokes` (8) */}
         {/* Gunakan component TableJokes */}
         <TableJokes jokes={jokes} />
       </section>
     );
   };

   export default DashboardJokePage;
   ```

1. Membuka kembali browser dan akses `http://localhost:3000/dashboard/jokes` perhatikan sekarang tampilan sudah tidak error, dan baik "tombol" `Detail` maupun tombol `Delete` sudah bisa berjalan dengan baik (walaupun masih sebatas di console.log saja).

Selamat pada langkah ini artinya kita sudah berhasil untuk membuat sebuah Client Component di dalam NextJS.

Perlu diingat bahwa secara default-nya dalam NextJS ini component akan di-render secara server (`server rendered component`) dan bukan client side `client component`. Namun NextJS memberikan kita opsi untuk "memilih" (opt-in) apakah ingin componentnya di-render di server atau client.

### Step 4 - Implementasi Delete pada Client Component `TableJokes`

Pada langkah ini kita akan mencoba untuk mengimplementasi Delete yang sebenarnya pada client component yah !

1. Membuka kembali file `TableJokes` (`src/components/TableJokes.tsx`) dan memodifikasi filenya menjadi seperti berikut:

   ```tsx
   // ?? Step 3 - Membuat Client Component `TableJokes` (6)
   // Menambahkan perintah "use client" untuk mendeklarasikan component sebagai Client Component
   "use client";

   // ?? Step 3 - Membuat Client Component `TableJokes` (4)
   // import Link dari "next/link"
   import Link from "next/link";

   // ?? Step 4 - Implementasi Delete pada Client Component `TableJokes` (3)
   // Import hooks dengan nama useRouter untuk menavigasi (refresh) halaman nantinya
   import { useRouter } from "next/navigation";

   // ?? Step 3 - Membuat Client Component `TableJokes` (5)
   // Membuat definition type untuk data yang akan di-parse
   type Joke = {
     id: number;
     setup: string;
     delivery: string;
   };

   // ?? Step 3 - Membuat Client Component `TableJokes` (1)
   // Membuat component TableJokes ini
   const TableJokes = ({ jokes }: { jokes: Joke[] }) => {
     // ?? Step 4 - Implementasi Delete pada Client Component `TableJokes` (4)
     // Menggunakan useRouter
     const navigation = useRouter();

     // ?? Step 4 - Implementasi Delete pada Client Component `TableJokes` (2)
     // Membuat fungsi ini menjadi async karena kita akan melakukan fetch ke backend
     const buttonDeleteOnClickHandler = async (
       _event: React.MouseEvent<HTMLButtonElement>,
       id: number
     ) => {
       console.log("Delete Button Clicked for id:", id);

       // ?? Step 4 - Implementasi Delete pada Client Component `TableJokes` (1)
       // Menggunakan fetch untuk melakukan DELETE ke backend
       const response = await fetch(`http://localhost:3001/jokes/${id}`, {
         method: "DELETE",
       });
       const responseJson = await response.json();

       console.log("statusCode:", response.status, "result:", responseJson);

       // ?? Step 4 - Implementasi Delete pada Client Component `TableJokes` (5)
       // Menggunakan useRouter untuk melakukan refresh halaman
       navigation.refresh();
     };

     return (
       <>
         {/* ?? Step 3 - Membuat Client Component `TableJokes` (6) */}
         {/* Memindahkan table dari dashboard/jokes/page.tsx ke sini */}
         <table className="mt-4">
           <thead>
             <tr>
               <th className="p-4">No</th>
               <th className="p-4">Setup</th>
               <th className="p-4">Delivery</th>
               <th className="p-4">Action</th>
             </tr>
           </thead>
           <tbody>
             {jokes.map((joke, idx) => (
               <tr key={joke.id}>
                 <td>{idx + 1}</td>
                 <td>{joke.setup}</td>
                 <td>{joke.delivery}</td>
                 <td className="p-2">
                   <Link
                     href={`/dashboard/jokes/${joke.id}`}
                     className="py-2 px-4 bg-blue-200 hover:bg-blue-400 hover:text-white transition-colors duration-300 rounded"
                   >
                     Detail
                   </Link>
                 </td>
                 <td className="p-2">
                   <button
                     onClick={(event) =>
                       buttonDeleteOnClickHandler(event, joke.id)
                     }
                     className="py-2 px-4 bg-red-200 hover:bg-red-400 hover:text-white transition-colors duration-300 rounded"
                   >
                     Delete
                   </button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </>
     );
   };

   export default TableJokes;
   ```

1. Membuka browser kembali pada halaman `dashboard/jokes` (`http://localhost:3000/dashboard/jokes`), kemudian jangan lupa untuk membuka `Inspect -> Console` untuk melihat hasil dari console log yang akan keluar.
1. Menekan salah satu tombol delete pada yang memiliki id manapun dan lihat hasilnya.

   Pada tahap ini, console akan menampilkan bahwa sebuah data sudah terhapus dan sudah mendapatkan kembalian dari backend berupa sudah object dengan value `{ statusCode: 200, result: {} }`.

   Dan halaman ini juga sudah melakukan refresh dengan menggunakan suatu navigasi `navigation.refresh()`

   Sayangnya masih ada sedikit error yang terjadi, yaitu, sekalipun kita sudah me-refresh halaman yang ada, dan fetch ulang untuk GET sudah terjadi, tapi, datanya masih keluar yang lama.

   Hmm.... 🤔🤔🤔

   **Kenapa seperti itu yah?**

### Intermezzo - Data Cache

Hal ini terjadi karena behaviour dari `Data Cache` yang ada di dalam NextJS itu sendiri.

Defaultnya dari `Data Cache` yang dilakukan pada saat melakukan `fetch` pada server adalah `force-cache`, di mana, data akan disimpan di-dalam memory selama belum dilakukan `revalidate` (meminta server untuk melakukan fetch ulang) atau dilakukan `opt-out` (meminta server untuk tidak menyimpan hasil request).

Nah karena pada `client component` ini kita meminta untuk melakukan `router.refresh()`, di mana, secara otomatis akan meminta server untuk melakukan fetch ulang, maka, data yang ada di dalam `Data Cache` akan tetap digunakan (karena defaultnya adalah `force-cache`).

Solusi yang bisa kita gunakan supaya ketika `router.refresh()` pada client bisa meminta data terbaru dari server adalah dengan menggunakan `opt-out` pada saat melakukan fetch.

### Step 5 - Opt-out dari Data Cache

Pada langkah ini kita akan melakukan ` opt out` dari `Data Cache` yang ada di dalam NextJS.

1. Membuka kembali file `src/dashboard/jokes/page.tsx` dan memodifikasi kode menjadi seperti berikut:

   ```tsx
   // ?? Step 1 - Menambahkan "tombol" Detail pada `/dashboard/jokes` (1)
   // Import Link untuk ke detail page
   // import Link from "next/link";

   // ?? Step 3 - Membuat Client Component `TableJokes` (7)
   // Comment import Link
   // Lakukan import TableJokes
   import TableJokes from "@/components/TableJokes";

   // Membuat definition type untuk data yang akan di-parse
   type Joke = {
     id: number;
     setup: string;
     delivery: string;
   };

   const fetchJokes = async () => {
     // ?? Step 5 - Opt-out dari Data Cache (1),
     // Melakukan opt-out dari data cache
     // dengan menggunakan cache: "no-store"
     const response = await fetch("http://localhost:3001/jokes", {
       cache: "no-store",
     });
     const responseJson: Joke[] = await response.json();

     if (!response.ok) {
       throw new Error("Waduh Error ...");
     }

     return responseJson;
   };

   const DashboardJokePage = async () => {
     const jokes = await fetchJokes();

     // ?? Step 2 - Menambahkan tombol `Delete` pada `/dashboard/jokes` (1)
     // Karena kita sekarang akan membuat button yang bisa menghapus data, maka sekarang kita akan membutuhkan sebuah event handler (onClick) yah !
     // const buttonDeleteOnClickHandler = (
     //   // Info: untuk event ini akan memiliki interface dengan nama MouseEvent dan memiliki target interface HTMLButtonElement

     //   // Sehingga deklarasi typenya akan menjadi MouseEvent<HTMLButtonElement>
     //   // Mungkin di sini tidak akan digunakan, sehingga kita akan menambahkan _ (underscore) untuk mengabaikan parameter tersebut
     //   _event: React.MouseEvent<HTMLButtonElement>,
     //   id: number
     // ) => {
     //   // Kita di sini akan mencoba untuk mensimulasikan terlebih dahulu dengan menggunakan console.log
     //   console.log("Delete Button Clicked for id:", id);
     // };
     // ?? Step 3 - Membuat Client Component `TableJokes` (2)
     // Comment buttonDeleteOnClickHandler di atas

     return (
       <section>
         <h2 className="text-2xl font-semibold">Dashboard Page - Jokes</h2>

         {/* ?? Step 3 - Membuat Client Component `TableJokes` (3) */}
         {/* Comment table di bawah ini */}
         {/* <table className="mt-4">
           <thead>
             <tr>
               <th className="p-4">No</th>
               <th className="p-4">Setup</th>
               <th className="p-4">Delivery</th> */}
         {/* ?? Step 1 - Menambahkan "tombol" Detail pada `/dashboard/jokes` (2) */}
         {/* Menambahkan sebuah header untuk "Action" */}
         {/* <th className="p-4">Action</th>
             </tr>
           </thead>
           <tbody> */}
         {/* {jokes.map((todo, idx) => (
               <tr key={todo.id}>
                 <td>{idx + 1}</td>
                 <td>{todo.setup}</td>
                 <td>{todo.delivery}</td> */}
         {/* Step 1 - Menambahkan "tombol" Detail pada `/dashboard/jokes` (3) */}
         {/* Menambahkan sebuah td untuk menggunakan component Link yang akan ditampilkan sebagai sebuah button */}
         {/* <td className="p-2">
                   <Link
                     href={`/dashboard/jokes/${todo.id}`}
                     className="py-2 px-4 bg-blue-200 hover:bg-blue-400 hover:text-white transition-colors duration-300 rounded"
                   >
                     Detail
                   </Link>
                 </td> */}
         {/* ?? Step 2 - Menambahkan tombol `Delete` pada `/dashboard/jokes` (2) */}
         {/* Di sini kita akan menambahkan button untuk melakukan interaksi buttonDeleteOnClickHandler */}
         {/* <td className="p-2">
                   <button
                     onClick={(event) =>
                       buttonDeleteOnClickHandler(event, todo.id)
                     }
                     className="py-2 px-4 bg-red-200 hover:bg-red-400 hover:text-white transition-colors duration-300 rounded"
                   >
                     Delete
                   </button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table> */}

         {/* ?? Step 3 - Membuat Client Component `TableJokes` (8) */}
         {/* Gunakan component TableJokes */}
         <TableJokes jokes={jokes} />
       </section>
     );
   };

   export default DashboardJokePage;
   ```

1. Membuka browser kembali pada halaman `dashboard/jokes` (`http://localhost:3000/dashboard/jokes`), kemudian jangan lupa untuk membuka `Inspect -> Console` untuk melihat hasil dari console log yang akan keluar.
1. Menekan salah satu tombol delete yang ada, kemudian lihat hasilnya.

Sampai pada tahap ini, kita sudah berhasil untuk melakuan `opt-out` dari `Data Cache` yang ada di dalam NextJS dan berhasil menghapus data yang ada di dalam server pada saat client menekan tombol delete.

### Step 6 - Membuat Form Add Joke (Client Component)

Pada langkah ini kita akan mencoba untuk membuat form pada `/dashboard/jokes` yang akan digunakan untuk menambahkan data joke baru.

Masih ingat kah pada saat kita ingin menggunakan Form di dalam React, kita harus:

- Menggunakan `useState` untuk menyimpan data yang ada di dalam form tersebut
- Menggunakan `onChange` untuk mengubah data yang ada di dalam `useState` tersebut
- Menggunakan `onSubmit` untuk mengirimkan data yang ada di dalam `useState` tersebut ke backend

Nah hal ini juga adalah hal yang akan kita lakukan apabila kita menggunakan `client component` di dalam NextJS.

1. Membuat sebuah file baru pada folder components dengan nama `ClientFormAddJokes` (`/src/components/ClientFormAddJokes.tsx`)

### Step 7 - Membuat Form Add Joke (Server Rendered Component)

## References
