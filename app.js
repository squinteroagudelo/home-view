$(document).ready(() => {
    let validateFields = document.getElementsByClassName("full-data");

    document.getElementById("agregar_item").addEventListener("click", addItem);
    document.getElementById("cantidad").addEventListener("keyup", (e) => {
        if (event.code === "Enter" || event.code === "NumpadEnter") addItem(e);
    });

    function addItem(event) {
        let medida = document.getElementById("medida");
        let emptyFields;
        Object.entries(validateFields).forEach(
            (field) =>
                (emptyFields = Object.entries(validateFields).filter(
                    ([key, value]) => value.value == -1 || value.value == ""
                ))
        );

        if (emptyFields.length <= 0) {
            addRow(validateFields, medida.textContent, event);
        } else {
            emptyFields.forEach(([key, value]) => {
                value.classList.add("is-invalid");
                if (document.getElementById(`${value.id}-msg`))
                    document.getElementById(`${value.id}-msg`).innerText =
                        "Campo requerido";
            });
        }
    }

    for (let el of validateFields)
        el.addEventListener("change", (e) => {
            if (el.value != -1 || el.value != "") {
                el.classList.remove("is-invalid");
                if (document.getElementById(`${el.id}-msg`))
                    document.getElementById(`${el.id}-msg`).innerText = "";
            }
        });

    let iconSidebar = document.getElementById("icon_sidebar");
    if (
        window.innerWidth <= 576 &&
        !iconSidebar.classList.contains("collapsed")
    ) {
        iconSidebar.click();
    }

    document.getElementById("menu_bodega").addEventListener("click", (e) => {
        document.getElementById("bc_bodega").textContent = e.target.textContent;
        document
            .getElementById("menu_mov")
            .parentNode.classList.remove("pe-none");
    });

    document.getElementById("menu_mov").addEventListener("click", (e) => {
        document.getElementById("bc_mov").textContent = e.target.textContent;
        document.getElementById("bc_mov").classList.remove("d-none");
    });
});

function addRow(validateFields, units, event) {
    let tr = document.createElement("tr");
    Object.entries(validateFields).forEach(([key, value]) => {
        let td = document.createElement("td");
        td.classList.add("text-center");
        td.innerText = value.value;
        tr.appendChild(td);
    });
    let tdUnits = document.createElement("td");
    tdUnits.classList.add("text-center");
    tdUnits.innerText = units;
    let tdIcons = document.createElement("td");
    tdIcons.classList.add("text-center");
    let iconDelete = document.createElement("i");
    iconDelete.classList.add("fas", "fa-trash-alt", "text-danger", "delete_row");
    iconDelete.onclick = deleteRow;
    tdIcons.appendChild(iconDelete);
    tr.appendChild(tdUnits);
    tr.appendChild(tdIcons);
    document.querySelector("#materiales tbody").appendChild(tr);

    document.getElementById("cantidad").ariaLabel = "";

    let form;
    for (const eKey in event.path)
        if (event.path[eKey].nodeName === "FORM") form = event.path[eKey];
    form.reset();
}

function deleteRow(event) {
    Swal.fire({
        title: "Eliminar item",
        text: "Se eliminará el item seleccionado",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si",
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            let row;
            for (const eKey in event.path)
                if (event.path[eKey].nodeName === "TR") row = event.path[eKey];
            row.parentNode.removeChild(row);
        }
    });
}

window.addEventListener("resize", (e) => {
    if (
        e.target.innerWidth <= 576 &&
        !document.getElementById("icon_sidebar").classList.contains("collapsed")
    ) {
        document.getElementById("icon_sidebar").click();
    }
});

function toggleSideMenu(icon) {
    icon.classList.toggle("fa-chevron-left");
    icon.classList.toggle("fa-chevron-right");
}

function onlyNumber(el) {
    let value = el.value;
    let exp = /^\d+$/;
    if (value != "") {
        if (exp.test(value)) {
            el.classList.remove("is-invalid");
            document.getElementById(`error_${el.id}`).classList.add("d-none");
            el.value = value;
            el.ariaLabel = value;
        } else {
            el.classList.add("is-invalid");
            document.getElementById(`error_${el.id}`).classList.remove("d-none");
            el.value = el.ariaLabel;
        }
    } else {
        el.ariaLabel = value;
    }
    setTimeout(() => {
        if (exp.test(el.value) || el.value == "") {
            el.classList.remove("is-invalid");
            document.getElementById(`error_${el.id}`).classList.add("d-none");
        }
    }, 2500);
}
