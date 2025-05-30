import { PDFSignature } from 'pdf-lib'
import React from 'react'

type Props = {
    field : PDFSignature
}

const SignatureFieldTemplate = ({field}: Props) => {
  return (
    <div className='p-2'>
        <div>
            <span className='font-bold '>{field.getName()}</span>
        </div>
        <div className='w-full border-1 border-round  ' style={{height:"3rem"}}>
        </div>
    </div>
  )
}

export default SignatureFieldTemplate