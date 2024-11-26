import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CertificateProps {
  studentName: string;
  courseName: string;
  completionDate: string;
  duration: number;
  certificateId: string;
  instructorName: string;
  instructorRole: string;
}

export const Certificate = React.forwardRef<HTMLDivElement, CertificateProps>(
  ({ studentName, courseName, completionDate, duration, certificateId, instructorName, instructorRole }, ref) => {
    return (
      <div
        ref={ref}
        className="w-[595px] h-[842px] bg-white relative p-12 font-serif"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)),
            url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50l-25-25h50l-25 25zm0 0l25 25h-50l25-25z' fill='%23f0f0f0' fill-opacity='0.4'/%3E%3C/svg%3E")
          `,
          border: '40px solid #1B3C59',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
      >
        <div className="absolute top-8 left-1/2 -translate-x-1/2">
          <img
            src="https://vpjalimentos.com.br/wp-content/uploads/2019/11/Logo_VPJ_Pecuaria_500x500-1.png"
            alt="VPJ Logo"
            className="w-32 mb-4"
          />
        </div>
        
        <div className="text-center mt-32 mb-12">
          <h1 className="text-4xl font-bold text-[#1B3C59] mb-2 tracking-wide">
            CERTIFICADO
          </h1>
          <div className="w-32 h-1 bg-[#8B0000] mx-auto" />
        </div>
        
        <div className="text-center mb-12">
          <p className="text-lg text-gray-700 mb-4">
            Certificamos que
          </p>
          
          <h2 className="text-3xl font-bold text-[#1B3C59] mb-4 px-8">
            {studentName}
          </h2>
          
          <p className="text-lg text-gray-700 mb-8 px-12 leading-relaxed">
            concluiu com êxito o curso de
          </p>

          <h3 className="text-2xl font-bold text-[#8B0000] mb-8 px-8">
            {courseName}
          </h3>
          
          <p className="text-lg text-gray-700 px-12 leading-relaxed">
            com carga horária de <strong>{duration} horas</strong>,<br />
            finalizado em {format(new Date(completionDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}.
          </p>
        </div>
        
        <div className="flex justify-center gap-20 mt-20">
          <div className="flex flex-col items-center">
            <div className="w-48 h-[2px] bg-gray-400" />
            <p className="mt-2 text-center">
              <strong className="block text-[#1B3C59]">{instructorName}</strong>
              <span className="text-sm text-gray-600">{instructorRole}</span>
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-48 h-[2px] bg-gray-400" />
            <p className="mt-2 text-center">
              <strong className="block text-[#1B3C59]">Dr. Roberto Santos</strong>
              <span className="text-sm text-gray-600">Diretor Acadêmico</span>
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-0 right-0 text-center text-sm text-gray-500">
          <p className="mb-1">Certificado registrado sob o número: {certificateId}</p>
          <p>
            Verifique a autenticidade em:{' '}
            <a 
              href={`https://vpj.edu.br/verificar/${certificateId}`}
              className="text-blue-600 hover:text-blue-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              vpj.edu.br/verificar/{certificateId}
            </a>
          </p>
        </div>
      </div>
    );
  }
);