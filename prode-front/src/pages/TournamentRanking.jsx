import React from 'react'
import DashboardLayout from '../components/layouts/DashboardLayout'
import MatchesPage from '../components/admin/MatchesPage'

const TournamentRanking = () => {
  return (
    <DashboardLayout title="Ranking de los torneos"> 
    
    <MatchesPage type={'pronostico'}/>
    </DashboardLayout>

    
  )
}

export default TournamentRanking