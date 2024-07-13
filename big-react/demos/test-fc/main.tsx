import { useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
	const [num, setNum] = useState(100);
	window.setNum = setNum;

	return (
		<div>
			{/* <Child /> */}
			{num}
		</div>
	);
}

function Child() {
	console.log('Child');
	return <span>big-react</span>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
