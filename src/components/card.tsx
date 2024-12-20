"use client"

import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { useState } from "react";
import ImageComponent from "./image";
import { CldImage } from "next-cloudinary";
import { StaticImageData } from "next/image";;
import imagem from "@/assets/Matias3.jpg"

type CardData = {
    title: string;
    image: string;
    mainQuestion: string;
}

const limit = 25

const Card = ( {title, image, mainQuestion} : CardData) => {

    // const [img, setImg] = useState<StaticImport | string>('/img')

    // import(`@/assets/${image}`).then((data) => {setImg(data.default)})
    const safeMainQuestion = typeof mainQuestion === 'string' ? mainQuestion : '';

    return (
        <>
            <div className={styles.container}> 
                <div className="h-">
                    <CldImage
                    src={image}
                    width="300" 
                    height="200"
                    crop={{
                        type: 'auto',
                        source: true
                    }}
                    alt="teste"
                    />
                    <h1 className={styles.title} >{title}</h1>
                    <p className={styles.question}> {safeMainQuestion.substring(0, limit)} {safeMainQuestion.length > limit ? '...' : ''}
                    </p>
                </div>
            </div>
        </>
    );
}
// dark:hover:bg-neutral-700 dark:bg-zinc-900 
const styles = {
    container:
      "flex justify-center items-center dark:bg-neutral-700 hover:dark:bg-zinc-900 rounded p-4 shadow-[0_0_5px_2px_rgba(0,0,0,0.3)] ease-in-out duration-300 hover:bg-zinc-200 hover:shadow-[0_0_2px_1px_rgba(0,0,0,0.3)] cursor-pointer",
    img: "rounded h-44 object-cover",
    title: "text-blue1 dark:text-blue5 text-2xl my-2",
    question:"w-full dark:text-blue4 text-sm text-gray-700 overflow-hidden overflow-ellipsis whitespace-nowrap",
  };


export default Card;
