import React from 'react';
import ReactDOM from 'react-dom';

function App() {
	return (
		<div>
			<Child />
		</div>
	);
};

function Child() {
	console.log('Child');
	return (
		<span>big-react</span>
	);
}

const root = document.querySelector('#root')
ReactDOM.createRoot(root).render(<App />);
console.log(React);
console.log(<App />);
console.log(ReactDOM);
