'use client'
import React, { useState } from 'react'
import Image from 'next/image'

// Assets
import BgImage from "@/assets/bg-portal.webp"
import PortalSticky from "@/assets/portal_sticky.webp"

// Components
import Card from '@/components/ClientCare_Desktop/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Consultation from './Consultation'
import Laboratory from './Laboratory'
import TermsOfUse from '@/components/TermsOfUse'



function RequestLoa() {


  const [showTerms, setShowTerms] = useState(true)

  return (
    <>

      {showTerms ? (
        <>
         <TermsOfUse onAccept={() => setShowTerms(false)} device={"desktop"} />
        </>
      ) : (
        <>
        <Card>
          <div className='w-full flex gap-2 '>
            <div
              className='border border-black/30 shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)] rounded-lg hidden lg:block w-1/3 bg-contain bg-repeat'
              style={{ backgroundImage: `url(${BgImage.src})` }}
            >
              <div className="relative h-full w-full pt-5">
                <Image
                  src={PortalSticky}
                  alt="Portal Sticky"
                  className="sticky rounded-2xl left-0 right-0 top-20 w-full"
                />
              </div>
            </div>
            <div className='border border-black/30 shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)] rounded-lg py-4 px-2 lg:p-4 w-full'>
              <div className='w-full'>
                  <Tabs defaultValue="consultation">
                      <TabsList className={"w-full"}>
                          <TabsTrigger value="consultation" className={"roboto"}>Consultation</TabsTrigger>
                          <TabsTrigger value="laboratory" className={"roboto"}>Laboratory</TabsTrigger>
                      </TabsList>
                      <TabsContent value="consultation">
                          <Consultation />
                      </TabsContent>
                      <TabsContent value="laboratory">
                          <Laboratory />
                      </TabsContent>
                  </Tabs>
              </div>
            </div>
          </div>
        </Card>
        </>
      )}



    </>
  )
}

export default RequestLoa
