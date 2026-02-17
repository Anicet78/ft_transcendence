import { toast as sonnerToast } from 'sonner';

interface CustomToastProps {
  title: string;
  message?: string;
  type?: 'is-primary' | 'is-info' | 'is-success' | 'is-warning' | 'is-danger';
}

const toast = ({ title, message, type = 'is-info' }: CustomToastProps) => {
	sonnerToast.custom((t) => (
		<div className={`notification ${type} is-light is-flex`}
			style={{
				width: '350px',
				boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
				padding: '1.25rem'
			}}>
		<div style={{ flexGrow: 1 }}>
			<p className="title is-6 mb-1">{title}</p>
			{message && <p className="subtitle is-7">{message}</p>}
		</div>
		<button
			className="delete"
			onClick={() => sonnerToast.dismiss(t)}
			aria-label="close"
		/>
		</div>
	));
};

export default toast;