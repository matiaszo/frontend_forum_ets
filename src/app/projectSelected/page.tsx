"use client";
import { Header } from "@/components/header";
import data from '@/constants/dataProjects.json'
import { useState } from "react";
import CardMessage from "@/components/cardMessage";
import ImageComponent from "@/components/image";

const idProjectExemple = 1;
const limit = 350;
const dataItems = data.find(project => project.id == idProjectExemple);

const projectPage = () => {

    const [isExpanded, setIsExpanded] = useState(false);
    const [newMessage, setNewMessage] = useState(""); // Estado para armazenar a mensagem
    const [messages, setMessages] = useState(dataItems?.messages || []); // estado para armazenar as mensagens
    const [open, setOpen] = useState<boolean>(false);
    const [rating, setRating] = useState<number>(0); // estado para armazenar a avaliação com estrelas

    // Função para alternar a descrição expandida
    const toggleDescription = () => {
        setIsExpanded(prevState => !prevState);
    };

    // Função para enviar a mensagem
    const send = () => {
        if (newMessage.trim()) {
            const newMessageObject = {
                id: messages.length + 1,
                text: newMessage,
                user: {
                    id: 1,
                    name: "Matias Zuniga",
                    image: "Matias3.jpg",
                    instructor: false
                }
            };

            setMessages(prevMessages => [...prevMessages, newMessageObject]); // adiciona a nova mensagem na lista
            setNewMessage(""); // limpa o campo de texto
        }
    };

    // função para lidar com a mudança da avaliação
    const handleRating = (index: number) => {
        setRating(index + 1); // definir o valor da avaliação com base no índice da estrela clicada
    };

    return (
        <>
            <Header />

            {/* Modal de feedback */}
            {open && (
                <div className="flex bg-[#000000A0] w-full h-full absolute items-center justify-center self-center justify-center">
                    <form className="flex-col shadow p-2 rounded bg-white-100 bg-white w-[600px] p-4 rounded shadow-[0_0_5px_2px_rgba(0,0,0,0.3)] max-h-[90%]" action="">
                        <p className="text-blue1 text-3xl mb-4 my-6">Feedback</p>

                        <textarea
                            className="bg-slate-100 w-full h-[200px] outline-none p-2"
                            placeholder="Comente um pouco sobre a contribuição do seu colega"
                        ></textarea>

                        {/* sistema de avaliação com estrelas */}
                        <div className="flex gap-2 mt-4">
                            {[...Array(5)].map((_, index) => (
                                <span
                                    key={index}
                                    className={`cursor-pointer ${rating > index ? 'text-yellow-400' : 'text-gray-400'}`}
                                    onClick={() => handleRating(index)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>

                        <div className="flex gap-3 mt-4">
                            <button
                                className="bg-red-500 p-2 rounded text-white"
                                onClick={() => { setOpen(false) }}
                            >
                                Cancelar
                            </button>
                            <button
                                className="bg-blue-500 p-2 rounded text-white"
                                onClick={() => { setOpen(false) }}
                            >
                                Enviar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Mostrando título e descrição do projeto */}
            <div className="h-[480px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue3 scrollbar-track-gray-100 p-6">
                <div className="mt-24 ml-8">
                    <h1 className={styles.title}>
                        {dataItems?.name}
                    </h1>
                    <p className="flex flex-wrap max-w-[750px]">
                        {isExpanded || (dataItems?.description && dataItems.description.length <= limit)
                            ? dataItems?.description
                            : dataItems?.description.substring(0, limit) + "..."}
                        {/* botão "Ler mais" ou "Ler menos" */}
                        {dataItems?.description && dataItems.description.length > limit && (
                            <span
                                className="text-blue-500 cursor-pointer"
                                onClick={toggleDescription}>
                                {isExpanded ? "Ler menos" : "Ler mais"}
                            </span>
                        )}
                    </p>
                </div>

                {/* Mostrando objetivos do projeto */}
                <div className="mt-6 ml-8">
                    <h1 className={styles.title}>Objetivos</h1>
                    {dataItems?.goals?.map((goal, index) => (
                        <h2 key={index}>
                            <input type="checkbox" id="objetivo1" className={styles.checkbox} />
                            <label className="ml-2">{goal}</label>
                        </h2>
                    ))}
                </div>

                {/* Mostrando contribuidores do projeto */}
                <div className="ml-8 mt-6">
                    <h1 className={styles.title}>Contribuidores</h1>
                    {dataItems?.users?.map((contributor, index) => (
                        <div key={index} className="flex gap-3 items-center mt-6">
                            <ImageComponent src="topic1.png" width={20} height={20} alt="" />
                            <h1>{contributor.image}</h1>
                            <button
                                className="bg-blue2 text-white rounded p-2 hover:shadow hover:bg-blue1"
                                onClick={() => { setOpen(true) }}
                            >
                                Feedback
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* cards de mensagens */}
            <hr className="shadow" />
            <div className="flex flex-col w-11/12 p-4 justify-self-center">
                <div className="flex flex-col h-[300px] overflow-y-auto gap-3 scrollbar-thin scrollbar-thumb-blue3 scrollbar-track-gray-100">
                    {messages.map((msg) => (
                        <div key={msg.id}>
                            <CardMessage user={msg.user.name} text={msg.text} image={msg.user.image} />
                        </div>
                    ))}
                </div>

                {/* enviar mensagens */}
                <div className="flex gap-3 items-center">
                    <input
                        className="outline-none mt-4 rounded-full p-2 bg-slate-100 w-11/12"
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)} // atualiza o estado com o valor digitado
                    />
                    <div onClick={send}>
                        <ImageComponent
                            src="sending.png"
                            width={50}
                            height={50}
                            alt="Enviar"
                            className="rounded-full self-center justify-self-center bg-slate-100 p-2 cursor-pointer hover:shadow hover:bg-blue1 ease-in-out duration-300"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

const styles = {
    title: "text-blue1 text-3xl mb-4",
    checkbox: 'w-4 h-4 border-2 border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 checked:bg-green-500 checked:border-green-500 transition-colors duration-200 ease-in-out'
};

export default projectPage;
