import es from "date-fns/locale/es"; // Importar configuración de localización en español
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Importar estilos básicos
import ReactModal from "react-modal";
import ClipLoader from "react-spinners/ClipLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [loading, setLoading] = useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    date: new Date(), // Fecha y hora actual
    status: "pendiente",
  });

  const [filters, setFilters] = useState({
    title: "",
    status: "todos",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredTasks = tasks.filter(task => {
    const matchesTitle = filters.title ? task.title.toLowerCase().includes(filters.title.toLowerCase()) : true;
    const matchesStatus = filters.status === "todos" ? true : task.status === filters.status;
    return matchesTitle && matchesStatus;
  });

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setNewTask({ ...newTask, date });
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      if (currentTask !== null) {
        const updatedTasks = tasks.map((task, index) =>
          index === currentTask ? newTask : task
        );
        setTasks(updatedTasks);
        toast.success("Tarea actualizada correctamente");
      } else {
        setTasks([...tasks, newTask]);
        toast.success("Tarea agregada correctamente");
      }
      setNewTask({ title: "", description: "", date: new Date(), status: "pendiente" });
      setIsModalOpen(false);
      setCurrentTask(null);
      setLoading(false);
    }, 1000); // Simula una carga de 1 segundo
  };

  const handleEdit = (index) => {
    setCurrentTask(index);
    setNewTask(tasks[index]);
    setIsModalOpen(true);
  };

  const handleComplete = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, status: task.status === "pendiente" ? "completada" : "pendiente" } : task
    );
    setTasks(updatedTasks);
    toast.info("Estado de la tarea actualizado");
  };

  const handleDelete = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    toast.error("Tarea eliminada");
  };

  return (
    <div className="flex flex-col w-[90vw] mx-5  md:container md:mx-auto my-5 md:my-10">
      <ToastContainer />
      <div className="flex flex-wrap justify-between mb-5 bg-white p-4 rounded-lg">
        <h1 className="text-4xl font-bold">To-Do Lists</h1>
        <div className="flex sm:mt-0 mt-2 gap-5">
          <button onClick={() => {
            setIsModalOpen(true);
            setNewTask({ title: '', description: '', date: new Date(), status: 'pendiente' });
          }}>
            <div className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">
              Agregar tarea
            </div>
          </button>
        </div>
      </div>
      <div>
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="text"
            name="title"
            placeholder="Buscar por título"
            value={filters.title}
            onChange={handleFilterChange}
            className="border p-2 rounded-lg"
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border p-2 rounded-lg"
          >
            <option value="todos">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="completada">Completada</option>
          </select>
        </div>

        {filteredTasks.length === 0 ? (
          <p className="sm:text-base h-[25vh] max-w-[100vw] justify-center items-center flex text-lg bg-white rounded-lg w-full">
            No hay tareas aún.
          </p>
        ) : (
          <table className="min-w-full table-auto bg-white rounded-lg">
            <thead>
              <tr>
                <th className=" px-4 py-2">Título</th>
                <th className=" px-4 py-2">Descripción</th>
                <th className=" px-4 py-2">Fecha</th>
                {/* <th className=" px-4 py-2">Hora</th> */}
                <th className=" px-4 py-2">Estado</th>
                <th className=" px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-lg bg-white rounded-lg w-full p-4">
                    No hay tareas aún.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task, index) => (
                  <tr key={index}>
                    <td className=" px-4 py-2">{task.title}</td>
                    <td className=" px-4 py-2">{task.description}</td>
                    <td className="text-center px-4 py-2">
                      {task.date.toLocaleDateString()}
                    </td>
                    {/* <td className="text-center px-4 py-2">
                      {task.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </td> */}
                    <td className="items-center px-4 py-2 flex justify-center">
                      <button
                        className={`flex items-center px-2 py-1 text-sm rounded-lg transition duration-300 ${task.status === "completada"
                          ? "bg-green-200 text-green-700 hover:bg-yellow-200 hover:text-yellow-700"
                          : "bg-yellow-200 text-yellow-700 hover:bg-green-200 hover:text-green-700"
                          }`}
                        onClick={() => handleComplete(index)}
                      >
                        {task.status === "pendiente" ? (
                          <div className="gap-2 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                              />
                            </svg>
                            {task.status}
                          </div>
                        ) : (
                          <div className="gap-2 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                              />
                            </svg>
                            {task.status}
                          </div>
                        )}
                      </button>
                    </td>

                    <td className="text-center px-4 py-2 gap-5">
                      <button
                        className="hover:text-blue-600 mr-2"
                        onClick={() => handleEdit(index)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </button>
                      <button
                        className="hover:text-red-600"
                        onClick={() => handleDelete(index)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Agregar/Edita Tarea"
        ariaHideApp={false}
        className="relative bg-white rounded-lg shadow-lg w-[90%] sm:w-[40%]  px-12 py-6 overflow-y-auto"
        overlayClassName="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div >
          <h2 className="text-xl font-bold mb-4">
            {currentTask !== null ? "Editar Tarea" : "Agregar Tarea"}
          </h2>
          <form>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                Título
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newTask.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                value={newTask.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
                Fecha
              </label>
              <DatePicker
                selected={newTask.date}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                locale={es}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            {currentTask !== null && (
              <div className="mb-4">
                <label htmlFor="status" className="block text-gray-700 font-medium mb-2">
                  Estado
                </label>
                <select
                  id="status"
                  name="status"
                  value={newTask.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="completada">Completada</option>
                </select>
              </div>
            )}


            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
              >
                {loading ? <ClipLoader size={20} color="#ffffff" /> : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </ReactModal>
      <footer className="bg-white left-0 bottom-0 fixed w-full  py-2">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            &copy; 2024 Duvan Serrano. | <a href="https://github.com/duvan29" className="text-blue-600 hover:underline">GitHub</a>
          </p>
        </div>
      </footer>


    </div>
  );
};

export default App;
