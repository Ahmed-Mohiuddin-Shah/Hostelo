import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NotAuthorized() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/");
    }, 5000);
  }, []);

  return (
    <section className="flex justify-center items-center h-[40rem]">
      <h1 className="text-4xl text-black mb-8 dark:text-white text-center">
        You are not authorized to view this page. You&apos;ll be redirected to
        the home page in 5 seconds.
      </h1>
    </section>
  );
}
