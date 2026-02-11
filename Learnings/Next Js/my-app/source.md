Next.js Basics 
------------------------------------------------------------------


1. Image Component

Next.js does not use the normal HTML <img /> tag.
Instead, it provides a built-in <Image /> component for better performance and optimization.

import Image from "next/image";

<Image src="/photo.png" alt="photo" width={300} height={200} />
------------------------------------------------------------------

2. Navigation (Routing)

Next.js does not use react-router-dom.

For programmatic navigation, use useRouter:

import { useRouter } from "next/navigation";

const router = useRouter();
router.push("/example");

For links, use:

import Link from "next/link";

<Link href="/example">Go to Example</Link>

❌ Do not use <Link to="">
✅ Use <Link href="">
------------------------------------------------------------------


3. App Router Folder Structure

In the app folder, folder names define the route paths.

Example:

app/blog/page.tsx → /blog
------------------------------------------------------------------


4. Page File Naming

Inside a route folder, only these file names are supported:

page.jsx or page.tsx

❌ Custom file names like blog.jsx will not work as a route.
------------------------------------------------------------------


5. Nested Routes

You can create nested routes by using multiple folders, and each folder must contain a page.tsx.

Example:

app/blog/post/page.tsx → /blog/post
------------------------------------------------------------------


6. Custom Layouts

If you want a custom layout for a specific route, create a layout.jsx or layout.tsx inside that folder.

This layout will apply only to that folder and its sub-routes

It will not affect other pages

Example:

app/dashboard/layout.tsx
app/dashboard/page.tsx
------------------------------------------------------------------
