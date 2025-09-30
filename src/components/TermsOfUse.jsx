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

function TermsOfUse({ onAccept, provider_id }) {

  const router = useRouter()

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
      <Card className="w-full max-w-3xl max-h-[85vh] flex flex-col shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-[#1E3161] font-bold roboto">
            Terms of Use
          </CardTitle>
        </CardHeader>

        {/* Scrollable main content */}
        <CardContent className="overflow-y-auto max-h-[65vh] space-y-4 text-sm text-gray-700 roboto">
          <p className="text-justify">
            Please read these Terms of Use before using the <b>LLIBI Client Care Portal ("Portal").</b><br /><br />
            By using this Portal, you explicitly consent and agree to comply with the terms set forth below. If you do not agree with these terms, please discontinue your use of the Portal. <br /><br />

            <b>Terms of Use</b><br />
            This <i>Portal</i> is created, owned, and managed by Lacson and Lacson Insurance Brokers, Inc. ("LLIBI"/us/our), to facilitiate online-based services and transactions for our MEMBERS.<br /><br />
            Through this Portal, you may: <br />
          </p>

          <ul className="list-disc pl-6 space-y-1">
            <li>Submit online requests for letters of authorization or callbacks;</li>
            <li>Upload necessary documentation such as doctor's request and medical certificates;</li>
            <li>Confirm active coverage by providing membership data; and</li>
            <li>Provide relevant data required to process your requests.</li>
          </ul>

          <p className="text-justify">
            No enrolment is necessary for use of this <i>Portal</i>.<br /><br />
            While LLIBI implements appropriate security measures, you are expected to use this Portal only for the above purposes. At the same time, you are responsible for safeguarding the confidentiality of the information you provide including your date of birth, emergency card number, and other information required for the use of this <i>Portal</i>.<br /><br />
            LLIBI will never ask for payment information (such as bank or credit card details) via this <i>Portal</i>. Please report immediately if you encounter such requests.<br /><br />
            By using this <i>Portal</i>, you also agree that any information provided will be shared with necessary LLIBI systems for processing your request.<br /><br />
            LLIBI reserves the right to deny access or services through the Portal if fraud is suspected, or if necessary, to conduct investigation.<br /><br />

            <b>Privacy Policy</b><br />
            Your use of the <i>Portal</i> and the personal data provided herein shall be processed strictly in compliance with Republic Act No. 10173, known as the Data Privacy Act of 2012, and its implementing rules and regulations.<br /><br />
            No personal data will be stored within this <i>Portal</i>. Further, to maintain the confidentiality of members’ data, and to provide you with continuous services through this <i>Portal</i>, you are expected to provide accurate information. Users are prohibited from using data mining tools.<br /><br />
            LLIBI reserves the right to decline access or services to this <i>Portal</i> in case of suspected fraud or to facilitate investigation of similar cases.<br /><br />
            Your personal data will only be shared internally within LLIBI’s systems on a strict “need-to-know” basis. LLIBI will retain your data and transaction records for a period of five (5) years from submission, or in accordance to your consent, whichever is appropriate or in compliance with applicable regulations.<br /><br />
            You are guaranteed the rights provided under the Data Privacy Act, including the right to access, correction, objection, data portability, and the right to lodge a complaint with the National Privacy Commission (NPC).<br /><br />
            For more information on our data handling practices, or if you need assistance regarding your privacy rights, please visit our Privacy Notice at{" "}
            <a href='https://llibi.com/data-privacy/' target='_blank' className='text-blue-700'>
              https://llibi.com/data-privacy/
            </a>.<br /><br />

            <b>Liability</b><br />
            LLIBI shall not be liable for any damages or losses arising from your misuse of this <i>Portal</i>, or from circumstances beyond our control, such as unauthorized access resulting from your failure to adequately protect your personal information.<br /><br />

            <b>Changes to these Terms</b><br />
            We may modify these Terms of Use from time to time. Any updates will be clearly posted on this <i>Portal</i>, and your continued use after any changes signifies your acceptance of the updated terms.<br /><br />

            <b>Explicit Consent</b><br />
            By actively submitting information or proceeding with requests via this <i>Portal</i>, you explicitly consent to the collection, processing, and sharing of your personal as described in these Terms and our Privacy Policy.<br /><br />
            If you have any questions regarding these Terms, would like to report a personal data breach, if you believe your personal data have been compromised , or wish to withdraw your consent at any time, please contact us at{" "}
            <a className='text-blue-700' href='mailto:privacy@llibi.com'>
              privacy@llibi.com
            </a>.
          </p>
        </CardContent>

        <CardFooter className="flex justify-end gap-2 border-t pt-2">
          <button
            onClick={() => router.push(`${applink}/provider/${provider_id}/declined-TOU`)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 rounded-lg bg-[#1E3161] text-white hover:opacity-90"
          >
            Accept
          </button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default TermsOfUse
