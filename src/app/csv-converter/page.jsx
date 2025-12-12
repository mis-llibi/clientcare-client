'use client'
import React, { useState } from 'react'

import { UseCsvUploader } from '@/hooks/CsvUploader'


export default function UploadPage() {
const [file, setFile] = useState(null)
const [progress, setProgress] = useState(0)
const [message, setMessage] = useState('')

const { csvUpload } = UseCsvUploader()


const upload = async (e) => {
    e.preventDefault()
    if (!file) return setMessage('Choose a file first')




    setMessage('Uploading...')
    csvUpload({
        setMessage,
        file
    })

}


return (
<div style={{maxWidth:600, margin:'2rem auto'}}>
<h2>Upload CSV</h2>
<form onSubmit={upload}>
<input
type="file"
accept=".csv,text/csv"
onChange={(e) => setFile(e.target.files[0])}
/>
<div style={{marginTop:12}}>
<button type="submit">Upload to Laravel</button>
</div>
</form>


<p>{message}</p>
</div>
)
}