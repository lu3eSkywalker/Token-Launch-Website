import React from 'react'

const MintedToken = ({mintAddress, associatedToken, metadataToSend}: any) => {
  return (
<div className="bg-gray-800 text-white p-6 rounded-lg shadow-md max-w-lg mx-auto mt-8">
  <h2 className="text-3xl font-bold mb-6 text-center border-b-2 border-blue-500 pb-2">Token Info</h2>

  <div className="space-y-6">
    <div>
      <p className="text-lg font-semibold">Mint Address:</p>
      <p className="text-blue-400 break-words">{mintAddress}</p>
    </div>

    <div>
      <p className="text-lg font-semibold">Associated Token Account:</p>
      <p className="text-blue-400 break-words">{associatedToken}</p>
    </div>

    <div>
      <p className="text-lg font-semibold">Metadata Account:</p>
      <p className="text-blue-400 break-words">{metadataToSend}</p>
    </div>
  </div>
</div>

  )
}

export default MintedToken