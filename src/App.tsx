import { useState } from "react";
import { OperationForm } from "./components/operation-form";
import { OperationsList } from "./components/operations-list";
import { Summary } from "./components/summary";
import { MembersManagement } from "./components/members-management";
import { QuarterlyReports } from "./components/quarterly-reports";
import { AuthScreen } from "./components/auth-screen";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import { Flame, LogOut } from "lucide-react";
import { Button } from "./components/ui/button";

export interface Member {
  id: string;
  name: string;
  rank: string;
}

export interface Operation {
  id: string;
  memberId: string;
  memberName: string;
  date: string;
  type: string;
  hours: number;
  rate: number;
  total: number;
}

interface User {
  username: string;
  fullName: string;
  password: string;
}

// Load auth state from localStorage
const loadAuthState = () => {
  const savedUser = localStorage.getItem("currentUser");
  return savedUser ? JSON.parse(savedUser) : null;
};

const loadUsers = (): User[] => {
  const savedUsers = localStorage.getItem("users");
  return savedUsers ? JSON.parse(savedUsers) : [];
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(loadAuthState());
  const [authError, setAuthError] = useState("");
  
  const [members, setMembers] = useState<Member[]>([
    { id: "1", name: "John Smith", rank: "Captain" },
    { id: "2", name: "Sarah Johnson", rank: "Lieutenant" },
    { id: "3", name: "Mike Davis", rank: "Firefighter" },
  ]);

  const [operations, setOperations] = useState<Operation[]>([]);

  const handleLogin = (username: string, password: string) => {
    setAuthError("");
    const users = loadUsers();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      const userWithoutPassword = { username: user.username, fullName: user.fullName, password: "" };
      setCurrentUser(userWithoutPassword);
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
    } else {
      setAuthError("Nieprawidłowa nazwa użytkownika lub hasło");
    }
  };

  const handleRegister = (username: string, password: string, fullName: string) => {
    setAuthError("");
    const users = loadUsers();
    
    if (users.find((u) => u.username === username)) {
      setAuthError("Nazwa użytkownika jest już zajęta");
      return;
    }

    const newUser: User = { username, password, fullName };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    const userWithoutPassword = { username, fullName, password: "" };
    setCurrentUser(userWithoutPassword);
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const handleAddOperation = (operation: Operation) => {
    setOperations([...operations, operation]);
  };

  const handleDeleteOperation = (id: string) => {
    setOperations(operations.filter((op) => op.id !== id));
  };

  const handleAddMember = (member: Member) => {
    setMembers([...members, member]);
  };

  const handleDeleteMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
    // Also remove operations for this member
    setOperations(
      operations.filter((op) => op.memberId !== id),
    );
  };

  // Show auth screen if not logged in
  if (!currentUser) {
    return (
      <AuthScreen 
        onLogin={handleLogin}
        onRegister={handleRegister}
        error={authError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-600 rounded-lg">
                <Flame className="size-8 text-white" />
              </div>
              <div>
                <h1 className="text-red-900">
                  Ochotnicza Straż Pożarna
                </h1>
                <p className="text-red-700">
                  Kalkulator ekwiwalentu
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-red-900">{currentUser.fullName}</p>
                <p className="text-red-700 text-sm">@{currentUser.username}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Wyloguj</span>
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="operations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="operations">
              Zdarzenia
            </TabsTrigger>
            <TabsTrigger value="summary">
              Podsumowanie
            </TabsTrigger>
            <TabsTrigger value="reports">Raporty</TabsTrigger>
            <TabsTrigger value="members">Strażacy</TabsTrigger>
          </TabsList>

          <TabsContent value="operations" className="space-y-6">
            <OperationForm
              members={members}
              onAddOperation={handleAddOperation}
            />
            <OperationsList
              operations={operations}
              onDeleteOperation={handleDeleteOperation}
            />
          </TabsContent>

          <TabsContent value="summary">
            <Summary
              operations={operations}
              members={members}
            />
          </TabsContent>

          <TabsContent value="reports">
            <QuarterlyReports
              operations={operations}
              members={members}
            />
          </TabsContent>

          <TabsContent value="members">
            <MembersManagement
              members={members}
              onAddMember={handleAddMember}
              onDeleteMember={handleDeleteMember}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}