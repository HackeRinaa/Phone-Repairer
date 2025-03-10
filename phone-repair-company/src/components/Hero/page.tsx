"use client";
import React, { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

// Export TextParallaxContentExample as default
export default function TextParallaxContentExample() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* General Service Introduction with Video Background */}
      <TextParallaxContent
        videoUrl="/video.mp4" // Replace with your video
        subheading="Η Καλύτερη Λύση για το Κινητό σου"
        heading="iRescue"
      >
        <ExampleContent id={0} />
      </TextParallaxContent>

      {/* Reliability & Professionalism */}
      <TextParallaxContent
        imgUrl="/images/cartoon-phone.jpg" // Replace with your image
        subheading="Αξιοπιστία & Επαγγελματισμός"
        heading="iRescue"
      >
        <ExampleContent id={1} />
      </TextParallaxContent>

      {/* Free Estimate & Shipping */}
      <TextParallaxContent
        imgUrl="/images/free-estimate-shipping.jpg" // Replace with your image
        subheading="Δωρεάν Εκτίμηση & Μεταφορικά"
        heading="iRescue"
      >
        <ExampleContent id={2} />
      </TextParallaxContent>

      {/* Eco Friendly */}
      <TextParallaxContent
        imgUrl="/images/eco-friendly.jpg" // Replace with your image
        subheading="Eco Friendly"
        heading="iRescue"
      >
        <ExampleContent id={3} />
      </TextParallaxContent>
    </div>
  );
}

const IMG_PADDING = 12;

interface TextParallaxContentProps {
  imgUrl?: string;
  videoUrl?: string;
  subheading: string;
  heading: string;
  children: ReactNode;
}

// Export TextParallaxContent if needed elsewhere
export const TextParallaxContent = ({
  imgUrl,
  videoUrl,
  subheading,
  heading,
  children,
}: TextParallaxContentProps) => {
  return (
    <div
      style={{
        paddingLeft: IMG_PADDING,
        paddingRight: IMG_PADDING,
      }}
    >
      <div className="relative h-[150vh]">
        {videoUrl ? (
          <StickyVideo videoUrl={videoUrl} />
        ) : (
          <StickyImage imgUrl={imgUrl!} />
        )}
        <OverlayCopy heading={heading} subheading={subheading} />
      </div>
      {children}
    </div>
  );
};

interface StickyImageProps {
  imgUrl: string;
}

// Export StickyImage if needed elsewhere
export const StickyImage = ({ imgUrl }: StickyImageProps) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: `calc(100vh - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
        scale,
      }}
      ref={targetRef}
      className="sticky z-0 overflow-hidden rounded-3xl"
    >
      <motion.div
        className="absolute inset-0 bg-neutral-950/70"
        style={{
          opacity,
        }}
      />
    </motion.div>
  );
};

interface StickyVideoProps {
  videoUrl: string;
}

// Export StickyVideo if needed elsewhere
export const StickyVideo = ({ videoUrl }: StickyVideoProps) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      style={{
        height: `calc(100vh - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
        scale,
      }}
      ref={targetRef}
      className="sticky z-0 overflow-hidden rounded-3xl"
    >
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <motion.div
        className="absolute inset-0 bg-neutral-950/70"
        style={{
          opacity,
        }}
      />
    </motion.div>
  );
};

interface OverlayCopyProps {
  subheading: string;
  heading: string;
}

// Export OverlayCopy if needed elsewhere
export const OverlayCopy = ({ subheading, heading }: OverlayCopyProps) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

  return (
    <motion.div
      style={{
        y,
        opacity,
      }}
      ref={targetRef}
      className="absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center text-white"
    >
      <p className="text-center text-4xl font-bold md:text-7xl text-purple-600">
        {heading}
      </p>
      <p className="mb-2 text-center text-xl md:mb-4 md:text-3xl text-purple-600">
        {subheading}
      </p>
    </motion.div>
  );
};

interface ExampleContentProps {
  id: number;
}
export const ExampleContent = ({ id }: ExampleContentProps) => {
  const content = [
    {
      heading: "iRescue: Η Λύση για το Κινητό σου",
      description:
        "Επισκευή, πώληση ή αγορά μεταχειρισμένων κινητών με ευκολία και αξιοπιστία. Χωρίς φυσικό κατάστημα, αλλά με γρήγορη και απρόσκοπτη εξυπηρέτηση!",
      button: "Μάθε Περισσότερα",
    },
    {
      heading: "Αξιοπιστία & Επαγγελματισμός",
      description:
        "Επισκευές από ειδικούς με πολλά χρόνια εμπειρίας. Εμπιστευτείτε μας τη συσκευή σας!",
      button: "Επισκευή Κινητού",
    },
    {
      heading: "Δωρεάν Εκτίμηση & Μεταφορικά",
      description:
        "Αποκτήστε μια δωρεάν εκτίμηση για την επισκευή ή την πώληση της συσκευής σας. Παίρνουμε και φέρνουμε το κινητό σας χωρίς χρέωση!",
      button: "Ζήτα Εκτίμηση",
    },
    {
      heading: "Eco Friendly",
      description:
        "Δώστε μια δεύτερη ευκαιρία στο κινητό σας. Μην το πετάξετε! Είμαστε υπέρμαχοι της ανακύκλωσης.",
      button: "Μάθε Περισσότερα",
    },
  ];

  const currentContent = content[id];

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12">
      <h2 className="col-span-1 text-3xl font-bold md:col-span-4 text-gray-700 dark:text-gray-100">
        {currentContent.heading}
      </h2>
      <div className="col-span-1 md:col-span-8">
        <p
          className="mb-4 text-xl text-gray-700 dark:text-gray-400 md:text-2xl whitespace-pre-line"
          dangerouslySetInnerHTML={{
            __html: currentContent.description.replace(/\n/g, "<br>"),
          }}
        />
        <button className="w-full rounded-xl bg-blue-600 px-6 py-4 text-xl text-white transition-colors hover:bg-blue-700 md:w-fit">
          {currentContent.button} <FiArrowUpRight className="inline" />
        </button>
      </div>
    </div>
  );
};