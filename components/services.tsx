"use client"
import { Asterisk } from "lucide-react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";
import ContentSection2 from "./content-2";

gsap.registerPlugin(ScrollTrigger, SplitText);




export default function Services() {

  const containerRef = useRef<HTMLDivElement>(null);
  const serviceRow = useRef<HTMLDivElement>(null);
  const serviceItem = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    const titleSplit = SplitText.create(".service-tite", {
      type: "words",
    });

    gsap.timeline({
      scrollTrigger: {
        trigger: ".services",
        start: "top 60%",
      },
    })
      .from(".section-title", {
        opacity: 0,
        y: 50,
      })
      .from(titleSplit.words, {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        ease: "power2.out",
      });

    const serviceItems = gsap.utils.toArray<HTMLElement>(".service-item");
   
    gsap.set(".content h3, .content p,.content ul li", {
      y: 0,
      autoAlpha: 0,
    })

    serviceItems.forEach((card, i) => {
      const wrapper = card.querySelector(".image-wrapper ") as HTMLElement;

      const textEls = card.querySelectorAll(
        ".content h3, .content p, .content ul li"
      );

      gsap.to(card, {
        scale: 0.7 + 0.2 * (i / (serviceItems.length - 1)),
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top top",
          endTrigger: ".service-row",
          end: "bottom bottom",
          pin: card,
          pinSpacing: false,
          invalidateOnRefresh: true,
          scrub: true,
        },
      });

      ScrollTrigger.create({
        trigger: card,
        start: "top 50%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();

         
          tl.to(textEls, {
            y: 0,
            autoAlpha: 1,
            stagger: 0.1,
            duration: 0.1,
          });
        },
      });
    });



  }, { scope: containerRef });
  return (
    <section className="services w-full min-h-screen">
      <div ref={containerRef} className="w-full h-full pt-35 overflow-hidden relative
      flex flex-col justify-center items-center">
        <div className="wrapper flex flex-col justify-center items-center gap-10 w-full md:max-w-6xl h-full">
         

          <div
            className="
                        service-row
                        w-full
                        max-w-7xl
                        min-h-screen
                        relative
                      "
          >
          
              <div
                ref={serviceItem}
                className="
                            service-item
                            w-full
                            min-h-[494px]
                            overflow-hidden
                            rounded-[45px]
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            p-3
                            mb-[50px]
                            gap-3
                          "
                
              >
                <ContentSection2 />
              </div>
      
          </div>

          <div>

          </div>
        </div>
      </div>


    </section>
  );
}

