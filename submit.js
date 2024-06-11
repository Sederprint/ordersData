import { db } from "./config.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Submit event handler
document
  .getElementById("orderForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    // Validation for finishing options
    var checkboxes = document.querySelectorAll(
      'input[name="cutting"], input[name="coating"], input[name="folding"], input[name="variousFinishing"], input[name="noFinishing"]'
    );
    var oneChecked = Array.prototype.slice
      .call(checkboxes)
      .some((x) => x.checked);

    if (!oneChecked) {
      alert("אנא בחר לפחות אופציית גימור אחת");
      return; // Prevent form submission
    }

    const formData = {
      orderId: document.getElementById("orderId").value,
      userName: document.getElementById("userName").value,
      customerName: document.getElementById("customerName").value,
      productName: document.getElementById("productName").value,
      stock: document.getElementById("stock").value,
      submissionDate: document.getElementById("submissionDate").value,
      width: document.getElementById("width").value,
      height: document.getElementById("height").value,
      quantity: document.getElementById("quantity").value,
      material: document.getElementById("material").value,
      internalPrint: document.getElementById("internalPrint").value,
      printer: document.getElementById("printer").value,
      coverType: document.getElementById("coverType").value,
      laminationOfCover: document.getElementById("laminationOfCover").value,
      bindingType: document.getElementById("bindingType").value,
      sides: document.getElementById("sides").value, // Add this line

      comments: document.getElementById("comments").value,
      cutting: getCheckedValues("cutting"),
      coating: getCheckedValues("coating"),
      folding: getCheckedValues("folding"),
      variousFinishing: getCheckedValues("variousFinishing"),
      numberOfPerforation: document.getElementById("numberOfPerforation").value,
      // numberOfCreasing: document.getElementById("numberOfCreasing").value,
      numberOfFolding: document.getElementById("numberOfFolding").value,
    };

    try {
      const docRef = await addDoc(collection(db, "orders"), formData);
      console.log("Document written with ID: ", docRef.id);
      showConfirmation(
        `Order submitted! View it at: <a href="http://127.0.0.1:5500/view.html?id=${docRef.id}">View Order</a>`,
        docRef.id
      );
    } catch (e) {
      console.error("Error adding document: ", e);
      showConfirmation("Error submitting order");
    }
  });

// Function to show confirmation
function showConfirmation(message, orderId) {
  const confirmationDiv = document.createElement("div");
  confirmationDiv.style.position = "fixed";
  confirmationDiv.style.top = "50%";
  confirmationDiv.style.left = "50%";
  confirmationDiv.style.transform = "translate(-50%, -50%)";
  confirmationDiv.style.padding = "20px";
  confirmationDiv.style.backgroundColor = "#fff";
  confirmationDiv.style.border = "1px solid #ccc";
  confirmationDiv.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
  confirmationDiv.innerHTML = `
        ${message}
        <button id="copyLinkButton">העתק קישור</button>
    `;
  document.body.appendChild(confirmationDiv);

  document.getElementById("copyLinkButton").addEventListener("click", () => {
    const link = `http://127.0.0.1:5500/view.html?id=${orderId}`;
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copied to clipboard");
    });
  });

  setTimeout(() => {
    confirmationDiv.remove();
  }, 10000);
}

// Fetch and display all orders
document
  .getElementById("showAllOrdersButton")
  .addEventListener("click", async () => {
    const allOrdersDiv = document.getElementById("allOrdersDiv");
    const backdrop = document.getElementById("backdrop");
    allOrdersDiv.innerHTML = "";
    const querySnapshot = await getDocs(collection(db, "orders"));

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const orderElement = document.createElement("div");
      orderElement.innerHTML = `
      <div class="lineToSpreate">

    </div>
    <p><strong>👳‍♂️שם לקוח:</strong> ${data.customerName}</p>

      <p><strong>🛒מספר הזמנה:</strong> ${data.orderId}</p>
      <button onclick="copyOrderLink('${doc.id}')">העתק קישור</button>
      <button onclick="loadOrderData('${doc.id}')">טען</button>
    `;
      allOrdersDiv.appendChild(orderElement);
    });

    document.getElementById("allOrdersContainer").style.display = "block";
    backdrop.style.display = "block";
  });

window.closeAllOrdersDiv = function () {
  document.getElementById("allOrdersContainer").style.display = "none";
  document.getElementById("backdrop").style.display = "none";
};

window.copyOrderLink = function (orderId) {
  const link = `http://127.0.0.1:5500/view.html?id=${orderId}`;
  navigator.clipboard.writeText(link).then(() => {
    alert("Link copied to clipboard");
  });
};

window.loadOrderData = async function (orderId) {
  const docRef = doc(db, "orders", orderId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    document.getElementById("orderId").value = data.orderId;
    document.getElementById("userName").value = data.userName;
    document.getElementById("customerName").value = data.customerName;
    document.getElementById("productName").value = data.productName;
    document.getElementById("stock").value = data.stock;
    document.getElementById("submissionDate").value = data.submissionDate;
    document.getElementById("width").value = data.width;
    document.getElementById("height").value = data.height;
    document.getElementById("quantity").value = data.quantity;
    document.getElementById("material").value = data.material;
    document.getElementById("internalPrint").value = data.internalPrint;
    document.getElementById("printer").value = data.printer;
    document.getElementById("coverType").value = data.coverType;
    document.getElementById("laminationOfCover").value = data.laminationOfCover;
    document.getElementById("bindingType").value = data.bindingType;
    document.getElementById("comments").value = data.comments;
    // Populate checkboxes
    setCheckedValues("cutting", data.cutting);
    setCheckedValues("coating", data.coating);
    setCheckedValues("folding", data.folding);
    setCheckedValues("variousFinishing", data.variousFinishing);
    document.getElementById("numberOfPerforation").value =
      data.numberOfPerforation;
    document.getElementById("numberOfCreasing").value = data.numberOfCreasing;
    document.getElementById("numberOfFolding").value = data.numberOfFolding;
  } else {
    alert("No such document!");
  }
};

