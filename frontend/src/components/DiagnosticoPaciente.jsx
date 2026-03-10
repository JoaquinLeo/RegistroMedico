import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import { getPacientByDni } from '../services/pacients';
import Pagination from './Pagination';
import ModalTemplate from './ModalTemplate';
import EditInfo from './EditInfo';
import ButtonLink from './ButtonLink';
import SideBar from './SideBar';
import Qr from './Qr';
import PDF from './PDF';
import ViewComment from './ViewComment';
import AddComment from './AddComment';
import CloseDiagnosis from './CloseDiagnosis';

//Recibe el DNI buscado
const DiagnosticoPaciente = ({ dni, setDni, user, diagnosticId }) => {
  const [searchParams] = useSearchParams();
  const [paciente, setPaciente] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage] = useState(3);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState();
  const [modalTitle, setModalTitle] = useState();
  const [diagnoticById, setDiagnoticById] = useState();

  //Busca el paciente en la base de datos
  useEffect(() => {
    const queryDni = searchParams.get('dni');
    const dniToSearch = queryDni ? queryDni : dni;
    setDni(dniToSearch);
    getPacientByDni(dniToSearch).then((paciente) => getComments(paciente));
  }, [dni, showModal]);

  const getComments = (paciente) => {
    setPaciente(paciente);

    // Busco el diagnotico por id
    const diagnotic = paciente.hist_diagnosticos.find(
      (diag) => diag._id === diagnosticId
    );

    setDiagnoticById(diagnotic);
  };

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;

  const currentComments =
    paciente && paciente.length !== 0 && paciente.hist_diagnosticos
      ? diagnoticById.historial.slice(indexOfFirstComment, indexOfLastComment)
      : [];

  // Callback to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <PageContainer>
      <SideBar setDni={setDni} user={user} />
      <InfoContainer>
        {/* Si el paciente existe, muestra su información */}
        {paciente && paciente.length !== 0 ? (
          <>
            <PersonalInfoContainer>
              <PersonalInfoHeader>
                <PersonalInfoTitle>Información Personal</PersonalInfoTitle>
                {user && user.username !== 'guest' && (
                  <ButtonLink
                    fontSize="16px"
                    onClick={() => {
                      setShowModal(true);
                      setModalContent(<EditInfo paciente={paciente} />);
                      setModalTitle('Editar Información Personal');
                    }}
                  >
                    Edit
                  </ButtonLink>
                )}
              </PersonalInfoHeader>

              <PersonalInfoBody>
                <PersonaInfoSeparadorLeft>
                  <PersonalInfoGroup>
                    <PersonalInfoType>Nombre y Apellido</PersonalInfoType>
                    <PersonalInfoData>
                      {paciente.nombre}, {paciente.apellido}
                    </PersonalInfoData>
                  </PersonalInfoGroup>
                  <PersonalInfoGroup>
                    <PersonalInfoType>Dni</PersonalInfoType>
                    <PersonalInfoData>{paciente.dni}</PersonalInfoData>
                  </PersonalInfoGroup>
                  <PersonalInfoGroup>
                    <PersonalInfoType>Teléfono</PersonalInfoType>
                    <PersonalInfoData>{paciente.telefono}</PersonalInfoData>
                  </PersonalInfoGroup>
                  <PersonalInfoGroup>
                    <PersonalInfoType>Dirección</PersonalInfoType>
                    <PersonalInfoData>{paciente.direccion}</PersonalInfoData>
                  </PersonalInfoGroup>
                  <PersonalInfoGroup>
                    <PersonalInfoType>Mutual y N°</PersonalInfoType>
                    <PersonalInfoData>
                      {paciente.mutual} - {paciente.num_socio}
                    </PersonalInfoData>
                  </PersonalInfoGroup>
                  <PersonalInfoGroup>
                    <PersonalInfoType>Grupo y Factor Sang.</PersonalInfoType>
                    <PersonalInfoData>
                      {paciente.grup_sang}
                      {paciente.fact_sang}
                    </PersonalInfoData>
                  </PersonalInfoGroup>
                </PersonaInfoSeparadorLeft>
                <PersonaInfoSeparadorRight>
                  <Qr paciente={paciente} />
                </PersonaInfoSeparadorRight>
              </PersonalInfoBody>
            </PersonalInfoContainer>

            <PersonalInfoContainer>
              <PersonalInfoHeader>
                <PersonalInfoTitle>Medico: {user.name}</PersonalInfoTitle>
              </PersonalInfoHeader>
              <PersonalInfoHeader>
                <InitialComentUserName>Comentario Inicial: {diagnoticById.comentario_diag}</InitialComentUserName>
              </PersonalInfoHeader>



              <CommentBodyContainer>
                {currentComments && currentComments.length === 0 ? (
                  <div>No hay comentarios aun</div>
                ) : (
                  currentComments.map((item, idx) => (
                    <CommentContainer key={idx}>
                      <CommentHeader>
                        <CommentGroup>
                          <CommentType>Fecha:</CommentType>
                          <CommentData>{item.fecha_hist}</CommentData>
                        </CommentGroup>
                        <CommentGroup>
                          <CommentType>Médico:</CommentType>
                          <CommentData>{item.medico_hist}</CommentData>
                        </CommentGroup>
                      </CommentHeader>
                      <CommentBody>
                        <CommentGroup>
                          <CommentType>Comentario:</CommentType>
                          <CommentData>{item.comentario_hist}</CommentData>
                        </CommentGroup>
                      </CommentBody>
                      <CommentBody>
                        <CommentGroup>
                          <CommentType estado={diagnoticById.estado_diag}>
                          Estado:
                        </CommentType>
                        {diagnoticById.estado_diag ? (
                          <CommentData estado={diagnoticById.estado_diag}>
                            Abierto
                          </CommentData>
                        ) : (
                          <CommentData estado={diagnoticById.estado_diag}>
                            Cerrado
                          </CommentData>
                        )}
                        </CommentGroup>
                      </CommentBody>
                      <ViewCommentBottonContainer>
                        <ButtonLink
                          fontSize="14px"
                          estado={item.estado_diag}
                          onClick={() => {
                            setShowModal(true);
                            setModalContent(<ViewComment comment={item.estado} />);
                            setModalTitle('Comentario');
                          }}
                        >
                          Ver Comentario
                        </ButtonLink>
                      </ViewCommentBottonContainer>
                    </CommentContainer>
                  ))
                )}

                <ButtonGroup>
                  {/* Si el usuario no es "Guest" puede agregar
                    comentarios */}

                  {user && user.username !== 'guest' && (
                    <AddDiagnosisButton
                      disabled={!diagnoticById.estado_diag}
                      onClick={() => {
                        setShowModal(true);
                        setModalContent(
                          <AddComment
                            dni={paciente.dni}
                            diagnosticId={diagnosticId}
                            setShowModal={setShowModal}
                            name={user.name}
                          />
                        );
                        setModalTitle('Nuevo Comentario');
                      }}
                    >
                      {diagnoticById.estado_diag
                        ? 'Nuevo Comentario'
                        : 'Diagnóstico Cerrado'}
                    </AddDiagnosisButton>
                  )}

                  {/* Si el usuario no es "Guest" puede agregar
                    cerrar el diagnostico */}
                  {user &&
                    user.username !== 'guest' &&
                    diagnoticById.estado_diag && (
                      <CloseDiagnosisButton
                        disabled={!diagnoticById.estado_diag}
                        onClick={() => {
                          setShowModal(true);
                          setModalContent(
                            <CloseDiagnosis
                              dni={paciente.dni}
                              diagnosticId={diagnosticId}
                              setShowModal={setShowModal}
                              name={user.name}
                            />
                          );
                          setModalTitle('Cerrar Diagnóstico');
                        }}
                      >
                        Cerrar Diagnóstico
                      </CloseDiagnosisButton>
                    )}
                </ButtonGroup>
                <DownloadButton
                  onClick={() => {
                    setShowModal(true);
                    setModalContent(<PDF paciente={paciente} />);
                  }}
                >
                  Descargar
                </DownloadButton>
              </CommentBodyContainer>
            </PersonalInfoContainer>
            {showModal ? (
              <ModalTemplate
                onCloseIconClick={() => setShowModal(false)}
                title={modalTitle}
                content={modalContent}
              />
            ) : null}
            <PaginationContainer>
              <Pagination
                itemsPerPage={commentsPerPage}
                currentPage={currentPage}
                totalItems={diagnoticById.historial.length}
                paginate={paginate}
              />
            </PaginationContainer>
          </>
        ) : (
          <InfoTitle>Ups, parece que no hay nadie con ese DNI.</InfoTitle>
        )}
        ;
      </InfoContainer>
    </PageContainer>
  );
};

