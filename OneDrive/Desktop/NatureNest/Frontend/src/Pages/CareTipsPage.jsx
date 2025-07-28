import React, { useState } from 'react';
import CareTipsList from '../components/CareTipsList';
import CareTipDetail from '../components/CareTipDetail';
import BookVisitForm from '../components/BookVisitForm'; 
import './../Styles/Global.css';

function CareTipsPage() {
  const [selectedTipId, setSelectedTipId] = useState(null);
  console.log(selectedTipId);

  if (selectedTipId) {
    return (
      <>
        <CareTipDetail id={selectedTipId} onBack={() => setSelectedTipId(null)} />
        <hr style={{ margin: '30px 0' }} />
        <BookVisitForm /> 
      </>
    );
  }
  return (
    <>
      <CareTipsList onSelect={setSelectedTipId} />
      <hr style={{ margin: '30px 0' }} />
      <BookVisitForm /> 
    </>
  );
}

export default CareTipsPage;
