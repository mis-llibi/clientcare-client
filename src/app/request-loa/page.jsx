'use client'
import React, { useState } from 'react'
import Image from 'next/image'

// Assets
import BgImage from '@/assets/bg-portal.webp'
import PortalSticky from '@/assets/0115.gif'

// Components
import Card from '@/components/ClientCare_Desktop/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Consultation from './Consultation'
import Laboratory from './Laboratory'
import TermsOfUse from '@/components/TermsOfUse'
import NotificationSystem from '@/components/NotificationSystem'

function RequestLoa() {
  // flow: 'terms' -> 'notification' -> 'main'
  const [step, setStep] = useState('terms')

  return (
    <>
      {step === 'terms' && (
        <TermsOfUse
          device="desktop"
          onAccept={() => setStep('notification')}
        />
      )}

      {step === 'notification' && (
        <NotificationSystem
          onAccept={() => setStep('main')}
        />
      )}

      {step === 'main' && (
        <Card>
          <div className="w-full flex gap-2">
            <div
              className="border border-black/30 shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)] rounded-lg hidden lg:block w-1/3 bg-contain bg-repeat"
              
            >
              <div className="relative h-full w-full">
                <h2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl uppercase font-bold text-white z-10 flex flex-col items-center leading-tight roboto">
                  <span>Letter</span>
                  <span>Of</span>
                  <span>Authority</span>
                </h2>
                <Image
                  src={PortalSticky}
                  alt="Portal Sticky"
                  className="sticky rounded-2xl left-0 right-0 w-full h-full blur-[3px] opacity-90"
                />
              </div>
            </div>

            <div className="border border-black/30 shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)] rounded-lg py-4 px-2 lg:p-4 w-full">
              <div className="w-full">
                <Tabs defaultValue="consultation">
                  <TabsList className="w-full">
                    <TabsTrigger value="consultation" className="roboto">
                      Consultation
                    </TabsTrigger>
                    <TabsTrigger value="laboratory" className="roboto">
                      Laboratory
                    </TabsTrigger>
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
      )}
    </>
  )
}

export default RequestLoa
