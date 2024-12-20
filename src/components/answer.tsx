import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import arrow_ans from "@/assets/arrow_ans.png";
import like_icon from "@/assets/heart.png";
import liked_icon from "@/assets/heart (1).png";
import { CldImage } from "next-cloudinary";

import plat from "@/assets/platina.png";
import rubi from "@/assets/rubi.png";
import ouro from "@/assets/ouro.png";
import esm from "@/assets/esmeralda.png";
import ferro from "@/assets/ferro.png";
import madeira from "@/assets/madeira.png";

interface User {
  id: string;
  name: string;
  num: number;
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

interface AnswerProps {
  comment: Comment;
  onReply: (comment: Comment) => void;
  addNewComment: (content: string, mention: Mention | null) => Promise<void>;
  onLike: () => Promise<void>;
}

export const Answer: React.FC<AnswerProps> = ({
  comment,
  onReply,
  addNewComment,
  onLike,
}) => {
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [liked, setLiked] = useState(false);

  const handleReplyClick = (commentId: number) => {
    setReplyingTo((prev) => (prev === commentId ? null : commentId));
  };

  const handleReplySubmit = async (replyingToId: number) => {
    if (replyContent.trim() === "") return;

    const mention = {
      id: comment.id,
      username: comment.user.name,
      content: comment.content,
    };

    console.log("Answer mention: " + mention);
    await addNewComment(replyContent, mention);

    setReplyContent("");
    setReplyingTo(null);
  };

  const handleLikeClick = async () => {
    try {
      await onLike();
      setLiked((prevLiked) => !prevLiked);
    } catch (error) {
      console.error("Erro ao processar o like:", error);
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-md shadow-xl mb-3 p-4 m-10">
      {comment.mention && (
        <div className="p-3 border-l-2 border-blue4 mb-3 bg-blue1/10 rounded-md">
          <p className="text-sm text-gray-600 font-robCondensed">
            Respondendo a: {comment.mention.username}
          </p>
          <p className="text-gray-800 italic">"{comment.mention.content}"</p>
        </div>
      )}

      <div className="flex items-center mb-2">
        <CldImage
          src={comment.user.image}
          width={40}
          height={40}
          radius={40}
          crop={{
            type: "auto",
            source: true,
          }}
          alt="userimg"
        />
        <p className="font-bold text-blue1 ml-2">{comment.user.name}</p>
        {comment.user.num > 5 && (
          <div>
            <Image
              style={{ width: 40, height: 20 }}
              src={
                comment.user.num > 50
                  ? plat
                  : comment.user.num > 40
                  ? rubi
                  : comment.user.num > 30
                  ? ouro
                  : comment.user.num > 20
                  ? esm
                  : comment.user.num > 15
                  ? ferro
                  : madeira
              }
              alt="Shield"
            />
          </div>
        )}
      </div>

      {/* Comment Content */}
      <p className="mt-1 text-black ml-2">{comment.content}</p>

      {/* Actions Section */}
      <div className="flex justify-around items-center mt-2">
        <button
          className="flex justify-end rounded-md w-[90%]"
          onClick={() => handleReplyClick(comment.id)}
        >
          <Image src={arrow_ans} height={30} width={30} alt="Responder" />
        </button>

        <div className="flex justify-between items-center w-16">
          <button onClick={handleLikeClick}>
            <Image
              src={liked ? liked_icon : like_icon}
              height={20}
              width={20}
              alt="Curtir"
            />
          </button>
          <p className="flex p-2 rounded-[100%] h-8 items-center justify-center">
            {comment.likes}
          </p>
        </div>
      </div>

      {/* Reply Section */}
      {replyingTo === comment.id && (
        <div className="mt-3 border-t border-blue3 pt-3">
          <textarea
            className="w-full p-2 border border-blue3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue5"
            placeholder={`Responda a ${comment.user.name}`}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <button
              className="bg-gray-300 text-black px-4 py-2 rounded-md mr-2"
              onClick={() => setReplyingTo(null)}
            >
              Cancelar
            </button>
            <button
              className="bg-blue5 text-white px-4 py-2 rounded-md"
              onClick={() => handleReplySubmit(comment.id)}
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
