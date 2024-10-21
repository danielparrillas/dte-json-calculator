export const jsonToObject = (file: File) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (event) => {
			try {
				const object = JSON.parse(event.target?.result as string);
				resolve(object);
			} catch (error) {
				reject(error);
			}
		};
		reader.readAsText(file);
	});
};
