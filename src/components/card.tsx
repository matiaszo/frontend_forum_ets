"use client"

import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { useState } from "react";

type CardData = {
    title: string;
    image: string;
    mainQuestion: string;
}

const limit = 25

const Card = ( {title, image, mainQuestion} : CardData) => {

    const [img, setImg] = useState<StaticImport | string>('/img')

    import(`@/assets/${image}`).then((data) => {setImg(data.default)})
    return (
        <>
            <div className={styles.container}> 
                <div className="">
                    <Image src={img} alt={title} width={200} height={200} className={styles.img} />
                    <h1 className={styles.title} >{title}</h1>
                    <p className={styles.question}> {mainQuestion.substring(0, limit)}{mainQuestion.length > limit ? "..." : ""}
                    </p>
                </div>
            </div>
        </>
    );
}

const styles = {
    container:
      "flex m-2 justify-center items-center w-60 rounded p-4 shadow-[0_0_5px_2px_rgba(0,0,0,0.3)] ease-in-out duration-300 hover:bg-zinc-200 hover:shadow-[0_0_2px_1px_rgba(0,0,0,0.3)] cursor-pointer",
    img: "rounded",
    title: "text-blue1 text-2xl my-2",
    question:"w-full text-sm text-gray-700 overflow-hidden overflow-ellipsis whitespace-nowrap",
  };


export default Card;