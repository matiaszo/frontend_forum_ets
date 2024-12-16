"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import blueColor from "@/assets/blueColor.jpg";
import { Answer } from "@/components/answer";
import { Header } from "@/components/header";
import { StaticImageData } from "next/image";

interface User {
  id: string;
  name: string;
  instructor: boolean;
  image: string;
}

interface Mention {
  id: number;
  username: string;
  content: string;
}

interface Comment {
  id: number;
  content: string;
  user: User;
  mention: Mention | null;
  likes: number;
}

interface Topic {
  id: number;
  title: string;
  idSection: number;
  mainComment: {
    id: number;
    user: User;
    content: string;
    likes: number;
  };
  comments: Comment[];
}

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

const TopicPage = () => {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [newReply, setNewReply] = useState("");
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  
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

  const params = useParams();
  const id = typeof params.id === "string" ? parseInt(params.id) : parseInt(params.id?.[0] || "0"); 

  const userId = "1";

  const fetchTopic = async (topicId: number) => {
    const token = localStorage.getItem("token");
    try {
      if (!token) {
        throw new Error("Token não encontrado. Faça login novamente.");
      }

      const response = await fetch(`http://localhost:8080/topic/${topicId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar os dados do tópico.");
      }

      const data: Topic = await response.json();
      setTopic(data);
    } catch (error) {
      console.error("Erro ao buscar dados do tópico:", error);
    }
  };

  const handlePostAnswer = async (content: string, mention: Mention | null) => {
    const token = localStorage.getItem("token");
    if (!token || !topic) {
      console.error("Token ou tópico não encontrado.");
      return;
    }

    const mentionId = mention ? mention.id : null;

    console.log("Content "+ content)
    console.log("mentionId "+ mentionId)
    console.log("userId "+ userId)
    console.log("topicId "+ topic.id)

    const body = JSON.stringify({
      content,
      mentionId,
      userId,
      topicId: topic.id,
    });

    try {
      const response = await fetch("http://localhost:8080/comment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body,
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar a resposta.");
      }

      fetchTopic(topic.id);
      setReplyingTo(null);
      setNewReply("");
    } catch (error) {
      console.error("Erro ao postar a resposta:", error);
    }
  };

  const handleLike = async (commentId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token não encontrado.");
      return;
    }

    const body = JSON.stringify({
      userId: parseInt(userId), 
      commentId,
    });

    try {
      const response = await fetch("http://localhost:8080/comment/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar o like.");
      }

      if (topic) fetchTopic(topic.id);
    } catch (error) {
      console.error("Erro ao enviar o like:", error);
    }
  };

  useEffect(() => {
    let user = localStorage.getItem("user");
    if(user != null)
    {
        setUsuario(JSON.parse(user))
    }

    if (id && !isNaN(id)) {
      fetchTopic(id);
    }
  }, [id]);

  if (!topic) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="h-screen mt-20 font-robFont">
      <Header instructor={usuario.instructor ? true : false}/>
      <div className="flex m-10 flex-col">
        <div className="flex flex-col items-center rounded-xl p-3 font-robFont mb-3 text-black">
          <div className="flex flex-col ml-10 min-w-[95%]">
            <h1 className="text-blue1 text-3xl mb-3 text-center">{topic.title}</h1>
            <h3 className="ml-1 text-center">{topic.mainComment.content}</h3>
            <div className="flex justify-end text-blue1">
              {topic.mainComment.user.name}
            </div>
          </div>
          <hr className="w-full border-t-1 border-black" />
        </div>

        <div className="flex flex-col border-blue5 border-2 rounded-md m-10">
          <textarea
            name="ans"
            id="ans"
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            className="m-1 text-black placeholder-blue0 p-1 h-30 mb-1 focus:outline-none focus:border-none"
            placeholder="Digite sua resposta à pergunta principal"
          />
          <button
            className="bg-blue5 w-20 rounded-md p-2 ml-auto m-1"
            onClick={() => handlePostAnswer(newReply, null)}
          >
            Enviar
          </button>
        </div>

        {topic.comments.map((comment) => (
          <div key={comment.id} className="mb-5">
            <Answer
              comment={comment}
              onReply={() => setReplyingTo(comment)}
              addNewComment={handlePostAnswer}
              onLike={() => handleLike(comment.id)} 
            />
          </div>
        ))}

        {replyingTo && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
              <h2 className="text-2xl font-xl mb-4">
                Responder a {replyingTo.user.name}
              </h2>
              <textarea
                name="reply"
                className="m-1 text-black placeholder-blue0 p-1 h-30 mb-1 focus:outline-none focus:border-none"
                placeholder={`Responda a: ${replyingTo.content}`}
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
              />
              <div className="flex justify-between">
                <button
                  className="bg-blue5 w-20 rounded-md p-2"
                  onClick={() =>
                    handlePostAnswer(newReply, {
                      id: replyingTo.id,
                      username: replyingTo.user.name,
                      content: replyingTo.content,
                    })
                  }
                >
                  Enviar
                </button>
                <button
                  className="bg-red-500 w-20 rounded-md p-2"
                  onClick={() => setReplyingTo(null)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicPage;