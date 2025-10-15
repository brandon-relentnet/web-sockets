import { createFileRoute } from '@tanstack/react-router'

type TeamData = {
  name: string
  players: [string, string]
  logoUrl: string
  score: number
}

type TickerData = {
  associationName: string
  eventName: string
  eventPhase: string
  eventFormat: string
  team1: TeamData
  team2: TeamData
  matchStatus: string
}

// Dummy API-style data
const dummyTickerData: TickerData = {
  associationName: 'NCPA',
  eventName: 'UTAH Regional',
  eventPhase: 'Pool Play',
  eventFormat: '1st to 11, win by 2',
  team1: {
    name: 'UTA Blue',
    players: ['Alice Alvarez', 'Bobby Benson'],
    logoUrl: '/logos/uta-blue.png',
    score: 5,
  },
  team2: {
    name: 'BYU White',
    players: ['Casey Chang', 'Drew Daniels'],
    logoUrl: '/logos/byu-white.png',
    score: 7,
  },
  matchStatus: 'Team 2 leads 3-0',
}

export const Route = createFileRoute('/ticker')({
  component: RouteComponent,
})

function RouteComponent() {
  const data = dummyTickerData

  return (
    <div className="flex flex-1 items-center bg-[#00b140] min-h-screen">
      <div className="mx-auto w-full max-w-5xl">
        <div className="relative mx-auto px-4 max-w-[1200px]">
          <div className="inline-grid relative grid-cols-[3.75rem_minmax(0,1fr)_3.75rem] pt-10 pl-28 align-top">
            {/* Association logo */}
            <img
              src={`/${data.associationName}-Logo.png`}
              alt={data.associationName}
              className="-bottom-4 -left-15 z-10 absolute w-75 h-auto pointer-events-none select-none"
            />

            {/* Header bar */}
            <div className="col-span-2 col-start-1 bg-[#001b3f] px-4 py-1 font-bold text-white text-sm text-end">
              {data.associationName} - {data.eventName}
            </div>

            {/* Match body */}
            <div className="grid grid-cols-[3.75rem_minmax(0,1fr)_3.75rem] col-span-3 col-start-1 w-full">
              {/* Left band */}
              <div className="bg-white h-full aspect-square" />

              {/* Teams */}
              <div className="flex flex-col divide-y divide-[#001b3f] min-w-0">
                {/* Team 1 */}
                <div className="flex bg-white text-black">
                  <div className="flex justify-center items-center bg-white ml-18 border-[#001b3f] border-r h-15 aspect-square shrink-0">
                    <img
                      src={data.team1.logoUrl}
                      alt={`${data.team1.name} logo`}
                      className="p-1 h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col flex-1 justify-center pr-6 pl-2 min-w-0">
                    <span className="font-bold">{data.team1.name}</span>
                    <span className="font-bold truncate">
                      {data.team1.players.join(' & ')}
                    </span>
                  </div>
                  <div className="flex justify-center items-center bg-[#78bce3] border-[#001b3f] border-x h-15 aspect-square font-bold text-4xl shrink-0">
                    {data.team1.score}
                  </div>
                </div>

                {/* Team 2 */}
                <div className="flex bg-white text-black">
                  <div className="flex justify-center items-center bg-white ml-18 border-[#001b3f] border-r h-15 aspect-square shrink-0">
                    <img
                      src={data.team2.logoUrl}
                      alt={`${data.team2.name} logo`}
                      className="p-1 h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col flex-1 justify-center pr-6 pl-2 min-w-0">
                    <span className="font-bold">{data.team2.name}</span>
                    <span className="font-bold truncate">
                      {data.team2.players.join(' & ')}
                    </span>
                  </div>
                  <div className="flex justify-center items-center bg-[#78bce3] border-[#001b3f] border-x h-15 aspect-square font-bold text-4xl shrink-0">
                    {data.team2.score}
                  </div>
                </div>
              </div>

              {/* Footer bar */}
              <div className="col-span-2 col-start-1 bg-[#001b3f] px-4 py-1 font-bold text-white text-sm text-end">
                {data.eventPhase} - {data.eventFormat} - {data.matchStatus}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
