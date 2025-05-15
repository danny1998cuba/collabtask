import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex items-center justify-center h-screen flex-col gap-4 prose w-full !max-w-[unset] p-4">
      <Image src="/images/collabtask-logo.png" alt="Logo" width={860} height={871} className="h-[75px] w-[75px] translate-x-4" />

      <h1>CollabTask</h1>

      <p className="max-w-full md:max-w-1/2 text-center">
        <b>CollabTask</b> es una plataforma colaborativa tipo Trello, diseñada para facilitar la gestión de tareas en equipos de trabajo organizados. Utiliza <Link href="https://clerk.com">Clerk</Link> para la autenticación avanzada y gestión de organizaciones.
      </p>

      <Link href="https://github.com/danny1998cuba/collabtask" target="_blank">
        <Button className="mt-6">
          <Github />
          Ver repositorio en Github
        </Button>
      </Link>
    </div>
  );
}
