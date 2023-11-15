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

1. Membuka file `/src/app/dashboard/jokes/page.tsx`

## References
