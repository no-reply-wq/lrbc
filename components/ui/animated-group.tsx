"use client";

import * as React from "react";
import { motion } from "motion/react";

export type PresetType =
  | "fade"
  | "slide"
  | "scale"
  | "blur"
  | "blur-slide"
  | "zoom"
  | "flip"
  | "bounce"
  | "rotate"
  | "swing";

type VariantObject = Record<string, any>;

export interface AnimatedGroupProps {
  children: React.ReactNode;
  className?: string;

  variants?: {
    container?: VariantObject;
    item?: VariantObject;
  };

  preset?: PresetType;

  as?: React.ElementType;
  asChild?: React.ElementType;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const presets: Record<PresetType, VariantObject> = {
  fade: {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  },

  slide: {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  },

  scale: {
    hidden: {
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      scale: 1,
    },
  },

  blur: {
    hidden: {
      opacity: 0,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
    },
  },

  "blur-slide": {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
    },
  },

  zoom: {
    hidden: {
      opacity: 0,
      scale: 0.6,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        bounce: 0.35,
      },
    },
  },

  flip: {
    hidden: {
      opacity: 0,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      rotateX: 0,
      transition: {
        type: "spring",
      },
    },
  },

  bounce: {
    hidden: {
      opacity: 0,
      y: -40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.5,
      },
    },
  },

  rotate: {
    hidden: {
      opacity: 0,
      rotate: -180,
    },
    visible: {
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
      },
    },
  },

  swing: {
    hidden: {
      opacity: 0,
      rotate: -10,
    },
    visible: {
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
      },
    },
  },
};

export function AnimatedGroup({
  children,
  className,
  preset = "fade",
  variants,
  as: Tag = "div",
  asChild: ChildTag = "div",
}: AnimatedGroupProps) {
  const Container = motion.create(Tag);
  const Item = motion.create(ChildTag);

  return (
    <Container
      className={className}
      initial="hidden"
      animate="visible"
      variants={variants?.container ?? containerVariants}
    >
      {React.Children.map(children, (child, index) => (
        <Item
          key={index}
          variants={variants?.item ?? presets[preset]}
        >
          {child}
        </Item>
      ))}
    </Container>
  );
}





