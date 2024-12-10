import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Login from "@/components/Login";
import Logout from "@/components/Logout";

// export default async function Home() {
//   const session = await getServerSession(authOptions);
//   if (session) {
//     return (
//       <div className="flex h-screen flex-col items-center justify-center space-y-3">
//         <div>Your name is {session.user?.name}</div>
//         <div>
//           <Logout />
//         </div>
//       </div>
//     );
//   }
//   return (
//     <div className="flex h-screen items-center justify-center">
//       <Login />
//     </div>
//   );
// }

import { Navigation } from "@/components/Navigation";
import { TopicsList } from "@/components/topic/TopicList";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-8">
        <TopicsList />
      </main>
    </div>
  );
}
