import Link from "next/link";
import Button from "./Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axios";

interface HeaderProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function Header({
  children,
  title = "Barbearia",
  subtitle = "Agende agora seu serviço",
}: HeaderProps) {
  const router = useRouter();
  const [isLoged, setIsLoged] = useState(false);
  const [user, setUser] = useState(null);

  // useEffect para buscar os dados do usuário após a montagem do componente
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Faça a requisição para obter os dados do usuário
          const response = api.get("http://localhost:5000/api/users/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Atualize o estado com os dados do usuário
          setUser((await response).data);
          setIsLoged(true); // Marca como logado
        } catch (error) {
          console.error("Erro ao buscar os dados do usuário:", error);
          setIsLoged(false); // Se houver erro, desloga o usuário
        }
      } else {
        setIsLoged(false); // Se não houver token, desloga o usuário
      }
    };

    fetchUserData();
  }, []); // O efeito executa uma vez, após a renderização inicial

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoged(false);
    setUser(null);
    router.push("/"); // Redireciona após o logout
  };

  return (
    <header className="bg-gray-500 text-white py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Exibir login e registrar apenas se não estiver logado */}
        {!isLoged ? (
          <div className="flex justify-end space-x-4">
            <Link href={"/Login"}>
              <Button color="bg-blue-900" text="Login" />
            </Link>

            <Link href={"/Register"}>
              <Button color="bg-gray-600" text="Registrar" />
            </Link>
          </div>
        ) : (
          // Exibir usuário logado e logout se estiver logado
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-2">
                <img
                  src="/imgs/batman.jpg"
                  alt="User Avatar"
                  className="w-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-sm font-semibold text-gray">
                    {user.role}
                  </p>
                </div>
              </div>
            )}

            <Button onClick={handleLogout} color="bg-red-500" text="Logout" />
          </div>
        )}

        <div className="flex justify-start space-x-4">{children}</div>
      </div>

      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-sm text-gray-100 mt-2">{subtitle}</p>
      </div>
    </header>
  );
}