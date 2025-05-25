import { useState } from "react";

export default function ConnectPage() {
    const [storeHash, setStoreHash] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleConnect = async () => {
        // try making the connection, throw error if connection fails, eg. due to incorrect creds
        
        try {
            const response: Response = await fetch('/api/connect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ storeHash, accessToken }),
            });

            // we have made a call to our backend at /api/connect and receive the response here
            const data = await response.json()

                if (data.success) {
                    setConnectionStatus('success');
                } else {
                    setConnectionStatus('error');
                } 
            } catch (error){
                console.error('Error verifying credentials:', error);
                setConnectionStatus('error');
            }
        };

        return (
        <div>
        <h1>Connection page</h1>

        <form onSubmit={(e) => { e.preventDefault(); handleConnect(); }}>
            <label htmlFor="store-hash">Store Hash:</label>
            <input
            id="store-hash"
            type="text"
            value={storeHash}
            onChange={(e) => setStoreHash(e.target.value)}
            />

            <br />

            <label htmlFor="access-token">Access Token:</label>
            <input
            id="access-token"
            type="password"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            />

            <br />

            <button type="submit">Connect</button>
        </form>

        <div>
            {connectionStatus === 'success' && <p>Connection success</p>}
            {connectionStatus === 'error' && <p>Invalid credentials - or perhaps some other error?</p>}
        </div>
        </div>
    );
}