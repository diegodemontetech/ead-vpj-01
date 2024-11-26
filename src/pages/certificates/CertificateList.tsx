import React from 'react';
import { MainLayout } from '../../components/Layout/MainLayout';
import { Award, Download, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CertificateList = () => {
  const certificates = [
    {
      id: '1',
      courseName: 'Gestão de Pastagens',
      completionDate: '15 de Março de 2024',
      duration: 40,
      grade: 9.5,
    },
    {
      id: '2',
      courseName: 'Nutrição Animal',
      completionDate: '10 de Março de 2024',
      duration: 35,
      grade: 8.5,
    }
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-white mb-8">Meus Certificados</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => (
            <div key={certificate.id} className="bg-[#1F1F1F] rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-center w-16 h-16 bg-[#2F2F2F] rounded-full mx-auto mb-4">
                  <Award className="w-8 h-8 text-[#E50914]" />
                </div>
                <h3 className="text-lg font-semibold text-white text-center mb-4">
                  {certificate.courseName}
                </h3>
                <div className="space-y-2 text-sm text-gray-400 mb-6">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{certificate.completionDate}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{certificate.duration} horas</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/certificates/${certificate.id}`}
                    className="btn flex-1 flex items-center justify-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    Visualizar
                  </Link>
                  <button className="btn-secondary flex items-center justify-center gap-2 px-4">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};