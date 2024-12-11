"use client";

import Card from "@/components/card";
import dataTests from "@/constants/dataTests.json";
import dataUser from "@/constants/dataUserTests.json";
import Image from "next/image";
import { useState, ChangeEvent, KeyboardEvent, useEffect } from "react";
import ImageComponent from "@/components/image";
import { Header } from "@/components/header";
import Link from "next/link";
import axios from "axios";

// tipo de dado para os participantes
type Person = {
  id: number;
  name: string;
  image: string;
};
// dados enviados dos projetos
type IProject = {
  id?: number,
  name: string;
  goals: string[];
  description: string;
  users: Person[];
  image: string;
};

interface user {
    id: string;
    name: string;
    image: string;
    bio: string;
    gitUseraname: string | null;
    instructor: number;
    isUser: boolean;
}

const Projects = () => {

  const u : user = {id: "1", name: "Mariana", bio: "slaaa", image: "https://img.freepik.com/fotos-premium/um-coala-com-rosto-preto-e-branco_900101-50964.jpg", gitUseraname: 'xmarimarquesh', instructor: 0, isUser: true}
    
  const [usuario, setUsuario] = useState(u);

  const [openModalInfo, setOpenModalInfo] = useState<boolean>(false);
  const [openModalAddPeople, setOpenModalAddPeople] = useState<boolean>(false);

  // variáveis de estado para o projeto
  const [nameProject, setNameProject] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [personValue, setPersonValue] = useState<string>("");
  const [goalValue, setGoalValue] = useState<string>("");

  const [project, setProject] = useState<IProject[]>([]);
  const [newImage, setNewImage] = useState<string>("");
  const token = localStorage.getItem('token')

 // listas que armazenam informaç~çoes inputadas
  const [goals, setGoals] = useState<string[]>([]);
  const [listContributors, setListContributors] = useState<Person[]>([]);

  // estado para armazenar o projeto criado
  const [infoProject, setInfoProject] = useState<IProject>();

  // atualiza o nome do projeto
  const setNameOfProject = (event: ChangeEvent<HTMLInputElement>) => {
    setNameProject(event.target.value);
  };

  // atualiza a descrição do projeto
  const setDescriptionOfProject = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  // função para pesquisar pessoas
  const setValuePerson = (event: ChangeEvent<HTMLInputElement>) => {
    setPersonValue(event.target.value);
  };

  // função para adicionar um objetivo quando clica no incone de mais
  const addGoal = () => {
    let goal = goalValue.trim(); 
    if (goal && !goals.includes(goal)) {
      setGoals((prevList) => [...prevList, goal]); // adiciona o objetivo ao array
      setGoalValue(""); // limpa o campo após adicionar para melhor ux
    }
  };

  // se apertar enter tbm adicionar objetivo
  const handleGoalKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addGoal();
    }
  };

  // função para adicionar uma pessoa à lista de participantes
  const addPeopleToList = (person: Person) => {
    if (!listContributors.find((p) => p.id === person.id)) {
      setListContributors((prevList) => [...prevList, person]); // Adiciona o participante
    }
  };

    useEffect(() => {
       
        const fetchProjects = async () => {
          try {
            const response = await axios.get("http://localhost:8080/project", {
              headers: {
                Authorization: `Bearer ${token}`, 
              },
            });
    
            setProject(response.data);
          } catch (err) {
                console.error(err);
          }
        };
    
        // chama a função para buscar os dados
        fetchProjects();
      }, []); // O array vazio [] faz com que o efeito seja executado apenas uma vez (quando o componente monta)

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            setNewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
        }
    };

  // função para finalizar o projeto e salvar os dados
  const setInfos = () => {

    const newProject: IProject = {
        name: nameProject,
        goals: goals,
        description: description,
        users: listContributors,
        image: newImage,
    };

    try {
        const response = await fetch('http://localhost:8080', {
            method: 'POST',
            headers:{
                `Baerer ${token}`
            } 
        })

    }

    // adiciona o novo projeto à lista de projetos
    setInfoProject(newProject);

    setProject((prevProjects) => [...prevProjects, newProject]);

    // reseta os campos para o próximo projeto
    setNameProject("");
    setDescription("");
    setGoals([]);
    setListContributors([]);
    setPersonValue("");
    setGoalValue("");

    // fecha o modal
    setOpenModalAddPeople(false)
  };

//   const setInfos = async () => {
//     const newProject: IProject = {
//       name: nameProject,
//       goals: goals,
//       description: description,
//       users: listContributors,
//       image: newImage,
//     };
  
//     try {
//       // Envia o projeto para a API via POST
//       const response = await fetch('/api/projects', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${jwtToken}`, // se você precisar enviar o JWT no header
//         },
//         body: JSON.stringify(newProject),
//       });
  