async function updateOrderData(orderId) {
  // Query the collection to find the document with the given orderId
  const ordersCollection = collection(db, "orders");
  const q = query(ordersCollection, where("orderId", "==", orderId));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docRef = querySnapshot.docs[0].ref; // Get the reference to the document

    // Collect updated data from the form
    const updatedData = {
      orderId: document.getElementById("orderId").value,
      userName: document.getElementById("userName").value,
      customerName: document.getElementById("customerName").value,
      productName: document.getElementById("productName").value,
      stock: document.getElementById("stock").value,
      submissionDate: document.getElementById("submissionDate").value,
      width: document.getElementById("width").value,
      height: document.getElementById("height").value,
      quantity: document.getElementById("quantity").value,
      material: document.getElementById("material").value,
      internalPrint: document.getElementById("internalPrint").value,
      printer: document.getElementById("printer").value,
      coverType: document.getElementById("coverType").value,
      laminationOfCover: document.getElementById("laminationOfCover").value,
      bindingType: document.getElementById("bindingType").value,
      comments: document.getElementById("comments").value,
      cutting: getCheckedValues("cutting"),
      coating: getCheckedValues("coating"),
      folding: getCheckedValues("folding"),
      variousFinishing: getCheckedValues("variousFinishing"),
      numberOfPerforation: document.getElementById("numberOfPerforation").value,
      numberOfCreasing: document.getElementById("numberOfCreasing").value,
      numberOfFolding: document.getElementById("numberOfFolding").value,
    };

    try {
      await updateDoc(docRef, updatedData);
      alert("Order data updated successfully!");
    } catch (e) {
      console.error("Error updating document: ", e);
      alert("Error updating order data");
    }
  } else {
    alert("No such document exists!");
  }
}

function getCheckedValues(name) {
  const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
  return Array.from(checkboxes).map((checkbox) => checkbox.value);
}

function setCheckedValues(name, values) {
  const checkboxes = document.querySelectorAll(`input[name="${name}"]`);
  checkboxes.forEach((checkbox) => {
    checkbox.checked = values.includes(checkbox.value);
  });
}
//new test

// Date Input Logic (unchanged)
const dateInput = document.getElementById("submissionDate");
const today = new Date().toISOString().split("T")[0];
dateInput.value = today;

async function saveOrderChanges() {
  const orderIdInput = document.getElementById("orderId").value;

  // Query the collection to find the document with the given orderId
  const ordersCollection = collection(db, "orders");
  const q = query(ordersCollection, where("orderId", "==", orderIdInput));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docRef = querySnapshot.docs[0].ref; // Get the reference to the document

    // Collect updated data from the form
    const updatedData = {
      orderId: document.getElementById("orderId").value,
      userName: document.getElementById("userName").value,
      customerName: document.getElementById("customerName").value,
      productName: document.getElementById("productName").value,
      stock: document.getElementById("stock").value,
      submissionDate: document.getElementById("submissionDate").value,
      width: document.getElementById("width").value,
      height: document.getElementById("height").value,
      quantity: document.getElementById("quantity").value,
      material: document.getElementById("material").value,
      internalPrint: document.getElementById("internalPrint").value,
      printer: document.getElementById("printer").value,
      coverType: document.getElementById("coverType").value,
      laminationOfCover: document.getElementById("laminationOfCover").value,
      bindingType: document.getElementById("bindingType").value,
      comments: document.getElementById("comments").value,
      cutting: getCheckedValues("cutting"),
      coating: getCheckedValues("coating"),
      folding: getCheckedValues("folding"),
      variousFinishing: getCheckedValues("variousFinishing"),
      numberOfPerforation: document.getElementById("numberOfPerforation").value,
      numberOfCreasing: document.getElementById("numberOfCreasing").value,
      numberOfFolding: document.getElementById("numberOfFolding").value,
    };

    try {
      await updateDoc(docRef, updatedData);
      alert("Order data updated successfully!");
    } catch (e) {
      console.error("Error updating document: ", e);
      alert("Error updating order data");
    }
  } else {
    alert("No such document exists!");
  }
}

document
  .getElementById("saveOrderButton")
  .addEventListener("click", saveOrderChanges);

function insertName(name) {
  document.getElementById("userName").value = name;
}
window.insertName = insertName; // Assign the function reference

$(function () {
  // Fetch item names from the JSON file
  $.getJSON("items.json", function (items) {
    // Initialize autocomplete for product names
    $("#productName").autocomplete({
      source: items,
    });
  });

  // Fetch customer names from the JSON file
  $.getJSON("customer_names.json", function (customers) {
    // Initialize autocomplete for customer names
    $("#customerName").autocomplete({
      source: customers,
    });
  });
});
function insertStockStatus(status) {
  document.getElementById("stock").value = status;
}
window.insertStockStatus = insertStockStatus;

function setCommonSize(width, height) {
  document.getElementById("width").value = width;
  document.getElementById("height").value = height;
}
window.setCommonSize = setCommonSize;
function setQuantity(quantity) {
  document.getElementById("quantity").value = quantity;
}
window.setQuantity = setQuantity;
document
  .getElementById("resetFormButton")
  .addEventListener("click", function () {
    document.getElementById("orderForm").reset();
    const dateInput = document.getElementById("submissionDate");
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
  });
