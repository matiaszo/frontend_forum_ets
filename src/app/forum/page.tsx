"use client"

import Card from "@/components/card";
import dataTests from "@/constants/dataTests.json";
import search from "@/assets/search.png";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

import plus from "@/assets/icons8-adicionar-100.png";
import { CldImage, CldUploadWidget } from "next-cloudinary";

const cloudPresetName = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;

interface user {
    id: string;
    name: string;
    image: string;
    bio: string;
    email: string;
    edv: string;
    gitUsername: string;
    instructor: number;
    isUser: boolean;
  }

interface forum {
    image: string;
    title: string;
    mainQuestion: string;
    nameInstructor: string;
}
  

const Forum = () => {
   
    const [usuario, setUsuario] = useState<user>({
        id: '',
        name: '',
        image: '',
        bio: '',
        gitUsername: '',
        email: '',
        edv: '',
        instructor: 0,
        isUser: false,
    });

    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = (event : any) => {
        setSearchValue(event.target.value);
    };

    const styles = {
        h1: "text-blue1 text-3xl font-robCondensed",
        box: "flex w-[100%] gap-4 items-end justify-end", 
        search: "border-b-2 border-blue1 w-[100%] p-2 outline-none", 
    };

    const initialforums: forum[] = [
        {
          image: "deqroecwubhy0olevakk",
          title: "Fábrica e tals",
          mainQuestion: "novidade nao sei o que lá",
          nameInstructor: "Fulano de Tal",
        },
        {
          image: "deqroecwubhy0olevakk",
          title: "Braço e tals",
          mainQuestion: "muitos braços vindos ai",
          nameInstructor: "Fulaninho de Talinho",
        },
      ];

    const [modalAdd, setModalAdd] = useState<boolean>(false);
    const [newForum, setNewForum] = useState<forum[]>(initialforums);
    const [newImage, setNewImage] = useState<string>("");
    const [newTitle, setNewTitle] = useState<string>("");
    const [newInstructor, setNewInstructor] = useState<string>("");
    const [newMainQuestion, setNewMainQuestion] = useState<string>("");

    useEffect(() =>
    {
        let user = localStorage.getItem("user");
        if(user != null)
        {
            setUsuario(JSON.parse(user))
        }
    },[])

    const handleUploadComplete = (result: any) => {
        if (result?.info?.public_id) {
          const publicId = result.info.public_id;
          console.log('Uploaded file public_id:', publicId);
          setNewImage(publicId); 
        } else {
          console.error('Upload failed or public_id is not present in the result');
        }
      };

    const handleAddForum = () => {
        if (newTitle && newMainQuestion && newImage) {
        const newForum: forum = {
            image: newImage,
            title: newTitle,
            mainQuestion: newMainQuestion,
            nameInstructor: usuario.name,
        };
        console.log(newForum)
        setNewForum((prev) => [...prev, newForum]);
        setModalAdd(false);
        setNewImage("");
        setNewTitle("");
        setNewMainQuestion("");
        setNewInstructor("");

        } else {
            alert("Por favor, preencha todos os campos.");
        }
    };

    return (
        <div className="flex flex-col mt-20 font-robFont">
            <Header instructor={usuario.instructor ? true : false} />
            {modalAdd && (
                <div className="h-screen w-screen object-contain flex justify-center fixed items-center top-0 left-0 bg-[#000000A0]">
                <div className="bg-white p-12 rounded-lg w-[600px] ">
                    <form id="modal" className="">
                    <h1 className="text-blue1 text-3xl mb-3">Adicionar Sessão ao Fórum</h1>
                    <div className="flex flex-col items-center space-y-4">
                    {
                    newImage ? 
                      <CldImage
                        src={newImage}
                        width="300"
                        height="300"
                        radius={8}
                        crop={{
                          type: 'auto',
                          source: true
                        }}
                        alt="teste"
                      /> 
                      : 
                      ""
                  }
                  <CldUploadWidget
                    uploadPreset={cloudPresetName}
                    onSuccess={handleUploadComplete} 
                  >
                    {({ open }) => (
                      <button 
                        type="button" 
                        onClick={() => open()} 
                        className="w-96 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500"
                      >
                        Upload an Image
                      </button>
                    )}
                  </CldUploadWidget>
                    </div>
                    <input type="text" placeholder="Digite o título da sessão" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full p-4 my-4 border-b border-blue3 outline-none ease-in-out hover:border-blue1 "/>
                    <textarea placeholder="Digite uma descrição á sessão" value={newMainQuestion} onChange={(e) => setNewMainQuestion(e.target.value)} className="w-full p-4 my-4 border-b border-blue3 outline-none ease-in-out hover:border-blue1 "/>
                    </form>
                    <div className="w-[100%] flex items-end justify-end mt-5">
                    <button onClick={handleAddForum} className="mt-4 mr-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-800">Salvar</button>
                    <button onClick={() => setModalAdd(false)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-800">Fechar</button>
                    </div>
                </div>
                </div>
            )}
            <div className="pr-20 pl-20 pt-10 flex flex-col items-center">
                    <div className="flex flex-col flex-wrap w-[100%]">
                        <h1 className={styles.h1} >Explore as conversas do setor aqui</h1>
                        <p className="font-robCondensed">Envolva-se nas discussões e expanda suas perspectivas.</p>
                    </div>

                <div className="w-[100%] flex flex-row justify-end items-end">
                    <div className="flex w-[65%]">

                    <div className={styles.box}>
                        <input
                            className={styles.search}
                            type="text"
                            value={searchValue} 
                            onChange={handleSearchChange} 
                            placeholder="Pesquise por título, pergunta.."
                            />
                        <Image className="cursor-pointer" src={search} alt={""} width={33} height={33}/>
                    </div>
                    <div className="flex items-end justify-end w-[100%]">
                        { usuario.instructor == 1 ? (
                            <div  className="w-auto cursor-pointer" onClick={() => setModalAdd(true)}>
                                <Image src={plus} width={50} height={50} alt="Adicionar Sessao" />
                            </div>

                        ) : (
                            <>
                            </>
                        )}
                    </div>
                    </div>
                </div>
                {/* Renderizando os cards */}
                <div className="flex justify-center mt-10 flex-wrap gap-8 max-w-[90%]">
                    {newForum
                        .filter((item) =>
                            item.title.toLowerCase().includes(searchValue.toLowerCase()) || 
                        item.mainQuestion.toLowerCase().includes(searchValue.toLowerCase())
                    )
                    .map((item, index) => {
                        return (
                            <Link href={ROUTES.session} key={index}>
                                <Card
                                    title={item.title}
                                    mainQuestion={item.mainQuestion}
                                    image={item.image}
                                />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Forum;