export default DiagnosticoPaciente;

const PageContainer = styled.div`
  display: flex;
`;

const InfoContainer = styled.div`
  width: calc(100vw - 300px);
  height: calc(100vh - 64px);
  background: #f4f6f5;
`;

const PersonalInfoContainer = styled.div`
  display: flex;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  flex-direction: column;
  box-sizing: border-box;
  margin: 16px;
`;

const PersonalInfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: white;
  margin: 0px 0px 00px 10px;
  padding: 4px;
`;

const PersonalInfoTitle = styled.span`
  font-weight: bold;
  font-size: 24px;
`;
const InitialComent = styled.span`
  font-size: 20px;
`;

const InitialComentUserName = styled.span`
  font-style: italic;
  font-size: 20px;
`;

const PersonalInfoBody = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background-color: white;
  padding: 8px;
`;

const PersonaInfoSeparadorLeft = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
`;

const PersonaInfoSeparadorRight = styled.div`
  display: flex;
  width: 30%;
  align-items: center;
`;

const PersonalInfoGroup = styled.div`
  display: flex;
`;

const PersonalInfoType = styled.label`
  display: flex;
  justify-content: flex-end;
  width: 30%;
  font-size: 16px;
  margin-left: 32px;
  color: gray;
`;

const PersonalInfoData = styled.span`
  margin-left: 12px;
  font-size: 16px;
