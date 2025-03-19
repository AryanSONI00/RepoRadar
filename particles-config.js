particlesJS("particles-js", {
	particles: {
		number: {
			value: 100,
			density: {
				enable: true,
				value_area: 800,
			},
		},
		color: {
			value: ["#58a6ff", "#1f6feb", "#238636", "#2ea043"],
		},
		shape: {
			type: "circle",
		},
		opacity: {
			value: 0.5,
			random: true,
			animation: {
				enable: true,
				speed: 1,
				opacity_min: 0.1,
				sync: false,
			},
		},
		size: {
			value: 3,
			random: true,
			animation: {
				enable: true,
				speed: 2,
				size_min: 0.1,
				sync: false,
			},
		},
		line_linked: {
			enable: true,
			distance: 150,
			color: "#58a6ff",
			opacity: 0.2,
			width: 1,
		},
		move: {
			enable: true,
			speed: 2, // Normal speed
			direction: "none",
			random: true,
			straight: false,
			out_mode: "out",
			bounce: false,
		},
	},
	interactivity: {
		detect_on: "canvas",
		events: {
			onhover: {
				enable: true,
				mode: "bubble", // Makes the particles react to hover
			},
			onclick: {
				enable: true,
				mode: "repulse", // Pushes particles away on click
			},
			resize: true,
		},
		modes: {
			bubble: {
				distance: 200,
				size: 4,
				duration: 1,
				opacity: 0.8,
			},
			repulse: {
				distance: 150,
				duration: 0.4,
			},
		},
	},
	retina_detect: true,
});
