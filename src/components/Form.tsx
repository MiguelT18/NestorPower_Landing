export default function Form() {
  return (
    <form>
      <iframe
        title="Formulario de Registro"
        src="https://tu-formulario.typeform.com/to/ABC123"
        className="w-full min-h-[500px] rounded-lg"
        allow="camera; microphone; autoplay; encrypted-media;"
      ></iframe>

      <div className="mt-4 flex items-center gap-4">
        <button
          id="close-modal-button"
          type="button"
          className="border-light-primary dark:border-dark-primary text-light-text-primary dark:text-dark-text-primary hover:bg-light-primary/30 hover:dark:bg-dark-primary/30 hover:text-light-primary hover:dark:text-dark-primary w-full cursor-pointer rounded-lg border py-2 text-sm transition-colors"
        >
          Cerrar
        </button>
        <button
          className="bg-light-primary dark:bg-dark-primary border-light-primary dark:border-dark-primary hover:bg-light-primary/70 hover:dark:bg-dark-primary/70 w-full cursor-pointer rounded-lg py-2 text-sm text-white transition-colors"
        >
          Siguiente
        </button>
      </div>
    </form>
  );
}