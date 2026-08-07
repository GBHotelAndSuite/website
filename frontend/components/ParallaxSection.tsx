"use client";

import Link from "next/link";
import { useRef } from "react";
import {
	useScroll,
	useTransform,
	motion,
	type MotionValue,
} from "framer-motion";

interface ParallaxSectionProps {
	image?: string;
	gradient?: string;
	title: string;
	description: string;
	price?: string;
	cta?: { label: string; href: string };
	reverse?: boolean;
	index: number;
}

export default function ParallaxSection({
	image,
	gradient,
	title,
	description,
	price,
	cta,
	reverse = false,
	index,
}: ParallaxSectionProps) {
	const ref = useRef<HTMLDivElement>(null);

	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "end start"],
	});

	const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
	const textOpacity = useTransform(
		scrollYProgress,
		[0, 0.3, 0.5, 0.8],
		[0, 1, 1, 0],
	);
	const textY = useTransform(
		scrollYProgress,
		[0, 0.3, 0.5, 0.8],
		[60, 0, 0, -40],
	);

	return (
		<section
			ref={ref}
			className="
				relative
				overflow-hidden
				h-screen
			"
		>
			<Background image={image} gradient={gradient} y={y} />

			<div
				className={`
					absolute inset-0
					bg-gradient-to-b from-black/40 via-black/20 to-black/60
				`}
			/>

			<motion.div
				style={{ opacity: textOpacity, y: textY }}
				className={`
					relative
					z-10 flex
					h-full
					px-6
					sm:px-12
					lg:px-24
					items-center
					${cta
						? "justify-between gap-6 text-left"
						: reverse
							? "justify-end text-right"
							: "justify-start"}
				`}
			>
				<div
					className="
						max-w-xl
					"
				>
					<motion.span
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="
							uppercase backdrop-blur-sm
							inline-block
							mb-3 px-3 py-1
							text-xs font-semibold tracking-widest text-white/80
							rounded-full border border-white/20
						"
					>
						0{index + 1}
					</motion.span>

					<motion.h2
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						style={{
							fontFamily: "var(--font-cormorant-garamond)",
							color: "white",
						}}
						className="
							mb-2
							text-4xl font-bold tracking-tight text-white
							sm:text-5xl
							lg:text-6xl
						"
					>
						{title}
					</motion.h2>

					{price && (
						<motion.p
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.6, delay: 0.3 }}
							className="
								mb-3
								text-lg font-semibold text-white
								sm:text-xl
							"
						>
							{price}
						</motion.p>
					)}

					<motion.p
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.6, delay: 0.45 }}
						className="
							text-lg leading-relaxed text-white/80
							sm:text-xl
						"
					>
						{description}
					</motion.p>
				</div>

				{cta && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.6, delay: 0.55 }}
						className="
							shrink-0
						"
					>
						<Link
							href={cta.href}
							className="
								hover:bg-fill
								inline-flex
								px-8 py-3
								font-medium text-heading
								bg-white
								rounded-full
								shadow-lg shadow-black/40
								transition-colors
							"
						>
							{cta.label}
						</Link>
					</motion.div>
				)}
			</motion.div>
		</section>
	);
}

function Background({
	image,
	gradient,
	y,
}: {
	image?: string;
	gradient?: string;
	y: MotionValue<string>;
}) {
	if (image) {
		return (
			<motion.div
				style={{ y }}
				className="
					absolute inset-0 -top-[20%] -bottom-[20%]
				"
			>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={image}
					alt=""
					className="
						object-cover
						h-full w-full
					"
				/>
			</motion.div>
		);
	}

	return (
		<div
			style={{
				background:
					gradient || "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
			}}
			className="
				absolute inset-0
			"
		/>
	);
}
