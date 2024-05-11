import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import the CSS for react-quill
import { IoIosArrowBack, IoMdSave } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../Firebase';
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import html2canvas from 'html2canvas'; // Import html2canvas
import { jsPDF } from 'jspdf'; // Import jsPDF

const EditAgreement = () => {
  const navigate = useNavigate();
  const { agreementId } = useParams();
  const [isEditable, setIsEditable] = useState(false);
  const [agreementText, setAgreementText] = useState('');
  const [agreementName, setAgreementName] = useState('');
  const [agreementDescription, setAgreementDescription] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const quillRef = useRef(null);
  const auth = getAuth();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/dashboard');
    }
  }, [auth, navigate]);

  useEffect(() => {
    const fetchAgreement = async () => {
      const docRef = doc(db, "agreements", agreementId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const formattedHtml = convertPlainTextToHtml(docSnap.data().text);
        setAgreementText(formattedHtml);
        setAgreementName(docSnap.data().name);
        setAgreementDescription(docSnap.data().description);
      } else {
        console.log("No such document!");
      }
    };
    fetchAgreement();
  }, [agreementId]);

  const convertPlainTextToHtml = (text) => {
    return text.split('\n').map((item, key) => `<span key=${key}>${item}<br/></span>`).join('');
  };
  

  const toggleEdit = () => {
    setIsEditable(!isEditable);
    if (isEditable) {
      saveAgreement();
    }
  };

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'header': '1' }, { 'header': '2' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const saveAgreement = async () => {
    if (quillRef.current) {
      const agreementRef = doc(db, "agreements", agreementId);
      await updateDoc(agreementRef, {
        text: quillRef.current.getEditor().root.innerHTML,
        name: agreementName,
        description: agreementDescription
      });
      setIsSaved(true);
      setShowModal(true);
      setTimeout(() => {
        setIsSaved(false);
        setShowModal(false);
      }, 2000); // Modal disappears after 2 seconds
    } else {
      console.error('The editor has not been initialized yet.');
    }
  };
  
  const deleteAgreement = async () => {
    const agreementRef = doc(db, "agreements", agreementId);
    await deleteDoc(agreementRef);
    navigate('/dashboard');
  };


  const copyLinkToClipboard = () => {
    const link = `https://klorah.app/share-agreement/${agreementId}`;
    navigator.clipboard.writeText(link).then(() => {
      alert('Link copied to clipboard');
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  const exportPdf = () => {
    const input = document.getElementById('agreementContent');
    html2canvas(input, { scale: window.devicePixelRatio }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = 595.28;
      const pdfHeight = 841.89;
      const margin = 28.35;
      const contentWidth = pdfWidth - 2 * margin;
      const contentHeight = (canvas.height * contentWidth) / canvas.width;
  
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'pt',
        format: 'a4'
      });
  
      if (contentHeight <= pdfHeight - 2 * margin) {
        pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, contentHeight);
      } else {
        const scaledHeight = pdfHeight - 2 * margin;
        const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
        pdf.addImage(imgData, 'PNG', margin, margin, scaledWidth, scaledHeight);
      }
  
      // Generate a blob from the PDF and send it in the POST request
      const blob = pdf.output('blob');
      const formData = new FormData();
      formData.append('file', blob, `${agreementName}.pdf`);
      formData.append('signer_email', 'signer@example.com'); // Replace with actual data
      formData.append('signer_name', 'Signer Name'); // Replace with actual data
      formData.append('document_title', agreementName);
  
      fetch('https://klorah-fast-server-9266fe8d441a.herokuapp.com/send-signature-request', {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(data => {
        console.log('PDF uploaded and signature requested successfully', data);
      })
      .catch(error => {
        console.error('Error in signature request:', error);
      });
    });
  };
  
  

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <IoIosArrowBack size={28} color="black" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
        <span style={{ fontSize: '20px', fontWeight: 'bold', marginLeft: '10px' }}>Edit Agreement</span>
      </div>

      {showModal && (
          <div style={{ 
            position: 'fixed', top: '50%', left: '50%', 
            transform: 'translate(-50%, -50%)', 
            backgroundColor: 'white', padding: '20px', 
            borderRadius: '5px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)'
          }}>
            <p>Agreement saved successfully!</p>
          </div>
      )}

  
      <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', margin: '20px 0' }}>
        {isEditable ? (
          <>
            <input 
              value={agreementName}
              onChange={(e) => setAgreementName(e.target.value)}
              style={{ fontSize: '24px', fontWeight: 'bold', display: 'block', marginBottom: '20px' }}
            />
            <input 
              value={agreementDescription}
              onChange={(e) => setAgreementDescription(e.target.value)}
              style={{ fontSize: '18px', display: 'block', marginBottom: '20px' }}
            />
            <ReactQuill
              ref={quillRef}
              value={agreementText}
              onChange={setAgreementText}
              modules={quillModules}
            />
          </>
        ) : (
          <div id="agreementContent">
            <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>{agreementName}</h1>
            <p style={{ fontSize: '18px' }}>{agreementDescription}</p>
            <div dangerouslySetInnerHTML={{ __html: agreementText }} />
          </div>
        )}
  
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
          <IoMdSave size={28} color={isSaved ? "green" : "black"} onClick={saveAgreement} style={{ cursor: 'pointer' }} />
        </div>
  
        <button onClick={saveAgreement} style={{ backgroundColor: 'black', padding: '12px', borderRadius: '5px', width: '60%', margin: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
          <span style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>Save</span>
        </button>
      </div>
  
      <div style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 1000 }}>
        <div className="hover-visible">
          <button onClick={toggleEdit} style={{ backgroundColor: 'black', color: 'white', padding: '10px', borderRadius: '5px', cursor: 'pointer', marginRight: '20px' }}>Edit</button>
          <button onClick={deleteAgreement} style={{ backgroundColor: 'black', color: 'white', padding: '10px', borderRadius: '5px', cursor: 'pointer', marginRight: '20px' }}>Delete</button>
          <button onClick={copyLinkToClipboard} style={{ backgroundColor: 'black', color: 'white', padding: '10px', borderRadius: '5px', cursor: 'pointer', marginRight: '20px' }}>Copy Link</button>
        </div>
        <div onClick={exportPdf} style={{ display: 'flex', justifyContent: 'center' }}>
          <button onClick={exportPdf} style={{ color: 'black', padding: '10px', borderRadius: '5px', cursor: 'pointer', textAlign: 'center', textDecoration: 'none' }}>Export as PDF</button>
        </div>
      </div>
    </div>
  );  
};

export default EditAgreement;
