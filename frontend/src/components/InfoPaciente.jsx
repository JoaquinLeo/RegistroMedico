import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import styled from 'styled-components';

import { getPacientByDni } from '../services/pacients';
import Pagination from './Pagination';
import ModalTemplate from './ModalTemplate';
import EditInfo from './EditInfo';
import AddDiagnosis from './AddDiagnosis';
import ButtonLink from './ButtonLink';
import ButtonLinkPaciente from './ButtonLinkPaciente';
import SideBar from './SideBar';
import Qr from './Qr';
import PDF from './PDF';

//Recibe el DNI buscado
const InfoPaciente = ({ dni, setDni, user, setDiagnosticId }) => {
  const [searchParams] = useSearchParams();
  const [paciente, setPaciente] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [diagnosticPerPage] = useState(2);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState();
  const [modalTitle, setModalTitle] = useState();

  //Busca el paciente en la base de datos
  useEffect(() => {
    const queryDni = searchParams.get('dni');
    queryDni && setDni(queryDni);
    getPacientByDni(queryDni ? queryDni : dni).then((paciente) =>
      setPaciente(paciente)
    );
  }, [dni, showModal]);

  // Get current comments
  const indexOfLastDiagnostic = currentPage * diagnosticPerPage;
  const indexOfFirstDiagnostic = indexOfLastDiagnostic - diagnosticPerPage;
  const currentDiagnostic =
    paciente &&
    paciente.length !== 0 &&
    paciente.hist_diagnosticos.slice(
      indexOfFirstDiagnostic,
      indexOfLastDiagnostic
    );

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
                      setModalContent(
                        <EditInfo paciente={paciente} user={user} />
                      );
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
                  <PersonalInfoGroup>
                    <PersonalInfoType>Alergias</PersonalInfoType>
                    <PersonalInfoData>
                      {paciente.alergias.join(' - ')}
                    </PersonalInfoData>
                  </PersonalInfoGroup>
                  <PersonalInfoGroup></PersonalInfoGroup>
                </PersonaInfoSeparadorLeft>
                <PersonaInfoSeparadorRight>
                  <Qr paciente={paciente} />
                </PersonaInfoSeparadorRight>
              </PersonalInfoBody>
            </PersonalInfoContainer>

            {/*---------------Inicio de diagnostco ----------------------------------- */}

            <PersonalDiagnosticContainer>
              <PersonalInfoHeader>
                <PersonalInfoTitle>Diagnósticos</PersonalInfoTitle>
              </PersonalInfoHeader>
              <CommentBodyContainer>
                {currentDiagnostic.map((item, idx) => (
                  <CommentContainer key={idx} estado={item.estado_diag}>
                    <CommentHeader>
                      <CommentGroup>
                        <CommentType estado={item.estado_diag}>
                          Fecha:
                        </CommentType>
                        <CommentData estado={item.estado_diag}>
                          {item.fecha_diag}
                        </CommentData>
                      </CommentGroup>
                      <CommentGroup>
                        <CommentType estado={item.estado_diag}>
                          Médico:
                        </CommentType>
                        <CommentData estado={item.estado_diag}>
                          {item.medico_diag}
                        </CommentData>
                      </CommentGroup>
                      <CommentGroup>
                        <CommentType estado={item.estado_diag}>
                          Especialidad:
                        </CommentType>
                        <CommentData estado={item.estado_diag}>
                          {item.rama_diag}
                        </CommentData>
                      </CommentGroup>
                      <CommentGroup>
                        <CommentType estado={item.estado_diag}>
                          Estado del Diagnóstico:
                        </CommentType>
                        {item.estado_diag ? (
                          <CommentData estado={item.estado_diag}>
                            Abierto
                          </CommentData>
                        ) : (
                          <CommentData estado={item.estado_diag}>
                            Cerrado
                          </CommentData>
                        )}
                      </CommentGroup>
                    </CommentHeader>
                    <CommentBody>
                      <CommentGroup>
                        <CommentType estado={item.estado_diag}>
                          Comentario:
                        </CommentType>
                        <CommentData estado={item.estado_diag}>
                          {item.comentario_diag}
                        </CommentData>
                      </CommentGroup>
                    </CommentBody>
                    <ViewCommentBottonContainer>
                      <Link to="/diagnostic">
                        <ButtonLinkPaciente
                          fontSize="14px"
                          estado={item.estado_diag}
                          onClick={() => setDiagnosticId(item._id)}
                        >
                          Ver Diagnóstico
                        </ButtonLinkPaciente>
                      </Link>
                    </ViewCommentBottonContainer>
                  </CommentContainer>
                ))}

                {/* Si el usuario no es "Guest" puede agregar
                comentarios */}
                <Botones>
                {user && user.username !== 'guest' && (
                  <AddDiagnosisButton
                    onClick={() => {
                      setShowModal(true);
                      setModalContent(
                        <AddDiagnosis
                          dni={paciente.dni}
                          setShowModal={setShowModal}
                          name={user.name}
                        />
                      );
                      setModalTitle('Agregar Diagnóstico');
                    }}
                  >
                    Nuevo Diagnóstico
                  </AddDiagnosisButton>
                )}
                <DownloadButton
                  onClick={() => {
                    setShowModal(true);
                    setModalContent(<PDF paciente={paciente} />);
                  }}
                >
                  Descargar
                </DownloadButton>
                </Botones>
              </CommentBodyContainer>
            </PersonalDiagnosticContainer>
            {showModal ? (
              <ModalTemplate
                onCloseIconClick={() => setShowModal(false)}
                title={modalTitle}
                content={modalContent}
              />
            ) : null}
            <PaginationContainer>
              <Pagination
                itemsPerPage={diagnosticPerPage}
                currentPage={currentPage}
                totalItems={paciente.hist_diagnosticos.length}
                paginate={paginate}
              />
            </PaginationContainer>{' '}
          </>
        ) : (
          <InfoTitle>Ups, parece que no hay nadie con ese DNI.</InfoTitle>
        )}
        ;
      </InfoContainer>
    </PageContainer>
  );
};

