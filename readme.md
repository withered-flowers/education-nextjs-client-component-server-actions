# Education NextJS - Client Component & Server Action

## Table of Content

- [Education NextJS - Client Component \& Server Action](#education-nextjs---client-component--server-action)
  - [Table of Content](#table-of-content)
  - [Scope Pembelajaran](#scope-pembelajaran)
  - [Disclaimer](#disclaimer)
  - [Demo](#demo)
    - [Step 0 - Menyalakan server](#step-0---menyalakan-server)
    - [Step 1 - Menambahkan "tombol" `Detail` pada `/dashboard/jokes`](#step-1---menambahkan-tombol-detail-pada-dashboardjokes)
    - [Step 2 - Menambahkan tombol `Delete` pada `/dashboard/jokes`](#step-2---menambahkan-tombol-delete-pada-dashboardjokes)
    - [Step 3 - Membuat Client Component `TableJokes`](#step-3---membuat-client-component-tablejokes)
    - [Step 4 - Implementasi Delete pada Client Component `TableJokes`](#step-4---implementasi-delete-pada-client-component-tablejokes)
    - [Intermezzo - Data Cache](#intermezzo---data-cache)
    - [Step 5 - Opt-out dari Data Cache](#step-5---opt-out-dari-data-cache)
    - [Step 6 - Membuat Form Add Joke (Client Component)](#step-6---membuat-form-add-joke-client-component)
    - [Intermezzo - `Server Actions`](#intermezzo---server-actions)
    - [Step 7 - Membuat Form Add Joke (Server Rendered Component)](#step-7---membuat-form-add-joke-server-rendered-component)
  - [References](#references)

## Scope Pembelajaran

- Client Component
- Caching Behaviour (`Data Cache`)
- Server Actions

## Disclaimer

- Pembelajaran ini menggunakan kode dari pembelajaran sebelumnya.
- Pembelajaran ini merupakan bagian **kedua** dari pembelajaran NextJS, Garis Besar pembelajarannya dapat dilihat di bawah ini:
  - [Part 1 - NextJS - Intro](https://github.com/withered-flowers/education-nextjs-intro)
  - [Part 2 - NextJS - Client Component & Server Actions](https://github.com/withered-flowers/education-nextjs-client-component-server-actions)
  - [Part 3 - NextJS - Route Handler & Input Validation](https://github.com/withered-flowers/education-nextjs-route-handler-and-input-validation)
  - [Part 4 - NextJS - Middleware & Authentication](https://github.com/withered-flowers/education-nextjs-middleware-and-authentication)

## Demo

### Step 0 - Menyalakan server

1. cd `/sources/a-start/server`
1. install package yang dibutuhkan dengan `npm install`
1. jalankan server dengan `npm run watch`

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
     id: string;
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

Pada langkah ini kita akan mencoba untuk menambahkan tombol `Delete` pada setiap item joke yang ada pada halaman `/dashboard/jokes`.

1. Membuka file `/src/app/dashboard/jokes/page.tsx` dan memodifikasi file menjadi sebagai berikut:

   (Perhatikan comment "?? Step 2")

   ```tsx
   // ?? Step 1 - Menambahkan "tombol" Detail pada `/dashboard/jokes` (1)
   // Import Link untuk ke detail page
   import Link from "next/link";

   // Membuat definition type untuk data yang akan di-parse
   type Joke = {
     id: string;
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
       id: string
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
                     type="button"
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
         <div>TableJokes</div>
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
     id: string;
     setup: string;
     delivery: string;
   };

   // ?? Step 3 - Membuat Client Component `TableJokes` (1)
   // Membuat component TableJokes ini
   const TableJokes = ({ jokes }: { jokes: Joke[] }) => {
     const buttonDeleteOnClickHandler = (
       _event: React.MouseEvent<HTMLButtonElement>,
       id: string
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
                     type="button"
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
     id: string;
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
     id: string;
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
       id: string
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
                     type="button"
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

### Intermezzo - Data Cache

> Bagian ini sudah dihapus karena pada versi NextJS 15+, by default cache sudah di-_disable_.

### Step 5 - Opt-out dari Data Cache

> Bagian ini sudah dihapus karena pada versi NextJS 15+, by default cache sudah di-_disable_.

### Step 6 - Membuat Form Add Joke (Client Component)

Pada langkah ini kita akan mencoba untuk membuat form pada `/dashboard/jokes` yang akan digunakan untuk menambahkan data joke baru.

Masih ingat kah pada saat kita ingin menggunakan Form di dalam React, kita harus:

- Menggunakan `useState` untuk menyimpan data yang ada di dalam form tersebut
- Menggunakan `onChange` untuk mengubah data yang ada di dalam `useState` tersebut
- Menggunakan `onSubmit` untuk mengirimkan data yang ada di dalam `useState` tersebut ke backend

Nah hal ini juga adalah hal yang akan kita lakukan apabila kita menggunakan `client component` di dalam NextJS.

1. Membuat sebuah file baru pada folder components dengan nama `ClientFormAddJokes` (`/src/components/ClientFormAddJokes.tsx`) dan menambahkan kode sebagai berikut:

   ```tsx
   // ?? Step 6 - Membuat Form Add Joke (Client Component) (1)
   // Membuat component ClientFormAddJokes
   "use client";

   import { useRouter } from "next/navigation";
   // ? Karena pada component ini kita akan menggunakan tipe data dari React
   // ? Maka kita perlu import React, tapi hanya sebagai type saja
   import type React from "react";
   import { useState } from "react";

   const ClientFormAddJokes = () => {
     const navigation = useRouter();

     const initialFormValue = {
       setup: "",
       delivery: "",
     };

     const [formValue, setFormValue] = useState({ ...initialFormValue });

     const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
       setFormValue({
         ...formValue,
         [event.target.id]: event.target.value,
       });
     };

     const onSubmitHandler = async (
       event: React.FormEvent<HTMLFormElement>
     ) => {
       event.preventDefault();

       const response = await fetch("http://localhost:3001/jokes", {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify(formValue),
       });

       const responseJson = await response.json();
       console.log(responseJson);

       setFormValue({ ...initialFormValue });
       navigation.refresh();
     };

     return (
       <>
         <section className="mt-4 bg-gray-200 p-4 rounded md:max-w-[25vw]">
           <p className="font-semibold mb-4">
             Form Add Jokes - Client Component
           </p>
           {/* // ! Sebenarnya di sini kita mulai bisa menggunakan React 19 component baru */}
           {/* // ! bernama <Form>, tapi di sini kita belum menggunakannya yah ! */}
           <form className="flex flex-col gap-2" onSubmit={onSubmitHandler}>
             <input
               className="py-2 px-4"
               type="text"
               id="setup"
               placeholder="Setup"
               value={formValue.setup}
               onChange={onChangeHandler}
             />
             <input
               className="py-2 px-4"
               type="text"
               id="delivery"
               placeholder="Delivery"
               value={formValue.delivery}
               onChange={onChangeHandler}
             />
             <button
               className="bg-emerald-300 hover:bg-emerald-500 hover:text-white/90 rounded py-2 px-4 transition-colors duration-300"
               type="submit"
             >
               Add Joke
             </button>
           </form>
         </section>
       </>
     );
   };

   export default ClientFormAddJokes;
   ```

1. Memodifikasi kode `page.tsx` (`src/dashboard/jokes/page.tsx`) untuk menambahkan `ClientFormAddJokes.tsx`, kodenya adalah sebagai berikut:

   ```tsx
   // ?? Step 6 - Membuat Form Add Joke (Client Component) (2)
   // Mengimport component ClientFormAddJokes
   import ClientFormAddJokes from "@/components/ClientFormAddJokes";

   // Membuat definition type untuk data yang akan di-parse
   type Joke = {
     id: string;
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

         {/* ?? Step 6 - Membuat Form Add Joke (Client Component) (3) */}
         {/* Memanggil component ClientFormAddJokes */}
         <section className="flex gap-4">
           <ClientFormAddJokes />
         </section>

         <TableJokes jokes={jokes} />
       </section>
     );
   };

   export default DashboardJokePage;
   ```

1. Membuka browser dan akses halaman `http://localhost:3000/dashboard/jokes`, coba isi Form dan tekan tombol `Add Joke`, kemudian lihat hasilnya, apakah data akan bertambah?

   Ya, pada halaman ini bisa bertambah dan data dari tabel sudah berubah. Maka semuanya sudah beres kan?

   Bisa saja sih... tapi... **MEMANG BOLEH SE-REACT INI?**

   Pada titik ini kan _ceritanya_ kita sedang mempelajari `NextJS`, bukan `React`, jadi, seharusnya kita bisa menggunakan fitur-fitur yang ada di dalam `NextJS` ini, bukannya _**`sedikit sedikit fallback ke caranya React`**_

   Namun bagaimanakah caranya?

   Caranya adalah dengan menggunakan sesuatu yang bernama **`Server Actions`**

### Intermezzo - `Server Actions`

Server Actions merupakan sebuah fitur yang ada di dalam NextJS yang bisa digunakan untuk melakukan mutasi ke backend pada saat menggunakan form.

Perbedannya dengan cara React adalah, cara ini kita gunakan layaknya seperti form `action` yang umumnya digunakan pada form HTML, ketimbang menggunakan event `onSubmit` yang ada di dalam React.

### Step 7 - Membuat Form Add Joke (Server Rendered Component)

Pada langkah ini kita akan mencoba untuk membuat ulang Form untuk menambahkan joke lagi, hanya saja sekarang ini sudah menggunakan `Server Actions` dan akan mencoba untuk membuat componentnya menjadi `Server Rendered Component`.

1. Membuat sebuah component baru dengan nama `ServerFormAddJokes` (`src/components/ServerFormAddJokes.tsx`) dan menuliskan kode sebagai berikut:

   ```tsx
   // ?? Step 7 - Membuat Form Add Joke (Server Rendered Component) (1)
   // Membuat component ServerFormAddJokes

   // !! Tidak digunakan lagi, karena cache sudah disabled by default
   // ?? Step 7 - Membuat Form Add Joke (Server Rendered Component) (7)
   // Menggunakan revalidatePath untuk melakukan revalidate pada path tertentu
   // import { revalidatePath } from "next/cache";

   // ?? Step 7 - Membuat Form Add Joke (Server Rendered Component) (8)
   // Menggunakan redirect untuk melakukan pindah halaman setelah action selesai
   import { redirect } from "next/navigation";

   const ServerFormAddJokes = () => {
     // ?? Step 7 - Membuat Form Add Joke (Server Rendered Component) (4)
     // Server Action diharuskan berupa async function
     // Di sini juga akan menerima FormData
     const formActionHandler = async (formData: FormData) => {
       "use server";
       // ?? Step 7 - Membuat Form Add Joke (Server Rendered Component) (5)
       // Mendeklarasikan function ini sebagai server function dengan "use server"

       console.log(formData.get("setup"));
       console.log(formData.get("delivery"));

       const response = await fetch("http://localhost:3001/jokes", {
         method: "POST",
         body: JSON.stringify({
           setup: formData.get("setup"),
           delivery: formData.get("delivery"),
         }),
         headers: {
           "Content-Type": "application/json",
         },
       });
       const responseJson = await response.json();
       console.log(responseJson);

       // !! Tidak digunakan lagi, karena cache sudah disabled by default
       // ?? Step 7 - Membuat Form Add Joke (Server Rendered Component) (9)
       // Menggunakan revalidatePath untuk melakukan revalidate (hilang cache) pada path tertentu
       // revalidatePath("/dashboard/jokes");

       // ?? Step 7 - Membuat Form Add Joke (Server Rendered Component) (10)
       // Menggunakan redirect untuk melakukan pindah halaman setelah action selesai
       redirect("/dashboard/jokes");

       // ?? Step 7 - Membuat Form Add Joke (Server Rendered Component) (11)
       // Ingat bahwa pada saat menggunakan form html, biasanya akan melakukan refresh halaman
       // dan tidak mendapatkan response dari server
     };

     return (
       <>
         <section className="mt-4 bg-gray-200 p-4 rounded md:max-w-[25vw]">
           <p className="font-semibold mb-4">
             Form Add Jokes - Server Component
           </p>
           {/* ?? Step 7 - Membuat Form Add Joke (Server Rendered Component) (6) */}
           {/* Menggunakan action berupa formActionHandler */}
           <form action={formActionHandler} className="flex flex-col gap-2">
             <input
               className="py-2 px-4"
               type="text"
               id="setup"
               // Perhatikan di sini kita menggunakan name="setup"
               name="setup"
               placeholder="Setup"
             />
             <input
               className="py-2 px-4"
               type="text"
               id="delivery"
               // Perhatikan di sini kita menggunakan name="delivery"
               name="delivery"
               placeholder="Delivery"
             />
             <button
               className="bg-emerald-300 hover:bg-emerald-500 hover:text-white/90 rounded py-2 px-4 transition-colors duration-300"
               type="submit"
             >
               Add Joke
             </button>
           </form>
         </section>
       </>
     );
   };

   export default ServerFormAddJokes;
   ```

1. Memodifikasi file `page.tsx` (`src/dashboard/jokes.page.tsx`) sebagai berikut:

   ```tsx
   // ?? Step 3 - Membuat Client Component `TableJokes` (7)
   // Comment import Link
   // Lakukan import TableJokes
   import TableJokes from "@/components/TableJokes";

   // ?? Step 6 - Membuat Form Add Joke (Client Component) (2)
   // Mengimport component ClientFormAddJokes
   import ClientFormAddJokes from "@/components/ClientFormAddJokes";

   // ?? Step 7 - Membuat Form Add Joke (Server Rendered Component) (2)
   // Mengimport component ServerFormAddJokes
   import ServerFormAddJokes from "@/components/ServerFormAddJokes";

   // Membuat definition type untuk data yang akan di-parse
   type Joke = {
     id: string;
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

         {/* ?? Step 6 - Membuat Form Add Joke (Client Component) (3) */}
         {/* Memanggil component ClientFormAddJokes */}
         <section className="flex gap-4">
           <ClientFormAddJokes />
           {/* ?? Step 7 - Membuat Form Add Joke (Server Rendered Component) (3) */}
           {/* Memanggil component ServerFormAddJokes */}
           <ServerFormAddJokes />
         </section>

         {/* ?? Step 3 - Membuat Client Component `TableJokes` (8) */}
         {/* Gunakan component TableJokes */}
         <TableJokes jokes={jokes} />
       </section>
     );
   };

   export default DashboardJokePage;
   ```

1. Membuka browser dan kembali ke halaman `http://localhost:3000/dashboard/jokes` dan cobalah untuk menambahkan data yang baru pada `Form Add Jokes - Server Component`

1. Cobalah untuk memodifikasi nama file `loading.tsx` dan `error.tsx` menjadi nama yang lain (`loading_dupe.tsx` dan `error.tsx`), kemudian pada browser cobalah untuk mematikan javascript, dan coba untuk menambahkan jokes pada keduanya.

   Manakah yang jalan? `Server Component` atau `Client Component` ?

   Apabila melihat ada refresh pada `Server Component`, coba cek kembali pada `Inspect Network` yang ada pada browser, apakah benar benar terjadi refresh? atau hanya sekedar fetch yang terjadi saja?

Sampai pada titik ini kita sudah berhasil mencoba untuk menggunakan `Server Actions` dan membuat sebuah `Server Rendered Component` yang bisa digunakan untuk melakukan mutasi ke backend. Mantap bukan?

Tapi di balik itu, ada yang harus kita korbankan:

- Kompleksitas kode yang harus kita tulis
- Harus mengetahui manakah component yang menjadi client dan component manakah yang menjadi server dan kombinasinya.

Selamat mempelajari NextJS dan sampai jumpa di pembelajaran berikutnya !

## References

- <https://nextjs.org/docs/app/building-your-application/data-fetching/patterns>
- <https://nextjs.org/docs/app/api-reference/functions/server-actions>
- <https://nextjs.org/docs/app/building-your-application/rendering/client-components>
