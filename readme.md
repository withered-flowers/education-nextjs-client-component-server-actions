# Education NextJS - Client Component & Server Action

## Table of Content

- [Demo](#demo)
- [References](#references)

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
             {jokes.map((todo, idx) => (
               <tr key={todo.id}>
                 <td>{idx + 1}</td>
                 <td>{todo.setup}</td>
                 <td>{todo.delivery}</td>
                 {/* Step 1 - Menambahkan "tombol" Detail pada `/dashboard/jokes` (3) */}
                 {/* Menambahkan sebuah td untuk menggunakan component Link yang akan ditampilkan sebagai sebuah button */}
                 <td className="p-2">
                   <Link
                     href={`/dashboard/jokes/${todo.id}`}
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
             {jokes.map((todo, idx) => (
               <tr key={todo.id}>
                 <td>{idx + 1}</td>
                 <td>{todo.setup}</td>
                 <td>{todo.delivery}</td>
                 {/* Step 1 - Menambahkan "tombol" Detail pada `/dashboard/jokes` (3) */}
                 {/* Menambahkan sebuah td untuk menggunakan component Link yang akan ditampilkan sebagai sebuah button */}
                 <td className="p-2">
                   <Link
                     href={`/dashboard/jokes/${todo.id}`}
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

## References
