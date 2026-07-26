import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ErrorMessage = ({ 
  title = 'Something went wrong',
  message = 'Please try again later',
  showRefresh = true,
  showHome = false,
  onRetry = null,
  className = ''
}) => {
  const navigate = useNavigate();

  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
      
      <div className="flex gap-3 justify-center">
        {onRetry && (
          <button onClick={onRetry} className="btn-primary flex items-center gap-2">
            <RefreshCw size={18} />
            Try Again
          </button>
        )}
        
        {showRefresh && (
          <button 
            onClick={() => window.location.reload()} 
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        )}
        
        {showHome && (
          <button 
            onClick={() => navigate('/')} 
            className="btn-secondary flex items-center gap-2"
          >
            <Home size={18} />
            Go Home
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;