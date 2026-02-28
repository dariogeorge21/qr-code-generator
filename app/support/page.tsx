'use client';

import Link from 'next/link';
import { Coffee, Heart, Share2, Github, Twitter, Copy, Mail, QrCode, Star, IndianRupee, ExternalLink } from 'lucide-react';
import { useState } from 'react';

const WHY_ITEMS = [
	{
		icon: QrCode,
		title: 'Keeps it free',
		description: 'QR Code Studio has no ads, no paywalls, and no account required. Your support makes that possible.',
	},
	{
		icon: Star,
		title: 'Funds new features',
		description: 'From new QR styles to better export options, your contributions directly shape what gets built next.',
	},
	{
		icon: Heart,
		title: 'Supports indie dev',
		description: 'This is a solo side project built with love. Every contribution is a genuine thank-you that keeps me motivated.',
	},
];

const UPI_ID = '7838403506@sbi'; // 🔁 replace with your real UPI ID

export default function SupportPage() {
	const [copied, setCopied] = useState(false);
	const siteUrl = 'https://qr.dariogeorge.in';

	const copyLink = async () => {
		try {
			await navigator.clipboard.writeText(siteUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			/* noop */
		}
	};

	const shareLinks = [
		{
			label: 'Twitter / X',
			icon: Twitter,
			href: `https://twitter.com/intent/tweet?text=I%20use%20QR%20Code%20Studio%20to%20create%20beautiful%20QR%20codes%20for%20free%20%F0%9F%9A%80&url=${encodeURIComponent(
				siteUrl
			)}`,
			color: 'bg-black text-white hover:bg-gray-800',
		},
		{
			label: 'WhatsApp',
			icon: Share2,
			href: `https://wa.me/?text=${encodeURIComponent('Check out QR Code Studio — free, beautiful QR codes! ' + siteUrl)}`,
			color: 'bg-green-500 text-white hover:bg-green-600',
		},
		{
			label: 'Email',
			icon: Mail,
			href: `mailto:?subject=Check out QR Code Studio&body=${encodeURIComponent('Hey! I found this awesome free QR code generator: ' + siteUrl)}`,
			color: 'bg-blue-600 text-white hover:bg-blue-700',
		},
	];

	return (
		<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14">
			{/* Header */}
			<div className="text-center mb-12">
				<div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--color-tertiary)]/20 flex items-center justify-center">
					<Heart className="w-8 h-8 text-orange-600 dark:text-yellow-400" />
				</div>
				<h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--color-text)] mb-4 tracking-tight">
					Support This Project
				</h1>
				<p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
					QR Code Studio is free and open to everyone. If it&apos;s saved you time, every contribution — big or small — means a lot. 🙏
				</p>
			</div>

			{/* ── INDIA-FRIENDLY ── UPI Section */}
			<div className="p-8 sm:p-10 rounded-2xl border-2 border-[var(--color-tertiary)] bg-[var(--color-tertiary)]/5 shadow-sm mb-6 text-center">
				<div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-[var(--color-tertiary)]/20 flex items-center justify-center">
					<IndianRupee className="w-6 h-6 text-orange-600 dark:text-yellow-400" />
				</div>
				<h2 className="text-2xl font-extrabold text-[var(--color-text)] mb-1">
					Pay via UPI
				</h2>
				<p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
					Works with GPay, PhonePe, Paytm, BHIM, or any bank app. No international transaction needed.
				</p>
				<a
					href={`upi://pay?pa=${UPI_ID}&pn=Dario+George&cu=INR&tn=QR+Studio+Contributions`}
					className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-orange-600 hover:opacity-90 transition-all active:scale-[0.98] shadow-md text-base"
				>
					<IndianRupee className="w-5 h-5" />
					Pay via UPI
					<ExternalLink className="w-3.5 h-3.5 opacity-60" />
				</a>
				<p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
					Opens your preferred UPI app · Amount editable inside the app · Any amount welcome 🙏
				</p>
			</div>

			{/* Divider with label */}
			<div className="flex items-center gap-4 mb-6">
				<div className="flex-1 h-px bg-[var(--color-border)]" />
				<span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
					Or support internationally
				</span>
				<div className="flex-1 h-px bg-[var(--color-border)]" />
			</div>

			{/* Buy Me a Coffee CTA */}
			<div className="p-8 sm:p-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-sm mb-8 text-center">
				<Coffee className="w-10 h-10 mx-auto mb-4 text-orange-600 dark:text-yellow-400" />
				<h2 className="text-2xl font-extrabold text-[var(--color-text)] mb-2">
					Buy Me a Coffee
				</h2>
				<p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
					A small one-time contribution via card or PayPal. No subscription, no pressure — just gratitude.
				</p>
				<a
					href="https://buymeacoffee.com/dariogeorge21"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-black bg-[var(--color-tertiary)] hover:opacity-90 transition-all active:scale-[0.98] shadow-md text-base"
				>
					<Coffee className="w-5 h-5" />
					Buy Me a Coffee
					<ExternalLink className="w-3.5 h-3.5 opacity-60" />
				</a>
			</div>

			{/* Why support */}
			<div className="p-6 sm:p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-sm mb-8">
				<h2 className="text-xl font-extrabold text-[var(--color-text)] mb-6">
					Why your support matters
				</h2>
				<div className="space-y-5">
					{WHY_ITEMS.map((item) => (
						<div key={item.title} className="flex gap-4">
							<div className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange-50 dark:bg-yellow-400/10 flex items-center justify-center">
								<item.icon className="w-5 h-5 text-orange-600 dark:text-yellow-400" />
							</div>
							<div>
								<h3 className="font-bold text-[var(--color-text)] mb-1">{item.title}</h3>
								<p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
									{item.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Spread the word */}
			<div className="p-6 sm:p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-sm mb-8">
				<h2 className="text-xl font-extrabold text-[var(--color-text)] mb-2">
					Spread the word
				</h2>
				<p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
					Can&apos;t donate right now? Sharing QR Code Studio with someone who could use it is just as valuable. 🙌
				</p>
				<div className="flex flex-wrap gap-3">
					{shareLinks.map((s) => (
						<a
							key={s.label}
							href={s.href}
							target="_blank"
							rel="noopener noreferrer"
							className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 ${s.color}`}
						>
							<s.icon className="w-4 h-4" />
							{s.label}
						</a>
					))}
					<button
						onClick={copyLink}
						className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-[var(--color-border)] text-[var(--color-text)] hover:border-orange-600 dark:hover:border-yellow-400 hover:text-orange-600 dark:hover:text-yellow-400 transition-all active:scale-95"
					>
						<Copy className="w-4 h-4" />
						{copied ? 'Copied!' : 'Copy Link'}
					</button>
				</div>
			</div>

			{/* Star on GitHub */}
			<div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-sm mb-10 flex items-center gap-4">
				<div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
					<Github className="w-5 h-5 text-[var(--color-text)]" />
				</div>
				<div className="flex-1">
					<h3 className="font-bold text-[var(--color-text)] mb-0.5">Star on GitHub</h3>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						It costs nothing and means a lot — give the repo a ⭐ to help others find it.
					</p>
				</div>
				<a
					href="https://github.com/dariogeorge21/qr-code-studio"
					target="_blank"
					rel="noopener noreferrer"
					className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--color-border)] text-sm font-semibold text-[var(--color-text)] hover:border-orange-600 dark:hover:border-yellow-400 hover:text-orange-600 dark:hover:text-yellow-400 transition-all"
				>
					<Star className="w-4 h-4" />
					Star
				</a>
			</div>

			{/* CTA back */}
			<div className="text-center">
				<Link
					href="/create"
					className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-orange-600 dark:bg-yellow-400 dark:text-black hover:opacity-90 transition-all active:scale-[0.98] shadow-md"
				>
					<QrCode className="w-4 h-4" />
					Create a QR Code
				</Link>
			</div>
		</div>
	);
}
