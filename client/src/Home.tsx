import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';

interface ServerResponse {
  certificateHeader: string;
  certificate: string;
  health: string;
}

const HomePage: React.FC = () => {
  const [message, setMessage] = useState<ServerResponse>({
    certificateHeader: '',
    certificate: '',
    health: '',
  });

  const handleCertificate = async () => {
    try {
      const response = await axios.get('https://localhost:8081/certificate', {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setMessage({ ...message, certificate: response.data, certificateHeader: 'Base64 encoded certificate:', health: '' });
    } catch (error) {
      console.error('Error handling certificate:', error);
      setMessage({ ...message, certificate: 'Error handling certificate.', health: '' });
    }
  };

  const handleHealth = async () => {
    try {
      const response = await axios.get('https://localhost:8081/health');
      setMessage({ ...message, health: response.data, certificate: '', certificateHeader: '' });
    } catch (error) {
      console.error('Error fetching health:', error);
      setMessage({ ...message, health: 'Error fetching health.' });
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full">
        <CardContent className="space-y-4">
          <div className='flex justify-center items-center'>
            <div className="flex flex-col items-center mr-8">
              <div className="mb-8">
                <Label className="text-3xl">Base64 Certificate</Label>
              </div>
              <Button className='m-2 w-72' onClick={handleHealth}>Server Health</Button>
              <Button className='m-2 w-72' onClick={handleCertificate}>Get Certificate String</Button>
              <p className="m-2 w-72 text-sm text-gray-600">
                Note: If you click the "Get Certificate String" button after getting a certificate string or if there is no certificate available in your local user,
                it may show an error.
              </p>
            </div>
            <div className='flex flex-col items-center max-w-96'>
              {message.certificateHeader && (
                <p className='text-xl mb-4'>Base64 encoded Certificate:</p>
              )}
                <Card className='max-w-96 p-4'>
                  {message.health && (
                    <div>
                      <div className="max-h-24 flex justify-center items-center">
                        <p>{message.health}</p>
                      </div>
                    </div>
                  )}
                  {message.certificate && (
                    <div>
                      <div className="max-h-96 max-w-96 overflow-y-auto break-all">
                        <p>{message.certificate}</p>
                      </div>
                    </div>
                  )}
                </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
