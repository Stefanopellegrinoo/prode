import { useState } from "react"
import DashboardLayout from "../components/layouts/DashboardLayout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs"
import TournamentsAdmin from "../components/admin/TournamentsAdmin"
import SubdivisionsAdmin from "../components/admin/SubdivisionsAdmin"
import TeamsAdmin from "../components/admin/TeamsAdmin"
import MatchesAdmin from "../components/admin/MatchesAdmin"
import { useToast } from "../hooks/useToast"
import MatchesPage from "../components/admin/MatchesPage"

const FixtureAdmin = () => {
  const [activeTab, setActiveTab] = useState("tournaments")
  const { ToastContainer } = useToast()

  return (
    <DashboardLayout title="Administración de Fixture">
      <Tabs defaultValue="tournaments" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="tournaments">Torneos</TabsTrigger>
          <TabsTrigger value="subdivisions">Subdivisiones</TabsTrigger>
          <TabsTrigger value="teams">Equipos</TabsTrigger>
          <TabsTrigger value="fixture">Fixture</TabsTrigger>
        </TabsList>

        <TabsContent value="tournaments">
          <TournamentsAdmin />
        </TabsContent>

        <TabsContent value="subdivisions">
          <SubdivisionsAdmin />
        </TabsContent>

        <TabsContent value="teams">
          <TeamsAdmin />
        </TabsContent>


        <TabsContent value="fixture">
          <MatchesPage/>
          {/* <MatchesAdmin /> */}
        </TabsContent>
      </Tabs>

      <ToastContainer />
    </DashboardLayout>
  )
}

export default FixtureAdmin
