'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

import { applink } from '@/lib/applink'


import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function NotificationSystem({ onAccept }) {

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-[9999]">
      <Card className="w-full max-w-3xl max-h-[85vh] flex flex-col shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-[#1E3161] font-bold roboto">
            System Notification
          </CardTitle>
        </CardHeader>

        {/* Scrollable main content */}
        <CardContent className="overflow-y-auto max-h-[65vh] space-y-4 text-sm text-gray-700 roboto">
          <p className="text-justify">
            Dear Valued Member,<br /><br />

            Kindly indicate reason/chief complaint/diagnosis for follow-up checkups when requesting for Consultation LOA to avoid denial/disapproval of LOA request.<br /><br />

            Thank you.<br /><br />

            <b>LLIBI Team</b>
          </p>
        </CardContent>

        <CardFooter className="flex justify-end gap-2 border-t pt-2">
          {/* <button
            onClick={() => device == "mobile" ? router.push(`${applink}/provider/${provider_id}/declined-TOU`) : router.push(`${applink}/request-loa/declined-TOU`)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 roboto"
          >
            Decline
          </button> */}
          <button
            onClick={onAccept}
            className="px-4 py-2 rounded-lg bg-[#1E3161] text-white hover:opacity-90 roboto"
          >
            Accept
          </button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default NotificationSystem