//       // Verifica se a resposta foi bem-sucedida
//       if (response.ok) {
//         const data = await response.json(); // Resposta da API (caso haja)
//         setProjects((prevProjects) => [...prevProjects, data]); // Adiciona o projeto ao estado local
//         alert('Projeto criado com sucesso!');
//       } else {
//         const errorData = await response.json();
//         console.error('Erro ao criar o projeto:', errorData.message);
//         alert(`Erro ao criar o projeto: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Erro na requisição:', error);
//       alert('Houve um erro na criação do projeto.');
//     }
  
//     // Reseta o formulário
//     setNameProject('');
//     setDescription('');
//     setGoals([]);
//     setListContributors([]);
//     setPersonValue('');
//     setGoalValue('');

  const deleteGoal = (goalToRemove : string) => {
    setGoals((prevGoals) => prevGoals.filter(goal => goal !== goalToRemove));
  }

  console.log(infoProject)

   function deletePerson(personToRemove: Person) {
        setListContributors((prevList) => prevList.filter(person => person !== personToRemove))
   }

   // IMAGEMMMMMMMMMM

 
  return (
    <div className="flex flex-col mt-20">
        <Header/>
        <div className="pr-20 pl-20 pt-10 w-[100%]">
            {/* Modal de criação do projeto */}
            {openModalInfo && (
                <div className={styles.modalContainer}>
                <form action={"POST"} id="modal" className={styles.modalBox}>
                    <h1 className={styles.title}>Crie um novo projeto</h1>
                    <div className="flex flex-col items-center space-y-4">
                        <input type="file" accept="image/*" capture="environment" id="cameraInput" onChange={handleImageChange} className="hidden"/>
                        <label htmlFor="cameraInput" className="cursor-pointer">
                        {newImage ? (
                            <img src={newImage} alt="Nova Imagem" className="w-96 h-64 object-cover rounded-lg"/>
                            ) : (
                                <div className="w-96 h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">Adicione uma imagem</div>
                            )}
                        </label>
                    </div>
                    <div className={styles.content}>

                    <input
                        className={styles.input + 'capitalize'}
                        onChange={setNameOfProject}
                        value={nameProject}
                        type="text"
                        placeholder="Digite o nome de seu projeto"
                        required
                    />

                    <input
                        className={styles.input}
                        onChange={setDescriptionOfProject}
                        value={description}
                        type="text"
                        placeholder="Digite uma descrição para o seu projeto"
                        required
                    />

                    <div className="flex gap-10">
                        <input
                        className={styles.inputObj}
                        type="text"
                        value={goalValue} 
                        onChange={(e) => setGoalValue(e.target.value)} // atualiza o valor do objetivo
                        onKeyDown={handleGoalKeyDown} // chama addGoal quando pressionar Enter
                        placeholder="Adicione objetivos ao seu projeto"
                        required
                        />
                        <div className="self-center " onClick={addGoal}>
                        <ImageComponent
                            src={"icons8-adicionar-100.png"}
                            width={50}
                            height={50}
                            alt="Adicionar objetivo"
                            className={styles.icon}
                        />
                        </div>
                    </div>
                    </div>

                    {goals.length > 0 && (
                    <div className="flex flex-col justify-items-stretch bg-gray-100 overflow-y-scroll max-h-[100px] rounded p-2 m-4 w-[79%] scrollbar-thin scrollbar-thumb-blue3 scrollbar-track-gray-100">
                        {goals.map((goal, index) => {
                        return (
                            <div key={index} className="flex items-center justify-between m-2">
                            <ImageComponent src="topic3.png" width={25} height={25} alt="topic" />
                            <h1 className="flex-wrap">{goal}</h1>
                            <div className="ml-auto" onClick={() => {deleteGoal(goal)}} >
                                <ImageComponent
                                className="cursor-pointer"
                                src="menos.png"
                                width={30}
                                height={30}
                                alt="topic"
                                />
                            </div>
                            </div>
                        );
                        })}
                    </div>
                    )}


                    <div className="flex justify-end gap-3">
                    <button
                        className={styles.btnNext}
                        onClick={() => {
                        if((nameProject && description)) {

                            setOpenModalInfo(false);
                            setOpenModalAddPeople(true);
                            //   setInfos(); // Salva o projeto ao clicar
                        }
                        }}>
                        Próximo
                    </button>
                    <button
                        className={styles.btnCancel}
                        onClick={() => {
                        setOpenModalInfo(false);
                        }}
                    >
                        Cancelar
                    </button>
                    </div>
                </form>
                </div>
            )}

            {/* Modal para adicionar pessoas ao projeto */}
            {openModalAddPeople && (
                <div className={styles.modalContainer}>
                <form action={"POST"} id="modal" className={styles.modalNext}>
                    <h1 className={styles.title}>Adicione pessoas ao seu projeto</h1>
                    <div className={`${styles.content} mb-8`}>
                    <div className="flex gap-10">
                        <input
                        id="person"
                        className={styles.input}
                        onChange={setValuePerson}
                        type="text"
                        placeholder="Pesquise por participantes..."
                        value={personValue}
                        />
                    </div>

                    {/* exibição das pessoas encontradas */}
                    <div className={styles.peopleSelect}>
                        {dataUser
                        .filter((person) =>
                            person.name.toLowerCase().includes(personValue.toLowerCase())
                        )
                        .map((person) => (
                            <div
                            key={person.id}
                            className={styles.person}
                            onClick={() => addPeopleToList(person)}
                            >
                            <ImageComponent
                                src={person.image}
                                width={40}
                                height={40}
                                alt={person.name}
                                className={styles.imgProfile}
                            />
                            <p className="self-center ">{person.name}</p>
                            <div className="ml-auto" >
                                <ImageComponent
                                    src={"icons8-adicionar-100.png"}
                                    width={30}
                                    height={30}
                                    alt=""
                                    className={styles.iconAdd}
                                />
                            </div>
                            </div>
                        ))}
                    </div>

                    <p className="my-4 ">Abaixo irão aparecer as pessoas adicionadas</p>

                    {/* exibe as pessoas que foram selecionadas */}
                    {listContributors.length > 0 && (
                        <div className={styles.people}>
                        {listContributors.map((person) => (
                            <div key={person.id} className={styles.person}>
                            <ImageComponent
                                src={person.image}
                                width={40}
                                height={40}
                                alt={person.name}
                                className={styles.imgProfile}
                            />
                            <p className="self-center">{person.name}</p>
                            <div className="ml-auto" onClick={() => {deletePerson(person)}} >
                                <ImageComponent
                                className="cursor-pointer"
                                src="menos.png"
                                width={30}
                                height={30}
                                alt="topic"
                                />
                            </div>
                            </div>
                        ))}
                        </div>
                    )}
                    </div>

                    <div className="flex justify-center gap-3">
                    <button
                        className={styles.btnNext}
                        onClick={() => {
                        setInfos(); // finaliza o projeto e salva
                        }}
                    >
                        Finalizar
                    </button>

                    <button
                        className={styles.btnCancel}
                        onClick={() => {
                        setOpenModalAddPeople(false);
                        }}
                    >
                        Cancelar
                    </button>
                    </div>
                </form>
                </div>
            )}

            <div className={styles.header}>
                <h1 className={styles.title}>Seus projetos</h1>
                <p>Seus projetos aparecem aqui</p>

                {/* Add projects */}
                    <div className="flex justify-end">
                        <div  className="w-auto" onClick={() => setOpenModalInfo(true)}>
                            <ImageComponent src={'icons8-adicionar-100.png'} width={50} height={50} alt="" className={styles.icon} />
                        </div>
                    </div>
            </div>

            {/* Cards view */}
    
                <div className={styles.container}>

                {project?.length === 0 ? (
                    <p className="text-slate-400" >Você ainda não tem projetos</p> 
                ) : (
                    project?.map((item, index) => (
                    <Link key={index} href={`/projectSelected?id=${item.id}`}>
                        <Card title={item.name} mainQuestion={item.description} image={item.image} />
                    </Link>
                    ))
                )}
                </div>

            </div>
        </div>
  );
};

