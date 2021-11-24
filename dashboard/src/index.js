import React from 'react';
import ReactDom from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom'
import { FacultyContext, FacultyProvider } from './store/FacultyContext'
import ContextProvider from './store/providerComposer'

ReactDom.render(
	// <React.StrictMode>
	<Router basename="/admin">
		<ContextProvider>
			<App />
		</ContextProvider>
	</Router>
	// </React.StrictMode>
	, document.getElementById('app'));
