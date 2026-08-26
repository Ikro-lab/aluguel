import NavBar from "@/components/NavBar";

export default function AdminLayout({ children }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