export default Projects;


const styles = {
  title: "text-blue1 text-3xl",
  input: " w-full p-2 my-4 border-b border-blue3 outline-none ease-in-out hover:border-blue1 ",
  inputObj: "capitalize w-[500px] p-2 my-4 border-b border-blue3 outline-none ease-in-out hover:border-blue1",
  content: "m-4",
  header: "",
  container: "flex justify-center items-center flex-wrap m-10 mx-35 gap-8",
  icon: "cursor-pointer h-12 w-auto self-center",
  iconAdd: "cursor-pointer h-8 w-auto self-end",
  modalContainer:
    "h-screen w-screen object-contain flex justify-center fixed items-center top-0 left-0 bg-[#000000A0]",
  modalBox:
    "bg-white w-[600px] p-4 w-auto flex-wrap rounded shadow-[0_0_5px_2px_rgba(0,0,0,0.3)]",
  modalNext:
    "bg-white w-[600px] p-4 rounded shadow-[0_0_5px_2px_rgba(0,0,0,0.3)] max-h-[90%]",
  btnNext: "bg-blue-500 text-white rounded-md px-3 py-3 hover:bg-blue-800",
  btnCancel: "bg-red-500 text-white rounded-md px-3 py-3 hover:bg-red-800",
  peopleSelect: "flex flex-col mt-2 overflow-y-scroll h-60 bg-gray-100 p-4 rounded ",
  people: "flex max-h-60 flex-col mt-2 overflow-y-scroll bg-gray-100 rounded",
  person: "flex gap-2 items-center cursor-pointer m-2",
  imgProfile: "object-cover rounded-full w-10 h-10 flex flex-row items-end justify-end",
};