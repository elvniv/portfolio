import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../Firebase';

const DownloadSignedAgreement = () => {
  const { agreementId } = useParams();
  const [signedUrl, setSignedUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSignedAgreement = async () => {
      try {
        const signedAgreementRef = ref(storage, `signed_agreements/${agreementId}.pdf`);
        const url = await getDownloadURL(signedAgreementRef);
        setSignedUrl(url);
      } catch (err) {
        setError('Error fetching signed agreement');
      }
      setLoading(false);
    };

    fetchSignedAgreement();
  }, [agreementId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Download Signed Agreement</h2>
      {signedUrl ? (
        <a href={signedUrl} download={`signed_agreement_${agreementId}.pdf`}>
          Download Signed Agreement
        </a>
      ) : (
        <p>No signed agreement available</p>
      )}
    </div>
  );
};

export default DownloadSignedAgreement;