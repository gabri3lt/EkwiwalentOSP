import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Flame } from "lucide-react";

interface AuthScreenProps {
  onLogin: (username: string, password: string) => void;
  onRegister: (username: string, password: string, fullName: string) => void;
  error?: string;
}

export function AuthScreen({ onLogin, onRegister, error }: AuthScreenProps) {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerFullName, setRegisterFullName] = useState("");
  const [registerError, setRegisterError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(loginUsername, loginPassword);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");

    if (!registerUsername || !registerPassword || !registerFullName) {
      setRegisterError("Wszystkie pola są wymagane");
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setRegisterError("Hasła nie są identyczne");
      return;
    }

    if (registerPassword.length < 6) {
      setRegisterError("Hasło musi mieć co najmniej 6 znaków");
      return;
    }

    onRegister(registerUsername, registerPassword, registerFullName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-3 bg-red-600 rounded-lg">
              <Flame className="size-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-red-900">
                Ochotnicza Straż Pożarna
              </h1>
              <p className="text-red-700">
                Kalkulator ekwiwalentu
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Logowanie</TabsTrigger>
            <TabsTrigger value="register">Rejestracja</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Zaloguj się</CardTitle>
                <CardDescription>
                  Wprowadź swoje dane logowania
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Nazwa użytkownika</Label>
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="nazwa_użytkownika"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Hasło</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && (
                    <div className="text-red-600 text-sm">
                      {error}
                    </div>
                  )}
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                    Zaloguj
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Zarejestruj się</CardTitle>
                <CardDescription>
                  Utwórz nowe konto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-fullname">Imię i nazwisko</Label>
                    <Input
                      id="register-fullname"
                      type="text"
                      placeholder="Jan Kowalski"
                      value={registerFullName}
                      onChange={(e) => setRegisterFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-username">Nazwa użytkownika</Label>
                    <Input
                      id="register-username"
                      type="text"
                      placeholder="nazwa_użytkownika"
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Hasło</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Potwierdź hasło</Label>
                    <Input
                      id="register-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  {(registerError || error) && (
                    <div className="text-red-600 text-sm">
                      {registerError || error}
                    </div>
                  )}
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                    Zarejestruj
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
