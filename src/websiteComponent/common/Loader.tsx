export default function Loader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="flex items-end gap-2 h-12">
        <span className="loader-bar delay-0" />
        <span className="loader-bar delay-1" />
        <span className="loader-bar delay-2" />
        <span className="loader-bar delay-3" />
      </div>
    </div>
  );
}