export default InfoPaciente;

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
  background: #f8f9fd;
  background: linear-gradient(
    0deg,
    rgb(255, 255, 255) 0%,
    rgb(244, 247, 251) 100%
  );
  border-radius: 40px;
  padding: 15px 40px;
  border: 5px solid rgb(255, 255, 255);
  box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 30px 30px -20px;
`;

const PersonalDiagnosticContainer = styled.div`
  display: flex;
  height: 55vh;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  flex-direction: column;
  box-sizing: border-box;
  margin: 16px;
  background: #f8f9fd;
  background: linear-gradient(
    0deg,
    rgb(255, 255, 255) 0%,
    rgb(244, 247, 251) 100%
  );
  border-radius: 40px;
  padding: 15px 40px;
  border: 5px solid rgb(255, 255, 255);
  box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 30px 30px -20px;
`;


const PersonalInfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px;
`;

const PersonalInfoTitle = styled.span`
  font-weight: bold;
  font-size: 24px;
`;

const PersonalInfoBody = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
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
  box-shadow: 0 1px 1px black;
  padding: 8px;
  margin: 4px;
  border: 1px solid rgb(0 49 83);
  border-radius: 7px;
  height: 22%;

  background: #e1f2ee;
  background: linear-gradient(
    0deg,
    rgb(255, 255, 255) 0%,
    rgb(179, 242, 223) 100%
  );
  border-radius: 40px;
  padding: 15px 40px;
  border: 5px solid rgb(255, 255, 255);
  box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 30px 30px -20px;
  );

  background: ${({ estado }) => !estado && '#e0d1cc'};
`;

const CommentBodyContainer = styled.div`
  display: flex;
  flex-direction: column;
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
  color: ${({ estado }) => (estado ? 'black' : 'gray')};
`;

const CommentData = styled.span`
  margin-left: 6px;
  font-size: 16px;
  color: ${({ estado }) => (estado ? 'black' : 'gray')};

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ViewCommentBottonContainer = styled.div`
  display: flex;
  margin: auto;
  margin-right: 0;
  width: 150px;
`;

const AddDiagnosisButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 240px;
  color: white;
  padding: 12px 24px 12px 24px;
  font-size: 18px;
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

const DownloadButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 140px;
  color: white;
  padding: 12px 24px 12px 24px;
  font-size: 18px;
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

const Botones = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 2%;
  align-items: center;
  justify-content: center;
  gap: 20px;
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
