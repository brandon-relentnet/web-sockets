import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ticker')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-1 items-center bg-[#00b140] min-h-screen">
      <div className="mx-auto w-full max-w-5xl">
        <div className="relative mx-auto px-4 max-w-[1200px]">
          {/* Ticker shell:
             - 3 cols: [left square | content | score col]
             - pl-28 reserves space for the absolute logo overlap */}
          <div className="inline-grid relative grid-cols-[3.75rem_minmax(0,1fr)_3.75rem] pt-10 pl-28 align-top">
            {/* Overlapping logo; keep width in sync with pl-28 */}
            <img
              src="/NCPA-Logo.png"
              alt="NCPA"
              className="-bottom-4 -left-15 z-10 absolute w-75 h-auto pointer-events-none select-none"
            />

            {/* HEADER spans first two columns; no spacer element needed */}
            <div className="col-span-2 col-start-1 bg-[#001b3f] px-4 py-1 font-bold text-white text-sm text-end">
              NCPA - UTAH Regional
            </div>

            {/* BODY spans all three columns */}
            <div className="grid grid-cols-[3.75rem_minmax(0,1fr)_3.75rem] col-span-3 col-start-1 w-full">
              {/* Left vertical band to align under header’s left area */}
              <div className="bg-white h-full aspect-square" />

              {/* Names column (flexible). min-w-0 so truncate/wrap behaves */}
              <div className="flex flex-col divide-y divide-[#001b3f] min-w-0">
                {/* Team 1 */}
                <div className="flex bg-white text-black">
                  <div className="flex justify-center items-center bg-white ml-18 border-[#001b3f] border-r h-15 aspect-square text-[10px] shrink-0">
                    t1_logo
                  </div>
                  <div className="flex flex-col flex-1 pr-6 pl-2 min-w-0">
                    <span className="font-bold">t1_name</span>
                    <span className="font-bold truncate">
                      t1_player1 &amp; t1_player2
                    </span>
                  </div>
                  <div className="flex justify-center items-center bg-[#78bce3] border-[#001b3f] border-x h-15 aspect-square text-xs shrink-0">
                    t1_score
                  </div>
                </div>

                {/* Team 2 */}
                <div className="flex bg-white text-black">
                  <div className="flex justify-center items-center bg-white ml-18 border-[#001b3f] border-r h-15 aspect-square text-[10px] shrink-0">
                    t2_logo
                  </div>
                  <div className="flex flex-col flex-1 pr-6 pl-2 min-w-0">
                    <span className="font-bold">t2_name</span>
                    <span className="font-bold truncate">
                      t2_player1 &amp; t2_player2
                    </span>
                  </div>
                  <div className="flex justify-center items-center bg-[#78bce3] border-[#001b3f] border-x h-15 aspect-square text-xs shrink-0">
                    t2_score
                  </div>
                </div>
              </div>

              {/* FOOTER spans first two columns; no spacer element needed */}
              <div className="col-span-2 col-start-1 bg-[#001b3f] px-4 py-1 font-bold text-white text-sm text-end">
                Pool Play - 1st to 11 (win by 2) - t2 leads x-y
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
