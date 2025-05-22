export function saveStorage(valor: any) {
    try {
        localStorage.setItem("user", JSON.stringify(valor));
    } catch (error) {
        console.error('Error al guardar los datos en localStorage:', error);
    }
}

export function getStorage() {
    try {
        const datos = localStorage.getItem("user");
        if (datos) {
            return JSON.parse(datos);
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error al obtener los datos de localStorage:', error);
    }
}

export function deleteStorage() {
    try {
        localStorage.removeItem("user");
        window.location.reload();
    } catch (error) {
        console.error('Error al eliminar los datos de localStorage:', error);
    }
}