`;

const CommentContainer = styled.div`
  border: solid 1px lightgray;
  box-shadow: 0 1px 1px black;
  padding: 8px;
  margin: 4px;
  background: linear-gradient(
    0deg,
    rgb(255, 255, 255) 0%,
    rgb(233, 237, 245) 100%
  );
`;

const CommentBodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 8px;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CommentBody = styled.div`
  display: flex;
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px solid lightgray;
`;

const CommentGroup = styled.div`
  display: flex;
`;

const CommentType = styled.label`
  display: flex;
  font-size: 16px;
  color: gray;
`;

const CommentData = styled.span`
  margin-left: 6px;
  font-size: 16px;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ViewCommentBottonContainer = styled.div`
  display: flex;
  margin: auto;
  /* margin-right: 0;
  margin-left: 0.2em;*/
  width: 150px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: white;
  padding: 8px;
`;

const AddDiagnosisButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 10px;
  color: white;
  padding: 12px 24px 12px 24px;
  font-size: 15px;
  border-radius: 8px;
  background: #3498db;
  background-image: linear-gradient(to bottom, #3498db, #2980b9);
  border: none;
  transition: all 0.3s ease;
  box-shadow: 6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff;

  :hover {
    background: #3cb0fd;
    background-image: linear-gradient(to bottom, #3cb0fd, #3498db);
  }

  :active {
    background: #3498db;
    background-image: linear-gradient(to bottom, #3498db, #2980b9);
  }

  :disabled {
    background: grey;
    font-size: 18px;
    opacity: 0.8;
  }
`;

const CloseDiagnosisButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 10px;
  color: white;
  padding: 12px 24px 12px 24px;
  font-size: 15px;
  border-radius: 8px;
  background: #f5412a;
  background-image: linear-gradient(to bottom, #f5412a, #fa5f4b);
  border: none;
  transition: all 0.3s ease;
  box-shadow: 6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff;

  :hover {
    background: #eb6434;
    background-image: linear-gradient(to bottom, #fa5f4b, #eb6434);
  }

  :active {
    background: #f5412a;
    background-image: linear-gradient(to bottom, #f5412a, #fa5f4b);
  }

  :disabled {
    background: grey;
    font-size: 18px;
    opacity: 0.8;
  }
`;

const DownloadButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 140px;
  margin: 16px auto;
  color: white;
  padding: 12px 24px 12px 24px;
  font-size: 14px;
  border-radius: 8px;
  background: #3498db;
  background-image: linear-gradient(to bottom, #3498db, #2980b9);
  border: none;
  transition: all 0.3s ease;
  box-shadow: 6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff;

  :hover {
    background: #3cb0fd;
    background-image: linear-gradient(to bottom, #3cb0fd, #3498db);
  }

  :active {
    background: #3498db;
    background-image: linear-gradient(to bottom, #3498db, #2980b9);
  }
`;

const PaginationContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InfoTitle = styled.h2`
  width: 100%;
  text-align: center;
  margin: 16px 0px 0px 0px;
`;
