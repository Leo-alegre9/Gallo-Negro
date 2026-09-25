import React from 'react';
import { ArrowUpRight, Clock3, Mail, MapPin, Phone } from 'lucide-react';
import '../../css/visit-us.css';

const phone = '1135879396';
const email = 'ventas@gallonegroba.com.ar';
const address = 'Villa Udaondo 4560, Ituzaingó, Provincia de Buenos Aires';
const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

export default function VisitUs() {
 return (
  <section id="contacto" className="visit-us" aria-labelledby="visit-us-title">
   <div className="shell visit-us-layout">
    <div className="visit-us-content">
     <p className="visit-us-intro"><MapPin size={16} aria-hidden="true" /> Visitanos</p>
     <h2 id="visit-us-title">El taller te espera.</h2>
     <p className="visit-us-description">Vení a conocer las piezas de cerca. Encontranos en Villa Udaondo, Ituzaingó.</p>

     <div className="visit-us-details">
      <div className="visit-us-detail">
       <MapPin size={19} aria-hidden="true" />
       <div><h3>Dirección</h3><p>{address}</p></div>
      </div>
      <div className="visit-us-detail">
       <Clock3 size={19} aria-hidden="true" />
       <div><h3>Atención al cliente</h3><p>Lunes a viernes, de 8 a 16 h</p></div>
      </div>
      <div className="visit-us-detail">
       <Phone size={19} aria-hidden="true" />
       <div><h3>Teléfono</h3><a href={`tel:+54${phone}`}>11 3587-9396</a></div>
      </div>
      <div className="visit-us-detail">
       <Mail size={19} aria-hidden="true" />
       <div><h3>Correo</h3><a href={`mailto:${email}`}>{email}</a></div>
      </div>
     </div>
    </div>

    <div className="visit-us-map">
     <iframe
      title="Mapa para llegar al taller de Gallo Negro en Villa Udaondo"
      src={mapUrl}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
     />
     <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
      Cómo llegar <ArrowUpRight size={17} aria-hidden="true" />
     </a>
    </div>
   </div>
  </section>
 );
}
