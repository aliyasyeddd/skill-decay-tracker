const Toast = ({ message, visible, onDismiss }) => {
  if (!visible) return null;
 
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-6 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-4 bg-white border border-[#f1ece8] shadow-xl shadow-[#cdb4db]/20 rounded-2xl px-5 py-3.5 max-w-md w-full sm:w-auto">
        <p className="text-sm font-semibold text-[#2E2A28] flex-1">{message}</p>
        <button
          type="button"
          onClick={onDismiss}
          className="text-xs font-bold text-[#a8a29c] hover:text-[#a13f5c] transition-colors whitespace-nowrap"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
 
export default Toast;