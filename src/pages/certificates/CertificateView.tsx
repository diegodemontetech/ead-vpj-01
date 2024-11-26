import React from 'react';
import { MainLayout } from '../../components/Layout/MainLayout';
import { Certificate } from '../../components/Certificate';
import { Download, Share2, Facebook, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  LinkedinShareButton 
} from 'react-share';
import { toast } from 'sonner';

export const CertificateView = () => {
  const { certificateId } = useParams();
  const certificateRef = React.useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const shareUrl = window.location.href;

  const certificate = {
    id: certificateId,
    studentName: 'João Silva',
    courseName: 'Gestão de Pastagens',
    completionDate: '2024-03-15',
    duration: 40,
    grade: 9.5,
    instructorName: 'Dr. Carlos Mendes',
    instructorRole: 'Coordenador do Curso',
  };

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
      pdf.save(`certificado-${certificate.courseName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
      
      toast.success('Certificado baixado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar o certificado. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copiado para a área de transferência!');
    } catch (error) {
      toast.error('Erro ao copiar o link. Tente novamente.');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Certificado de Conclusão
          </h1>
          <div className="flex gap-4">
            <button
              onClick={downloadCertificate}
              disabled={isGenerating}
              className="btn flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {isGenerating ? 'Gerando...' : 'Download PDF'}
            </button>
            
            <div className="flex items-center gap-2">
              <FacebookShareButton url={shareUrl}>
                <div className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                  <Facebook className="w-5 h-5" />
                </div>
              </FacebookShareButton>
              
              <TwitterShareButton url={shareUrl}>
                <div className="p-2 text-blue-400 hover:bg-blue-50 rounded-full transition-colors">
                  <Twitter className="w-5 h-5" />
                </div>
              </TwitterShareButton>
              
              <LinkedinShareButton url={shareUrl}>
                <div className="p-2 text-blue-700 hover:bg-blue-50 rounded-full transition-colors">
                  <Linkedin className="w-5 h-5" />
                </div>
              </LinkedinShareButton>
              
              <button
                onClick={copyShareLink}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <LinkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8">
          {/* Certificate Preview */}
          <div className="flex justify-center mb-8">
            <div className="transform scale-50 origin-top">
              <Certificate
                ref={certificateRef}
                studentName={certificate.studentName}
                courseName={certificate.courseName}
                completionDate={certificate.completionDate}
                duration={certificate.duration}
                certificateId={certificate.id!}
                instructorName={certificate.instructorName}
                instructorRole={certificate.instructorRole}
              />
            </div>
          </div>

          {/* Certificate Details */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Detalhes do Certificado
            </h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Aluno</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {certificate.studentName}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Curso</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {certificate.courseName}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Data de Conclusão
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(certificate.completionDate).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Carga Horária
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {certificate.duration} horas
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Nota Final
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {certificate.grade}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Código de Verificação
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {certificate.id}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};